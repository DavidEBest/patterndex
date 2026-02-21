/**
 * Patterndex Grid Page - renders creature cards with filtering
 */
(function() {
  const data = window.PATTERNDEX_DATA;
  const types = window.PatterndexTypes;
  const svg = window.SvgGenerator;

  const grid = document.getElementById('creature-grid');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('filter-category');
  const typeFilter = document.getElementById('filter-type');

  // Populate type filter dropdown
  function populateTypeFilter() {
    types.getAllTypes().forEach(typeId => {
      const opt = document.createElement('option');
      opt.value = typeId;
      opt.textContent = types.getTypeName(typeId).toUpperCase();
      typeFilter.appendChild(opt);
    });
  }

  // Render a single creature card
  function renderCard(creature) {
    const card = document.createElement('a');
    card.className = 'creature-card';
    card.href = `creature.html?id=${creature.id}`;

    const number = document.createElement('span');
    number.className = 'card-number';
    number.textContent = `#${creature.id}`;

    const sprite = document.createElement('div');
    sprite.className = 'card-sprite';
    sprite.appendChild(types.createSprite(creature, 80));

    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = creature.name;

    const pattern = document.createElement('div');
    pattern.className = 'card-pattern';
    pattern.textContent = creature.pattern;

    const typesDiv = document.createElement('div');
    typesDiv.className = 'card-types';
    creature.types.forEach(t => {
      typesDiv.appendChild(types.createTypeBadge(t));
    });

    card.appendChild(number);
    card.appendChild(sprite);
    card.appendChild(name);
    card.appendChild(pattern);
    card.appendChild(typesDiv);

    return card;
  }

  // Render the full grid with filters applied
  function renderGrid() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const categoryVal = categoryFilter.value;
    const typeVal = typeFilter.value;

    let creatures = data.creatures;

    // Apply filters
    if (searchTerm) {
      creatures = creatures.filter(c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.pattern.toLowerCase().includes(searchTerm) ||
        c.id.includes(searchTerm)
      );
    }

    if (categoryVal) {
      creatures = creatures.filter(c => c.category === categoryVal);
    }

    if (typeVal) {
      creatures = creatures.filter(c => c.types.includes(typeVal));
    }

    // Clear and render
    grid.innerHTML = '';

    if (creatures.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'NO CREATURES FOUND...';
      grid.appendChild(noResults);
      return;
    }

    creatures.forEach(creature => {
      grid.appendChild(renderCard(creature));
    });
  }

  // Event listeners
  searchInput.addEventListener('input', renderGrid);
  categoryFilter.addEventListener('change', renderGrid);
  typeFilter.addEventListener('change', renderGrid);

  // Initialize
  populateTypeFilter();
  renderGrid();
})();
