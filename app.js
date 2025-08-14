// Listas iniciais:
// 1. amigosCadastrados: todos os nomes que foram adicionados
// 2. amigosDisponiveisSorteio: nomes ainda disponíveis para serem sorteados
// 3. amigosRemovidosDaLista: nomes removidos e que eventualmente podem ser restaurados

let amigosCadastrados = [];
let amigosDisponiveisSorteio = [];
let amigosRemovidosDaLista = [];

// Atualiza a visibilidade do botão "Refazer" com base na lista de amigos removidos
function atualizarBotaoRefazer() {
    const botaoRefazer = document.getElementById("buttonRefazer");
    if (!botaoRefazer) return;
    botaoRefazer.classList.toggle("visivel", amigosRemovidosDaLista.length > 0);
}

// Formata o nome removendo espaços e ajustando letras
function formatarNome(nome) {
    return nome.trim()
               .replace(/\s+/g, " ")
               .toLowerCase()
               .replace(/\b\w/g, letra => letra.toUpperCase());
}

// Validação de nomes
function validarNome(nome) {
    nome = formatarNome(nome);

    if (nome === "") {
        exibirMensagem("Insira um nome.");
        return false;
    }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        exibirMensagem("O nome deve conter apenas letras e espaços. NÃO serão aceitos números ou símbolos.");
        return false;
    }
    if (/(.)\1{2,}/.test(nome.replace(/\s+/g, ''))) {
        exibirMensagem("Muitas letras repetidas, verifique novamente!");
        return false;
    }
    if (nome.length < 2) {
        exibirMensagem("O nome deve ter pelo menos 2 letras.");
        return false;
    }
    if (amigosCadastrados.some(a => a.toLowerCase() === nome.toLowerCase())) {
        exibirMensagem("Nome já foi adicionado.");
        return false;
    }

    return true;
}

// Exibe uma mensagem de alerta em um pop-up padrão no navegador.

function exibirMensagem(texto) {
    alert(texto);
}

// Atualiza a lista de itens no HTML e permite remover um por vez ao clicar nele.
function atualizarLista() {
    const listaAmigosElemento = document.getElementById("listaAmigos");
    if (!listaAmigosElemento) return;

    listaAmigosElemento.innerHTML = "";

    amigosCadastrados.forEach(amigo => {
        const itemListaAmigo = document.createElement("li");
        itemListaAmigo.textContent = amigo;
        itemListaAmigo.style.cursor = "pointer";
        itemListaAmigo.title = "Clique para remover";

        itemListaAmigo.addEventListener("click", () => {
            amigosCadastrados = amigosCadastrados.filter(a => a.toLowerCase() !== amigo.toLowerCase());
            amigosDisponiveisSorteio = [...amigosCadastrados];

            const amigoJaRemovido = amigosRemovidosDaLista.some(a => a.toLowerCase() === amigo.toLowerCase());
            if (!amigoJaRemovido) {
                amigosRemovidosDaLista.push(amigo);
            }

            atualizarLista();
            atualizarBotaoRefazer();
        });

        listaAmigosElemento.appendChild(itemListaAmigo);
    });

    atualizarBotaoRefazer();
}

// Adiciona um novo amigo à lista, após validar e formatar o nome.
function adicionarAmigo() {
    const campoNomeAmigo = document.getElementById("amigo");
    if (!campoNomeAmigo) return;

    let nome = campoNomeAmigo.value;
    if (!validarNome(nome)) return;

    nome = formatarNome(nome);
    amigosCadastrados.push(nome);
    amigosDisponiveisSorteio = [...amigosCadastrados];

    atualizarLista();

    campoNomeAmigo.value = "";
    campoNomeAmigo.focus();

    const elementoResultadoSorteio = document.getElementById("resultado");
    if (elementoResultadoSorteio) elementoResultadoSorteio.innerHTML = "";

    atualizarBotaoRefazer();
}

// Retorna um número aleatório que corresponde a uma posição de um item na lista.
function obterIndiceAleatorio(lista) {
    return Math.floor(Math.random() * lista.length);
}

// Sorteia um único amigo da lista de disponíveis e exibe o resultado com um efeito de animação.
function sortearAmigo() {
    const elementoResultadoSorteio = document.getElementById("resultado");
    if (!elementoResultadoSorteio) return;

    if (amigosCadastrados.length < 2) {
        exibirMensagem("Para sortear, deve haver pelo menos duas pessoas!");
        return;
    }

    if (amigosDisponiveisSorteio.length === 0) {
        exibirMensagem("Todos já foram sorteados! Reinicie um novo sorteio...");
        amigosDisponiveisSorteio = [...amigosCadastrados];
    }

    let contador = 0;
    const efeito = setInterval(() => {
        const indiceSorteioAtual = obterIndiceAleatorio(amigosDisponiveisSorteio);
        elementoResultadoSorteio.innerHTML = `<li>O amigo secreto é: <strong>${amigosDisponiveisSorteio[indiceSorteioAtual]}</strong></li>`;
        contador++;

        if (contador > 15) {
            clearInterval(efeito);
            const indiceAmigoSorteado = obterIndiceAleatorio(amigosDisponiveisSorteio);
            const amigoSorteado = amigosDisponiveisSorteio.splice(indiceAmigoSorteado, 1)[0];
            elementoResultadoSorteio.innerHTML = `<li>🎉 O amigo secreto é: <strong>${amigoSorteado}</strong></li>`;
        }
    }, 100);
}

// Restaura o último amigo que foi removido da lista.
function restaurarAmigoRemovido() {
    if (amigosRemovidosDaLista.length === 0) return;

    const amigoRestaurado = amigosRemovidosDaLista.pop();

    if (!amigosCadastrados.some(a => a.toLowerCase() === amigoRestaurado.toLowerCase())) {
        amigosCadastrados.push(amigoRestaurado);
    }

    amigosDisponiveisSorteio = [...amigosCadastrados];

    atualizarLista();

    const elementoResultadoSorteio = document.getElementById("resultado");
    if (elementoResultadoSorteio) elementoResultadoSorteio.innerHTML = "";

    atualizarBotaoRefazer();
}

// Adiciona novo nome ao pressionar Enter no campo de texto
const campoNomeAmigo = document.getElementById("amigo");
if (campoNomeAmigo) {
    campoNomeAmigo.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            adicionarAmigo();
        }
    });
}

const botaoRefazer = document.getElementById("buttonRefazer");
if (botaoRefazer) {
    botaoRefazer.addEventListener("click", restaurarAmigoRemovido);
}
