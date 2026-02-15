/**
 * Creature Detail Page - renders full creature info
 */
(function() {
  const data = window.PATTERNDEX_DATA;
  const types = window.PatterndexTypes;
  const svg = window.SvgGenerator;

  const container = document.getElementById('creature-detail');

  // Get creature ID from URL params
  const params = new URLSearchParams(window.location.search);
  const creatureId = params.get('id');

  if (!creatureId) {
    container.innerHTML = '<div class="no-results">NO CREATURE SPECIFIED</div>';
    return;
  }

  const creature = types.getCreatureById(creatureId);
  if (!creature) {
    container.innerHTML = '<div class="no-results">CREATURE NOT FOUND</div>';
    return;
  }

  // Update page title
  document.title = `Patterndex - ${creature.name}`;

  // Find prev/next creatures
  const idx = data.creatures.findIndex(c => c.id === creatureId);
  const prev = idx > 0 ? data.creatures[idx - 1] : null;
  const next = idx < data.creatures.length - 1 ? data.creatures[idx + 1] : null;

  const primaryColor = data.types[creature.types[0]]?.color || '#888888';
  const statKeys = ['complexity', 'flexibility', 'decoupling', 'abstraction', 'performance', 'popularity'];
  const statLabels = ['COMPLEXITY', 'FLEXIBILITY', 'DECOUPLING', 'ABSTRACTION', 'PERFORMANCE', 'POPULARITY'];

  // Build stat bars
  function renderStatBars() {
    return statKeys.map((key, i) => {
      const val = creature.stats[key] || 0;
      const pct = val * 10;
      const barColor = pct >= 70 ? '#8bac0f' : pct >= 40 ? '#f8d030' : '#f08030';
      return `
        <div class="stat-row">
          <span class="stat-label">${statLabels[i]}</span>
          <div class="stat-bar-bg">
            <div class="stat-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
          </div>
          <span class="stat-value">${val}</span>
        </div>
      `;
    }).join('');
  }

  // Build related patterns links
  function renderRelated() {
    if (!creature.related || !creature.related.length) return '';
    return creature.related.map(id => {
      const rel = types.getCreatureById(id);
      if (!rel) return '';
      return `<a href="creature.html?id=${id}" class="related-link">#${rel.id} ${rel.name}</a>`;
    }).join('');
  }

  // Build navigation
  function renderNav() {
    let html = '<div class="creature-nav">';
    if (prev) {
      html += `<a href="creature.html?id=${prev.id}">&lt; #${prev.id} ${prev.name}</a>`;
    } else {
      html += '<span></span>';
    }
    if (next) {
      html += `<a href="creature.html?id=${next.id}">#${next.id} ${next.name} &gt;</a>`;
    } else {
      html += '<span></span>';
    }
    html += '</div>';
    return html;
  }

  // Escape HTML
  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Render
  container.innerHTML = `
    ${renderNav()}

    <div class="creature-layout">
      <div class="creature-sprite-section">
        <div class="creature-header">
          <div class="creature-number">#${creature.id}</div>
          <div class="creature-name">${esc(creature.name)}</div>
          <div class="creature-pattern">${esc(creature.pattern)}</div>
          <div class="creature-types" id="creature-types"></div>
          <div class="creature-category" id="creature-category"></div>
        </div>

        <div class="sprite-container">
          ${svg.generate(creature)}
        </div>

        <div class="radar-container">
          ${svg.generateRadar(creature.stats, primaryColor)}
        </div>

        <div class="stats-section">
          <div class="stats-bars">
            ${renderStatBars()}
          </div>
        </div>
      </div>

      <div class="creature-info-section">
        <div class="info-block">
          <h3>INTENT</h3>
          <p>${esc(creature.intent)}</p>
        </div>

        <div class="info-block">
          <h3>PROBLEM</h3>
          <p>${esc(creature.problem)}</p>
        </div>

        <div class="info-block">
          <h3>SOLUTION</h3>
          <p>${esc(creature.solution)}</p>
        </div>

        <div class="info-block">
          <h3>REAL-WORLD ANALOGY</h3>
          <p>${esc(creature.analogy)}</p>
        </div>

        <div class="info-block">
          <h3>CODE HINT</h3>
          <pre class="code-hint">${esc(creature.codeHint)}</pre>
        </div>

        <div class="info-block">
          <h3>PARTICIPANTS</h3>
          <ul>
            ${creature.participants.map(p => `<li>${esc(p)}</li>`).join('')}
          </ul>
        </div>

        <div class="info-block">
          <h3>RELATED PATTERNS</h3>
          <div class="related-patterns">
            ${renderRelated()}
          </div>
        </div>
      </div>
    </div>

    ${renderNav()}
  `;

  // Add type badges via DOM
  const typesContainer = document.getElementById('creature-types');
  creature.types.forEach(t => {
    typesContainer.appendChild(types.createTypeBadge(t));
  });

  // Add category badge
  const catContainer = document.getElementById('creature-category');
  catContainer.appendChild(types.createCategoryBadge(creature.category));

  // Animate stat bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.stat-bar-fill').forEach(bar => {
      bar.style.transition = 'width 0.5s steps(10)';
    });
  });
})();
