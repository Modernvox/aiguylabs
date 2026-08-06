(function () {
  'use strict';

  var mountId = 'ai-guy-labs-hero-hotspots';
  var mountedInstance = null;
  var mountPromise = null;
  var previousFocus = null;
  var studioAssetsPromise = null;
  var studioEditorInstance = null;
  var activeVariant = null;
  var mediaQueryList = null;

  var dispatcherActions = {
    'home': function () {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    'projects': function () {
      scrollToSection('software');
    },
    'open-projects': function () {
      scrollToSection('software');
    },
    'software': function () {
      scrollToSection('software');
    },
    'open-software': function () {
      scrollToSection('software');
    },
    'contact': function () {
      openModal('Contact AI Guy Labs™', 'Project inquiries will connect to the production contact flow when that section is added.');
    },
    'open-contact': function () {
      openModal('Contact AI Guy Labs™', 'Project inquiries will connect to the production contact flow when that section is added.');
    }
  };

  function getMount() {
    return document.getElementById(mountId);
  }

  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof target.focus === 'function') target.focus({ preventScroll: true });
  }

  function openModal(title, body) {
    var modal = document.getElementById('ai-guy-labs-modal');
    var titleElement = document.getElementById('aigl-modal-title');
    var bodyElement = document.getElementById('aigl-modal-body');
    if (!modal || !titleElement || !bodyElement) return;

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleElement.textContent = title;
    bodyElement.textContent = body;
    modal.hidden = false;

    var closeButton = modal.querySelector('[data-modal-close]:not(.aigl-modal__backdrop)');
    if (closeButton && typeof closeButton.focus === 'function') closeButton.focus();
  }

  function closeModal() {
    var modal = document.getElementById('ai-guy-labs-modal');
    if (!modal || modal.hidden) return;
    modal.hidden = true;

    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    previousFocus = null;
  }

  function handleModalClick(event) {
    if (event.target && event.target.matches('[data-modal-close]')) closeModal();
  }

  function handleModalKeydown(event) {
    var modal = document.getElementById('ai-guy-labs-modal');
    if (!modal || modal.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    var focusable = Array.prototype.slice.call(modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')).filter(function (element) {
      return !element.hasAttribute('disabled') && !element.hidden;
    });
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleDispatch(detail) {
    if (!detail || !detail.action) return;
    var handler = dispatcherActions[detail.action];
    if (typeof handler === 'function') handler(detail);
  }

  function getResponsiveVariant(mount) {
    var breakpoint = Number(mount.dataset.hotspotBreakpoint || 768);
    if (!window.matchMedia) return window.innerWidth < breakpoint ? 'mobile' : 'desktop';
    var query = '(max-width: ' + (breakpoint - 1) + 'px)';
    return window.matchMedia(query).matches ? 'mobile' : 'desktop';
  }

  function applyResponsiveDataset(mount) {
    var variant = getResponsiveVariant(mount);
    var projectUrl = variant === 'mobile' ? mount.dataset.hotspotMobileProjectUrl : mount.dataset.hotspotDesktopProjectUrl;
    var imageUrl = variant === 'mobile' ? mount.dataset.hotspotMobileImageUrl : mount.dataset.hotspotDesktopImageUrl;
    if (projectUrl) mount.dataset.hotspotProjectUrl = projectUrl;
    if (imageUrl) mount.dataset.hotspotImageUrl = imageUrl;
    mount.dataset.hotspotVariant = variant;
    return variant;
  }

  function setupResponsiveHotspots() {
    var mount = getMount();
    if (!mount || mediaQueryList) return;
    var breakpoint = Number(mount.dataset.hotspotBreakpoint || 768);
    if (!window.matchMedia) return;
    mediaQueryList = window.matchMedia('(max-width: ' + (breakpoint - 1) + 'px)');
    var onChange = function () {
      var nextVariant = applyResponsiveDataset(mount);
      if (nextVariant === activeVariant) return;
      activeVariant = null;
      destroyRuntime();
      unmountStudioEditor();
      if (isEditQueryEnabled()) activateDeveloperMode();
      else mountRuntime();
    };
    if (typeof mediaQueryList.addEventListener === 'function') mediaQueryList.addEventListener('change', onChange);
    else if (typeof mediaQueryList.addListener === 'function') mediaQueryList.addListener(onChange);
  }
  function mountRuntime() {
    var mount = getMount();
    if (!mount) {
      console.warn('[AI Guy Labs] Hotspot mount element was not found.');
      return;
    }

    var variant = applyResponsiveDataset(mount);
    if (mountedInstance || mountPromise || studioEditorInstance) return;
    if (!mount.dataset.hotspotImageUrl || !mount.dataset.hotspotProjectUrl) return;
    activeVariant = variant;

    if (!window.HotspotRuntime || typeof window.HotspotRuntime.mount !== 'function') {
      console.warn('[AI Guy Labs] Hotspot runtime failed to load.');
      return;
    }

    mountPromise = window.HotspotRuntime.mount({
      mount: mount,
      projectUrl: mount.dataset.hotspotProjectUrl,
      imageUrl: mount.dataset.hotspotImageUrl,
      imageElement: mount.dataset.hotspotImageSelector,
      imageAlt: mount.dataset.hotspotImageAlt,
      onDispatch: handleDispatch,
      onError: function (error) {
        console.warn('[AI Guy Labs] Hotspot runtime error:', error.message, error.details || []);
      }
    }).then(function (instance) {
      mountedInstance = instance;
    }).catch(function () {
      console.warn('[AI Guy Labs] Hotspot runtime could not mount.');
    }).finally(function () {
      mountPromise = null;
    });
  }

  function destroyRuntime() {
    if (mountedInstance && typeof mountedInstance.destroy === 'function') {
      mountedInstance.destroy();
    }
    mountedInstance = null;
    mountPromise = null;
  }

  function isEditQueryEnabled() {
    return new URLSearchParams(window.location.search).get('hotspots') === 'edit';
  }

  function loadStylesheet(href, id) {
    return new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        resolve(existing);
        return;
      }

      var link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = function () { resolve(link); };
      link.onerror = function () { reject(new Error('Hotspot Studio embed CSS could not be loaded.')); };
      document.head.appendChild(link);
    });
  }

  function loadScript(src, id) {
    if (!window.process) window.process = { env: { NODE_ENV: 'production' } };
    else if (!window.process.env) window.process.env = { NODE_ENV: 'production' };
    else if (!window.process.env.NODE_ENV) window.process.env.NODE_ENV = 'production';

    return new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        resolve(existing);
        return;
      }

      var script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.defer = true;
      script.onload = function () { resolve(script); };
      script.onerror = function () { reject(new Error('Hotspot Studio embed script could not be loaded.')); };
      document.head.appendChild(script);
    });
  }

  function loadHotspotStudioEmbed() {
    if (window.HotspotStudio && typeof window.HotspotStudio.mount === 'function') {
      return Promise.resolve(window.HotspotStudio);
    }
    if (studioAssetsPromise) return studioAssetsPromise;

    studioAssetsPromise = Promise.all([
      loadStylesheet('/hotspot-studio-embed.css', 'hotspot-studio-embed-css'),
      loadScript('/hotspot-studio-embed.js', 'hotspot-studio-embed-js')
    ]).then(function () {
      if (!window.HotspotStudio || typeof window.HotspotStudio.mount !== 'function') {
        throw new Error('HotspotStudio.mount is unavailable.');
      }
      return window.HotspotStudio;
    });

    return studioAssetsPromise;
  }

  function downloadJson(project, json) {
    var payload = json || project;
    var blob = payload instanceof Blob
      ? payload
      : new Blob([typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'hero-desktop.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function clearEditQueryParam() {
    var url = new URL(window.location.href);
    if (url.searchParams.get('hotspots') !== 'edit') return;
    url.searchParams.delete('hotspots');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }

  function unmountStudioEditor() {
    if (!studioEditorInstance) return;

    if (typeof studioEditorInstance.destroy === 'function') studioEditorInstance.destroy();
    else if (typeof studioEditorInstance.unmount === 'function') studioEditorInstance.unmount();
    else if (typeof studioEditorInstance.stop === 'function') studioEditorInstance.stop();

    studioEditorInstance = null;
  }

  function exitDeveloperMode() {
    unmountStudioEditor();
    clearEditQueryParam();
    mountRuntime();
  }

  function loadProject(projectUrl) {
    return fetch(projectUrl, { credentials: 'same-origin', cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('Project JSON could not be loaded.');
      return response.json();
    });
  }

  function activateDeveloperMode() {
    var mount = getMount();
    if (!mount) return;
    if (studioEditorInstance) return;

    applyResponsiveDataset(mount);
    destroyRuntime();
    if (!mount.dataset.hotspotImageUrl || !mount.dataset.hotspotProjectUrl) return;

    Promise.all([
      loadHotspotStudioEmbed(),
      loadProject(mount.dataset.hotspotProjectUrl)
    ]).then(function (results) {
      var studio = results[0];
      var project = results[1];
      if (studioEditorInstance) return;

      studioEditorInstance = studio.mount({
        mount: mount,
        project: project,
        imageUrl: mount.dataset.hotspotImageUrl,
      imageElement: mount.dataset.hotspotImageSelector,
      imageAlt: mount.dataset.hotspotImageAlt,
        mode: 'overlay',
        dispatchers: dispatcherActions,
        dispatcherActions: dispatcherActions,
        onExport: downloadJson,
        onClose: exitDeveloperMode
      });
    }).catch(function (error) {
      console.warn('[AI Guy Labs] Hotspot Studio embed failed to load:', error.message);
      mountRuntime();
    });
  }

  function handleDeveloperShortcut(event) {
    if (!event.ctrlKey || !event.shiftKey || event.key.toLowerCase() !== 'h') return;
    event.preventDefault();

    if (studioEditorInstance) {
      exitDeveloperMode();
      return;
    }

    activateDeveloperMode();
  }

  function init() {
    var modal = document.getElementById('ai-guy-labs-modal');
    if (modal) modal.addEventListener('click', handleModalClick);
    document.addEventListener('keydown', handleModalKeydown, true);

    document.addEventListener('keydown', handleDeveloperShortcut, true);

    setupResponsiveHotspots();

    if (isEditQueryEnabled()) activateDeveloperMode();
    else if (getMount()) mountRuntime();
    window.addEventListener('pagehide', function () {
      unmountStudioEditor();
      destroyRuntime();
    }, { once: true });
  }

  window.AIGuyLabsHotspotIntegration = {
    mount: mountRuntime,
    destroy: destroyRuntime,
    activateDeveloperMode: activateDeveloperMode,
    exitDeveloperMode: exitDeveloperMode,
    dispatchers: dispatcherActions
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();




