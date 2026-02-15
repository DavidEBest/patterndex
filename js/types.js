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

  return {
    getTypeColor,
    getTypeName,
    getTypeConcept,
    createTypeBadge,
    createCategoryBadge,
    getEffectiveness,
    getCategoryColor,
    getCreatureById,
    getAllTypes
  };
})();
