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

module.exports = router;
