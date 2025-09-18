// Lista de clientes fictícios para teste

function playBeep() {
  // Novo alerta: três tons ascendentes curtos
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const freqs = [660, 880, 1040]; // tons ascendentes
  let start = ctx.currentTime;
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.18;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + i * 0.13);
    osc.stop(start + i * 0.13 + 0.11);
    osc.onended = () => {
      gain.disconnect();
      if (i === freqs.length - 1) ctx.close();
    };
  });
}

// Array para armazenar as últimas chamadas recebidas
let lastCalls = [];

function renderLastCalls(calls) {
  const listEl = document.getElementById("lastCallsList");
  if (!listEl) return;
  listEl.innerHTML = "";
  calls.forEach((call) => {
    const li = document.createElement("li");
    // Exibe nome, guichê e horário formatado se disponível
    let texto = `${call.nome} - ${call.guiche}`;
    if (call.chamadoEm) {
      const dt = new Date(call.chamadoEm);
      texto += ` <span style='font-size:0.9em;color:#888;'>(${dt.toLocaleTimeString(
        "pt-BR",
        { hour: "2-digit", minute: "2-digit" }
      )})</span>`;
    }
    li.innerHTML = texto;
    listEl.appendChild(li);
  });
}

window.onload = function () {
  console.log("App iniciado");

  // Atualiza o relógio a cada segundo
  setInterval(updateClock, 1000);
  updateClock(); // inicial

  // Tecla RETURN fecha o app
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 10009) {
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (err) {
        console.log("Erro ao sair:", err);
      }
    }
  });

  // Conexão com o servidor WebSocket
  const ws = new WebSocket("ws://localhost:3001");
  console.log("Conectado ao servidor WebSocket!");
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "painel" }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Dados recebidos do WebSocket:", data); // <-- log dos dados recebidos
      if (Array.isArray(data)) {
        // Se for array, renderiza a lista de últimas chamadas
        lastCalls = data.slice(0, 5); // Garante no máximo 10
        renderLastCalls(lastCalls);
      } else if (data.nome && data.guiche) {
        // Atualiza o painel com os dados recebidos
        const nomeEl = document.getElementById("customerName");
        const setorEl = document.getElementById("customerSector");
        if (nomeEl && setorEl) {
          nomeEl.textContent = data.nome;
          setorEl.textContent = data.guiche;
        }
        // Opcional: tocar beep e falar nome
        playBeep();
        if ("speechSynthesis" in window) {
          const texto = `${data.nome}, ${data.guiche}`;
          const utter = new SpeechSynthesisUtterance(texto);
          utter.lang = "pt-BR";
          utter.rate = 0.98;
          // Seleciona voz feminina pt-BR se disponível
          const voices = window.speechSynthesis.getVoices();
          const female =
            voices.find(
              (v) =>
                (v.lang.startsWith("pt-BR") &&
                  v.name.toLowerCase().includes("feminina")) ||
                (v.lang.startsWith("pt-BR") && v.gender === "female")
            ) ||
            voices.find(
              (v) =>
                v.lang.startsWith("pt-BR") &&
                v.name.toLowerCase().includes("female")
            ) ||
            voices.find(
              (v) =>
                v.lang.startsWith("pt-BR") &&
                v.name.toLowerCase().includes("brasil")
            ) ||
            voices.find((v) => v.lang.startsWith("pt-BR"));
          if (female) utter.voice = female;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }
        // Adiciona à lista de últimas chamadas
        lastCalls.unshift({
          nome: data.nome,
          guiche: data.guiche,
          chamadoEm: data.chamadoEm || new Date().toISOString(),
        });
        lastCalls = lastCalls.slice(0, 5);
        renderLastCalls(lastCalls);
      }
    } catch (e) { }
  };
};

function updateClock() {
  const now = new Date();

  const timeEl = document.getElementById("clockTime");
  const dateEl = document.getElementById("clockDate");

  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
