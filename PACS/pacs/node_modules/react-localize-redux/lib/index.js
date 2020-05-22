'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Localize = require('./Localize');

Object.defineProperty(exports, 'localize', {
  enumerable: true,
  get: function get() {
    return _Localize.localize;
  }
});

var _Translate = require('./Translate');

Object.defineProperty(exports, 'Translate', {
  enumerable: true,
  get: function get() {
    return _Translate.Translate;
  }
});

var _locale = require('./locale');

Object.defineProperty(exports, 'localeReducer', {
  enumerable: true,
  get: function get() {
    return _locale.localeReducer;
  }
});
Object.defineProperty(exports, 'initialize', {
  enumerable: true,
  get: function get() {
    return _locale.initialize;
  }
});
Object.defineProperty(exports, 'addTranslation', {
  enumerable: true,
  get: function get() {
    return _locale.addTranslation;
  }
});
Object.defineProperty(exports, 'addTranslationForLanguage', {
  enumerable: true,
  get: function get() {
    return _locale.addTranslationForLanguage;
  }
});
Object.defineProperty(exports, 'setLanguages', {
  enumerable: true,
  get: function get() {
    return _locale.setLanguages;
  }
});
Object.defineProperty(exports, 'setActiveLanguage', {
  enumerable: true,
  get: function get() {
    return _locale.setActiveLanguage;
  }
});
Object.defineProperty(exports, 'getTranslate', {
  enumerable: true,
  get: function get() {
    return _locale.getTranslate;
  }
});
Object.defineProperty(exports, 'getActiveLanguage', {
  enumerable: true,
  get: function get() {
    return _locale.getActiveLanguage;
  }
});
Object.defineProperty(exports, 'getLanguages', {
  enumerable: true,
  get: function get() {
    return _locale.getLanguages;
  }
});
Object.defineProperty(exports, 'getTranslations', {
  enumerable: true,
  get: function get() {
    return _locale.getTranslations;
  }
});
Object.defineProperty(exports, 'getOptions', {
  enumerable: true,
  get: function get() {
    return _locale.getOptions;
  }
});