(function () {
  'use strict';

  var INK = '#1B1B2F';
  var COLORS = [
    ['핑크', '#FF6FB5'], ['옐로', '#FFD60A'], ['블루', '#2F5BFF'],
    ['민트', '#2EE6B0'], ['오렌지', '#FF7A2F'], ['퍼플', '#8A5CF6'],
    ['크림', '#FFFBF4'], ['블랙', '#1B1B2F']
  ];
  var PARTS = { body: '몸체', lid: '뚜껑', handle: '손잡이', sleeve: '슬리브' };
  var STICKERS = [
    ['없음', 'none'], ['별', 'star'], ['하트', 'heart'], ['스마일', 'smile']
  ];

  function stickerShape(type) {
    var s = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
    if (type === 'star') {
      return '<path d="M0 -16 L4.1 -5.7 L15.2 -4.9 L6.7 2.2 L9.4 12.9 L0 7 L-9.4 12.9 L-6.7 2.2 L-15.2 -4.9 L-4.1 -5.7Z" fill="#FFD60A" ' + s + '/>';
    }
    if (type === 'heart') {
      return '<path d="M0 13 C-18 0 -14-14 -6-14 C-2-14 0-10 0-8 C0-10 2-14 6-14 C14-14 18 0 0 13Z" fill="#FF6FB5" ' + s + '/>';
    }
    if (type === 'smile') {
      return '<circle r="14" fill="#2EE6B0" ' + s + '/><circle cx="-5" cy="-3" r="2" fill="' + INK + '"/><circle cx="5" cy="-3" r="2" fill="' + INK + '"/><path d="M-6 4 Q0 10 6 4" fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
    }
    return '';
  }

  /* Draw a tumbler as inline SVG (self-drawn). */
  function tumblerSVG(o) {
    var w = 'stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"';
    var id = 'c' + Math.random().toString(36).slice(2, 8);
    var handle = o.handleOn
      ? '<path d="M150 100 H182 Q198 100 198 118 V190 Q198 208 182 208 H146" fill="none" stroke="' + INK + '" stroke-width="20" stroke-linecap="round"/>' +
        '<path d="M150 100 H182 Q198 100 198 118 V190 Q198 208 182 208 H146" fill="none" stroke="' + o.handle + '" stroke-width="11" stroke-linecap="round"/>'
      : '';
    var sticker = o.sticker && o.sticker !== 'none'
      ? '<g transform="translate(100 252) rotate(-8)">' + stickerShape(o.sticker) + '</g>'
      : '';
    var body = 'M40 62 L160 62 L146 296 Q145 306 135 306 L65 306 Q55 306 54 296 Z';
    return '<svg viewBox="0 0 210 330" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><path d="' + body + '"/></clipPath></defs>' +
      handle +
      '<path d="' + body + '" fill="' + o.body + '" ' + w + '/>' +
      '<g clip-path="url(#' + id + ')"><rect x="30" y="130" width="150" height="80" fill="' + o.sleeve + '"/>' +
      '<path d="M40 130 H170 M40 210 H170" stroke="' + INK + '" stroke-width="4" fill="none"/>' +
      '<rect x="48" y="66" width="14" height="236" fill="#fff" opacity=".22"/></g>' +
      '<path d="' + body + '" fill="none" ' + w + '/>' +
      sticker +
      '<rect x="48" y="34" width="114" height="30" rx="10" fill="' + o.lid + '" ' + w + '/>' +
      '<rect x="78" y="14" width="54" height="22" rx="9" fill="' + o.lid + '" ' + w + '/>' +
      '<rect x="56" y="38" width="9" height="20" rx="4" fill="#fff" opacity=".3"/>' +
      '</svg>';
  }

  /* Static tumblers from data attributes */
  document.querySelectorAll('[data-tumbler]').forEach(function (el) {
    var d = el.dataset;
    el.innerHTML = tumblerSVG({
      body: d.body, lid: d.lid, sleeve: d.sleeve,
      handle: d.handle || '#FFD60A', handleOn: d.handleOn === '1'
    });
  });

  /* Sticker sheet (decorative) */
  var sheet = document.getElementById('sticker-sheet');
  if (sheet) {
    var pieces = ['star', 'heart', 'smile', 'star', 'smile', 'heart', 'star', 'heart'];
    sheet.innerHTML = pieces.map(function (p) {
      return '<svg viewBox="-20 -20 40 40" focusable="false">' + stickerShape(p) + '</svg>';
    }).join('');
  }

  /* Interactive picker */
  var form = document.getElementById('picker-form');
  var stage = document.getElementById('picker-tumbler');
  var summary = document.getElementById('picker-summary');
  if (form && stage) {
    var state = { body: '#FF6FB5', lid: '#2F5BFF', handle: '#FFD60A', sleeve: '#2EE6B0', sticker: 'star' };

    Object.keys(PARTS).forEach(function (part) {
      var box = form.querySelector('[data-part="' + part + '"] .swatches');
      box.innerHTML = COLORS.map(function (c) {
        return '<label class="swatch"><input type="radio" name="' + part + '" value="' + c[1] + '" aria-label="' + PARTS[part] + ' ' + c[0] + '"' +
          (state[part] === c[1] ? ' checked' : '') + '><span style="background:' + c[1] + '"></span></label>';
      }).join('');
    });
    document.getElementById('sticker-chips').innerHTML = STICKERS.map(function (s) {
      return '<label class="chip"><input type="radio" name="sticker" value="' + s[1] + '"' +
        (state.sticker === s[1] ? ' checked' : '') + '><span>' + s[0] + '</span></label>';
    }).join('');

    function nameOf(hex) {
      for (var i = 0; i < COLORS.length; i++) if (COLORS[i][1] === hex) return COLORS[i][0];
      return hex;
    }
    function render() {
      stage.innerHTML = tumblerSVG({
        body: state.body, lid: state.lid, handle: state.handle, sleeve: state.sleeve,
        handleOn: true, sticker: state.sticker
      });
      summary.textContent = '몸체 ' + nameOf(state.body) + ' / 뚜껑 ' + nameOf(state.lid) +
        ' / 손잡이 ' + nameOf(state.handle) + ' / 슬리브 ' + nameOf(state.sleeve);
    }
    form.addEventListener('change', function (e) {
      if (e.target.name && e.target.name in state) { state[e.target.name] = e.target.value; render(); }
    });
    document.getElementById('random-btn').addEventListener('click', function () {
      Object.keys(PARTS).forEach(function (part) {
        var c = COLORS[Math.floor(Math.random() * COLORS.length)][1];
        state[part] = c;
        form.querySelector('input[name="' + part + '"][value="' + c + '"]').checked = true;
      });
      var s = STICKERS[Math.floor(Math.random() * STICKERS.length)][1];
      state.sticker = s;
      form.querySelector('input[name="sticker"][value="' + s + '"]').checked = true;
      render();
    });
    render();
  }

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }
})();
