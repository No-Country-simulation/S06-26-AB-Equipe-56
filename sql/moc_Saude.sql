-- ===========================================================
-- App BiT - MOCK DATA (PostgreSQL)
-- Módulo Saúde
-- ===========================================================
BEGIN;

INSERT INTO Especialidades (especialidade_id, nome, descricao) OVERRIDING SYSTEM VALUE VALUES (1, 'Cardiologia', 'Avaliação e acompanhamento do sistema cardiovascular');
INSERT INTO Especialidades (especialidade_id, nome, descricao) OVERRIDING SYSTEM VALUE VALUES (2, 'Dermatologia', 'Tratamento de condições de pele, cabelo e unhas');
INSERT INTO Especialidades (especialidade_id, nome, descricao) OVERRIDING SYSTEM VALUE VALUES (3, 'Clínica Geral', 'Atendimento primário e prevenção de doenças');
INSERT INTO Especialidades (especialidade_id, nome, descricao) OVERRIDING SYSTEM VALUE VALUES (4, 'Pediatria', 'Cuidados com a saúde infantil');
INSERT INTO Especialidades (especialidade_id, nome, descricao) OVERRIDING SYSTEM VALUE VALUES (5, 'Neurologia', 'Diagnóstico e tratamento de doenças neurológicas');

SELECT setval(pg_get_serial_sequence('Especialidades', 'especialidade_id'), COALESCE((SELECT MAX(especialidade_id) FROM Especialidades), 1));

INSERT INTO ProfissionaisSaude (profissional_id, nome, email, senha, crm, telefone, especialidade_id, ativo) OVERRIDING SYSTEM VALUE VALUES (1, 'Dr. João Pereira', 'joao.pereira@saude.com', '123456', 'CRM-SP-12345', '(11) 99999-1111', 1, true);
INSERT INTO ProfissionaisSaude (profissional_id, nome, email, senha, crm, telefone, especialidade_id, ativo) OVERRIDING SYSTEM VALUE VALUES (2, 'Dra. Ana Silva', 'ana.silva@saude.com', '123456', 'CRM-SP-23456', '(11) 98888-2222', 2, true);
INSERT INTO ProfissionaisSaude (profissional_id, nome, email, senha, crm, telefone, especialidade_id, ativo) OVERRIDING SYSTEM VALUE VALUES (3, 'Dr. Carlos Mendes', 'carlos.mendes@saude.com', '123456', 'CRM-SP-34567', '(11) 97777-3333', 3, true);
INSERT INTO ProfissionaisSaude (profissional_id, nome, email, senha, crm, telefone, especialidade_id, ativo) OVERRIDING SYSTEM VALUE VALUES (4, 'Dra. Beatriz Costa', 'beatriz.costa@saude.com', '123456', 'CRM-SP-45678', '(11) 96666-4444', 4, true);
INSERT INTO ProfissionaisSaude (profissional_id, nome, email, senha, crm, telefone, especialidade_id, ativo) OVERRIDING SYSTEM VALUE VALUES (5, 'Dr. Eduardo Ramos', 'eduardo.ramos@saude.com', '123456', 'CRM-SP-56789', '(11) 95555-5555', 5, true);

SELECT setval(pg_get_serial_sequence('ProfissionaisSaude', 'profissional_id'), COALESCE((SELECT MAX(profissional_id) FROM ProfissionaisSaude), 1));

INSERT INTO Pacientes (paciente_id, nome, email, senha, cpf, data_nascimento, telefone, altura, peso) OVERRIDING SYSTEM VALUE VALUES (1, 'Maria Oliveira', 'maria@email.com', '123456', '123.456.789-00', '1990-05-12', '(11) 91234-5678', 1.65, 62.5);
INSERT INTO Pacientes (paciente_id, nome, email, senha, cpf, data_nascimento, telefone, altura, peso) OVERRIDING SYSTEM VALUE VALUES (2, 'Pedro Santos', 'pedro@email.com', '123456', '987.654.321-00', '1988-09-20', '(11) 92345-6789', 1.80, 85.0);
INSERT INTO Pacientes (paciente_id, nome, email, senha, cpf, data_nascimento, telefone, altura, peso) OVERRIDING SYSTEM VALUE VALUES (3, 'Julia Souza', 'julia@email.com', '123456', '111.222.333-44', '1995-02-15', '(11) 93456-7890', 1.70, 68.0);

SELECT setval(pg_get_serial_sequence('Pacientes', 'paciente_id'), COALESCE((SELECT MAX(paciente_id) FROM Pacientes), 1));

INSERT INTO Consultas (consulta_id, paciente_id, profissional_id, data_hora, status, observacoes) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, '2026-07-10 09:00:00', 'agendada', 'Consulta de rotina');
INSERT INTO Consultas (consulta_id, paciente_id, profissional_id, data_hora, status, observacoes) OVERRIDING SYSTEM VALUE VALUES (2, 2, 3, '2026-07-11 14:30:00', 'confirmada', 'Acompanhamento clínico');
INSERT INTO Consultas (consulta_id, paciente_id, profissional_id, data_hora, status, observacoes) OVERRIDING SYSTEM VALUE VALUES (3, 3, 2, '2026-07-12 16:00:00', 'realizada', 'Exame dermatológico');

SELECT setval(pg_get_serial_sequence('Consultas', 'consulta_id'), COALESCE((SELECT MAX(consulta_id) FROM Consultas), 1));

INSERT INTO Exames (exame_id, paciente_id, profissional_id, tipo_exame, data_exame, resultado, status) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'Hemograma', '2026-07-09 08:30:00', 'Valores dentro do esperado', 'concluído');
INSERT INTO Exames (exame_id, paciente_id, profissional_id, tipo_exame, data_exame, resultado, status) OVERRIDING SYSTEM VALUE VALUES (2, 2, 3, 'Raio-X', '2026-07-10 10:15:00', 'Pendente análise', 'pendente');
INSERT INTO Exames (exame_id, paciente_id, profissional_id, tipo_exame, data_exame, resultado, status) OVERRIDING SYSTEM VALUE VALUES (3, 3, 2, 'Dermatologia', '2026-07-08 11:00:00', 'Sem alterações', 'concluído');

SELECT setval(pg_get_serial_sequence('Exames', 'exame_id'), COALESCE((SELECT MAX(exame_id) FROM Exames), 1));

COMMIT;
