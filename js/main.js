const startScreen = document.getElementById('startScreen');
const appContainer = document.getElementById('appContainer');
const chatBox = document.getElementById('chatBox');
const appHeader = document.getElementById('appHeader');
const actionContainer = document.getElementById('actionContainer');
const mainContent = document.getElementById('mainContent');

// Variables globales leídas por ambos bloques
let playerCoins = 100;
let hasMidtryst = false;
let currentActiveTab = 'chatBox';

function startNewGame() {
    startScreen.style.display = 'none';
    document.getElementById('creationScreen').style.display = 'flex';
}

function saveCharacterAndStart() {
    const nameInput = document.getElementById('charName').value.trim();
    const ageInput = document.getElementById('charAge').value.trim();
    const descInput = document.getElementById('charDesc').value.trim();

    if (nameInput === "") {
        alert("[El Sistema requiere un nombre válido para registrar la Encarnación.]");
        return;
    }

    if (typeof statsRolled === 'undefined' || !statsRolled) {
        alert("[Debes lanzar los dados 🎲 para inicializar tus estadísticas base antes del registro.]");
        return;
    }

    // Insertar datos de texto en el Perfil
    document.getElementById('profileName').innerText = `[${nameInput}]`;
    document.getElementById('profileAge').innerText = ageInput !== "" ? `${ageInput} años` : "--";
    document.getElementById('profileDesc').innerText = descInput !== "" ? descInput : "--";

    // Insertar datos numéricos generados por el dado en el Perfil
    document.getElementById('profileStr').innerText = `Nvl. ${statStr}`;
    document.getElementById('profileVit').innerText = `Nvl. ${statVit}`;
    document.getElementById('profileAgi').innerText = `Nvl. ${statAgi}`;
    document.getElementById('profileMag').innerText = `Nvl. ${statMag}`;

    // Mensaje de bienvenida en el Chat
    chatBox.innerHTML = `
        <div class="message"><span class="system-alert">[El Sistema ha registrado con éxito a la encarnación ${nameInput}.]</span></div>
        <div class="message"><span class="system-alert">[El Sistema te da la bienvenida al escenario.]</span></div>
        <div class="message">Camináis hacia la salida del jardín botánico, con los sentidos alerta a cualquier crujido de hojas o voz lejana que pueda delataros.</div>
    `;

    document.getElementById('creationScreen').style.display = 'none';
    appContainer.style.display = 'flex';
    switchTab('chatBox', 'nav-chat', 'HISTORIAL DE ROL');
}

function switchTab(tabId, buttonId, headerText) {
    currentActiveTab = tabId;
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    const tabs = document.querySelectorAll('.nav-item');
    tabs.forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';
    document.getElementById(buttonId).classList.add('active');
    appHeader.innerText = headerText;

    if (tabId === 'chatBox' || (tabId === 'midtrystBox' && hasMidtryst)) {
        actionContainer.style.display = 'flex';
    } else {
        actionContainer.style.display = 'none';
    }
    mainContent.scrollTop = mainContent.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    if (input.value.trim() !== "") {
        const newMessage = document.createElement('div');
        newMessage.className = 'message';
        newMessage.innerHTML = `${input.value}`;

        if (currentActiveTab === 'chatBox') {
            chatBox.appendChild(newMessage);
        } else if (currentActiveTab === 'midtrystBox' && hasMidtryst) {
            document.getElementById('midtrystActiveContent').appendChild(newMessage);
        }

        input.value = "";
        mainContent.scrollTop = mainContent.scrollHeight;
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') { sendMessage(); }
}

function buyMidtryst() {
    if (hasMidtryst) {
        alert("[Ya posees este objeto en tu inventario.]");
        return;
    }
    if (playerCoins >= 50) {
        playerCoins -= 50;
        hasMidtryst = true;
        document.getElementById('coinDisplay').innerText = playerCoins;
        document.getElementById('midtrystLockedState').style.display = 'none';
        document.getElementById('midtrystActiveContent').style.display = 'block';
        document.getElementById('nav-midtryst').querySelector('.icon').innerText = '🔓';
        document.getElementById('midtrystShopItem').innerHTML = "<span style='color: #10b981;'>[Objeto 'Midtryst' Adquirido]</span>";
        alert("[Has adquirido el 'Midtryst'. La frecuencia de transmisión privada ha sido abierta.]");
    } else {
        alert("[Monedas insuficientes para realizar el intercambio con el Dokkaebi.]");
    }
}
