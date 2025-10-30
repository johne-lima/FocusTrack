// 🎯 Seleciona os principais elementos da página
const form = document.getElementById('distraction-form');
const historico = document.getElementById('historico');
const emojiContainer = document.getElementById('emoji-foco');
const focoHidden = document.getElementById('foco');

// Carrega distrações salvas no Local Storage (ou cria um array vazio)
let distracoes = JSON.parse(localStorage.getItem('distracoes')) || [];

// Função para atualizar o Local Storage
function salvarNoLocalStorage() {
    localStorage.setItem('distracoes', JSON.stringify(distracoes));
}

// Função para exibir todas as distrações salvas na tela
function renderizarHistorico() {
    historico.innerHTML = ''; // limpa a lista antes de re-renderizar
    distracoes.forEach(item => {
        const li = document.createElement('li');
        li.className = 'bg-gray-700 p-4 rounded-lg shadow border border-gray-600';
        li.innerHTML = `
            <div class="flex justify-between items-center">
              <span class="font-semibold">${escapeHtml(truncate(item.descricao, 60))}</span>
              <span class="text-sm text-gray-400">${item.hora}</span>
            </div>
            <p class="text-sm text-gray-300 mt-1">
              Categoria: <strong>${item.categoria || 'Não definida'}</strong> — 
              Foco antes da distração: ${item.foco}/5
            </p>
        `;
        historico.prepend(li); // adiciona do mais recente para o mais antigo
    });
}

// Chama renderizar assim que a página carrega
renderizarHistorico();

//  Define o estado inicial dos emojis
[...emojiContainer.children].forEach(span => {
    if (span.dataset.value === focoHidden.value) {
        span.classList.add('scale-125', 'opacity-100');
    } else {
        span.classList.add('opacity-60');
    }
});

// Detecta clique nos emojis
emojiContainer.addEventListener('click', e => {
    if (e.target.dataset.value) {
        focoHidden.value = e.target.dataset.value;

        [...emojiContainer.children].forEach(span => {
            span.classList.remove('scale-125', 'opacity-100');
            span.classList.add('opacity-60');
        });

        e.target.classList.add('scale-125', 'opacity-100');
        e.target.classList.remove('opacity-60');
    }
});

// Função para evitar injeção de código HTML
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[match]));
}

// ✂️ Função para cortar texto longo
function truncate(str, n) {
    return str.length > n ? str.slice(0, n) + '...' : str;
}

// 📋 Evento do envio do formulário
form.addEventListener('submit', e => {
    e.preventDefault();

    const descricao = document.getElementById('descricao').value.trim();
    const categoria = document.getElementById('categoria').value;
    const foco = focoHidden.value;

    if (!descricao) return;

    const hora = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Cria um objeto com os dados da distração
    const novaDistracao = { descricao, categoria, foco, hora };

    // Adiciona no array e salva no Local Storage
    distracoes.push(novaDistracao);
    salvarNoLocalStorage();

    // Re-renderiza o histórico com o novo item
    renderizarHistorico();

    // 🔄 Reseta o formulário e volta o emoji padrão
    form.reset();
    focoHidden.value = "3";
    [...emojiContainer.children].forEach(span => {
        if (span.dataset.value === "3") {
            span.classList.add('scale-125', 'opacity-100');
            span.classList.remove('opacity-60');
        } else {
            span.classList.remove('scale-125', 'opacity-100');
            span.classList.add('opacity-60');
        }
    });
});
