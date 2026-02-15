/**
 * SVG Creature Generator for Patterndex
 * Generates deterministic pixel-art creatures based on visual config.
 * 64x64 viewBox with 4x4 unit pixels (16x16 pixel grid).
 */
window.SvgGenerator = (() => {
  const PX = 4; // each "pixel" is 4x4 units

  function px(n) { return n * PX; }

  // Color helpers
  function darken(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  function lighten(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  function rect(x, y, w, h, fill) {
    return `<rect x="${px(x)}" y="${px(y)}" width="${px(w)}" height="${px(h)}" fill="${fill}"/>`;
  }

  // Body shapes (return arrays of pixel rects)
  const bodies = {
    round(color, dark) {
      // 8x8 circle-ish centered at 4,4 (pixels 4-11)
      return [
        // Shadow
        rect(5, 13, 6, 1, 'rgba(0,0,0,0.2)'),
        // Body rows
        rect(6, 3, 4, 1, dark),
        rect(5, 4, 6, 1, color),
        rect(4, 5, 8, 1, color),
        rect(4, 6, 8, 1, color),
        rect(4, 7, 8, 1, color),
        rect(4, 8, 8, 1, color),
        rect(5, 9, 6, 1, color),
        rect(6, 10, 4, 1, color),
        // Highlight
        rect(6, 4, 2, 1, lighten(color, 40)),
      ].join('');
    },

    angular(color, dark) {
      // Diamond/angular shape
      return [
        rect(5, 14, 6, 1, 'rgba(0,0,0,0.2)'),
        rect(7, 2, 2, 1, dark),
        rect(6, 3, 4, 1, color),
        rect(5, 4, 6, 1, color),
        rect(4, 5, 8, 1, color),
        rect(3, 6, 10, 1, color),
        rect(3, 7, 10, 1, color),
        rect(4, 8, 8, 1, color),
        rect(5, 9, 6, 1, color),
        rect(4, 10, 8, 1, color),
        rect(5, 11, 6, 1, dark),
        rect(7, 3, 1, 1, lighten(color, 40)),
      ].join('');
    },

    tall(color, dark) {
      // Tall/upright shape
      return [
        rect(5, 14, 6, 1, 'rgba(0,0,0,0.2)'),
        rect(6, 1, 4, 1, dark),
        rect(5, 2, 6, 1, color),
        rect(5, 3, 6, 1, color),
        rect(5, 4, 6, 1, color),
        rect(6, 5, 4, 1, color),
        rect(6, 6, 4, 1, color),
        rect(5, 7, 6, 1, color),
        rect(5, 8, 6, 1, color),
        rect(5, 9, 6, 1, color),
        rect(5, 10, 6, 1, color),
        rect(6, 11, 4, 1, color),
        rect(6, 12, 2, 1, dark),
        rect(8, 12, 2, 1, dark),
        rect(6, 2, 2, 1, lighten(color, 40)),
      ].join('');
    },

    wide(color, dark) {
      // Wide/squat shape
      return [
        rect(3, 13, 10, 1, 'rgba(0,0,0,0.2)'),
        rect(5, 4, 6, 1, dark),
        rect(4, 5, 8, 1, color),
        rect(3, 6, 10, 1, color),
        rect(2, 7, 12, 1, color),
        rect(2, 8, 12, 1, color),
        rect(2, 9, 12, 1, color),
        rect(3, 10, 10, 1, color),
        rect(4, 11, 8, 1, color),
        rect(5, 12, 6, 1, dark),
        rect(5, 5, 3, 1, lighten(color, 40)),
      ].join('');
    },

    multi(color, dark) {
      // Cluster of 3 smaller bodies
      return [
        rect(4, 14, 8, 1, 'rgba(0,0,0,0.2)'),
        // Main body (center)
        rect(6, 5, 4, 1, dark),
        rect(5, 6, 6, 1, color),
        rect(5, 7, 6, 1, color),
        rect(5, 8, 6, 1, color),
        rect(6, 9, 4, 1, color),
        // Left satellite
        rect(2, 3, 3, 1, dark),
        rect(2, 4, 3, 1, color),
        rect(2, 5, 3, 1, color),
        rect(2, 6, 3, 1, dark),
        // Right satellite
        rect(11, 3, 3, 1, dark),
        rect(11, 4, 3, 1, color),
        rect(11, 5, 3, 1, color),
        rect(11, 6, 3, 1, dark),
        // Connections
        rect(5, 5, 1, 1, dark),
        rect(10, 5, 1, 1, dark),
        rect(6, 6, 2, 1, lighten(color, 40)),
      ].join('');
    },

    serpentine(color, dark) {
      // Snake/wave shape
      return [
        rect(3, 14, 10, 1, 'rgba(0,0,0,0.2)'),
        // Head
        rect(3, 3, 4, 1, dark),
        rect(2, 4, 5, 1, color),
        rect(2, 5, 5, 1, color),
        rect(3, 6, 4, 1, color),
        // Body curve
        rect(6, 6, 3, 1, color),
        rect(8, 7, 3, 1, color),
        rect(9, 8, 3, 1, color),
        rect(9, 9, 3, 1, color),
        // Tail curve
        rect(7, 10, 3, 1, color),
        rect(5, 11, 3, 1, color),
        rect(4, 12, 3, 1, dark),
        rect(3, 4, 2, 1, lighten(color, 40)),
      ].join('');
    }
  };

  // Eyes (placed relative to body)
  function drawEyes(bodyType, eyeColor) {
    const positions = {
      round:     [[6, 6], [9, 6]],
      angular:   [[6, 6], [9, 6]],
      tall:      [[6, 4], [9, 4]],
      wide:      [[5, 7], [9, 7]],
      multi:     [[6, 7], [9, 7]],
      serpentine:[[3, 4], [5, 4]]
    };
    const pos = positions[bodyType] || [[6, 6], [9, 6]];
    return pos.map(([x, y]) =>
      rect(x, y, 1, 1, eyeColor || '#ffffff') +
      rect(x, y, 1, 1, 'rgba(0,0,0,0.3)') // pupil overlay (top-left look)
    ).join('') +
    // White eye highlight
    pos.map(([x, y]) =>
      `<rect x="${px(x)}" y="${px(y)}" width="${PX/2}" height="${PX/2}" fill="#ffffff"/>`
    ).join('');
  }

  // Feature library
  const features = {
    horns(color) {
      return [
        rect(4, 1, 1, 2, color),
        rect(3, 0, 1, 1, color),
        rect(11, 1, 1, 2, color),
        rect(12, 0, 1, 1, color)
      ].join('');
    },

    antennae(color) {
      return [
        rect(5, 0, 1, 3, color),
        rect(4, 0, 1, 1, lighten(color, 60)),
        rect(10, 0, 1, 3, color),
        rect(11, 0, 1, 1, lighten(color, 60))
      ].join('');
    },

    wings(color) {
      return [
        // Left wing
        rect(1, 4, 2, 1, color),
        rect(0, 5, 3, 1, color),
        rect(0, 6, 3, 1, lighten(color, 30)),
        rect(1, 7, 2, 1, color),
        // Right wing
        rect(13, 4, 2, 1, color),
        rect(13, 5, 3, 1, color),
        rect(13, 6, 3, 1, lighten(color, 30)),
        rect(13, 7, 2, 1, color)
      ].join('');
    },

    tail(color) {
      return [
        rect(12, 10, 1, 1, color),
        rect(13, 9, 1, 1, color),
        rect(14, 8, 1, 1, color),
        rect(15, 7, 1, 1, lighten(color, 40))
      ].join('');
    },

    claws(color) {
      return [
        rect(3, 11, 1, 2, color),
        rect(4, 12, 1, 1, color),
        rect(11, 11, 1, 2, color),
        rect(12, 12, 1, 1, color)
      ].join('');
    },

    aura(color) {
      const c = color + '44'; // transparent
      return [
        `<rect x="${px(3)}" y="${px(2)}" width="${px(10)}" height="${px(12)}" fill="none" stroke="${c}" stroke-width="4"/>`,
        `<rect x="${px(2)}" y="${px(1)}" width="${px(12)}" height="${px(14)}" fill="none" stroke="${color}22" stroke-width="4"/>`
      ].join('');
    },

    shield(color) {
      return [
        rect(6, 6, 4, 1, lighten(color, 50)),
        rect(5, 7, 6, 1, color),
        rect(5, 8, 6, 1, color),
        rect(6, 9, 4, 1, color),
        rect(7, 10, 2, 1, darken(color, 30))
      ].join('');
    },

    markings(color) {
      return [
        rect(5, 8, 1, 1, color),
        rect(7, 7, 1, 1, color),
        rect(9, 9, 1, 1, color),
        rect(10, 7, 1, 1, color)
      ].join('');
    }
  };

  /**
   * Generate SVG for a creature
   * @param {Object} creature - creature data from PATTERNDEX_DATA
   * @returns {string} SVG markup string
   */
  function generate(creature) {
    const types = window.PATTERNDEX_DATA.types;
    const primaryColor = types[creature.types[0]]?.color || '#888888';
    const secondaryColor = types[creature.types[1]]?.color || primaryColor;
    const darkColor = darken(primaryColor, 40);
    const vis = creature.visual;

    if (!vis || !bodies[vis.body]) {
      return generateFallback(creature, primaryColor);
    }

    let svg = '';

    // Layer 1: Body
    svg += bodies[vis.body](primaryColor, darkColor);

    // Layer 2: Eyes
    svg += drawEyes(vis.body, '#ffffff');

    // Layer 3: Features
    if (vis.features) {
      vis.features.forEach(feat => {
        if (features[feat]) {
          svg += features[feat](secondaryColor);
        }
      });
    }

    // Layer 4: Accent feature
    if (vis.accent && features[vis.accent]) {
      svg += features[vis.accent](lighten(secondaryColor, 30));
    }

    return wrapSvg(svg);
  }

  function generateFallback(creature, color) {
    // Silhouette fallback with type glow
    const svg = `
      <rect x="${px(4)}" y="${px(3)}" width="${px(8)}" height="${px(10)}" fill="${color}" rx="2"/>
      <text x="32" y="36" text-anchor="middle" font-size="16" fill="#ffffff" font-family="monospace">?</text>
      <rect x="${px(4)}" y="${px(3)}" width="${px(8)}" height="${px(10)}" fill="none" stroke="${color}" stroke-width="2" rx="2" opacity="0.5"/>
    `;
    return wrapSvg(svg);
  }

  function wrapSvg(content) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">${content}</svg>`;
  }

  /**
   * Generate a radar chart SVG for creature stats
   * @param {Object} stats - { complexity, flexibility, ... } (1-10)
   * @param {string} color - fill color
   * @returns {string} SVG markup
   */
  function generateRadar(stats, color) {
    const labels = ['CMP', 'FLX', 'DCP', 'ABS', 'PRF', 'POP'];
    const keys = ['complexity', 'flexibility', 'decoupling', 'abstraction', 'performance', 'popularity'];
    const cx = 100, cy = 100, r = 80;
    const angles = keys.map((_, i) => (Math.PI * 2 * i / 6) - Math.PI / 2);

    // Background hexagons
    let bg = '';
    for (let level = 2; level <= 10; level += 2) {
      const points = angles.map(a => {
        const lr = r * (level / 10);
        return `${cx + lr * Math.cos(a)},${cy + lr * Math.sin(a)}`;
      }).join(' ');
      bg += `<polygon points="${points}" fill="none" stroke="rgba(139,172,15,0.2)" stroke-width="1"/>`;
    }

    // Axis lines
    let axes = '';
    angles.forEach(a => {
      axes += `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(a)}" y2="${cy + r * Math.sin(a)}" stroke="rgba(139,172,15,0.15)" stroke-width="1"/>`;
    });

    // Data polygon
    const dataPoints = keys.map((key, i) => {
      const val = stats[key] || 0;
      const dr = r * (val / 10);
      return `${cx + dr * Math.cos(angles[i])},${cy + dr * Math.sin(angles[i])}`;
    }).join(' ');

    // Labels
    let labelSvg = '';
    keys.forEach((key, i) => {
      const lx = cx + (r + 16) * Math.cos(angles[i]);
      const ly = cy + (r + 16) * Math.sin(angles[i]);
      labelSvg += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-family="'Press Start 2P', monospace" font-size="6" fill="rgba(139,172,15,0.6)">${labels[i]}</text>`;
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      ${bg}${axes}
      <polygon points="${dataPoints}" fill="${color}44" stroke="${color}" stroke-width="2"/>
      ${labelSvg}
    </svg>`;
  }

  return { generate, generateRadar };
})();
