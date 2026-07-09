CREATE OR REPLACE VIEW vw_perfil_completo_candidato AS
SELECT 
    c.candidato_id,
    c.nome AS candidato_nome,
    c.email AS candidato_email,
    c.telefone AS candidato_telefone,
    c.data_cadastro AS candidato_data_cadastro,
    
    -- 1. Endereço Atual (Tratando latitude e longitude para geolocalização)
    e.cep,
    e.logradouro,
    e.numero,
    e.complemento,
    e.bairro,
    e.cidade,
    e.estado,
    e.latitude,
    e.longitude,
    e.geohash,

    -- 2. Identificador do Currículo
    cu.curriculo_id,

    -- 3. Skills em formato de Array de Texto (Ex: ['Java', 'SQL', 'Python'])
    COALESCE(
        (SELECT array_agg(s.nome_skill)
         FROM Skills_Curriculo sc
         JOIN Skills s ON sc.skill_id = s.skill_id
         WHERE sc.curriculo_id = cu.curriculo_id), 
        '{}'::text[]
    ) AS lista_skills,

    -- 4. Badges do Candidato em formato JSON (Para avaliar afinidade ESG/D&I)
    COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('badge_id', b.badge_id, 'nome', b.nome))
         FROM Badges_Candidato bc
         JOIN Badges b ON bc.badge_id = b.badge_id
         WHERE bc.candidato_id = c.candidato_id),
        '[]'::jsonb
    ) AS badges_candidato,

    -- 5. Histórico de Experiência Profissional Completo em JSON
    COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
                    'empresa', exp.empresa,
                    'cargo', cg.nome,
                    'senioridade', sn.nome,
                    'salario', exp.salario,
                    'descricao', exp.descricao,
                    'data_inicio', exp.data_inicio,
                    'data_fim', exp.data_fim,
                    'is_atual', exp.is_atual
                 ) ORDER BY exp.data_inicio DESC)
         FROM ExperienciaCandidato exp
         JOIN Cargos cg ON exp.cargo_id = cg.cargo_id
         JOIN Senioridades sn ON exp.senioridade_id = sn.senioridade_id
         WHERE exp.curriculo_id = cu.curriculo_id),
        '[]'::jsonb
    ) AS historico_experiencias,

    -- 6. Histórico de Escolaridade Completo em JSON
    COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
                    'instituicao', esc.nome_instituicao,
                    'curso', esc.curso,
                    'tipo', esc.tipo_escolaridade,
                    'modalidade', esc.modalidade,
                    'concluido', esc.concluido,
                    'data_inicio', esc.data_inicio,
                    'data_fim', esc.data_fim
                 ) ORDER BY esc.data_inicio DESC)
         FROM Escolaridade esc
         WHERE esc.curriculo_id = cu.curriculo_id),
        '[]'::jsonb
    ) AS historico_escolaridade

FROM Candidatos c
LEFT JOIN Curriculo cu ON c.candidato_id = cu.candidato_id
LEFT JOIN Endereco_Candidato e ON c.candidato_id = e.candidato_id AND e.is_atual = TRUE;



CREATE OR REPLACE VIEW vw_detalhes_vaga AS
SELECT 
    v.vaga_id,
    v.recrutador_id,
    v.empresa_id,
    v.titulo AS vaga_titulo,
    v.descricao AS vaga_descricao,
    v.data_cadastro AS vaga_data_cadastro,
    c.nome AS cargo_nome,
    s.nome AS senioridade_nome,
    m.nome AS modalidade_nome,
    
    -- Agrupando todos os requisitos de Skills em um único objeto estruturado
    COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
                    'skill_id', sk.skill_id,
                    'nome_skill', sk.nome_skill,
                    'tipo_skill', sk.tipo_skill,
                    'nivel_skill', sv.nivel_skill,
                    'obrigatorio', sv.obrigatorio,
                    'peso', sv.peso
                 ) ORDER BY sv.obrigatorio DESC, sv.peso DESC)
         FROM Skills_Vaga sv
         JOIN Skills sk ON sv.skill_id = sk.skill_id
         WHERE sv.vaga_id = v.vaga_id),
        '[]'::jsonb
    ) AS requisitos_skills

FROM Vagas v
JOIN Cargos c ON v.cargo_id = c.cargo_id
JOIN Senioridades s ON v.senioridade_id = s.senioridade_id
JOIN Modalidades m ON v.modalidade_id = m.modalidade_id;


CREATE OR REPLACE VIEW vw_metas_empresa AS
SELECT 
    e.empresa_id,
    e.nome AS empresa_nome,
    e.razao_social AS empresa_razao_social,
    e.cnpj AS empresa_cnpj,
    
    -- Agrupando as metas ativas da empresa
    COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
                    'meta_id', m.meta_id,
                    'badge_id', b.badge_id,
                    'meta_nome', b.nome,
                    'porcentagem_alvo', m.porcentagem,
                    'quantidade_alvo', m.quantidade
                 ))
         FROM MetasESG m
         JOIN Badges b ON m.badge_id = b.badge_id
         WHERE m.empresa_id = e.empresa_id),
        '[]'::jsonb
    ) AS metas_esg_ativas

FROM Empresa e;