/**
 * Type Chart Page - renders matchup matrix with tooltips
 */
(function() {
  const data = window.PATTERNDEX_DATA;
  const types = window.PatterndexTypes;
  const container = document.getElementById('typechart-container');

  const allTypes = types.getAllTypes();

  // Effectiveness descriptions for software concepts
  const effDescriptions = {
    2: 'Super effective! This concept strongly overcomes the defender.',
    0.5: 'Not very effective. The defender resists this approach.',
    0: 'No effect. The defender is immune to this approach.',
    1: 'Normal effectiveness.'
  };

  // Specific matchup explanations
  function getMatchupReason(attacker, defender, eff) {
    const reasons = {
      'fire_steel': 'Dynamic behavior breaks rigid structure',
      'fire_grass': 'Mutation disrupts composition',
      'fire_ice': 'Dynamic change melts immutability',
      'fire_bug': 'Heavy mutation overwhelms lightweight patterns',
      'water_fire': 'Sequencing controls mutation',
      'water_poison': 'Flow cleanses side effects',
      'ice_grass': 'Immutability freezes growth',
      'ice_flying': 'Snapshots halt traversal',
      'ice_dragon': 'Immutability tames complexity',
      'ice_poison': 'Immutability prevents mutation',
      'fairy_dragon': 'Simplification tames complexity',
      'fairy_fighting': 'Elegance redirects force',
      'fairy_dark': 'Simplification reveals hidden state',
      'psychic_fighting': 'Abstraction makes force irrelevant',
      'psychic_poison': 'Indirection isolates side effects',
      'ghost_ghost': 'Proxies can detect each other',
      'ghost_psychic': 'Indirection pierces abstraction',
      'dark_psychic': 'Encapsulation defeats abstraction',
      'dark_ghost': 'Hiding exposes proxies',
      'bug_grass': 'Efficiency optimizes composition',
      'bug_psychic': 'Lightweight patterns simplify abstractions',
      'bug_dark': 'Efficiency penetrates encapsulation',
      'steel_ice': 'Structure preserves immutability',
      'steel_fairy': 'Structure enables elegance',
      'fighting_normal': 'Direct action fulfills contracts',
      'fighting_dark': 'Commands break through encapsulation',
      'fighting_steel': 'Force shapes structure',
      'fighting_ice': 'Action breaks frozen state',
      'flying_grass': 'Traversal explores compositions',
      'flying_fighting': 'Iteration avoids direct confrontation',
      'flying_bug': 'Traversal collects lightweight objects',
      'electric_water': 'Transformation changes flow',
      'electric_flying': 'Conversion intercepts traversal',
      'dragon_dragon': 'Complexity compounds complexity',
      'poison_grass': 'Side effects corrupt composition',
      'poison_fairy': 'Mutation tarnishes elegance',
      'normal_ghost': 'Contracts can\'t bind proxies',
      'grass_water': 'Composition shapes flow',
      'grass_normal': 'Growth extends contracts'
    };
    const key = `${attacker}_${defender}`;
    return reasons[key] || '';
  }

  function render() {
    let html = `
      <p class="typechart-intro">
        TYPE MATCHUPS REFLECT SOFTWARE RELATIONSHIPS.<br>
        ROWS = ATTACKER, COLUMNS = DEFENDER.
      </p>
    `;

    // Build table
    html += '<table class="type-chart-table">';

    // Header row
    html += '<tr><th class="corner"></th>';
    allTypes.forEach(t => {
      const name = types.getTypeName(t);
      const abbr = name.slice(0, 3).toUpperCase();
      html += `<th style="color: ${types.getTypeColor(t)};" title="${name}">${abbr}</th>`;
    });
    html += '</tr>';

    // Data rows
    allTypes.forEach(attacker => {
      const aName = types.getTypeName(attacker);
      html += `<tr><th class="row-header" style="color: ${types.getTypeColor(attacker)};">${aName}</th>`;

      allTypes.forEach(defender => {
        const eff = types.getEffectiveness(attacker, defender);
        let cls = 'eff-neutral';
        let text = '';
        if (eff === 2) { cls = 'eff-super'; text = '2x'; }
        else if (eff === 0.5) { cls = 'eff-not-very'; text = '\u00BD'; }
        else if (eff === 0) { cls = 'eff-immune'; text = '0'; }

        const reason = getMatchupReason(attacker, defender, eff);
        const tooltip = reason ? `${aName} vs ${types.getTypeName(defender)}: ${reason}` : '';

        html += `<td class="${cls}" data-tooltip="${tooltip}" data-attacker="${attacker}" data-defender="${defender}">${text}</td>`;
      });

      html += '</tr>';
    });

    html += '</table>';

    // Legend
    html += `
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-swatch eff-super"></div>
          <span>2x SUPER EFFECTIVE</span>
        </div>
        <div class="legend-item">
          <div class="legend-swatch eff-not-very"></div>
          <span>&frac12;x NOT EFFECTIVE</span>
        </div>
        <div class="legend-item">
          <div class="legend-swatch eff-immune"></div>
          <span>0x IMMUNE</span>
        </div>
        <div class="legend-item">
          <div class="legend-swatch eff-neutral"></div>
          <span>1x NEUTRAL</span>
        </div>
      </div>
    `;

    // Type descriptions
    html += '<div class="type-descriptions">';
    allTypes.forEach(t => {
      html += `
        <div class="type-desc-item">
          <span class="type-badge" style="background: ${types.getTypeColor(t)};">${types.getTypeName(t).toUpperCase()}</span>
          <p>${types.getTypeConcept(t)}</p>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;

    // Tooltip behavior
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    document.body.appendChild(tooltip);

    container.addEventListener('mouseover', e => {
      const td = e.target.closest('td[data-tooltip]');
      if (td && td.dataset.tooltip) {
        tooltip.textContent = td.dataset.tooltip;
        tooltip.classList.add('visible');
      }
    });

    container.addEventListener('mousemove', e => {
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top = (e.clientY + 12) + 'px';
    });

    container.addEventListener('mouseout', e => {
      if (e.target.closest('td[data-tooltip]')) {
        tooltip.classList.remove('visible');
      }
    });
  }

  render();
})();
