var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { combineReducers } from 'redux';
import { flatten } from 'flat';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { getLocalizedElement, getIndexForLanguageCode, objectValuesToString, validateOptions, getTranslationsForLanguage, warning } from './utils';

/**
 * TYPES
 */


/**
 * ACTIONS
 */
export var INITIALIZE = '@@localize/INITIALIZE';
export var ADD_TRANSLATION = '@@localize/ADD_TRANSLATION';
export var ADD_TRANSLATION_FOR_LANGUGE = '@@localize/ADD_TRANSLATION_FOR_LANGUGE';
export var SET_LANGUAGES = '@@localize/SET_LANGUAGES';
export var SET_ACTIVE_LANGUAGE = '@@localize/SET_ACTIVE_LANGUAGE';
export var TRANSLATE = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
export function languages() {
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

export function translations() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case ADD_TRANSLATION:
      // apply transformation if set in options
      var _translations = action.translationTransform !== undefined ? action.translationTransform(action.payload.translation, action.languageCodes) : action.payload.translation;
      return _extends({}, state, flatten(_translations, { safe: true }));
    case ADD_TRANSLATION_FOR_LANGUGE:
      var languageIndex = action.languageCodes.indexOf(action.payload.language);
      var flattenedTranslations = languageIndex >= 0 ? flatten(action.payload.translation) : {};
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

export function options() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultTranslateOptions;
  var action = arguments[1];

  switch (action.type) {
    case INITIALIZE:
      var _options2 = action.payload.options || {};
      return _extends({}, state, validateOptions(_options2));
    default:
      return state;
  }
};

export var defaultTranslateOptions = {
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

export var localeReducer = function localeReducer() {
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
export var initialize = function initialize(languages) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultTranslateOptions;
  return {
    type: INITIALIZE,
    payload: { languages: languages, options: options }
  };
};

export var addTranslation = function addTranslation(translation) {
  return {
    type: ADD_TRANSLATION,
    payload: { translation: translation }
  };
};

export var addTranslationForLanguage = function addTranslationForLanguage(translation, language) {
  return {
    type: ADD_TRANSLATION_FOR_LANGUGE,
    payload: { translation: translation, language: language }
  };
};

export var setLanguages = function setLanguages(languages, activeLanguage) {
  warning('The setLanguages action will be removed in the next major version. ' + 'Please use initialize action instead https://ryandrewjohnson.github.io/react-localize-redux/api/action-creators/#initializelanguages-options');
  return {
    type: SET_LANGUAGES,
    payload: { languages: languages, activeLanguage: activeLanguage }
  };
};

export var setActiveLanguage = function setActiveLanguage(languageCode) {
  return {
    type: SET_ACTIVE_LANGUAGE,
    payload: { languageCode: languageCode }
  };
};

/**
 * SELECTORS
 */
export var getTranslations = function getTranslations(state) {
  return state.translations;
};

export var getLanguages = function getLanguages(state) {
  return state.languages;
};

export var getOptions = function getOptions(state) {
  return state.options;
};

export var getActiveLanguage = function getActiveLanguage(state) {
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
export var translationsEqualSelector = createSelectorCreator(defaultMemoize, function (cur, prev) {
  var prevKeys = (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === "object" ? Object.keys(prev).toString() : undefined;
  var curKeys = (typeof cur === 'undefined' ? 'undefined' : _typeof(cur)) === "object" ? Object.keys(cur).toString() : undefined;

  var prevValues = (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === "object" ? objectValuesToString(prev) : undefined;
  var curValues = (typeof cur === 'undefined' ? 'undefined' : _typeof(cur)) === "object" ? objectValuesToString(cur) : undefined;

  var prevCacheValue = !prevKeys || !prevValues ? prevKeys + ' - ' + prevValues : prev;

  var curCacheValue = !curKeys || !curValues ? curKeys + ' - ' + curValues : cur;

  return prevCacheValue === curCacheValue;
});

export var getTranslationsForActiveLanguage = translationsEqualSelector(getActiveLanguage, getLanguages, getTranslations, getTranslationsForLanguage);

export var getTranslationsForSpecificLanguage = translationsEqualSelector(getLanguages, getTranslations, function (languages, translations) {
  return defaultMemoize(function (languageCode) {
    return getTranslationsForLanguage(languageCode, languages, translations);
  });
});

var getTranslate = createSelector(getTranslationsForActiveLanguage, getTranslationsForSpecificLanguage, getActiveLanguage, getOptions, function (translationsForActiveLanguage, getTranslationsForLanguage, activeLanguage, options) {
  return function (value) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var optionsOverride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var defaultLanguage = optionsOverride.defaultLanguage,
        rest = _objectWithoutProperties(optionsOverride, ['defaultLanguage']);

    var translateOptions = _extends({}, options, rest);
    var translations = defaultLanguage !== undefined ? getTranslationsForLanguage({ code: defaultLanguage, active: false }) : translationsForActiveLanguage;
    if (typeof value === 'string') {
      return getLocalizedElement(value, translations, data, activeLanguage, translateOptions);
    } else if (Array.isArray(value)) {
      return value.reduce(function (prev, cur) {
        return _extends({}, prev, _defineProperty({}, cur, getLocalizedElement(cur, translations, data, activeLanguage, translateOptions)));
      }, {});
    } else {
      throw new Error('react-localize-redux: Invalid key passed to getTranslate.');
    }
  };
});

export { getTranslate };
export var getTranslateComponent = createSelector(getTranslate, function (translate) {
  return function (props) {
    return translate(props.id, props.data, props.options);
  };
});