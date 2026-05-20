(function(){
  function cleanText(value) {
    return (value || '').toString().replace(/\s+/g, ' ').trim();
  }

  function normalize(value) {
    return cleanText(value).toLowerCase();
  }

  function splitTerms(value) {
    return normalize(value).split(/\s+/).filter(Boolean);
  }

  function parseSearchValue(value) {
    const raw = cleanText(value);
    const first = raw.charAt(0);
    const last = raw.charAt(raw.length - 1);
    const quoted = raw.length >= 2 && (
      (first === '"' && last === '"') ||
      (first === "'" && last === "'")
    );
    const query = cleanText(quoted ? raw.slice(1, -1) : raw);

    return {
      raw,
      query,
      exact: quoted && Boolean(query),
      terms: splitTerms(query)
    };
  }

  function currentParams() {
    try {
      return new URLSearchParams(window.location.search || '');
    } catch (_) {
      return new URLSearchParams();
    }
  }

  function getParam(name) {
    return cleanText(currentParams().get(name));
  }

  function getSearchParam(name) {
    return parseSearchValue(getParam(name || 'q'));
  }

  function selectOption(select, value) {
    const clean = cleanText(value);
    if (!select || !clean) return false;
    const match = Array.from(select.options).find((option) => option.value === clean);
    if (!match) return false;
    select.value = match.value;
    return true;
  }

  function hasDataValue(elements, attribute, value) {
    const clean = cleanText(value);
    if (!clean) return false;
    return Array.from(elements || []).some((element) => element.getAttribute(attribute) === clean);
  }

  function matchesText(text, search) {
    if (!search || !search.query) return true;
    if (search.exact) return normalize(text) === normalize(search.query);
    const haystack = normalize(text);
    return search.terms.every((term) => haystack.indexOf(term) !== -1);
  }

  window.SiteUrlFilters = {
    cleanText,
    getParam,
    getSearchParam,
    hasDataValue,
    matchesText,
    normalize,
    parseSearchValue,
    selectOption,
    splitTerms
  };
})();

(function(){
  const btn = document.getElementById('nav-toggle');
  const list = document.getElementById('nav-list');
  if (!btn || !list) return;

  const saved = localStorage.getItem('navOpen') === '1';
  if (saved) {
    list.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  const toggle = () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    const next = !open;
    btn.setAttribute('aria-expanded', String(next));
    list.hidden = !next;
    try { localStorage.setItem('navOpen', next ? '1' : '0'); } catch(_) {}
  };

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  if (!saved) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      if (!reduce) {
        btn.animate([{transform:'translateY(0)'},{transform:'translateY(2px)'},{transform:'translateY(0)'}], {duration:500,iterations:1});
      }
    }, 1200);
  }
})();
