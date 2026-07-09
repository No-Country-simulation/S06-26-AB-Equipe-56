const express = require('express');
const router = express.Router();
const { conectarBanco } = require('../config/db_postgre');
const verificarAutenticacao = require('../middlewares/verificarAutenticacao');

// GET /api/trilhas - List all trails with recruiter progress
router.get('/', verificarAutenticacao, async (req, res) => {
    try {
        const recrutadorId = req.usuarioLogado.id;
        const pool = await conectarBanco();

        // Fetch active trails
        const { rows: trilhas } = await pool.query(
            'SELECT * FROM Trilhas WHERE ativo = true ORDER BY trilha_id'
        );

        // Fetch all modules
        const { rows: modulos } = await pool.query(
            'SELECT * FROM Modulos ORDER BY trilha_id, ordem'
        );

        // Fetch recruiter's completed modules
        const { rows: progressoModulos } = await pool.query(
            "SELECT modulo_id FROM Recrutadores_Modulos WHERE recrutador_id = $1 AND status = 'Concluido'",
            [recrutadorId]
        );

        const completedModuleIds = new Set(progressoModulos.map(p => p.modulo_id));

        // Group modules by trail_id
        const modulesByTrail = {};
        modulos.forEach(mod => {
            if (!modulesByTrail[mod.trilha_id]) {
                modulesByTrail[mod.trilha_id] = [];
            }
            modulesByTrail[mod.trilha_id].push({
                id: mod.modulo_id,
                titulo: mod.nome,
                descricao: mod.descricao,
                conteudo_url: mod.conteudo_url,
                duracao: mod.duracao_minutos,
                concluido: completedModuleIds.has(mod.modulo_id)
            });
        });

        // Assemble the response array
        const responseData = trilhas.map(trilha => {
            const trailModules = modulesByTrail[trilha.trilha_id] || [];
            const totalModules = trailModules.length;
            const completedModules = trailModules.filter(m => m.concluido).length;
            const totalDuration = trailModules.reduce((acc, curr) => acc + (curr.duracao || 0), 0);
            
            const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

            // Categories map to present nicely in Portuguese
            const categoriesMap = {
                vies_inconsciente: 'Mitigação de Viés',
                inclusao: 'Inclusão / PCD',
                diversidade_racial: 'Diversidade Racial',
                genero: 'Equidade de Gênero',
                lgbtqia: 'Comunicação LGBT+'
            };

            return {
                id: trilha.trilha_id,
                titulo: trilha.nome,
                descricao: trilha.descricao,
                categoria: categoriesMap[trilha.categoria] || trilha.categoria || 'Geral',
                obrigatoria: trilha.trilha_id === 1, // Make first trail mandatory as core learning
                duracao: `${totalDuration} min`,
                progresso: progress,
                modulosCount: totalModules,
                modulos: trailModules
            };
        });

        res.status(200).json(responseData);
    } catch (erro) {
        console.error('Erro ao buscar trilhas com progresso:', erro);
        res.status(500).json({ mensagem: 'Erro interno ao carregar trilhas.' });
    }
});

// POST /api/trilhas/modulos/:modulo_id/toggle - Toggle module completion status
router.post('/modulos/:modulo_id/toggle', verificarAutenticacao, async (req, res) => {
    try {
        const recrutadorId = req.usuarioLogado.id;
        const moduloId = parseInt(req.params.modulo_id);
        const pool = await conectarBanco();

        // 1. Check if the module is already marked as completed
        const { rows: existing } = await pool.query(
            'SELECT * FROM Recrutadores_Modulos WHERE recrutador_id = $1 AND modulo_id = $2',
            [recrutadorId, moduloId]
        );

        let statusResponse = '';

        if (existing.length > 0) {
            // Unmark completion
            await pool.query(
                'DELETE FROM Recrutadores_Modulos WHERE recrutador_id = $1 AND modulo_id = $2',
                [recrutadorId, moduloId]
            );
            statusResponse = 'pendente';
        } else {
            // Mark completion
            await pool.query(
                `INSERT INTO Recrutadores_Modulos (recrutador_id, modulo_id, status, data_inicio, data_conclusao)
                 VALUES ($1, $2, 'Concluido', NOW(), NOW())`,
                [recrutadorId, moduloId]
            );
            statusResponse = 'concluido';
        }

        // 2. Fetch the trail_id for this module
        const { rows: moduleData } = await pool.query(
            'SELECT trilha_id FROM Modulos WHERE modulo_id = $1',
            [moduloId]
        );

        if (moduleData.length > 0) {
            const trailId = moduleData[0].trilha_id;

            // 3. Check trail completion: count total modules in trail vs completed modules in trail
            const { rows: countTotal } = await pool.query(
                'SELECT COUNT(*) as total FROM Modulos WHERE trilha_id = $1',
                [trailId]
            );
            const totalModules = parseInt(countTotal[0].total);

            const { rows: countCompleted } = await pool.query(
                `SELECT COUNT(rm.modulo_id) as completed 
                 FROM Modulos m
                 JOIN Recrutadores_Modulos rm ON m.modulo_id = rm.modulo_id
                 WHERE m.trilha_id = $1 AND rm.recrutador_id = $2 AND rm.status = 'Concluido'`,
                [trailId, recrutadorId]
            );
            const completedModules = parseInt(countCompleted[0].completed);

            // 4. Update or Insert Recrutadores_Trilhas
            const trailStatus = completedModules === totalModules ? 'Concluido' : (completedModules > 0 ? 'Iniciado' : 'Pendente');

            const { rows: existingTrailProgress } = await pool.query(
                'SELECT * FROM Recrutadores_Trilhas WHERE recrutador_id = $1 AND trilha_id = $2',
                [recrutadorId, trailId]
            );

            if (existingTrailProgress.length > 0) {
                await pool.query(
                    `UPDATE Recrutadores_Trilhas 
                     SET status = $3, data_conclusao = $4
                     WHERE recrutador_id = $1 AND trilha_id = $2`,
                    [recrutadorId, trailId, trailStatus, trailStatus === 'Concluido' ? new Date() : null]
                );
            } else if (completedModules > 0) {
                await pool.query(
                    `INSERT INTO Recrutadores_Trilhas (recrutador_id, trilha_id, status, data_inicio, data_conclusao)
                     VALUES ($1, $2, $3, NOW(), $4)`,
                    [recrutadorId, trailId, trailStatus, trailStatus === 'Concluido' ? new Date() : null]
                );
            }
        }

        res.status(200).json({ status: statusResponse });
    } catch (erro) {
        console.error('Erro ao alternar progresso do modulo:', erro);
        res.status(500).json({ mensagem: 'Erro interno ao salvar progresso.' });
    }
});

// GET /api/trilhas/modulos/:modulo_id/detalhes - Get module details, its questionnaire, questions, and alternatives
router.get('/modulos/:modulo_id/detalhes', verificarAutenticacao, async (req, res) => {
    try {
        const recrutadorId = req.usuarioLogado.id;
        const moduloId = parseInt(req.params.modulo_id);
        const pool = await conectarBanco();

        // 1. Fetch Module
        const { rows: moduloRows } = await pool.query(
            'SELECT * FROM Modulos WHERE modulo_id = $1',
            [moduloId]
        );
        if (moduloRows.length === 0) {
            return res.status(404).json({ mensagem: 'Módulo não encontrado.' });
        }
        const modulo = moduloRows[0];

        // 2. Fetch Questionnaire (if any)
        const { rows: questionarioRows } = await pool.query(
            'SELECT * FROM Questionarios WHERE modulo_id = $1',
            [moduloId]
        );

        let questionario = null;
        if (questionarioRows.length > 0) {
            const q = questionarioRows[0];
            
            // Fetch Questions
            const { rows: questoesRows } = await pool.query(
                'SELECT questao_id, enunciado, ordem FROM Questoes WHERE questionario_id = $1 ORDER BY ordem',
                [q.questionario_id]
            );

            // Fetch Alternatives for these questions (EXCLUDING 'correta' column to prevent cheating)
            const questionIds = questoesRows.map(qu => qu.questao_id);
            let alternativas = [];
            if (questionIds.length > 0) {
                const { rows: altRows } = await pool.query(
                    `SELECT alternativa_id, questao_id, texto 
                     FROM AlternativasQuestao 
                     WHERE questao_id = ANY($1) 
                     ORDER BY alternativa_id`,
                    [questionIds]
                );
                alternativas = altRows;
            }

            // Group alternatives by question
            const alternativesByQuestion = {};
            alternativas.forEach(alt => {
                if (!alternativesByQuestion[alt.questao_id]) {
                    alternativesByQuestion[alt.questao_id] = [];
                }
                alternativesByQuestion[alt.questao_id].push({
                    id: alt.alternativa_id,
                    texto: alt.texto
                });
            });

            questionario = {
                id: q.questionario_id,
                nome: q.nome,
                nota_minima_aprovacao: parseFloat(q.nota_minima_aprovacao || 70),
                tentativas_permitidas: q.tentativas_permitidas,
                questoes: questoesRows.map(qu => ({
                    id: qu.questao_id,
                    enunciado: qu.enunciado,
                    ordem: qu.ordem,
                    alternativas: alternativesByQuestion[qu.questao_id] || []
                }))
            };
        }

        // 3. Fetch past result for this recruiter and questionnaire
        let resultadoAnterior = null;
        if (questionario) {
            const { rows: resRows } = await pool.query(
                `SELECT * FROM ResultadosQuestionario 
                 WHERE recrutador_id = $1 AND questionario_id = $2 
                 ORDER BY aprovado DESC, nota DESC, data_realizacao DESC LIMIT 1`,
                [recrutadorId, questionario.id]
            );
            if (resRows.length > 0) {
                resultadoAnterior = {
                    resultado_id: resRows[0].resultado_id,
                    tentativa: resRows[0].tentativa,
                    total_questoes: resRows[0].total_questoes,
                    total_acertos: resRows[0].total_acertos,
                    total_erros: resRows[0].total_erros,
                    nota: parseFloat(resRows[0].nota),
                    aprovado: resRows[0].aprovado,
                    data_realizacao: resRows[0].data_realizacao
                };
            }
        }

        // 4. Fetch if module is marked as Completed
        const { rows: completedRows } = await pool.query(
            "SELECT * FROM Recrutadores_Modulos WHERE recrutador_id = $1 AND modulo_id = $2 AND status = 'Concluido'",
            [recrutadorId, moduloId]
        );
        const concluido = completedRows.length > 0;

        res.status(200).json({
            modulo: {
                id: modulo.modulo_id,
                trilha_id: modulo.trilha_id,
                nome: modulo.nome,
                descricao: modulo.descricao,
                conteudo_url: modulo.conteudo_url,
                duracao: modulo.duracao_minutos,
                ordem: modulo.ordem,
                concluido
            },
            questionario,
            resultadoAnterior
        });
    } catch (erro) {
        console.error('Erro ao buscar detalhes do módulo:', erro);
        res.status(500).json({ mensagem: 'Erro interno ao carregar detalhes do módulo.' });
    }
});

// POST /api/trilhas/questionarios/:questionario_id/submeter - Submit answers for a questionnaire
router.post('/questionarios/:questionario_id/submeter', verificarAutenticacao, async (req, res) => {
    try {
        const recrutadorId = req.usuarioLogado.id;
        const questionarioId = parseInt(req.params.questionario_id);
        const { respostas } = req.body; // Array of { questao_id, alternativa_id }

        if (!Array.isArray(respostas)) {
            return res.status(400).json({ mensagem: 'Respostas inválidas.' });
        }

        const pool = await conectarBanco();

        // 1. Fetch Questionnaire details
        const { rows: qRows } = await pool.query(
            'SELECT * FROM Questionarios WHERE questionario_id = $1',
            [questionarioId]
        );
        if (qRows.length === 0) {
            return res.status(404).json({ mensagem: 'Questionário não encontrado.' });
        }
        const questionario = qRows[0];

        // 2. Fetch Questions
        const { rows: questoes } = await pool.query(
            'SELECT questao_id FROM Questoes WHERE questionario_id = $1',
            [questionarioId]
        );
        const totalQuestoes = questoes.length;

        if (totalQuestoes === 0) {
            return res.status(400).json({ mensagem: 'Este questionário não possui questões.' });
        }

        // 3. Fetch all Alternatives with correctness status for this questionnaire
        const questaoIds = questoes.map(q => q.questao_id);
        const { rows: todasAlternativas } = await pool.query(
            `SELECT alternativa_id, questao_id, correta 
             FROM AlternativasQuestao 
             WHERE questao_id = ANY($1)`,
            [questaoIds]
        );

        // Map to easily check correctness
        const altMap = {};
        todasAlternativas.forEach(alt => {
            if (!altMap[alt.questao_id]) {
                altMap[alt.questao_id] = [];
            }
            altMap[alt.questao_id].push(alt);
        });

        // 4. Score calculation
        let totalAcertos = 0;
        let totalErros = 0;
        const respostasVerificadas = [];

        questoes.forEach(q => {
            const respUsuario = respostas.find(r => r.questao_id === q.questao_id);
            const alternativasQuestao = altMap[q.questao_id] || [];
            const altCorreta = alternativasQuestao.find(a => a.correta);

            const alternativaSelecionadaId = respUsuario ? respUsuario.alternativa_id : null;
            const isCorreta = alternativaSelecionadaId && altCorreta && alternativaSelecionadaId === altCorreta.alternativa_id;

            if (isCorreta) {
                totalAcertos++;
            } else {
                totalErros++;
            }

            respostasVerificadas.push({
                questao_id: q.questao_id,
                alternativa_selecionada_id: alternativaSelecionadaId,
                correta: !!isCorreta,
                alternativa_correta_id: altCorreta ? altCorreta.alternativa_id : null
            });
        });

        const nota = (totalAcertos / totalQuestoes) * 100;
        const notaMinima = parseFloat(questionario.nota_minima_aprovacao || 70);
        const aprovado = nota >= notaMinima;

        // 5. Determine attempt number
        const { rows: attemptRes } = await pool.query(
            'SELECT COALESCE(MAX(tentativa), 0) as max_tentativa FROM ResultadosQuestionario WHERE recrutador_id = $1 AND questionario_id = $2',
            [recrutadorId, questionarioId]
        );
        const proximaTentativa = parseInt(attemptRes[0].max_tentativa) + 1;

        // 6. Save ResultadoQuestionario
        const { rows: novoResultadoRows } = await pool.query(
            `INSERT INTO ResultadosQuestionario (recrutador_id, questionario_id, tentativa, total_questoes, total_acertos, total_erros, nota, aprovado, data_realizacao)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
             RETURNING *`,
            [recrutadorId, questionarioId, proximaTentativa, totalQuestoes, totalAcertos, totalErros, nota, aprovado]
        );
        const novoResultado = novoResultadoRows[0];

        // 7. Save each RespostaRecrutador
        for (const rv of respostasVerificadas) {
            if (rv.alternativa_selecionada_id) {
                await pool.query(
                    `INSERT INTO RespostasRecrutador (recrutador_id, questionario_id, questao_id, alternativa_id, tentativa, correta, data_resposta)
                     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                    [recrutadorId, questionarioId, rv.questao_id, rv.alternativa_selecionada_id, proximaTentativa, rv.correta]
                );
            }
        }

        // 8. If approved, mark the module as Concluido
        if (aprovado) {
            // Check if Recrutadores_Modulos entry already exists
            const { rows: existingRM } = await pool.query(
                'SELECT * FROM Recrutadores_Modulos WHERE recrutador_id = $1 AND modulo_id = $2',
                [recrutadorId, questionario.modulo_id]
            );

            if (existingRM.length === 0) {
                await pool.query(
                    `INSERT INTO Recrutadores_Modulos (recrutador_id, modulo_id, status, data_inicio, data_conclusao)
                     VALUES ($1, $2, 'Concluido', NOW(), NOW())`,
                    [recrutadorId, questionario.modulo_id]
                );
            } else if (existingRM[0].status !== 'Concluido') {
                await pool.query(
                    `UPDATE Recrutadores_Modulos 
                     SET status = 'Concluido', data_conclusao = NOW() 
                     WHERE recrutador_id = $1 AND modulo_id = $2`,
                    [recrutadorId, questionario.modulo_id]
                );
            }

            // Update trail completion progress
            const moduloId = questionario.modulo_id;
            const { rows: moduleData } = await pool.query(
                'SELECT trilha_id FROM Modulos WHERE modulo_id = $1',
                [moduloId]
            );

            if (moduleData.length > 0) {
                const trailId = moduleData[0].trilha_id;

                // Check trail completion
                const { rows: countTotal } = await pool.query(
                    'SELECT COUNT(*) as total FROM Modulos WHERE trilha_id = $1',
                    [trailId]
                );
                const totalModules = parseInt(countTotal[0].total);

                const { rows: countCompleted } = await pool.query(
                    `SELECT COUNT(rm.modulo_id) as completed 
                     FROM Modulos m
                     JOIN Recrutadores_Modulos rm ON m.modulo_id = rm.modulo_id
                     WHERE m.trilha_id = $1 AND rm.recrutador_id = $2 AND rm.status = 'Concluido'`,
                    [trailId, recrutadorId]
                );
                const completedModules = parseInt(countCompleted[0].completed);

                const trailStatus = completedModules === totalModules ? 'Concluido' : (completedModules > 0 ? 'Iniciado' : 'Pendente');

                const { rows: existingTrailProgress } = await pool.query(
                    'SELECT * FROM Recrutadores_Trilhas WHERE recrutador_id = $1 AND trilha_id = $2',
                    [recrutadorId, trailId]
                );

                if (existingTrailProgress.length > 0) {
                    await pool.query(
                        `UPDATE Recrutadores_Trilhas 
                         SET status = $3, data_conclusao = $4
                         WHERE recrutador_id = $1 AND trilha_id = $2`,
                        [recrutadorId, trailId, trailStatus, trailStatus === 'Concluido' ? new Date() : null]
                    );
                } else if (completedModules > 0) {
                    await pool.query(
                        `INSERT INTO Recrutadores_Trilhas (recrutador_id, trilha_id, status, data_inicio, data_conclusao)
                         VALUES ($1, $2, $3, NOW(), $4)`,
                        [recrutadorId, trailId, trailStatus, trailStatus === 'Concluido' ? new Date() : null]
                    );
                }
            }
        }

        res.status(200).json({
            aprovado,
            nota,
            total_questoes: totalQuestoes,
            total_acertos: totalAcertos,
            total_erros: totalErros,
            tentativa: proximaTentativa,
            respostasVerificadas
        });

    } catch (erro) {
        console.error('Erro ao submeter questionário:', erro);
        res.status(500).json({ mensagem: 'Erro interno ao submeter questionário.' });
    }
});

module.exports = router;

