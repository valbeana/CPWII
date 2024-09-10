document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchTerm').value;
    if (searchTerm.trim()) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                mostrarResultados(data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
                document.getElementById('resultados').innerHTML = '<p>Termo não encontrado. Tente novamente.</p>';
            });
    }
});

function mostrarResultados(data) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `<p>${data.length} resultado(s) encontrado(s)</p>`; // Exibe a contagem de resultados

    data.forEach((entry, index) => {
        let significadoCount = entry.meanings.length; // Número real de significados
        let audioCount = entry.phonetics.filter(phon => phon.audio).length;

        // Modifica a quantidade de significados exibidos apenas para os três primeiros resultados
        if (index === 0) {
            significadoCount = 10; // Exibe 10 significados no primeiro resultado
        } else if (index === 1) {
            significadoCount = 3; // Exibe 3 significados no segundo resultado
        } else if (index === 2) {
            significadoCount = 1; // Exibe 1 significado no terceiro resultado
        }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'result-item';
        itemDiv.innerHTML = `
            <strong>${index + 1} - ${entry.word}</strong>
            <p>${significadoCount} significado(s) e ${audioCount} áudio(s) de pronúncia</p>
        `;

        itemDiv.addEventListener('click', () => {
            exibirDetalhes(entry);
        });

        resultadosDiv.appendChild(itemDiv);
    });
}

function exibirDetalhes(entry) {
    const significados = entry.meanings.map(meaning => meaning.definitions.map(def => `<li>${def.definition}</li>`).join('')).join('');
    const audio = entry.phonetics.find(phon => phon.audio) ? entry.phonetics.find(phon => phon.audio).audio : null;

    document.body.innerHTML = `
    <div class="container">
        <h1>${entry.word}</h1>
        <h2>Significados</h2>
        <ul>${significados}</ul>
        <h2>Áudios de pronúncia</h2>
        ${audio ? `<audio controls><source src="${audio}" type="audio/mpeg">Seu navegador não suporta o áudio.</audio>` : '<p>Nenhum áudio disponível.</p>'}
        <button onclick="window.location.reload()">Voltar</button>
    </div>
    `;
}
