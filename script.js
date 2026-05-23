const dados = {
    usuario: "",
    carteiraDigital: 0,
    carteiraFisica: 0,
    meta: 0,
    mesMeta: ""
}

const transacoes = []

function salvarDados() {
    sessionStorage.setItem('fincontrol_config', JSON.stringify(dados))
    sessionStorage.setItem('fincontrol_transacoes', JSON.stringify(transacoes))
}

const btnSalvarDados = document.getElementById('btnSalvar')
if (btnSalvarDados) {
    btnSalvarDados.addEventListener('click', function() {
        dados.usuario = document.getElementById('inputUsuario').value
        dados.carteiraDigital = parseFloat(document.getElementById('inputCarteiraDigital').value)
        dados.carteiraFisica = parseFloat(document.getElementById('inputCarteiraFisica').value)
        dados.meta = parseFloat(document.getElementById('inputMeta').value)
        dados.mesMeta = document.getElementById('selectMesMeta').value
        salvarDados()
        alert('Dados salvos com sucesso!')
    })
}