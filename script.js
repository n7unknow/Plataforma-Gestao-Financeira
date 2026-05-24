const dadosSalvos = JSON.parse(sessionStorage.getItem('fincontrol_config'))
const transacoesSalvas = JSON.parse(sessionStorage.getItem('fincontrol_transacoes'))

const dados = dadosSalvos || {
    usuario: "",
    carteiraDigital: 0,
    carteiraFisica: 0,
    meta: 0,
    mesMeta: ""
}

const transacoes = transacoesSalvas || []

function salvarDados() {
    sessionStorage.setItem('fincontrol_config', JSON.stringify(dados))
    sessionStorage.setItem('fincontrol_transacoes', JSON.stringify(transacoes))
}

const formConfig = document.getElementById('formConfig')
if (formConfig) {
    formConfig.addEventListener('submit', function(e) {
        e.preventDefault()
        dados.usuario = document.getElementById('inputUsuario').value
        dados.carteiraDigital = parseFloat(document.getElementById('inputCarteiraDigital').value)
        dados.carteiraFisica = parseFloat(document.getElementById('inputCarteiraFisica').value)
        dados.meta = parseFloat(document.getElementById('inputMeta').value)
        dados.mesMeta = document.getElementById('selectMesMeta').value
        salvarDados()
        alert('Dados salvos com sucesso!')
    })
}

function carregarNome() {
    const nameUser = document.getElementById('name_user')
    if (nameUser && dados.usuario) {
        nameUser.textContent = 'Olá, ' + dados.usuario.toUpperCase() + '👋'
    }
}

carregarNome()

function carregarHome() {
    const saldoAtual = document.getElementById('saldoAtual')
    const receitas = document.getElementById('receitas')
    const despesas = document.getElementById('despesas')
    const descricaoMeta = document.getElementById('descricaoMeta')
    const progresso = document.querySelector('.progresso')
    const tabelaTransacoes = document.getElementById('tabelaTransacoes')

    if (!saldoAtual) return

    const totalReceitas = transacoes.filter(t => t.tipo === 'Receita').reduce((acc, t) => acc + t.valor, 0)
    const totalDespesas = transacoes.filter(t => t.tipo === 'Despesa').reduce((acc, t) => acc + t.valor, 0)
    const saldo = (dados.carteiraDigital + dados.carteiraFisica + totalReceitas) - totalDespesas

    saldoAtual.textContent = 'R$ ' + saldo.toFixed(2)
    receitas.textContent = '+ R$ ' + totalReceitas.toFixed(2)
    despesas.textContent = '- R$ ' + totalDespesas.toFixed(2)

    if (dados.meta && dados.mesMeta) {
        descricaoMeta.textContent = 'Meta de ' + dados.mesMeta + ': Economizar R$ ' + dados.meta.toFixed(2)
        const porcentagem = Math.min((totalReceitas - totalDespesas) / dados.meta * 100, 100)
        progresso.style.width = porcentagem + '%'
        progresso.style.transition = 'width 1s ease'
    }

    if (tabelaTransacoes) {
        tabelaTransacoes.innerHTML = ''
        transacoes.slice(-5).reverse().forEach(t => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${t.descricao}</td>
                <td>${t.categoria}</td>
                <td style="color: ${t.tipo === 'Receita' ? '#10b981' : '#ef4444'}"> ${t.tipo === 'Receita' ? '+' : '-'} R$ ${t.valor.toFixed(2)}</td>
            `
            tabelaTransacoes.appendChild(tr)
        })
    }
}

carregarHome()

const btnAdicionar = document.getElementById('btnAdicionar')
if (btnAdicionar) {
    btnAdicionar.addEventListener('click', function() {
        const descricao = document.getElementById('inputDescricao').value
        const valor = parseFloat(document.getElementById('inputValor').value)
        const tipo = document.getElementById('selectTipo').value
        const categoria = document.getElementById('selectCategoria').value
        const mes = document.getElementById('selectMes').value

        if (!descricao || !valor || !tipo || !categoria || !mes) {
            alert('Preencha todos os campos!')
            return
        }

        transacoes.push({ descricao, valor, tipo, categoria, mes })
        salvarDados()
        carregarTransacoes()

        document.getElementById('inputDescricao').value = ''
        document.getElementById('inputValor').value = ''
    })
}

function carregarTransacoes() {
    const lista = document.getElementById('listaTransacoes')
    if (!lista) return

    lista.innerHTML = ''
    transacoes.slice().reverse().forEach(t => {
        const div = document.createElement('div')
        div.className = 'transacao-item ' + (t.tipo === 'Receita' ? 'receita-item' : 'despesa-item')
        div.innerHTML = `
            <div>
                <h3>${t.descricao}</h3>
                <p>${t.categoria} — ${t.mes}</p>
            </div>
            <span style="color: ${t.tipo === 'Receita' ? '#10b981' : '#ef4444'}">
                ${t.tipo === 'Receita' ? '+' : '-'} R$ ${t.valor.toFixed(2)}
            </span>
        `
        lista.appendChild(div)
    })
}

carregarTransacoes()