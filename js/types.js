/**
 * Type system utilities for Patterndex
 */
window.PatterndexTypes = (() => {
  const data = window.PATTERNDEX_DATA;

  function getTypeColor(typeId) {
    return data.types[typeId]?.color || '#888888';
  }

  function getTypeName(typeId) {
    return data.types[typeId]?.name || typeId;
  }

  function getTypeConcept(typeId) {
    return data.types[typeId]?.concept || '';
  }

  function createTypeBadge(typeId) {
    const span = document.createElement('span');
    span.className = 'type-badge';
    span.textContent = getTypeName(typeId).toUpperCase();
    span.style.background = getTypeColor(typeId);
    return span;
  }

  function createCategoryBadge(category) {
    const span = document.createElement('span');
    span.className = `category-badge category-${category}`;
    span.textContent = category.toUpperCase();
    return span;
  }

  function getEffectiveness(attackType, defendType) {
    const chart = data.typeChart[attackType];
    if (!chart) return 1;
    return chart[defendType] !== undefined ? chart[defendType] : 1;
  }

  function getCategoryColor(category) {
    const colors = {
      creational: '#f08030',
      structural: '#6890f0',
      behavioral: '#78c850'
    };
    return colors[category] || '#888888';
  }

  function getCreatureById(id) {
    return data.creatures.find(c => c.id === id);
  }

  function getAllTypes() {
    return Object.keys(data.types);
  }

  /** Get the PNG image path for a creature (generated art) */
  function getImagePath(creature) {
    return `img/${creature.id}-${creature.name.toLowerCase()}.png`;
  }

  /**
   * Create a sprite element: tries PNG first, falls back to SVG.
   * Clicking opens a lightbox with the full-size image.
   */
  function createSprite(creature, size, opts) {
    const clickable = opts && opts.lightbox;
    const img = document.createElement('img');
    img.src = getImagePath(creature);
    img.alt = creature.name;
    img.width = size;
    img.height = size;
    img.style.imageRendering = 'pixelated';
    img.className = 'creature-sprite-img';
    if (clickable) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(creature);
      });
    }
    // On error, fall back to SVG
    img.onerror = function() {
      const div = document.createElement('div');
      div.innerHTML = window.SvgGenerator.generate(creature);
      const svgEl = div.querySelector('svg');
      svgEl.style.width = size + 'px';
      svgEl.style.height = size + 'px';
      svgEl.style.imageRendering = 'pixelated';
      if (clickable) {
        svgEl.style.cursor = 'pointer';
        svgEl.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(creature);
        });
      }
      img.replaceWith(svgEl);
    };
    return img;
  }

  // Lightbox singleton
  let lightboxEl = null;

  function getLightbox() {
    if (lightboxEl) return lightboxEl;
    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.innerHTML = '<span class="lightbox-hint">CLICK TO CLOSE</span>';
    lightboxEl.addEventListener('click', () => {
      lightboxEl.classList.remove('open');
      lightboxEl.querySelectorAll('img, svg').forEach(el => el.remove());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightboxEl.classList.remove('open');
        lightboxEl.querySelectorAll('img, svg').forEach(el => el.remove());
      }
    });
    document.body.appendChild(lightboxEl);
    return lightboxEl;
  }

  function openLightbox(creature) {
    const box = getLightbox();
    // Remove any previous image
    box.querySelectorAll('img, svg').forEach(el => el.remove());
    const img = document.createElement('img');
    img.src = getImagePath(creature);
    img.alt = creature.name;
    img.style.imageRendering = 'pixelated';
    img.onerror = function() {
      const div = document.createElement('div');
      div.innerHTML = window.SvgGenerator.generate(creature);
      const svgEl = div.querySelector('svg');
      svgEl.style.imageRendering = 'pixelated';
      img.replaceWith(svgEl);
    };
    box.prepend(img);
    box.classList.add('open');
  }

  return {
    getTypeColor,
    getTypeName,
    getTypeConcept,
    createTypeBadge,
    createCategoryBadge,
    getEffectiveness,
    getCategoryColor,
    getCreatureById,
    getAllTypes,
    getImagePath,
    createSprite
  };
})();
