const startScreen = document.getElementById('startScreen');
const appContainer = document.getElementById('appContainer');
const chatBox = document.getElementById('chatBox');
const appHeader = document.getElementById('appHeader');
const actionContainer = document.getElementById('actionContainer');
const mainContent = document.getElementById('mainContent');

let playerCoins = 100;
let hasMidtryst = false;
let currentActiveTab = 'chatBox';

// Nueva función para el botón de "Comenzar"
function startNewGame() {
    // Oculta la pantalla negra de inicio y muestra el formulario de registro
    startScreen.style.display = 'none';
    document.getElementById('creationScreen').style.display = 'flex';
}

// Nueva función para procesar el personaje e iniciar el rol
function saveCharacterAndStart() {
    const nameInput = document.getElementById('charName').value.trim();
    const ageInput = document.getElementById('charAge').value.trim();
    const descInput = document.getElementById('charDesc').value.trim();

    // Validar que al menos ponga un nombre
    if (nameInput === "") {
        alert("[El Sistema requiere un nombre válido para registrar la Encarnación.]");
        return;
    }

    // Insertar los datos capturados directamente en la pestaña de Perfil
    document.getElementById('profileName').innerText = `[${nameInput}]`;
    document.getElementById('profileAge').innerText = ageInput !== "" ? `${ageInput} años` : "--";
    document.getElementById('profileDesc').innerText = descInput !== "" ? descInput : "--";

    // Inicializar el mensaje de bienvenida personalizado en el chat
    chatBox.innerHTML = `
        <div class="message"><span class="system-alert">[El Sistema ha registrado con éxito a la encarnación ${nameInput}.]</span></div>
        <div class="message"><span class="system-alert">[El Sistema te da la bienvenida al escenario.]</span></div>
        <div class="message">Camináis hacia la salida del jardín botánico, con los sentidos alerta a cualquier crujido de hojas o voz lejana que pueda delataros.</div>
    `;

    // Ocultar pantalla de creación y encender la interfaz WorldOS
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
