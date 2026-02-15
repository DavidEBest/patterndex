/**
 * SVG Creature Generator for Patterndex
 * Generates deterministic pixel-art creatures based on visual config.
 * 64x64 viewBox with 2x2 unit pixels (32x32 pixel grid).
 */
window.SvgGenerator = (() => {
  const PX = 2; // each "pixel" is 2x2 units in the 64x64 viewBox

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

  function r(x, y, w, h, fill) {
    return `<rect x="${px(x)}" y="${px(y)}" width="${px(w)}" height="${px(h)}" fill="${fill}"/>`;
  }

  // Draws rows from an array of [y, xStart, width] tuples
  function rows(data, fill) {
    return data.map(([y, x, w]) => r(x, y, w, 1, fill)).join('');
  }

  // ==================== BODY SHAPES ====================

  const bodies = {
    round(color, dark, light) {
      return [
        // Ground shadow
        rows([[27, 10, 12]], 'rgba(0,0,0,0.15)'),
        // Outline top
        rows([[7, 13, 6]], dark),
        rows([[8, 11, 10]], dark),
        // Body fill
        rows([
          [9, 10, 12],
          [10, 9, 14],
          [11, 8, 16],
          [12, 8, 16],
          [13, 8, 16],
          [14, 8, 16],
          [15, 8, 16],
          [16, 8, 16],
          [17, 8, 16],
          [18, 8, 16],
          [19, 9, 14],
          [20, 9, 14],
          [21, 10, 12],
          [22, 11, 10],
          [23, 12, 8],
        ], color),
        // Outline bottom
        rows([[24, 13, 6]], dark),
        // Highlight (specular)
        rows([
          [10, 11, 4],
          [11, 10, 3],
          [12, 10, 2],
        ], light),
        // Belly shade
        rows([
          [20, 12, 8],
          [21, 13, 6],
        ], darken(color, 20)),
      ].join('');
    },

    angular(color, dark, light) {
      return [
        rows([[28, 9, 14]], 'rgba(0,0,0,0.15)'),
        // Top spike
        rows([[4, 15, 2]], dark),
        rows([[5, 14, 4]], dark),
        rows([[6, 13, 6]], color),
        rows([
          [7, 12, 8],
          [8, 11, 10],
          [9, 10, 12],
          [10, 9, 14],
          [11, 8, 16],
          [12, 7, 18],
          [13, 7, 18],
          [14, 7, 18],
          [15, 7, 18],
          [16, 8, 16],
          [17, 8, 16],
          [18, 9, 14],
        ], color),
        // Lower angular legs/base
        rows([
          [19, 8, 6],
          [19, 18, 6],
          [20, 7, 6],
          [20, 19, 6],
          [21, 7, 5],
          [21, 20, 5],
          [22, 7, 4],
          [22, 21, 4],
        ], color),
        rows([[23, 7, 3], [23, 22, 3]], dark),
        // Chest plate / angular highlight
        rows([
          [9, 12, 3],
          [10, 11, 4],
          [11, 10, 3],
        ], light),
        // Side edges
        rows([
          [12, 7, 1],
          [13, 7, 1],
          [14, 7, 1],
          [15, 7, 1],
          [12, 24, 1],
          [13, 24, 1],
          [14, 24, 1],
          [15, 24, 1],
        ], dark),
      ].join('');
    },

    tall(color, dark, light) {
      return [
        rows([[28, 10, 12]], 'rgba(0,0,0,0.15)'),
        // Head
        rows([[3, 12, 8]], dark),
        rows([
          [4, 11, 10],
          [5, 10, 12],
          [6, 10, 12],
          [7, 10, 12],
          [8, 11, 10],
        ], color),
        // Neck
        rows([
          [9, 12, 8],
          [10, 13, 6],
        ], color),
        // Torso
        rows([
          [11, 11, 10],
          [12, 10, 12],
          [13, 10, 12],
          [14, 10, 12],
          [15, 10, 12],
          [16, 10, 12],
          [17, 10, 12],
          [18, 11, 10],
          [19, 11, 10],
        ], color),
        // Legs
        rows([
          [20, 11, 4],
          [20, 17, 4],
          [21, 11, 4],
          [21, 17, 4],
          [22, 11, 4],
          [22, 17, 4],
          [23, 10, 4],
          [23, 18, 4],
        ], color),
        // Feet
        rows([
          [24, 10, 5],
          [24, 17, 5],
        ], dark),
        // Head highlight
        rows([
          [4, 12, 4],
          [5, 11, 3],
        ], light),
        // Torso shade
        rows([
          [17, 12, 8],
          [18, 13, 6],
        ], darken(color, 20)),
      ].join('');
    },

    wide(color, dark, light) {
      return [
        rows([[27, 5, 22]], 'rgba(0,0,0,0.15)'),
        // Top
        rows([[7, 11, 10]], dark),
        rows([
          [8, 9, 14],
          [9, 7, 18],
          [10, 6, 20],
          [11, 5, 22],
          [12, 4, 24],
          [13, 4, 24],
          [14, 4, 24],
          [15, 4, 24],
          [16, 4, 24],
          [17, 4, 24],
          [18, 5, 22],
          [19, 5, 22],
          [20, 6, 20],
          [21, 7, 18],
          [22, 8, 16],
        ], color),
        // Feet stubs
        rows([
          [23, 7, 5],
          [23, 20, 5],
          [24, 6, 6],
          [24, 20, 6],
        ], color),
        rows([[25, 6, 6], [25, 20, 6]], dark),
        // Highlight
        rows([
          [9, 9, 5],
          [10, 8, 4],
          [11, 7, 3],
        ], light),
        // Bottom shade
        rows([
          [20, 8, 16],
          [21, 10, 12],
        ], darken(color, 20)),
      ].join('');
    },

    multi(color, dark, light) {
      // Central body + two satellite orbs with connecting tendrils
      return [
        rows([[28, 8, 16]], 'rgba(0,0,0,0.15)'),
        // Left satellite
        rows([[4, 4, 6]], dark),
        rows([
          [5, 3, 8],
          [6, 3, 8],
          [7, 3, 8],
          [8, 3, 8],
          [9, 3, 8],
        ], color),
        rows([[10, 4, 6]], dark),
        rows([[5, 4, 3], [6, 3, 2]], light),
        // Right satellite
        rows([[4, 22, 6]], dark),
        rows([
          [5, 21, 8],
          [6, 21, 8],
          [7, 21, 8],
          [8, 21, 8],
          [9, 21, 8],
        ], color),
        rows([[10, 22, 6]], dark),
        rows([[5, 23, 3], [6, 22, 2]], light),
        // Connectors
        rows([
          [8, 11, 2],
          [9, 10, 3],
          [8, 19, 2],
          [9, 19, 3],
        ], darken(color, 15)),
        // Main central body
        rows([[10, 12, 8]], dark),
        rows([
          [11, 10, 12],
          [12, 9, 14],
          [13, 9, 14],
          [14, 9, 14],
          [15, 9, 14],
          [16, 9, 14],
          [17, 9, 14],
          [18, 10, 12],
          [19, 10, 12],
        ], color),
        rows([[20, 11, 10]], color),
        rows([[21, 12, 8]], dark),
        // Main highlight
        rows([
          [11, 12, 4],
          [12, 11, 3],
        ], light),
        // Main shade
        rows([
          [19, 12, 8],
          [20, 13, 6],
        ], darken(color, 20)),
      ].join('');
    },

    serpentine(color, dark, light) {
      return [
        rows([[28, 5, 22]], 'rgba(0,0,0,0.15)'),
        // Head (upper left)
        rows([[5, 6, 8]], dark),
        rows([
          [6, 5, 10],
          [7, 4, 12],
          [8, 4, 12],
          [9, 4, 12],
          [10, 5, 10],
        ], color),
        rows([
          [6, 6, 4],
          [7, 5, 3],
        ], light),
        // Neck curving right
        rows([
          [11, 7, 10],
          [12, 10, 8],
          [13, 12, 8],
        ], color),
        // Body mid (right side)
        rows([
          [14, 14, 10],
          [15, 16, 10],
          [16, 17, 9],
          [17, 17, 9],
          [18, 16, 10],
        ], color),
        // Curve back left
        rows([
          [19, 14, 10],
          [20, 12, 10],
          [21, 10, 8],
        ], color),
        // Tail (lower left)
        rows([
          [22, 8, 6],
          [23, 6, 5],
          [24, 5, 4],
        ], color),
        rows([[25, 4, 3]], dark),
        // Tail tip
        rows([[25, 3, 1]], lighten(color, 30)),
        // Body underside shade
        rows([
          [10, 6, 8],
          [17, 19, 5],
          [18, 18, 6],
        ], darken(color, 20)),
        // Dorsal highlight
        rows([
          [14, 15, 4],
          [15, 17, 4],
        ], light),
      ].join('');
    }
  };

  // ==================== EYES ====================

  function drawEyes(bodyType) {
    // Eye positions: [leftEyeX, leftEyeY, rightEyeX, rightEyeY]
    // Each eye is 3x3 pixels: white base, dark pupil 2x2 offset, highlight 1x1
    const positions = {
      round:     [11, 13, 19, 13],
      angular:   [11, 12, 19, 12],
      tall:      [11, 5, 18, 5],
      wide:      [10, 13, 19, 13],
      multi:     [12, 14, 18, 14],
      serpentine:[6, 7, 12, 7]
    };
    const [lx, ly, rx, ry] = positions[bodyType] || [11, 13, 19, 13];

    function eye(x, y) {
      return [
        // White of eye 3x3
        r(x, y, 3, 3, '#ffffff'),
        // Pupil 2x2 (bottom-right of eye)
        r(x + 1, y + 1, 2, 2, '#080808'),
        // Highlight 1x1 (top-left)
        r(x, y, 1, 1, '#fcfcfc'),
      ].join('');
    }
    return eye(lx, ly) + eye(rx, ry);
  }

  // ==================== FEATURES ====================

  const features = {
    horns(color) {
      const dk = darken(color, 30);
      return [
        // Left horn - curves outward
        r(9, 5, 2, 2, color),
        r(8, 3, 2, 2, color),
        r(7, 1, 2, 2, color),
        r(6, 0, 2, 1, dk),
        // Right horn
        r(21, 5, 2, 2, color),
        r(22, 3, 2, 2, color),
        r(23, 1, 2, 2, color),
        r(24, 0, 2, 1, dk),
        // Highlights
        r(7, 1, 1, 1, lighten(color, 50)),
        r(23, 1, 1, 1, lighten(color, 50)),
      ].join('');
    },

    antennae(color) {
      const tip = lighten(color, 60);
      return [
        // Left antenna - thin stalk + bulb
        r(10, 4, 1, 4, color),
        r(9, 2, 1, 2, color),
        r(8, 0, 2, 2, tip),
        r(8, 0, 1, 1, lighten(color, 80)),
        // Right antenna
        r(21, 4, 1, 4, color),
        r(22, 2, 1, 2, color),
        r(22, 0, 2, 2, tip),
        r(23, 0, 1, 1, lighten(color, 80)),
      ].join('');
    },

    wings(color) {
      const lt = lighten(color, 30);
      const dk = darken(color, 20);
      return [
        // Left wing
        r(2, 7, 4, 2, color),
        r(0, 9, 6, 2, color),
        r(0, 11, 7, 2, lt),
        r(0, 13, 6, 2, color),
        r(1, 15, 4, 1, dk),
        // Wing membrane lines
        r(1, 9, 1, 6, dk),
        r(3, 8, 1, 7, dk),
        // Right wing
        r(26, 7, 4, 2, color),
        r(26, 9, 6, 2, color),
        r(25, 11, 7, 2, lt),
        r(26, 13, 6, 2, color),
        r(27, 15, 4, 1, dk),
        // Wing membrane lines
        r(30, 9, 1, 6, dk),
        r(28, 8, 1, 7, dk),
      ].join('');
    },

    tail(color) {
      const lt = lighten(color, 30);
      return [
        // Thick tail curving right and up
        r(22, 20, 3, 2, color),
        r(24, 19, 3, 2, color),
        r(26, 17, 3, 2, color),
        r(27, 15, 3, 2, color),
        r(28, 13, 2, 2, color),
        // Tail tip
        r(29, 12, 2, 1, lt),
        r(30, 11, 1, 1, lt),
      ].join('');
    },

    claws(color) {
      const dk = darken(color, 30);
      return [
        // Left hand/claws
        r(6, 22, 2, 3, color),
        r(5, 24, 1, 2, dk),
        r(7, 24, 1, 2, dk),
        r(8, 25, 1, 1, dk),
        // Right hand/claws
        r(24, 22, 2, 3, color),
        r(23, 24, 1, 2, dk),
        r(25, 24, 1, 2, dk),
        r(26, 25, 1, 1, dk),
      ].join('');
    },

    aura(color) {
      // Pulsating energy outline
      const c1 = color + '33';
      const c2 = color + '1a';
      return [
        `<rect x="${px(5)}" y="${px(3)}" width="${px(22)}" height="${px(24)}" fill="none" stroke="${c1}" stroke-width="3" rx="2"/>`,
        `<rect x="${px(3)}" y="${px(1)}" width="${px(26)}" height="${px(28)}" fill="none" stroke="${c2}" stroke-width="2" rx="4"/>`,
        // Corner sparkles
        r(4, 3, 1, 1, color + '44'),
        r(27, 3, 1, 1, color + '44'),
        r(4, 26, 1, 1, color + '44'),
        r(27, 26, 1, 1, color + '44'),
      ].join('');
    },

    shield(color) {
      const lt = lighten(color, 40);
      const dk = darken(color, 30);
      return [
        // Shield shape on chest
        r(12, 13, 8, 1, lt),
        r(11, 14, 10, 1, color),
        r(11, 15, 10, 2, color),
        r(12, 17, 8, 1, color),
        r(13, 18, 6, 1, color),
        r(14, 19, 4, 1, dk),
        r(15, 20, 2, 1, dk),
        // Shield emblem (cross)
        r(15, 15, 2, 3, lt),
        r(13, 16, 6, 1, lt),
      ].join('');
    },

    markings(color) {
      // Body stripes/spots pattern
      return [
        // Diagonal stripes
        r(10, 16, 2, 1, color),
        r(11, 17, 2, 1, color),
        r(12, 18, 2, 1, color),
        r(18, 16, 2, 1, color),
        r(19, 17, 2, 1, color),
        r(20, 18, 2, 1, color),
        // Accent dots
        r(14, 14, 1, 1, color),
        r(17, 14, 1, 1, color),
        r(15, 20, 1, 1, color),
        r(16, 20, 1, 1, color),
      ].join('');
    }
  };

  // ==================== MOUTH EXPRESSIONS ====================

  function drawMouth(bodyType, color) {
    const mouthPositions = {
      round:     [14, 18],
      angular:   [14, 17],
      tall:      [14, 9],
      wide:      [14, 18],
      multi:     [14, 18],
      serpentine:[8, 11]
    };
    const [mx, my] = mouthPositions[bodyType] || [14, 18];
    // Simple 4px wide mouth
    return r(mx, my, 4, 1, darken(color, 50));
  }

  // ==================== GENERATE ====================

  function generate(creature) {
    const types = window.PATTERNDEX_DATA.types;
    const primaryColor = types[creature.types[0]]?.color || '#888888';
    const secondaryColor = types[creature.types[1]]?.color || primaryColor;
    const darkColor = darken(primaryColor, 40);
    const lightColor = lighten(primaryColor, 35);
    const vis = creature.visual;

    if (!vis || !bodies[vis.body]) {
      return generateFallback(creature, primaryColor);
    }

    let svg = '';

    // Layer 1: Aura (behind body)
    if (vis.features && vis.features.includes('aura')) {
      svg += features.aura(secondaryColor);
    }

    // Layer 2: Body
    svg += bodies[vis.body](primaryColor, darkColor, lightColor);

    // Layer 3: Eyes
    svg += drawEyes(vis.body);

    // Layer 4: Mouth
    svg += drawMouth(vis.body, primaryColor);

    // Layer 5: Features (excluding aura, already drawn)
    if (vis.features) {
      vis.features.forEach(feat => {
        if (feat !== 'aura' && features[feat]) {
          svg += features[feat](secondaryColor);
        }
      });
    }

    // Layer 6: Accent feature
    if (vis.accent && features[vis.accent]) {
      const accentColor = vis.accent === 'aura'
        ? lighten(secondaryColor, 30)
        : lighten(secondaryColor, 20);
      if (vis.accent !== 'aura') {
        svg += features[vis.accent](accentColor);
      }
    }

    return wrapSvg(svg);
  }

  function generateFallback(creature, color) {
    const svg = [
      r(8, 6, 16, 20, color),
      r(9, 7, 14, 18, darken(color, 20)),
      `<text x="32" y="36" text-anchor="middle" font-size="14" fill="#ffffff" font-family="monospace" dominant-baseline="middle">?</text>`,
      `<rect x="${px(8)}" y="${px(6)}" width="${px(16)}" height="${px(20)}" fill="none" stroke="${color}" stroke-width="2" rx="2" opacity="0.6"/>`,
    ].join('');
    return wrapSvg(svg);
  }

  function wrapSvg(content) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">${content}</svg>`;
  }

  // ==================== RADAR CHART ====================

  function generateRadar(stats, color) {
    const labels = ['CMP', 'FLX', 'DCP', 'ABS', 'PRF', 'POP'];
    const keys = ['complexity', 'flexibility', 'decoupling', 'abstraction', 'performance', 'popularity'];
    const cx = 100, cy = 100, radius = 80;
    const angles = keys.map((_, i) => (Math.PI * 2 * i / 6) - Math.PI / 2);

    let bg = '';
    for (let level = 2; level <= 10; level += 2) {
      const points = angles.map(a => {
        const lr = radius * (level / 10);
        return `${cx + lr * Math.cos(a)},${cy + lr * Math.sin(a)}`;
      }).join(' ');
      bg += `<polygon points="${points}" fill="none" stroke="rgba(139,172,15,0.2)" stroke-width="1"/>`;
    }

    let axes = '';
    angles.forEach(a => {
      axes += `<line x1="${cx}" y1="${cy}" x2="${cx + radius * Math.cos(a)}" y2="${cy + radius * Math.sin(a)}" stroke="rgba(139,172,15,0.15)" stroke-width="1"/>`;
    });

    const dataPoints = keys.map((key, i) => {
      const val = stats[key] || 0;
      const dr = radius * (val / 10);
      return `${cx + dr * Math.cos(angles[i])},${cy + dr * Math.sin(angles[i])}`;
    }).join(' ');

    let labelSvg = '';
    keys.forEach((_, i) => {
      const lx = cx + (radius + 16) * Math.cos(angles[i]);
      const ly = cy + (radius + 16) * Math.sin(angles[i]);
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
