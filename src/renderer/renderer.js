const statusEl = document.getElementById("status");
const dot = document.getElementById("dot");
const startBtn = document.getElementById("start");
const siteBtn = document.getElementById("site");
const startup = document.getElementById("startup");
const eventsEl = document.getElementById("events");

function setStatus(data) {
  statusEl.textContent = data.text || "";
  dot.className = "dot " + (
    data.state === "online" ? "online" :
    data.state === "error" || data.state === "captcha" ? "error" : "offline"
  );
}

function renderEvents(events) {
  if (!events?.length) return;
  eventsEl.innerHTML = events.slice(0, 30).map(e => `
    <tr>
      <td>${escapeHtml(e.date)}</td>
      <td><strong>${escapeHtml(e.magnitude)}</strong></td>
      <td>${escapeHtml(e.lat)}</td>
      <td>${escapeHtml(e.lon)}</td>
      <td>${escapeHtml(e.depth)}</td>
    </tr>
  `).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

startBtn.addEventListener("click", async () => {
  const active = await window.infp.getMonitoring();
  if (active) {
    await window.infp.stop();
    startBtn.textContent = "Pornește monitorizarea";
  } else {
    const started = await window.infp.start();
    startBtn.textContent = started ? "Oprește monitorizarea" : "Pornește monitorizarea";
  }
});

siteBtn.addEventListener("click", () => window.infp.openSite());
document.getElementById("source").addEventListener("click", () => window.infp.openSite());

window.infp.onStatus(setStatus);
window.infp.onEvents(renderEvents);

window.infp.onEarthquake((e) => {
  // Toast-ul este emis de procesul principal.
  // Aici doar evidențiem evenimentul în tabel.
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${escapeHtml(e.date)}</td>
    <td><strong>${escapeHtml(e.magnitude)}</strong></td>
    <td>${escapeHtml(e.lat)}</td>
    <td>${escapeHtml(e.lon)}</td>
    <td>${escapeHtml(e.depth)}</td>
  `;
  eventsEl.prepend(row);
});

startup.addEventListener("change", async () => {
  startup.checked = await window.infp.setStartup(startup.checked);
});

window.infp.getMonitoring().then(active => {
  startBtn.textContent = active ? "Oprește monitorizarea" : "Pornește monitorizarea";
});
