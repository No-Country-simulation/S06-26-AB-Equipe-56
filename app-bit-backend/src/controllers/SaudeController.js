const SaudeModel = require('../models/SaudeModel');

const responderErro = (res, statusCode, mensagem) => {
  res.status(statusCode).json({ mensagem });
};

const listarEspecialidades = async (req, res) => {
  try {
    const especialidades = await SaudeModel.listarEspecialidades();
    res.status(200).json(especialidades);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao listar especialidades.');
  }
};

const criarEspecialidade = async (req, res) => {
  try {
    const especialidade = await SaudeModel.criarEspecialidade(req.body);
    res.status(201).json(especialidade);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao criar especialidade.');
  }
};

const listarProfissionais = async (req, res) => {
  try {
    const profissionais = await SaudeModel.listarProfissionais();
    res.status(200).json(profissionais);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao listar profissionais.');
  }
};

const criarProfissional = async (req, res) => {
  try {
    const profissional = await SaudeModel.criarProfissional(req.body);
    res.status(201).json(profissional);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao criar profissional.');
  }
};

const listarPacientes = async (req, res) => {
  try {
    const pacientes = await SaudeModel.listarPacientes();
    res.status(200).json(pacientes);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao listar pacientes.');
  }
};

const criarPaciente = async (req, res) => {
  try {
    const paciente = await SaudeModel.criarPaciente(req.body);
    res.status(201).json(paciente);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao criar paciente.');
  }
};

const listarConsultas = async (req, res) => {
  try {
    const consultas = await SaudeModel.listarConsultas();
    res.status(200).json(consultas);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao listar consultas.');
  }
};

const criarConsulta = async (req, res) => {
  try {
    const consulta = await SaudeModel.criarConsulta(req.body);
    res.status(201).json(consulta);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao criar consulta.');
  }
};

const listarExames = async (req, res) => {
  try {
    const exames = await SaudeModel.listarExames();
    res.status(200).json(exames);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao listar exames.');
  }
};

const criarExame = async (req, res) => {
  try {
    const exame = await SaudeModel.criarExame(req.body);
    res.status(201).json(exame);
  } catch (erro) {
    responderErro(res, 500, 'Erro interno ao criar exame.');
  }
};

module.exports = {
  listarEspecialidades,
  criarEspecialidade,
  listarProfissionais,
  criarProfissional,
  listarPacientes,
  criarPaciente,
  listarConsultas,
  criarConsulta,
  listarExames,
  criarExame,
};