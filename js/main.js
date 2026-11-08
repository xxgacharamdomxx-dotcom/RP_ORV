const startScreen = document.getElementById('startScreen');
const appContainer = document.getElementById('appContainer');
const chatBox = document.getElementById('chatBox');
const constellationsBox = document.getElementById('constellationsBox');
const appHeader = document.getElementById('appHeader');
const actionContainer = document.getElementById('actionContainer');
const mainContent = document.getElementById('mainContent');
const aiTyping = document.getElementById('aiTyping');

// VARIABLES GLOBALES (Conectadas con index.html)
window.statStr = 0;
window.statVit = 0;
window.statAgi = 0;
window.statMag = 0;
window.statsRolled = false;

let playerCoins = 100;
let hasMidtryst = false;
let currentActiveTab = 'chatBox';
let charNameGlobal = "";

// Configuración de la IA Libre (Hugging Face)
const parte1 = "https://huggingface.co";
const parte2 = "models/meta-llama/";
const HF_API_URL = parte1 + parte2 + "Llama-3.2-3B-Instruct";

// Catálogo de Constelaciones para interacciones aleatorias
const constNames = [
    "Prisionero de la Diadema Dorada",
    "Dragón Negro del Abismo de Fuego",
    "Jueza de Fuego de la Demoniaca Llama",
    "Estratega Supremo",
    "Monarca de la Salvación"
];

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
    if (!window.statsRolled) {
        alert("[Debes lanzar los dados 🎲 para inicializar tus estadísticas base.]");
        return;
    }

    charNameGlobal = nameInput;
    document.getElementById('profileName').innerText = `[${nameInput}]`;
    document.getElementById('profileAge').innerText = ageInput !== "" ? `${ageInput} años` : "--";
    document.getElementById('profileDesc').innerText = descInput !== "" ? descInput : "--";

    updateProfileStatDisplays();

    chatBox.innerHTML = `
        <div class="message"><span class="system-alert">[El Sistema ha registrado con éxito a la encarnación ${nameInput}.]</span></div>
        <div class="message"><span class="system-alert">[El Sistema te da la bienvenida al escenario.]</span></div>
        <div class="message">Te encuentras en los vagones oscuros de la Estación de Oksu en Seúl. Una neblina azulada flota en el aire y un silencio sepulcral inunda el lugar. El escenario número 1 está por comenzar. ¿Qué decides hacer?</div>
    `;

    document.getElementById('creationScreen').style.display = 'none';
    appContainer.style.display = 'flex';
    switchTab('chatBox', 'nav-chat', 'HISTORIAL DE ROL');
}

function updateProfileStatDisplays() {
    document.getElementById('profileStr').innerText = `Nvl. ${window.statStr}`;
    document.getElementById('profileVit').innerText = `Nvl. ${window.statVit}`;
    document.getElementById('profileAgi').innerText = `Nvl. ${window.statAgi}`;
    document.getElementById('profileMag').innerText = `Nvl. ${window.statMag}`;
}

// MECÁNICA: Mejorar estadísticas gastando monedas
function upgradeStat(statType) {
    if (playerCoins >= 10) {
        playerCoins -= 10;
        document.getElementById('coinDisplay').innerText = playerCoins;
        
        if(statType === 'Str') window.statStr++;
        if(statType === 'Vit') window.statVit++;
        if(statType === 'Agi') window.statAgi++;
        if(statType === 'Mag') window.statMag++;
        
        updateProfileStatDisplays();
        
        const upgradeMsg = document.createElement('div');
        upgradeMsg.className = 'message';
        upgradeMsg.innerHTML = `<span class="system-alert">[Tu estadística de ${statType} ha subido de nivel. Has gastado 10 monedas.]</span>`;
        chatBox.appendChild(upgradeMsg);
        
        triggerConstellationReaction(`ha subido su estadística de ${statType}`);
    } else {
        alert("[Monedas insuficientes. El Sistema rechaza la transacción.]");
    }
}

// MECÁNICA: Reacciones automáticas en la pestaña de Constelaciones
function triggerConstellationReaction(actionText) {
    const randomConst = constNames[Math.floor(Math.random() * constNames.length)];
    const reactions = [
        "está mirando con ojos brillantes tu crecimiento.",
        "asiente con la cabeza ante tus decisiones.",
        "devora con gran interés la historia que estás creando.",
        "considera que eres una encarnación bastante intrigante.",
        "ha soltado una pequeña risa burlona desde el cielo."
    ];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    const newConstMsg = document.createElement('div');
    newConstMsg.className = 'message';
    newConstMsg.innerHTML = `<span class="constellation">[La constelación '${randomConst}' ${randomReaction}]</span>`;
    constellationsBox.appendChild(newConstMsg);
    
    // Probabilidad de patrocinio de monedas (Donaciones aleatorias)
    if(Math.random() > 0.6) {
        playerCoins += 20;
        document.getElementById('coinDisplay').innerText = playerCoins;
        const rewardMsg = document.createElement('div');
        rewardMsg.className = 'message';
        rewardMsg.innerHTML = `<span class="constellation">[La constelación '${randomConst}' ha patrocinado a la encarnación con 20 monedas.]</span>`;
        chatBox.appendChild(rewardMsg);
    }
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

// MECÁNICA: Procesamiento de mensajes y activación del flujo de IA
async function sendMessage() {
    const input = document.getElementById('userInput');
    const userText = input.value.trim();
    if (userText === "") return;

    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.innerHTML = `<strong>> ${charNameGlobal}:</strong> ${userText}`;
    
    if (currentActiveTab === 'chatBox') {
        chatBox.appendChild(newMessage);
    } else if (currentActiveTab === 'midtrystBox' && hasMidtryst) {
        document.getElementById('midtrystActiveContent').appendChild(newMessage);
    }

    input.value = "";
    mainContent.scrollTop = mainContent.scrollHeight;

    triggerConstellationReaction("hizo una acción");

    if (currentActiveTab === 'chatBox') {
        await fetchAIResponse(userText);
    }
}

async function fetchAIResponse(userAction) {
    aiTyping.style.display = "block";
    mainContent.scrollTop = mainContent.scrollHeight;

    const promptContext = `Eres el narrador omnisciente y el 'Sistema' del universo de 'Omniscient Reader's Viewpoint'. El usuario es la encarnación llamada ${charNameGlobal}. Responde a su acción de rol continuando la historia de forma inmersiva, interactiva, fría y misteriosa en español. Describe el peligro del escenario actual, monstruos o el Star Stream. Mantén la respuesta corta, de máximo 3 líneas. No uses emojis bajo ninguna circunstancia. Acción del usuario: "${userAction}". Narración del sistema:`;

    try {
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                inputs: promptContext,
                parameters: { max_new_tokens: 90, temperature: 0.7 }
            })
        });

        const data = await response.json();
        let aiText = "";
        
        if (data && data[0] && data[0].generated_text) {
            aiText = data[0].generated_text.replace(promptContext, "").trim();
        } else if (data && data.generated_text) {
            aiText = data.generated_text.replace(promptContext, "").trim();
        } else {
            aiText = "El flujo del escenario avanza. Una presencia helada te observa desde las vías del tren, esperando tu próxima resolución.";
        }

        const aiMessage = document.createElement('div');
        aiMessage.className = 'message';
        aiMessage.innerHTML = `${aiText}`;
        chatBox.appendChild(aiMessage);

    } catch (error) {
        console.error("Error en la conexión del Star Stream:", error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message';
        errorMessage.innerHTML = `<em>[El canal experimenta una distorsión temporal momentánea. El flujo del escenario continúa latiendo en la oscuridad.]</em>`;
        chatBox.appendChild(errorMessage);
    } finally {
        aiTyping.style.display = "none";
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
