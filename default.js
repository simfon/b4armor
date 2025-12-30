// State - all 21 slots (helmet + 20 body locations)
const armorState = {
    helmet: 0,
    torso_sup_front: 0, torso_sup_back: 0,
    torso_inf_front: 0, torso_inf_back: 0,
    arm_l_sup_front: 0, arm_l_sup_back: 0,
    arm_l_inf_front: 0, arm_l_inf_back: 0,
    arm_r_sup_front: 0, arm_r_sup_back: 0,
    arm_r_inf_front: 0, arm_r_inf_back: 0,
    leg_l_sup_front: 0, leg_l_sup_back: 0,
    leg_l_inf_front: 0, leg_l_inf_back: 0,
    leg_r_sup_front: 0, leg_r_sup_back: 0,
    leg_r_inf_front: 0, leg_r_inf_back: 0
};

// Points tables
const torsoPoints = { 1: 0.2, 2: 0.3, 3: 0.4, 4: 0.5 };
const limbPoints = { 1: 0.1, 2: 0.2, 3: 0.3, 4: 0.4 };

// Helmet options
const helmetOptions = [
    { value: 0, name: 'Nessun elmo', desc: '', points: 0 },
    { value: 1, name: 'Cuoio/Gambeson aperto', desc: 'Elmo leggero', points: 0.2 },
    { value: 2, name: 'Cuoio/Gambeson chiuso', desc: 'Copre ≥75% viso', points: 0.3 },
    { value: 3, name: 'Camaglio/Cervelliera', desc: 'Con o senza maglia', points: 0.5 },
    { value: 4, name: 'Lattice/Metallo aperto', desc: 'Elmo scenico o metallico', points: 0.7 },
    { value: 5, name: 'Metallo con visiera', desc: 'Chiuso ≥75%', points: 1.0 },
    { value: 6, name: 'Camaglio + Elmo metallo', desc: 'Combinazione completa', points: 1.5 }
];

// Body armor options
const bodyOptions = [
    { value: 0, name: 'Nessuna', desc: '' },
    { value: 1, name: 'Categoria 1', desc: 'Gambeson, cuoio, pelliccia' },
    { value: 2, name: 'Categoria 2', desc: 'Piastre, maglia, brigantina' },
    { value: 3, name: 'Categoria 3', desc: 'Cat.1 + Cat.2 sovrapposti' },
    { value: 4, name: 'Categoria 4', desc: 'Piastre su maglia' }
];

const slotNames = {
    helmet: 'Elmo',
    torso_sup_front: 'Torso Superiore (Fronte)',
    torso_sup_back: 'Torso Superiore (Retro)',
    torso_inf_front: 'Torso Inferiore (Fronte)',
    torso_inf_back: 'Torso Inferiore (Retro)',
    arm_l_sup_front: 'Braccio SX Sup. (Fronte)',
    arm_l_sup_back: 'Braccio SX Sup. (Retro)',
    arm_l_inf_front: 'Braccio SX Inf. (Fronte)',
    arm_l_inf_back: 'Braccio SX Inf. (Retro)',
    arm_r_sup_front: 'Braccio DX Sup. (Fronte)',
    arm_r_sup_back: 'Braccio DX Sup. (Retro)',
    arm_r_inf_front: 'Braccio DX Inf. (Fronte)',
    arm_r_inf_back: 'Braccio DX Inf. (Retro)',
    leg_l_sup_front: 'Gamba SX Sup. (Fronte)',
    leg_l_sup_back: 'Gamba SX Sup. (Retro)',
    leg_l_inf_front: 'Gamba SX Inf. (Fronte)',
    leg_l_inf_back: 'Gamba SX Inf. (Retro)',
    leg_r_sup_front: 'Gamba DX Sup. (Fronte)',
    leg_r_sup_back: 'Gamba DX Sup. (Retro)',
    leg_r_inf_front: 'Gamba DX Inf. (Fronte)',
    leg_r_inf_back: 'Gamba DX Inf. (Retro)'
};

function getPointsForSlot(slot, category) {
    if (category === 0) return 0;
    if (slot.startsWith('torso')) {
        return torsoPoints[category];
    }
    return limbPoints[category];
}

function openModal(slot) {
    const modal = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const optionsContainer = document.getElementById('modal-options');
    
    title.textContent = slotNames[slot] || slot;
    optionsContainer.innerHTML = '';

    const options = slot === 'helmet' ? helmetOptions : bodyOptions;
    const currentValue = armorState[slot];

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'armor-option' + (opt.value === currentValue ? ' selected' : '');
        
        if (slot === 'helmet') {
            btn.innerHTML = `
                <span class="option-name">${opt.name}</span>
                <span class="option-points">+${opt.points}</span>
                ${opt.desc ? `<div class="option-desc">${opt.desc}</div>` : ''}
            `;
        } else {
            const points = getPointsForSlot(slot, opt.value);
            btn.innerHTML = `
                <span class="option-name">${opt.name}</span>
                <span class="option-points">+${points}</span>
                ${opt.desc ? `<div class="option-desc">${opt.desc}</div>` : ''}
            `;
        }
        
        btn.onclick = () => {
            armorState[slot] = opt.value;
            updateDisplay();
            closeModal();
        };
        optionsContainer.appendChild(btn);
    });

    modal.classList.add('active');
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modal-overlay').classList.remove('active');
}

function applyToZone(zone) {
    const modal = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const optionsContainer = document.getElementById('modal-options');
    
    const zoneNames = {
        torso: 'Tutto il Torso',
        arm_l: 'Braccio Sinistro',
        arm_r: 'Braccio Destro',
        leg_l: 'Gamba Sinistra',
        leg_r: 'Gamba Destra',
        all: 'Tutto il Corpo'
    };
    
    title.textContent = zoneNames[zone];
    optionsContainer.innerHTML = '';

    bodyOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'armor-option';
        btn.innerHTML = `
            <span class="option-name">${opt.name}</span>
            ${opt.desc ? `<div class="option-desc">${opt.desc}</div>` : ''}
        `;
        btn.onclick = () => {
            Object.keys(armorState).forEach(slot => {
                if (slot === 'helmet') return;
                if (zone === 'all' || slot.startsWith(zone)) {
                    armorState[slot] = opt.value;
                }
            });
            updateDisplay();
            closeModal();
        };
        optionsContainer.appendChild(btn);
    });

    modal.classList.add('active');
}

function resetAll() {
    Object.keys(armorState).forEach(key => {
        armorState[key] = 0;
    });
    updateDisplay();
}

function updateDisplay() {
    let torsoTotal = 0, armsTotal = 0, legsTotal = 0, helmetTotal = 0;

    Object.keys(armorState).forEach(slot => {
        const value = armorState[slot];
        const slotEl = document.querySelector(`[data-slot="${slot}"]`);
        const valEl = document.getElementById(`val-${slot}`);
        
        if (!slotEl || !valEl) return; // Safety check
        
        if (slot === 'helmet') {
            const helmOpt = helmetOptions.find(h => h.value === value);
            helmetTotal = helmOpt ? helmOpt.points : 0;
            valEl.textContent = value === 0 ? '—' : `+${helmetTotal}`;
            slotEl.classList.toggle('has-armor', value > 0);
        } else {
            const points = getPointsForSlot(slot, value);
            valEl.textContent = value === 0 ? '—' : `+${points}`;
            
            // Update slot styling
            slotEl.classList.remove('has-armor', 'cat-1', 'cat-2', 'cat-3', 'cat-4');
            if (value > 0) {
                slotEl.classList.add('has-armor', `cat-${value}`);
            }

            // Add to subtotals
            if (slot.startsWith('torso')) torsoTotal += points;
            else if (slot.startsWith('arm')) armsTotal += points;
            else if (slot.startsWith('leg')) legsTotal += points;
        }
    });

    const totalRaw = torsoTotal + armsTotal + legsTotal + helmetTotal;
    const totalRounded = Math.round(totalRaw * 10) / 10;
    const decimal = Math.round((totalRounded - Math.floor(totalRounded)) * 10) / 10;
    const finalTotal = decimal >= 0.7 ? Math.ceil(totalRaw) : Math.floor(totalRaw);

    document.getElementById('total-pa').textContent = finalTotal;
    document.getElementById('total-raw').textContent = totalRaw.toFixed(1);
    document.getElementById('sub-torso').textContent = torsoTotal.toFixed(1);
    document.getElementById('sub-arms').textContent = armsTotal.toFixed(1);
    document.getElementById('sub-legs').textContent = legsTotal.toFixed(1);
    document.getElementById('sub-helmet').textContent = helmetTotal.toFixed(1);
}

// Initialize
updateDisplay();