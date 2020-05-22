'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranslateComponent = exports.getTranslate = exports.getTranslationsForSpecificLanguage = exports.getTranslationsForActiveLanguage = exports.translationsEqualSelector = exports.getActiveLanguage = exports.getOptions = exports.getLanguages = exports.getTranslations = exports.setActiveLanguage = exports.setLanguages = exports.addTranslationForLanguage = exports.addTranslation = exports.initialize = exports.localeReducer = exports.defaultTranslateOptions = exports.TRANSLATE = exports.SET_ACTIVE_LANGUAGE = exports.SET_LANGUAGES = exports.ADD_TRANSLATION_FOR_LANGUGE = exports.ADD_TRANSLATION = exports.INITIALIZE = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.languages = languages;
exports.translations = translations;
exports.options = options;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _redux = require('redux');

var _flat = require('flat');

var _reselect = require('reselect');

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ACTIONS
 */


/**
 * TYPES
 */
var INITIALIZE = exports.INITIALIZE = '@@localize/INITIALIZE';
var ADD_TRANSLATION = exports.ADD_TRANSLATION = '@@localize/ADD_TRANSLATION';
var ADD_TRANSLATION_FOR_LANGUGE = exports.ADD_TRANSLATION_FOR_LANGUGE = '@@localize/ADD_TRANSLATION_FOR_LANGUGE';
var SET_LANGUAGES = exports.SET_LANGUAGES = '@@localize/SET_LANGUAGES';
var SET_ACTIVE_LANGUAGE = exports.SET_ACTIVE_LANGUAGE = '@@localize/SET_ACTIVE_LANGUAGE';
var TRANSLATE = exports.TRANSLATE = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
function languages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case INITIALIZE:
    case SET_LANGUAGES:
      var _options = action.payload.options || {};
      var _activeLanguage = action.payload.activeLanguage || _options.defaultLanguage;
      return action.payload.languages.map(function (language, index) {
        var isActive = function isActive(code) {
          return _activeLanguage !== undefined ? code === _activeLanguage : index === 0;
        };
        // check if it's using array of Language objects, or array of languge codes
        return typeof language === 'string' ? { code: language, active: isActive(language) // language codes
        } : _extends({}, language, { active: isActive(language.code) }); // language objects
      });
    case SET_ACTIVE_LANGUAGE:
      return state.map(function (language) {
        return language.code === action.payload.languageCode ? _extends({}, language, { active: true }) : _extends({}, language, { active: false });
      });
    default:
      return state;
  }
}

function translations() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case ADD_TRANSLATION:
      // apply transformation if set in options
      var _translations = action.translationTransform !== undefined ? action.translationTransform(action.payload.translation, action.languageCodes) : action.payload.translation;
      return _extends({}, state, (0, _flat.flatten)(_translations, { safe: true }));
    case ADD_TRANSLATION_FOR_LANGUGE:
      var languageIndex = action.languageCodes.indexOf(action.payload.language);
      var flattenedTranslations = languageIndex >= 0 ? (0, _flat.flatten)(action.payload.translation) : {};
      // convert single translation data into multiple
      var languageTranslations = Object.keys(flattenedTranslations).reduce(function (prev, cur) {
        // loop through each language, and for languages that don't match active language 
        // keep existing translation data, and for active language store new translation data
        var translationValues = action.languageCodes.map(function (code, index) {
          var existingValues = state[cur] || [];
          return index === languageIndex ? flattenedTranslations[cur] : existingValues[index];
        });
        return _extends({}, prev, _defineProperty({}, cur, translationValues));
      }, {});

      return _extends({}, state, languageTranslations);
    default:
      return state;
  }
}

function options() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultTranslateOptions;
  var action = arguments[1];

  switch (action.type) {
    case INITIALIZE:
      var _options2 = action.payload.options || {};
      return _extends({}, state, (0, _utils.validateOptions)(_options2));
    default:
      return state;
  }
};

var defaultTranslateOptions = exports.defaultTranslateOptions = {
  renderInnerHtml: true,
  showMissingTranslationMsg: true,
  missingTranslationMsg: 'Missing translation key ${ key } for language ${ code }',
  ignoreTranslateChildren: false
};

var initialState = {
  languages: [],
  translations: {},
  options: defaultTranslateOptions
};

var localeReducer = exports.localeReducer = function localeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  var languageCodes = state.languages.map(function (language) {
    return language.code;
  });
  var translationTransform = state.options.translationTransform;
  return {
    languages: languages(state.languages, action),
    translations: translations(state.translations, _extends({}, action, { languageCodes: languageCodes, translationTransform: translationTransform })),
    options: options(state.options, action)
  };
};

/**
 * ACTION CREATORS
 */
var initialize = exports.initialize = function initialize(languages) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultTranslateOptions;
  return {
    type: INITIALIZE,
    payload: { languages: languages, options: options }
  };
};

var addTranslation = exports.addTranslation = function addTranslation(translation) {
  return {
    type: ADD_TRANSLATION,
    payload: { translation: translation }
  };
};

var addTranslationForLanguage = exports.addTranslationForLanguage = function addTranslationForLanguage(translation, language) {
  return {
    type: ADD_TRANSLATION_FOR_LANGUGE,
    payload: { translation: translation, language: language }
  };
};

var setLanguages = exports.setLanguages = function setLanguages(languages, activeLanguage) {
  (0, _utils.warning)('The setLanguages action will be removed in the next major version. ' + 'Please use initialize action instead https://ryandrewjohnson.github.io/react-localize-redux/api/action-creators/#initializelanguages-options');
  return {
    type: SET_LANGUAGES,
    payload: { languages: languages, activeLanguage: activeLanguage }
  };
};

var setActiveLanguage = exports.setActiveLanguage = function setActiveLanguage(languageCode) {
  return {
    type: SET_ACTIVE_LANGUAGE,
    payload: { languageCode: languageCode }
  };
};

/**
 * SELECTORS
 */
var getTranslations = exports.getTranslations = function getTranslations(state) {
  return state.translations;
};

var getLanguages = exports.getLanguages = function getLanguages(state) {
  return state.languages;
};

var getOptions = exports.getOptions = function getOptions(state) {
  return state.options;
};

var getActiveLanguage = exports.getActiveLanguage = function getActiveLanguage(state) {
  var languages = getLanguages(state);
  return languages.filter(function (language) {
    return language.active === true;
  })[0];
};

/**
 * A custom equality checker that checker that compares an objects keys and values instead of === comparison
 * e.g. {name: 'Ted', sport: 'hockey'} would result in 'name,sport - Ted,hocker' which would be used for comparison
 * 
 * NOTE: This works with activeLanguage, languages, and translations data types.
 * If a new data type is added to selector this would need to be updated to accomodate
 */
var translationsEqualSelector = exports.translationsEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, function (cur, prev) {
  var prevKeys = (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === "object" ? Object.keys(prev).toString() : undefined;
  var curKeys = (typeof cur === 'undefined' ? 'undefined' : _typeof(cur)) === "object" ? Object.keys(cur).toString() : undefined;

  var prevValues = (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === "object" ? (0, _utils.objectValuesToString)(prev) : undefined;
  var curValues = (typeof cur === 'undefined' ? 'undefined' : _typeof(cur)) === "object" ? (0, _utils.objectValuesToString)(cur) : undefined;

  var prevCacheValue = !prevKeys || !prevValues ? prevKeys + ' - ' + prevValues : prev;

  var curCacheValue = !curKeys || !curValues ? curKeys + ' - ' + curValues : cur;

  return prevCacheValue === curCacheValue;
});

var getTranslationsForActiveLanguage = exports.getTranslationsForActiveLanguage = translationsEqualSelector(getActiveLanguage, getLanguages, getTranslations, _utils.getTranslationsForLanguage);

var getTranslationsForSpecificLanguage = exports.getTranslationsForSpecificLanguage = translationsEqualSelector(getLanguages, getTranslations, function (languages, translations) {
  return (0, _reselect.defaultMemoize)(function (languageCode) {
    return (0, _utils.getTranslationsForLanguage)(languageCode, languages, translations);
  });
});

var getTranslate = (0, _reselect.createSelector)(getTranslationsForActiveLanguage, getTranslationsForSpecificLanguage, getActiveLanguage, getOptions, function (translationsForActiveLanguage, getTranslationsForLanguage, activeLanguage, options) {
  return function (value) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var optionsOverride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var defaultLanguage = optionsOverride.defaultLanguage,
        rest = _objectWithoutProperties(optionsOverride, ['defaultLanguage']);

    var translateOptions = _extends({}, options, rest);
    var translations = defaultLanguage !== undefined ? getTranslationsForLanguage({ code: defaultLanguage, active: false }) : translationsForActiveLanguage;
    if (typeof value === 'string') {
      return (0, _utils.getLocalizedElement)(value, translations, data, activeLanguage, translateOptions);
    } else if (Array.isArray(value)) {
      return value.reduce(function (prev, cur) {
        return _extends({}, prev, _defineProperty({}, cur, (0, _utils.getLocalizedElement)(cur, translations, data, activeLanguage, translateOptions)));
      }, {});
    } else {
      throw new Error('react-localize-redux: Invalid key passed to getTranslate.');
    }
  };
});

exports.getTranslate = getTranslate;
var getTranslateComponent = exports.getTranslateComponent = (0, _reselect.createSelector)(getTranslate, function (translate) {
  return function (props) {
    return translate(props.id, props.data, props.options);
  };
});