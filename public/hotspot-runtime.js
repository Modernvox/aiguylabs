(function (global) {
  'use strict';

  var VERSION = '0.4.0';
  var CURRENT_SCHEMA_VERSION = 3;
  var instanceCounter = 0;
  var cursors = ['pointer', 'help', 'zoom-in', 'default'];
  var animations = ['none', 'pulse', 'glow', 'outline'];
  var actions = ['none', 'url', 'scroll', 'modal', 'video', 'dispatcher'];

  function RuntimeError(message, details) {
    this.name = 'HotspotRuntimeError';
    this.message = message;
    this.details = details || [];
  }
  RuntimeError.prototype = Object.create(Error.prototype);
  RuntimeError.prototype.constructor = RuntimeError;

  function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function normalizeAction(action) {
    var source = isObject(action) ? action : {};
    var type = actions.indexOf(source.type) >= 0 ? source.type : 'none';
    return {
      type: type,
      value: typeof source.value === 'string' ? source.value : '',
      newTab: type === 'url' && source.newTab === true
    };
  }

  function normalizeHotspot(hotspot) {
    return {
      id: String(hotspot.id),
      name: typeof hotspot.name === 'string' ? hotspot.name : String(hotspot.id),
      shape: 'rectangle',
      x: clamp(Number(hotspot.x), 0, 100),
      y: clamp(Number(hotspot.y), 0, 100),
      width: clamp(Number(hotspot.width), 0.001, 100),
      height: clamp(Number(hotspot.height), 0.001, 100),
      visible: hotspot.visible !== false,
      locked: hotspot.locked === true,
      tooltip: typeof hotspot.tooltip === 'string' ? hotspot.tooltip : '',
      cursor: cursors.indexOf(hotspot.cursor) >= 0 ? hotspot.cursor : 'pointer',
      animation: animations.indexOf(hotspot.animation) >= 0 ? hotspot.animation : 'none',
      action: normalizeAction(hotspot.action)
    };
  }

  function validateProject(project) {
    var errors = [];
    if (!isObject(project)) {
      return ['Project data must be an object.'];
    }
    if (project.schemaVersion !== undefined && (typeof project.schemaVersion !== 'number' || project.schemaVersion > CURRENT_SCHEMA_VERSION)) {
      errors.push('Unsupported project schema version.');
    }
    if (typeof project.name !== 'string' || !project.name.trim()) {
      errors.push('Project name is required.');
    }
    if (!Array.isArray(project.hotspots)) {
      errors.push('Project hotspots must be an array.');
      return errors;
    }

    var ids = Object.create(null);
    project.hotspots.forEach(function (hotspot, index) {
      var prefix = 'hotspots[' + index + ']';
      if (!isObject(hotspot)) {
        errors.push(prefix + ' must be an object.');
        return;
      }
      if (typeof hotspot.id !== 'string' || !hotspot.id.trim()) {
        errors.push(prefix + '.id must be a non-empty string.');
      } else if (ids[hotspot.id]) {
        errors.push(prefix + '.id duplicates another hotspot ID.');
      } else {
        ids[hotspot.id] = true;
      }
      ['x', 'y', 'width', 'height'].forEach(function (field) {
        if (typeof hotspot[field] !== 'number' || !isFinite(hotspot[field])) {
          errors.push(prefix + '.' + field + ' must be a number.');
        }
      });
      if (typeof hotspot.x === 'number' && (hotspot.x < 0 || hotspot.x > 100)) errors.push(prefix + '.x must be between 0 and 100.');
      if (typeof hotspot.y === 'number' && (hotspot.y < 0 || hotspot.y > 100)) errors.push(prefix + '.y must be between 0 and 100.');
      if (typeof hotspot.width === 'number' && (hotspot.width <= 0 || hotspot.width > 100)) errors.push(prefix + '.width must be greater than 0 and at most 100.');
      if (typeof hotspot.height === 'number' && (hotspot.height <= 0 || hotspot.height > 100)) errors.push(prefix + '.height must be greater than 0 and at most 100.');
      if (typeof hotspot.x === 'number' && typeof hotspot.width === 'number' && hotspot.x + hotspot.width > 100) errors.push(prefix + '.x + width must not exceed 100.');
      if (typeof hotspot.y === 'number' && typeof hotspot.height === 'number' && hotspot.y + hotspot.height > 100) errors.push(prefix + '.y + height must not exceed 100.');
      if (hotspot.cursor !== undefined && cursors.indexOf(hotspot.cursor) < 0) errors.push(prefix + '.cursor is not supported.');
      if (hotspot.animation !== undefined && animations.indexOf(hotspot.animation) < 0) errors.push(prefix + '.animation is not supported.');
      if (hotspot.action !== undefined) {
        if (!isObject(hotspot.action)) errors.push(prefix + '.action must be an object.');
        else if (actions.indexOf(hotspot.action.type) < 0) errors.push(prefix + '.action.type is not supported.');
      }
    });
    return errors;
  }

  function resolveMount(mount) {
    if (typeof mount === 'string') return document.querySelector(mount);
    if (mount && mount.nodeType === 1) return mount;
    return null;
  }

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function loadProject(options) {
    if (options.project) return Promise.resolve(options.project);
    if (options.projectUrl) {
      return fetch(options.projectUrl, { credentials: options.credentials || 'same-origin' }).then(function (response) {
        if (!response.ok) throw new RuntimeError('Project JSON could not be loaded.', ['HTTP ' + response.status]);
        return response.json();
      });
    }
    return Promise.reject(new RuntimeError('Missing project data. Pass project or projectUrl.'));
  }

  function HotspotInstance(options, project) {
    this.options = options;
    this.project = project;
    this.id = 'hsr-' + (++instanceCounter);
    this.mount = resolveMount(options.mount);
    this.root = null;
    this.stage = null;
    this.tooltip = null;
    this.tooltipTimer = null;
    this.noticeTimer = null;
    this.modal = null;
    this.previousFocus = null;
    this.boundKeydown = this.onDocumentKeydown.bind(this);
  }

  HotspotInstance.prototype.render = function () {
    if (!this.mount) throw new RuntimeError('HotspotRuntime mount element was not found.');
    var externalImage = null;
    if (this.options.imageElement) {
      externalImage = typeof this.options.imageElement === 'string'
        ? document.querySelector(this.options.imageElement)
        : this.options.imageElement;
    }
    var imageUrl = this.options.imageUrl || this.options.imagePath || (this.project.image && this.project.image.url);
    if (!imageUrl && !externalImage) throw new RuntimeError('Missing image path. Pass imageUrl when mounting exported project JSON.');

    this.destroy();
    var root = createElement('div', externalImage ? 'hs-runtime hs-runtime--external-image' : 'hs-runtime');
    root.setAttribute('data-hotspot-runtime-id', this.id);
    var stage = createElement('div', 'hs-runtime__stage');
    var image = null;
    if (!externalImage) {
      image = createElement('img', 'hs-runtime__image');
      image.alt = this.options.imageAlt || this.project.name || 'Interactive image';
      image.src = imageUrl;
      image.addEventListener('error', this.showNotice.bind(this, 'Runtime image could not be loaded.'));
    }
    var layer = createElement('div', 'hs-runtime__layer');

    this.project.hotspots.filter(function (hotspot) { return hotspot.visible !== false; }).map(normalizeHotspot).forEach(function (hotspot) {
      layer.appendChild(this.createHotspot(hotspot));
    }, this);

    if (image) stage.appendChild(image);
    stage.appendChild(layer);
    root.appendChild(stage);
    this.mount.innerHTML = '';
    this.mount.appendChild(root);
    this.root = root;
    this.stage = stage;
    document.addEventListener('keydown', this.boundKeydown, true);
  };

  HotspotInstance.prototype.createHotspot = function (hotspot) {
    var element = createElement('button', 'hs-runtime__hotspot hs-runtime__hotspot--' + hotspot.animation);
    element.type = 'button';
    element.setAttribute('aria-label', (hotspot.name || hotspot.id) + ' hotspot');
    element.dataset.hotspotId = hotspot.id;
    element.style.left = hotspot.x + '%';
    element.style.top = hotspot.y + '%';
    element.style.width = hotspot.width + '%';
    element.style.height = hotspot.height + '%';
    element.style.cursor = hotspot.cursor;

    element.addEventListener('mouseenter', this.scheduleTooltip.bind(this, hotspot, element));
    element.addEventListener('mousemove', this.moveTooltip.bind(this));
    element.addEventListener('mouseleave', this.hideTooltip.bind(this));
    element.addEventListener('focus', this.scheduleTooltip.bind(this, hotspot, element));
    element.addEventListener('blur', this.hideTooltip.bind(this));
    element.addEventListener('click', this.activate.bind(this, hotspot));
    element.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    });
    return element;
  };

  HotspotInstance.prototype.scheduleTooltip = function (hotspot, element) {
    this.hideTooltip();
    if (!hotspot.tooltip) return;
    var self = this;
    this.tooltipTimer = window.setTimeout(function () {
      self.showTooltip(hotspot.tooltip, element);
    }, 280);
  };

  HotspotInstance.prototype.showTooltip = function (text, element) {
    if (!this.root || !this.stage) return;
    var tooltip = createElement('div', 'hs-runtime__tooltip', text);
    this.root.appendChild(tooltip);
    this.tooltip = tooltip;
    this.positionTooltip(element);
  };

  HotspotInstance.prototype.positionTooltip = function (element) {
    if (!this.tooltip || !this.root) return;
    var rootRect = this.root.getBoundingClientRect();
    var rect = element.getBoundingClientRect();
    var tooltipRect = this.tooltip.getBoundingClientRect();
    var x = clamp(rect.left - rootRect.left + 10, 8, Math.max(8, rootRect.width - tooltipRect.width - 8));
    var y = rect.top - rootRect.top > rootRect.height - 80
      ? rect.top - rootRect.top - tooltipRect.height - 8
      : rect.bottom - rootRect.top + 8;
    y = clamp(y, 8, Math.max(8, rootRect.height - tooltipRect.height - 8));
    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
  };

  HotspotInstance.prototype.moveTooltip = function (event) {
    if (!this.tooltip || !this.root) return;
    var rootRect = this.root.getBoundingClientRect();
    var tooltipRect = this.tooltip.getBoundingClientRect();
    var x = clamp(event.clientX - rootRect.left + 12, 8, Math.max(8, rootRect.width - tooltipRect.width - 8));
    var y = clamp(event.clientY - rootRect.top + 14, 8, Math.max(8, rootRect.height - tooltipRect.height - 8));
    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
  };

  HotspotInstance.prototype.hideTooltip = function () {
    if (this.tooltipTimer) window.clearTimeout(this.tooltipTimer);
    this.tooltipTimer = null;
    if (this.tooltip && this.tooltip.parentNode) this.tooltip.parentNode.removeChild(this.tooltip);
    this.tooltip = null;
  };

  HotspotInstance.prototype.showNotice = function (message) {
    if (!this.root) return;
    var existing = this.root.querySelector('.hs-runtime__notice');
    if (existing) existing.remove();
    var notice = createElement('div', 'hs-runtime__notice', message);
    notice.setAttribute('role', 'status');
    this.root.appendChild(notice);
    if (this.noticeTimer) window.clearTimeout(this.noticeTimer);
    this.noticeTimer = window.setTimeout(function () {
      if (notice.parentNode) notice.parentNode.removeChild(notice);
    }, 2600);
  };

  HotspotInstance.prototype.activate = function (hotspot, event) {
    this.hideTooltip();
    var action = hotspot.action || { type: 'none', value: '', newTab: false };
    var value = (action.value || '').trim();
    switch (action.type) {
      case 'none':
        return;
      case 'url':
        if (!value) return this.showNotice('URL action has no value.');
        if (action.newTab) window.open(value, '_blank', 'noopener,noreferrer');
        else window.location.href = value;
        return;
      case 'scroll':
        return this.handleScroll(value);
      case 'modal':
        return this.openModal({ title: hotspot.name || hotspot.id, body: 'The host page supplies real modal content for modal ID: ' + (value || 'not configured') + '.', kicker: 'Modal ID: ' + (value || 'not configured') });
      case 'video':
        return this.openVideoModal(hotspot, value);
      case 'dispatcher':
        return this.handleDispatcher(hotspot, value, event);
      default:
        return;
    }
  };

  HotspotInstance.prototype.handleScroll = function (value) {
    if (!value) return this.showNotice('Scroll action has no selector or element ID.');
    var target = document.getElementById(value.replace(/^#/, ''));
    if (!target) {
      try { target = document.querySelector(value); } catch (error) { target = null; }
    }
    if (!target) return this.showNotice('No matching scroll target found.');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  HotspotInstance.prototype.openVideoModal = function (hotspot, value) {
    if (!value) return this.openModal({ title: hotspot.name || hotspot.id, body: 'No video URL is configured for this hotspot.' });
    if (/^https?:\/\/.+\.mp4(\?.*)?$/i.test(value) || /^\.?.+\.mp4(\?.*)?$/i.test(value)) {
      return this.openModal({ title: hotspot.name || hotspot.id, videoUrl: value, body: 'Video preview.' });
    }
    return this.openModal({ title: hotspot.name || hotspot.id, kicker: 'Configured video URL', body: value + '\n\nThe host page can decide how to embed or launch this video.' });
  };

  HotspotInstance.prototype.handleDispatcher = function (hotspot, value, event) {
    if (!value) return this.showNotice('Dispatcher action has no event name.');
    var detail = { hotspotId: hotspot.id, action: value, hotspot: hotspot, originalEvent: event || null, instanceId: this.id };
    if (typeof this.options.onDispatch === 'function') this.options.onDispatch(detail);
    this.root.dispatchEvent(new CustomEvent('hotspotruntime:dispatch', { bubbles: true, detail: detail }));
    this.showNotice('Dispatched ' + value + '.');
  };

  HotspotInstance.prototype.openModal = function (content) {
    this.closeModal();
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    var backdrop = createElement('div', 'hs-runtime__modal-backdrop');
    var dialog = createElement('div', 'hs-runtime__modal');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', this.id + '-modal-title');
    var header = createElement('div', 'hs-runtime__modal-header');
    var title = createElement('h2', '', content.title || 'Hotspot');
    title.id = this.id + '-modal-title';
    var close = createElement('button', 'hs-runtime__modal-close', 'Close');
    close.type = 'button';
    close.addEventListener('click', this.closeModal.bind(this));
    header.appendChild(title);
    header.appendChild(close);
    var body = createElement('div', 'hs-runtime__modal-body');
    if (content.kicker) body.appendChild(createElement('div', 'hs-runtime__modal-kicker', content.kicker));
    if (content.videoUrl) {
      var video = document.createElement('video');
      video.className = 'hs-runtime__video';
      video.controls = true;
      video.src = content.videoUrl;
      body.appendChild(video);
    }
    if (content.body) {
      content.body.split('\n').forEach(function (line) {
        body.appendChild(createElement('p', '', line));
      });
    }
    dialog.appendChild(header);
    dialog.appendChild(body);
    backdrop.appendChild(dialog);
    backdrop.addEventListener('mousedown', function (event) {
      if (event.target === backdrop) this.closeModal();
    }.bind(this));
    this.root.appendChild(backdrop);
    this.modal = backdrop;
    close.focus();
  };

  HotspotInstance.prototype.closeModal = function () {
    if (this.modal && this.modal.parentNode) this.modal.parentNode.removeChild(this.modal);
    this.modal = null;
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') this.previousFocus.focus();
    this.previousFocus = null;
  };

  HotspotInstance.prototype.onDocumentKeydown = function (event) {
    if (!this.modal) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(this.modal.querySelectorAll('button, [href], video, [tabindex]:not([tabindex="-1"])')).filter(function (element) {
      return !element.hasAttribute('disabled');
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
  };

  HotspotInstance.prototype.destroy = function () {
    this.hideTooltip();
    this.closeModal();
    if (this.noticeTimer) window.clearTimeout(this.noticeTimer);
    document.removeEventListener('keydown', this.boundKeydown, true);
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    this.root = null;
    this.stage = null;
  };

  HotspotInstance.prototype.update = function (project, imageUrl) {
    var errors = validateProject(project);
    if (errors.length) throw new RuntimeError('Invalid project data.', errors);
    this.project = project;
    if (imageUrl) this.options.imageUrl = imageUrl;
    this.render();
  };

  HotspotInstance.prototype.getProject = function () {
    return this.project;
  };

  function mount(options) {
    options = options || {};
    return loadProject(options).then(function (project) {
      var errors = validateProject(project);
      if (errors.length) throw new RuntimeError('Invalid project data.', errors);
      var instance = new HotspotInstance(options, project);
      instance.render();
      return instance;
    }).catch(function (error) {
      var runtimeError = error instanceof RuntimeError ? error : new RuntimeError(error.message || 'HotspotRuntime failed to mount.');
      if (typeof options.onError === 'function') options.onError(runtimeError);
      throw runtimeError;
    });
  }

  global.HotspotRuntime = {
    version: VERSION,
    mount: mount,
    validateProject: validateProject,
    RuntimeError: RuntimeError
  };
})(window);
