const bdMockRecrutadores = [];
let contadorRecrutadorId = 1;

class RecrutadorModel {
    async buscarPorEmail(email) {
        return bdMockRecrutadores.find(recrutador => recrutador.email === email);
    }

    async criar(dadosRecrutador) {
        const novoRecrutador = {
            recrutador_id: contadorRecrutadorId++,
            ...dadosRecrutador,
            data_cadastro: new Date().toISOString()
        };
        
        bdMockRecrutadores.push(novoRecrutador);
        return novoRecrutador;
    }
    async listarTodos(empresa_id) {
        if (empresa_id) {
            return bdMockRecrutadores.filter(r => r.empresa_id === Number(empresa_id));
        }
        return bdMockRecrutadores;
    }

    async buscarPorId(id) {
        return bdMockRecrutadores.find(r => r.recrutador_id === Number(id));
    }
}

module.exports = new RecrutadorModel();