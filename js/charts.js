(function () {
  window.App = window.App || {};
  var U = App.utils;
  var C = {};

  C.ring = function (percent, opts) {
    opts = opts || {};
    var size = opts.size || 132;
    var stroke = opts.stroke || 12;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var p = U.clamp(percent, 0, 100);
    var offset = c * (1 - p / 100);
    var color = opts.color || 'url(#ringGrad)';
    return '' +
      '<svg class="chart-svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + Math.round(p) + '%">' +
      '<defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b7cff"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient></defs>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + offset.toFixed(2) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
      '</svg>';
  };

  C.line = function (data, opts) {
    opts = opts || {};
    var W = opts.width || 620, H = opts.height || 220;
    var padL = 34, padR = 12, padT = 16, padB = 28;
    var iw = W - padL - padR, ih = H - padT - padB;
    var n = Math.max(1, data.length - 1);
    var max = opts.max || 100;
    var color = opts.color || '#6c5ce7';
    var gridCol = 'var(--chart-grid)';
    function x(i) { return padL + (i / n) * iw; }
    function y(v) { return padT + ih - (U.clamp(v, 0, max) / max) * ih; }
    var pts = data.map(function (d, i) { return x(i).toFixed(1) + ',' + y(d.value).toFixed(1); });
    var line = pts.join(' ');
    var area = padL + ',' + (padT + ih) + ' ' + line + ' ' + x(data.length - 1).toFixed(1) + ',' + (padT + ih);
    var svg = '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img">';
    svg += '<defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + U.hexToRgba(color, .32) + '"/>' +
      '<stop offset="1" stop-color="' + U.hexToRgba(color, 0) + '"/></linearGradient></defs>';
    [0, 25, 50, 75, 100].forEach(function (g) {
      var gy = y(g);
      svg += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '" stroke="' + gridCol + '" stroke-width="1"/>';
      svg += '<text x="' + (padL - 8) + '" y="' + (gy + 3.5).toFixed(1) + '" text-anchor="end" font-size="10" fill="var(--muted)">' + g + '%</text>';
    });
    svg += '<polygon points="' + area + '" fill="url(#areaGrad)"/>';
    svg += '<polyline points="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    var step = Math.max(1, Math.round(data.length / 8));
    data.forEach(function (d, i) {
      if (i % step === 0 || i === data.length - 1) {
        svg += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(d.value).toFixed(1) + '" r="3" fill="var(--surface)" stroke="' + color + '" stroke-width="2" pointer-events="none"/>';
        svg += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--muted)" pointer-events="none">' + U.escapeHtml(d.label) + '</text>';
      }
    });
    if (opts.hit !== false) {
      data.forEach(function (d, i) {
        var left = i === 0 ? padL : (x(i - 1) + x(i)) / 2;
        var right = i === data.length - 1 ? W - padR : (x(i) + x(i + 1)) / 2;
        svg += '<rect class="chart-hit" data-i="' + i + '" x="' + left.toFixed(1) + '" y="' + padT + '" width="' + Math.max(1, right - left).toFixed(1) + '" height="' + ih.toFixed(1) + '" fill="transparent" pointer-events="all"/>';
      });
    }
    svg += '</svg>';
    return svg;
  };

  C.bars = function (data, opts) {
    opts = opts || {};
    var W = opts.width || 620, H = opts.height || 220;
    var padL = 34, padR = 12, padT = 16, padB = 28;
    var iw = W - padL - padR, ih = H - padT - padB;
    var max = opts.max || 100;
    var bw = iw / data.length;
    var color = opts.color || '#6c5ce7';
    var svg = '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img">';
    [0, 25, 50, 75, 100].forEach(function (g) {
      var gy = padT + ih - (g / max) * ih;
      svg += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '" stroke="var(--chart-grid)" stroke-width="1"/>';
      svg += '<text x="' + (padL - 8) + '" y="' + (gy + 3.5).toFixed(1) + '" text-anchor="end" font-size="10" fill="var(--muted)">' + g + '%</text>';
    });
    data.forEach(function (d, i) {
      var h = (U.clamp(d.value, 0, max) / max) * ih;
      var bx = padL + i * bw + bw * 0.18;
      var w = bw * 0.64;
      svg += '<rect class="chart-hit" data-i="' + i + '" x="' + bx.toFixed(1) + '" y="' + (padT + ih - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(1, h).toFixed(1) + '" rx="4" fill="' + (d.color || color) + '"/>';
      svg += '<text x="' + (bx + w / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--muted)">' + U.escapeHtml(d.label) + '</text>';
    });
    if (opts.hit !== false) {
      data.forEach(function (d, i) {
        svg += '<rect class="chart-hit" data-i="' + i + '" x="' + (padL + i * bw).toFixed(1) + '" y="' + padT + '" width="' + bw.toFixed(1) + '" height="' + ih.toFixed(1) + '" fill="transparent" pointer-events="all"/>';
      });
    }
    svg += '</svg>';
    return svg;
  };

  C.donut = function (items, opts) {
    opts = opts || {};
    var size = opts.size || 180;
    var stroke = opts.stroke || 26;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var total = items.reduce(function (s, i) { return s + i.value; }, 0) || 1;
    var svg = '<svg class="chart-svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img">';
    svg += '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="' + stroke + '"/>';
    var acc = 0;
    items.forEach(function (it, idx) {
      var frac = it.value / total;
      var dash = (frac * c).toFixed(2) + ' ' + (c - frac * c).toFixed(2);
      var rot = (acc / total) * 360 - 90;
      svg += '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + it.color + '" stroke-width="' + stroke + '" stroke-dasharray="' + dash + '" transform="rotate(' + rot.toFixed(2) + ' ' + size / 2 + ' ' + size / 2 + ')" data-i="' + idx + '" pointer-events="stroke" style="cursor:pointer"/>';
      acc += it.value;
    });
    svg += '</svg>';
    return svg;
  };

  C.miniBars = function (values, color) {
    var max = Math.max.apply(null, values.concat([1]));
    return '<div class="compare-bar">' + values.map(function (v, i) {
      var h = Math.max(6, (v / max) * 100);
      return '<div class="bar' + (color && i === values.length - 1 ? ' now' : '') + '" style="height:' + h.toFixed(0) + '%"></div>';
    }).join('') + '</div>';
  };

  App.charts = C;
})();
