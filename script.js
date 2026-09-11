// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // Animated stat counters (runs once, when visible)
  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var animate = function (el) {
      var target = +el.getAttribute('data-target');
      var suffix = el.getAttribute('data-suffix') || '';
      var current = 0;
      var increment = Math.max(1, Math.ceil(target / 60));
      var step = function () {
        current += increment;
        if (current < target) {
          el.textContent = current + suffix;
          requestAnimationFrame(function () { setTimeout(step, 16); });
        } else {
          el.textContent = target + suffix;
        }
      };
      step();
    };

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { observer.observe(c); });
    } else {
      counters.forEach(animate);
    }
  }

  /* ---------------- Gallery filter tabs ---------------- */
  var tabs = document.querySelectorAll('.filter-tabs button');
  var tiles = document.querySelectorAll('.gallery figure');
  var countEl = document.querySelector('.gallery-count');

  function updateCount() {
    if (!countEl) return;
    var visible = 0;
    tiles.forEach(function (t) { if (!t.classList.contains('hide')) visible++; });
    countEl.textContent = 'Showing ' + visible + ' of ' + tiles.length + ' photos';
  }

  if (tabs.length && tiles.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-filter');
        tiles.forEach(function (tile) {
          var match = cat === 'all' || tile.getAttribute('data-category') === cat;
          tile.classList.toggle('hide', !match);
        });
        updateCount();
      });
    });
    updateCount();
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && tiles.length) {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lb-cap');
    var visibleTiles = function () {
      return Array.prototype.filter.call(tiles, function (t) { return !t.classList.contains('hide'); });
    };
    var currentIndex = 0;

    function openAt(index) {
      var vis = visibleTiles();
      if (!vis.length) return;
      currentIndex = (index + vis.length) % vis.length;
      var tile = vis[currentIndex];
      var img = tile.querySelector('img');
      lbImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      lightbox.classList.add('open');
    }

    tiles.forEach(function (tile, i) {
      tile.addEventListener('click', function () {
        var vis = visibleTiles();
        var idx = vis.indexOf(tile);
        openAt(idx);
      });
    });

    lightbox.querySelector('.lb-close').addEventListener('click', function () {
      lightbox.classList.remove('open');
    });
    lightbox.querySelector('.lb-next').addEventListener('click', function () {
      openAt(currentIndex + 1);
    });
    lightbox.querySelector('.lb-prev').addEventListener('click', function () {
      openAt(currentIndex - 1);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowRight') openAt(currentIndex + 1);
      if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
    });
  }
});
