let viewDate = new Date();
const todayDate = new Date();
const selectH = document.getElementById('horario');

for(let i=8; i<=20; i++) {
    let h = (i < 10 ? '0'+i : i) + ':00';
    selectH.innerHTML += `<option value="${h}">${h}</option>`;
}

function closeOnClickOutside(e, id) {
    if (e.target.id === id) closeModal(id);
}

function openModal(id) { 
    document.getElementById(id).style.display = 'flex'; 
    if(id === 'modalMeusCortes') renderMeus();
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function openNewModal() {
    document.getElementById('formAgendamento').reset();
    document.getElementById('editId').value = "";
    document.getElementById('modalTitle').innerText = "Novo Agendamento";
    openModal('modalAgendar');
}

document.getElementById('data').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.substring(0,2) + '/' + v.substring(2);
    if (v.length > 5) v = v.substring(0,5) + '/' + v.substring(5,9);
    e.target.value = v;
});

function toggleCal() {
    const p = document.getElementById('popup-calendar');
    p.style.display = p.style.display === 'block' ? 'none' : 'block';
    renderCal();
}

function changeMonth(step) { viewDate.setMonth(viewDate.getMonth() + step); renderCal(); }

function renderCal() {
    const grid = document.getElementById('gridCliente');
    grid.innerHTML = "";
    const monthYear = viewDate.toLocaleDateString('pt-br', {month:'long', year:'numeric'});
    document.getElementById('calMonthYear').innerText = monthYear;
    
    const days = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const skip = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    
    for(let i=0; i<skip; i++) grid.innerHTML += `<div></div>`;
    for(let d=1; d<=days; d++) {
        const isToday = d === todayDate.getDate() && viewDate.getMonth() === todayDate.getMonth() && viewDate.getFullYear() === todayDate.getFullYear();
        grid.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''}" onclick="pickDate(${d})">${d}</div>`;
    }
}

function pickDate(d) {
    const dateStr = `${String(d).padStart(2,'0')}/${String(viewDate.getMonth()+1).padStart(2,'0')}/${viewDate.getFullYear()}`;
    document.getElementById('data').value = dateStr;
    toggleCal();
}

document.getElementById('formAgendamento').onsubmit = function(e) {
    e.preventDefault();
    let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    const editId = document.getElementById('editId').value;
    const item = {
        id: editId ? parseInt(editId) : Date.now(),
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('horario').value,
        servico: document.getElementById('servico').options[document.getElementById('servico').selectedIndex].text,
        preco: parseFloat(document.getElementById('servico').value),
        status: 'pendente'
    };
    if(editId) db = db.map(x => x.id === item.id ? item : x);
    else db.push(item);
    localStorage.setItem('barbearia_db', JSON.stringify(db));
    alert("Agendamento salvo!"); 
    closeModal('modalAgendar');
};

function renderMeus() {
    const lista = document.getElementById('listaMeusAgendamentos');
    const db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    lista.innerHTML = db.length ? '' : '<p>Você não tem cortes agendados.</p>';
    db.forEach(item => {
        lista.innerHTML += `
            <div class="item-agendamento">
                <div><strong>${item.data} - ${item.hora}</strong><br><small>${item.servico}</small></div>
                <div>
                    <button onclick="editar(${item.id})" style="background:none; color:var(--gold); font-size:1.2rem; margin-right:10px;">✎</button>
                    <button onclick="excluir(${item.id})" style="background:none; color:var(--danger); font-size:1.2rem;">X</button>
                </div>
            </div>`;
    });
}

function editar(id) {
    const db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    const item = db.find(x => x.id === id);
    document.getElementById('editId').value = item.id;
    document.getElementById('nome').value = item.nome;
    document.getElementById('data').value = item.data;
    document.getElementById('horario').value = item.hora;
    document.getElementById('modalTitle').innerText = "Editar Agendamento";
    closeModal('modalMeusCortes');
    openModal('modalAgendar');
}

function excluir(id) {
    if(confirm("Deseja cancelar este agendamento?")) {
        let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
        db = db.filter(x => x.id !== id);
        localStorage.setItem('barbearia_db', JSON.stringify(db));
        renderMeus();
    }
}
