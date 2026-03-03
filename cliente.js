// Preenche horários de 08:00 às 20:00
const selectH = document.getElementById('horario');
for(let i=8; i<=20; i++) {
    let h = i < 10 ? `0${i}:00` : `${i}:00`;
    selectH.innerHTML += `<option value="${h}">${h}</option>`;
}

function openModal(id) { 
    document.getElementById(id).style.display = 'block'; 
    if(id === 'modalMeusCortes') renderMeus();
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function prepareNew() {
    document.getElementById('formAgendamento').reset();
    document.getElementById('editId').value = "";
    document.getElementById('modalTitle').innerText = "Novo Agendamento";
    openModal('modalAgendar');
}

document.getElementById('formAgendamento').onsubmit = function(e) {
    e.preventDefault();
    let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    const editId = document.getElementById('editId').value;

    const agendamento = {
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('horario').value,
        servico: document.getElementById('servico').options[document.getElementById('servico').selectedIndex].text,
        preco: parseFloat(document.getElementById('servico').value),
        status: 'pendente'
    };

    if (editId) {
        db = db.map(item => item.id == editId ? { ...item, ...agendamento } : item);
        alert("Alterado com sucesso!");
    } else {
        agendamento.id = Date.now();
        db.push(agendamento);
        alert("Agendado com sucesso!");
    }

    localStorage.setItem('barbearia_db', JSON.stringify(db));
    closeModal('modalAgendar');
};

function renderMeus() {
    const lista = document.getElementById('listaMeusAgendamentos');
    const db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    lista.innerHTML = db.length ? '' : '<p>Você não tem cortes marcados.</p>';
    
    db.forEach(item => {
        lista.innerHTML += `
            <div class="item-agendamento">
                <div>
                    <strong>${item.data} às ${item.hora}</strong><br>
                    <small>${item.servico}</small>
                </div>
                <div class="actions-list">
                    <button class="btn-edit" onclick="editar(${item.id})">Editar</button>
                    <button class="btn-del" onclick="excluir(${item.id})">X</button>
                </div>
            </div>
        `;
    });
}

function editar(id) {
    const db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    const item = db.find(i => i.id == id);
    document.getElementById('editId').value = item.id;
    document.getElementById('nome').value = item.nome;
    document.getElementById('data').value = item.data;
    document.getElementById('horario').value = item.hora;
    document.getElementById('modalTitle').innerText = "Editar Horário";
    closeModal('modalMeusCortes');
    openModal('modalAgendar');
}

function excluir(id) {
    if(confirm("Deseja cancelar seu horário?")) {
        let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
        db = db.filter(i => i.id !== id);
        localStorage.setItem('barbearia_db', JSON.stringify(db));
        renderMeus();
    }
}