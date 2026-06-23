const bdMockEmpresas = [];
let contadorEmpresaId = 1;

class EmpresaModel {
    async buscarPorCnpj(cnpj) {
        return bdMockEmpresas.find(empresa => empresa.cnpj === cnpj);
    }

    async criar(dadosEmpresa) {
        const novaEmpresa = {
            empresa_id: contadorEmpresaId++,
            ...dadosEmpresa,
            data_cadastro: new Date().toISOString()
        };
        
        bdMockEmpresas.push(novaEmpresa);
        return novaEmpresa;
    }
}

module.exports = new EmpresaModel();