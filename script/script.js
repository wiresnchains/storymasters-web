const DEV_URL = "http://localhost:8080/";
const LIVE_URL = "http://wiresnchains.com/";
const LIVE_MODE = false;

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

(async () => {
    console.log(await request("create-game", "POST"));
})();

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