// Czech Media Rating - Content Script
// Zobrazuje hodnocení médií přímo na zpravodajských stránkách

// Data hodnocení médií
const mediaRatings = {
  'idnes.cz': { name: 'iDNES.cz', score: 72, accuracy: 75, transparency: 70, professionalism: 72, balance: 71 },
  'aktualne.cz': { name: 'Aktuálně.cz', score: 74, accuracy: 76, transparency: 73, professionalism: 74, balance: 73 },
  'novinky.cz': { name: 'Novinky.cz', score: 68, accuracy: 70, transparency: 65, professionalism: 69, balance: 68 },
  'seznamzpravy.cz': { name: 'Seznam Zprávy', score: 76, accuracy: 78, transparency: 75, professionalism: 76, balance: 75 },
  'irozhlas.cz': { name: 'iROZHLAS.cz', score: 82, accuracy: 85, transparency: 83, professionalism: 80, balance: 80 },
  'denik.cz': { name: 'Deník N', score: 80, accuracy: 83, transparency: 78, professionalism: 81, balance: 78 },
  'denikn.cz': { name: 'Deník N', score: 80, accuracy: 83, transparency: 78, professionalism: 81, balance: 78 },
  'lidovky.cz': { name: 'Lidovky.cz', score: 70, accuracy: 72, transparency: 68, professionalism: 71, balance: 69 },
  'blesk.cz': { name: 'Blesk.cz', score: 45, accuracy: 50, transparency: 40, professionalism: 45, balance: 45 },
  'echo24.cz': { name: 'Echo24.cz', score: 65, accuracy: 68, transparency: 63, professionalism: 65, balance: 64 },
  'pravo.cz': { name: 'Právo', score: 67, accuracy: 70, transparency: 65, professionalism: 68, balance: 65 },
  'ihned.cz': { name: 'Hospodářské noviny', score: 78, accuracy: 80, transparency: 77, professionalism: 79, balance: 76 },
  'forum24.cz': { name: 'Forum24', score: 62, accuracy: 65, transparency: 60, professionalism: 63, balance: 60 },
  'parlamentnilisty.cz': { name: 'Parlamentní listy', score: 35, accuracy: 40, transparency: 30, professionalism: 35, balance: 35 },
  'ceskatelevize.cz': { name: 'Česká televize', score: 85, accuracy: 90, transparency: 88, professionalism: 82, balance: 80 },
  'rozhlas.cz': { name: 'Český rozhlas', score: 83, accuracy: 88, transparency: 85, professionalism: 80, balance: 79 }
};

// Získání domény z URL
function getDomainKey() {
  const hostname = window.location.hostname;
  for (const domain in mediaRatings) {
    if (hostname.includes(domain)) {
      return domain;
    }
  }
  return null;
}

// Získání barvy podle skóre
function getScoreColor(score) {
  if (score >= 75) return '#4caf50';
  if (score >= 55) return '#ff9800';
  return '#f44336';
}

// Získání textu podle skóre
function getScoreLabel(score) {
  if (score >= 75) return 'Vysoká důvěryhodnost';
  if (score >= 55) return 'Střední důvěryhodnost';
  return 'Nízká důvěryhodnost';
}

// Vytvoření hodnotícího panelu
function createRatingPanel(rating) {
  const panel = document.createElement('div');
  panel.id = 'cmr-rating-panel';
  panel.className = 'cmr-panel';
  
  panel.innerHTML = `
    <div class="cmr-header">
      <div class="cmr-logo">🎯</div>
      <div class="cmr-title">
        <strong>${rating.name}</strong>
        <span class="cmr-subtitle">Czech Media Rating</span>
      </div>
      <button class="cmr-close" id="cmr-close">✕</button>
    </div>
    <div class="cmr-content">
      <div class="cmr-score-section">
        <div class="cmr-score" style="color: ${getScoreColor(rating.score)}">${rating.score}</div>
        <div class="cmr-score-label">${getScoreLabel(rating.score)}</div>
      </div>
      <div class="cmr-metrics">
        <div class="cmr-metric">
          <span class="cmr-metric-label">Přesnost</span>
          <span class="cmr-metric-value">${rating.accuracy}%</span>
        </div>
        <div class="cmr-metric">
          <span class="cmr-metric-label">Transparentnost</span>
          <span class="cmr-metric-value">${rating.transparency}%</span>
        </div>
        <div class="cmr-metric">
          <span class="cmr-metric-label">Profesionalita</span>
          <span class="cmr-metric-value">${rating.professionalism}%</span>
        </div>
        <div class="cmr-metric">
          <span class="cmr-metric-label">Vyváženost</span>
          <span class="cmr-metric-value">${rating.balance}%</span>
        </div>
      </div>
    </div>
    <div class="cmr-footer">
      <a href="https://julekcreator.github.io/media-rating-cz/" target="_blank" class="cmr-link">Zobrazit všechna média →</a>
    </div>
  `;
  
  return panel;
}

// Inicializace rozšíření
function init() {
  const domainKey = getDomainKey();
  
  if (!domainKey) return;
  
  const rating = mediaRatings[domainKey];
  if (!rating) return;
  
  // Zkontroluj, zda panel už neexistuje
  if (document.getElementById('cmr-rating-panel')) return;
  
  // Vytvoř a přidej panel
  const panel = createRatingPanel(rating);
  document.body.appendChild(panel);
  
  // Přidej event listener pro zavření
  const closeBtn = document.getElementById('cmr-close');
  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
    // Ulož stav do localStorage
    localStorage.setItem('cmr-panel-hidden', 'true');
  });
  
  // Zkontroluj, zda byl panel dříve zavřen
  if (localStorage.getItem('cmr-panel-hidden') === 'true') {
    panel.style.display = 'none';
  }
}

// Spusť inicializaci po načtení stránky
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
