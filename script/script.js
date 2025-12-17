const DEV_URL = "http://localhost:8080/";
const LIVE_URL = "http://wiresnchains.com/";
const LIVE_MODE = false;


const DEV_MODE = true;
const BASE_URL = DEV_MODE ? 'localhost:8080' : 'wiresnchains.com';

function buildQuery(params = {}) {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : "";
}

function getBaseUrl() {
    return LIVE_MODE ? LIVE_URL : DEV_URL;
}

async function request(path, method, data = {}) {
    const baseUrl = getBaseUrl();
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

// (async () => {
//     console.log(await request("create-game", "POST"));
// })();

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


    console.log(123);

    const div = document.querySelector('div#game');
    console.log(div);
    const nodeList = div.querySelectorAll('input');
    console.log(nodeList);

    
    const input = [...nodeList].map(input => input.value);
    console.log(input);
    const userStory = input.join(' ');
    console.log(userStory);
    
    


    console.log('sending request...');
    const response = await request("create-game", "POST");
    console.log(response);



    
    const gameID = response.connectionCode;
    const player = 'Jos';

    const url = `ws://${BASE_URL}/game/${gameID}/${player}`;
    console.log('url: ');
    console.log(url);
    
    const ws = new WebSocket(url);
    const data = {
        event: 'send-user-story',
        data: {
            message: userStory,
            // as:
            // wantTo:
            // soThat: 
        },
    };

    const json = JSON.stringify(data);

    ws.addEventListener('open', (event) => {
        console.log("OPEN");
        ws.send(json);
    })
    // onopen = (event) => { }
}