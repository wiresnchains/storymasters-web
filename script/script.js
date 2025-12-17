const DEV_URL = "http://localhost:8080/";
const LIVE_URL = "https://wiresnchains.com/";
const LIVE_MODE = false;

function buildQuery(params = {}) {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : "";
}

function getBaseURL(ws) {
    const result = LIVE_MODE ? LIVE_URL : DEV_URL;

    if (ws) {
        result.replace("https", "wss").replace("http", "ws");
    }

    return result;
}

async function request(path, method, data = {}) {
    const baseUrl = getBaseURL();
    const url = method === "GET" ? baseUrl + path + buildQuery(data) : baseUrl + path;

    const res = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: method === "POST" ? JSON.stringify(data) : undefined,
    });

    const payload = await res.json();

    if (!res.ok) {
        throw new Error(payload);
    }

    return payload;
}

function copyBtn() {
    const copyText = document.getElementById("connection-code");
    const button = document.getElementById("copyBtn");

    // Copy text
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);

    // Save original button content
    const originalContent = button.innerHTML;

    // Show image
    button.innerHTML = `<img src="/img/check.png" alt="Copied" style="height:20px;">`;

    // Restore after 1 second
    setTimeout(() => {
        button.innerHTML = originalContent;
    }, 1000);
}

async function submitBtn() {
    const game = document.getElementById("game");
    const submitText = document.getElementById("submit-text");
    const submitBtn = document.getElementById("submit");
    const submitInput = document.getElementById("submit-input");

    const texts = [
        "Antwoord verstuurd!",
        "Even nadenken… 🤔",
        "Dit ging snel!",
        "Goede keuze!",
        "Succes! 🍀",
        "Wachten op de rest…",
        "Bijna daar!",
        "Topantwoord! ⭐",
        "Ingezonden 🚀",
        "Slim gespeeld!"
    ];

    // Kies een random tekst
    const randomText = texts[Math.floor(Math.random() * texts.length)];

    submitInput.value = randomText;

    submitBtn.style.display = 'none';
    game.style.display = 'none';
    submitText.style.display = 'inline-flex';
}

class Game {
    constructor(ws) {
        this.ws = ws;
        this.events = {};

        this.ws.onopen = (event) => {
            console.log("Connected to websocket");

            this.interval = setInterval(() => {
                this.ws.send("im-alive");
            }, 15000);
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const handler = this.events[message.event];

            if (handler) {
                handler(message.data);
            }
        }

        this.ws.onclose = (event) => {
            console.log("Connected closed");
            window.location.replace("/");
            clearInterval(this.aliveInterval);
        }
    }

    addEvent(name, handler) {
        this.events[name] = handler;
    }

    sendEvent(name, payload) {
        this.ws.send(JSON.stringify({
            event: name,
            data: payload,
        }))
    }
}

function connectToGame(name, connectionCode) {
    return new Game(new WebSocket(getBaseURL(true) + "game/" + encodeURIComponent(connectionCode) + "/" + encodeURIComponent(name)));
}
