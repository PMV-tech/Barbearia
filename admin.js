let currentTab = 'agenda';
let filterDate = null;
let adminMonth = new Date();
const realToday = new Date();

function setTab(t) {
    currentTab = t;
    document.getElementById('tab-agenda').classList.toggle('active', t === 'agenda');
    document.getElementById('tab-his').classList.toggle('active', t === 'historico');
    render();
}

function toggleCalAdmin() {
    const area = document.getElementById('cal-area-admin');
    const btn = document.getElementById('cal-toggle');
    const isOpen = area.style.display === 'block';
    area.style.display = isOpen ? 'none' : 'block';
    btn.innerText = isOpen ? "Abrir calendário" : "Fechar calendário";
    if(isOpen) filterDate = null; 
    render();
}

function moveMonthAdmin(step) { adminMonth.setMonth(adminMonth.getMonth() + step); render(); }

function render() {
    const db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    renderCalAdmin(db);
    const container = document.getElementById('lista-admin');
    container.innerHTML = "";
    let p = 0, c = 0;

    db.forEach(item => {
        if(item.status === 'pendente') p += item.preco; else c += item.preco;
        
        const dateMatch = filterDate ? item.data === filterDate : true;
        const tabMatch = (currentTab === 'agenda' && item.status === 'pendente') || (currentTab === 'historico' && item.status === 'concluido');

        if(tabMatch && dateMatch) {
            container.innerHTML += `<div class="item-agendamento">
                <div><strong>${item.nome}</strong><br><small>${item.data} - ${item.hora}</small></div>
                <div>
                    ${item.status === 'pendente' ? `<button onclick="setStatus(${item.id},'concluido')" style="background:var(--success); color:white; padding:8px; border-radius:5px">✓</button>` : ''}
                    <button onclick="del(${item.id})" style="background:var(--danger); color:white; padding:8px; border-radius:5px; margin-left:5px">X</button>
                </div>
            </div>`;
        }
    });
    document.getElementById('totalP').innerText = `R$ ${p}`;
    document.getElementById('totalC').innerText = `R$ ${c}`;
}

function renderCalAdmin(db) {
    const grid = document.getElementById('grid-admin');
    grid.innerHTML = "";
    
    const monthText = adminMonth.toLocaleDateString('pt-br', {month:'long'});
    const yearText = adminMonth.getFullYear();
    document.getElementById('monthYearAdmin').innerText = `${monthText} de ${yearText}`;

    const days = new Date(adminMonth.getFullYear(), adminMonth.getMonth() + 1, 0).getDate();
    const skip = new Date(adminMonth.getFullYear(), adminMonth.getMonth(), 1).getDay();
    
    for(let i=0; i<skip; i++) grid.innerHTML += `<div></div>`;
    for(let d=1; d<=days; d++) {
        let ds = `${String(d).padStart(2,'0')}/${String(adminMonth.getMonth()+1).padStart(2,'0')}/${adminMonth.getFullYear()}`;
        let has = db.some(a => a.data === ds && a.status === 'pendente');
        const isToday = d === realToday.getDate() && adminMonth.getMonth() === realToday.getMonth() && adminMonth.getFullYear() === realToday.getFullYear();
        
        grid.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''} ${filterDate === ds ? 'selected' : ''} ${has ? 'has-event' : ''}" onclick="pickDateAdmin('${ds}')">${d}</div>`;
    }
}

function pickDateAdmin(d) { 
    filterDate = (filterDate === d) ? null : d; 
    render(); 
}

function setStatus(id, s) {
    let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
    db = db.map(i => i.id === id ? {...i, status: s} : i);
    localStorage.setItem('barbearia_db', JSON.stringify(db));
    render();
}

function del(id) {
    if(confirm("Excluir este registro?")) {
        let db = JSON.parse(localStorage.getItem('barbearia_db')) || [];
        db = db.filter(i => i.id !== id);
        localStorage.setItem('barbearia_db', JSON.stringify(db));
        render();
    }
}
render();
