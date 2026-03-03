function renderAdmin() {
    const db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    const containerP = document.getElementById('listaPendentesAdmin');
    const containerC = document.getElementById('listaConcluidosAdmin');
    
    let pendenteCash = 0;
    let concluidoCash = 0;

    containerP.innerHTML = "";
    containerC.innerHTML = "";

    db.forEach(item => {
        const card = `
            <div class="item-agendamento">
                <div>
                    <strong>${item.nome}</strong> - ${item.hora}<br>
                    <small>${item.servico} (${item.data})</small>
                </div>
                <div class="actions-list">
                    ${item.status === 'pendente' ? 
                        `<button class="btn-edit" style="background:var(--success)" onclick="finalizar(${item.id})">Concluir</button>` : 
                        `<span style="color:var(--success); font-weight:bold; margin-right:10px;">PAGO</span>`}
                    <button class="btn-del" onclick="remover(${item.id})">X</button>
                </div>
            </div>
        `;

        if(item.status === 'pendente') {
            containerP.innerHTML += card;
            pendenteCash += item.preco;
        } else {
            containerC.innerHTML += card;
            concluidoCash += item.preco;
        }
    });

    document.getElementById('ganhosPendentes').innerText = `R$ ${pendenteCash.toFixed(2)}`;
    document.getElementById('totalGanhos').innerText = `R$ ${concluidoCash.toFixed(2)}`;
}

function finalizar(id) {
    let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    db = db.map(item => item.id === id ? {...item, status: 'concluido'} : item);
    localStorage.setItem('barbearia_db', JSON.stringify(db));
    renderAdmin();
}

function remover(id) {
    if(confirm("Remover este registro permanentemente?")) {
        let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
        db = db.filter(i => i.id !== id);
        localStorage.setItem('barbearia_db', JSON.stringify(db));
        renderAdmin();
    }
}

// Atualiza a cada vez que abre
renderAdmin();