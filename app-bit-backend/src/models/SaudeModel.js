const { conectarBanco } = require('../config/db_postgre');

class SaudeModel {
  static async executarConsulta(textoConsulta, parametros = []) {
    const pool = await conectarBanco();
    return pool.query(textoConsulta, parametros);
  }

  static async buscarProfissionalPorEmail(email) {
    const { rows } = await this.executarConsulta(
      'SELECT profissional_id, nome, email, senha, crm, telefone, especialidade_id, ativo FROM ProfissionaisSaude WHERE email = $1',
      [email]
    );
    return rows[0];
  }

  static async buscarPacientePorEmail(email) {
    const { rows } = await this.executarConsulta(
      'SELECT paciente_id, nome, email, senha, cpf, data_nascimento, telefone, altura, peso FROM Pacientes WHERE email = $1',
      [email]
    );
    return rows[0];
  }

  static async listarEspecialidades() {
    const { rows } = await this.executarConsulta('SELECT * FROM Especialidades ORDER BY especialidade_id');
    return rows;
  }

  static async criarEspecialidade(dados) {
    const { rows } = await this.executarConsulta(
      'INSERT INTO Especialidades (nome, descricao) VALUES ($1, $2) RETURNING *',
      [dados.nome, dados.descricao || null]
    );
    return rows[0];
  }

  static async listarProfissionais() {
    const { rows } = await this.executarConsulta(`
      SELECT p.*, e.nome AS especialidade_nome
      FROM ProfissionaisSaude p
      LEFT JOIN Especialidades e ON e.especialidade_id = p.especialidade_id
      ORDER BY p.profissional_id
    `);
    return rows;
  }

  static async criarProfissional(dados) {
    const { rows } = await this.executarConsulta(
      `INSERT INTO ProfissionaisSaude (nome, email, senha, crm, telefone, especialidade_id, ativo)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [dados.nome, dados.email, dados.senha, dados.crm, dados.telefone || null, dados.especialidade_id, dados.ativo !== false]
    );
    return rows[0];
  }

  static async listarPacientes() {
    const { rows } = await this.executarConsulta('SELECT * FROM Pacientes ORDER BY paciente_id');
    return rows;
  }

  static async criarPaciente(dados) {
    const { rows } = await this.executarConsulta(
      `INSERT INTO Pacientes (nome, email, senha, cpf, data_nascimento, telefone, altura, peso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [dados.nome, dados.email, dados.senha, dados.cpf, dados.data_nascimento || null, dados.telefone || null, dados.altura || null, dados.peso || null]
    );
    return rows[0];
  }

  static async listarConsultas() {
    const { rows } = await this.executarConsulta(`
      SELECT c.*, p.nome AS paciente_nome, ps.nome AS profissional_nome
      FROM Consultas c
      LEFT JOIN Pacientes p ON p.paciente_id = c.paciente_id
      LEFT JOIN ProfissionaisSaude ps ON ps.profissional_id = c.profissional_id
      ORDER BY c.data_hora DESC
    `);
    return rows;
  }

  static async criarConsulta(dados) {
    const { rows } = await this.executarConsulta(
      `INSERT INTO Consultas (paciente_id, profissional_id, data_hora, status, observacoes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [dados.paciente_id, dados.profissional_id, dados.data_hora, dados.status || 'agendada', dados.observacoes || null]
    );
    return rows[0];
  }

  static async listarExames() {
    const { rows } = await this.executarConsulta(`
      SELECT e.*, p.nome AS paciente_nome, ps.nome AS profissional_nome
      FROM Exames e
      LEFT JOIN Pacientes p ON p.paciente_id = e.paciente_id
      LEFT JOIN ProfissionaisSaude ps ON ps.profissional_id = e.profissional_id
      ORDER BY e.data_exame DESC
    `);
    return rows;
  }

  static async criarExame(dados) {
    const { rows } = await this.executarConsulta(
      `INSERT INTO Exames (paciente_id, profissional_id, tipo_exame, data_exame, resultado, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [dados.paciente_id, dados.profissional_id, dados.tipo_exame, dados.data_exame, dados.resultado || null, dados.status || 'pendente']
    );
    return rows[0];
  }
}

module.exports = SaudeModel;