const DEV_URL = "http://localhost:8080/";
const LIVE_URL = "http://wiresnchains.com/";
const LIVE_MODE = false;


const DEV_MODE = true;
const BASE_URL = DEV_MODE ? 'localhost:8080' : 'wiresnchains.com';

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

class Game {
    events = {};
    queue = [];

    constructor(ws) {
        this.ws = ws;
        
        const old = Date.now();

        this.ws.onopen = (event) => {
            const ms = (Date.now() - old) + 'ms';
            console.log(`(${ms}) Connected to websocket`);
            // alert(ms);

            const tmp = this.queue;
            this.queue = null;
            tmp.forEach(arr => this.sendEvent(...arr));
            

            this.aliveInterval = setInterval(() => {
                this.ws.send("I'm alive");
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

    addEvent = (name, handler) => this.events[name] = handler;

    sendEvent = (event, data) => {
        console.log("sending event");
        if (this.queue === null) return this.ws.send(JSON.stringify({ event, data }));
        this.queue.push([ event, data ]);

        // this.ws.send(JSON.stringify({
        //     event: event,
        //     data: data,
        // }))
    }
}

function connectToGame(name, connectionCode) {
    // const url = `ws://${BASE_URL}/game/${gameID}/${player}`;
    // const ws = new WebSocket(url);
    // return new Game(ws);
    return new Game(new WebSocket(getBaseURL(true) + "game/" + encodeURIComponent(connectionCode) + "/" + encodeURIComponent(name)));
}

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
