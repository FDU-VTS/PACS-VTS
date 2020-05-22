'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warning = exports.storeDidChange = exports.getTranslationsForLanguage = exports.validateOptions = exports.objectValuesToString = exports.getIndexForLanguageCode = exports.templater = exports.hasHtmlTags = exports.getLocalizedElement = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _locale = require('./locale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getLocalizedElement = exports.getLocalizedElement = function getLocalizedElement(key, translations, data, activeLanguage) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _locale.defaultTranslateOptions;

  var onMissingTranslation = function onMissingTranslation() {
    if (options.missingTranslationCallback) {
      options.missingTranslationCallback(key, activeLanguage.code);
    }
    return options.showMissingTranslationMsg === false ? '' : templater(options.missingTranslationMsg || '', { key: key, code: activeLanguage.code });
  };
  var localizedString = translations[key] || onMissingTranslation();
  var translatedValue = templater(localizedString, data);
  return options.renderInnerHtml && hasHtmlTags(translatedValue) ? _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: translatedValue } }) : translatedValue;
};

var hasHtmlTags = exports.hasHtmlTags = function hasHtmlTags(value) {
  var pattern = /(&[^\s]*;|<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>)/;
  return value.search(pattern) >= 0;
};

/**
 * @func templater
 * @desc A poor mans template parser 
 * @param {string} strings The template string
 * @param {object} data The data that should be inserted in template
 * @return {string} The template string with the data merged in
 */
var templater = exports.templater = function templater(strings) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var prop in data) {
    var pattern = '\\${\\s*' + prop + '\\s*}';
    var regex = new RegExp(pattern, 'gmi');
    strings = strings.replace(regex, data[prop]);
  }
  return strings;
};

var getIndexForLanguageCode = exports.getIndexForLanguageCode = function getIndexForLanguageCode(code, languages) {
  return languages.map(function (language) {
    return language.code;
  }).indexOf(code);
};

var objectValuesToString = exports.objectValuesToString = function objectValuesToString(data) {
  return !Object.values ? Object.keys(data).map(function (key) {
    return data[key].toString();
  }).toString() : Object.values(data).toString();
};

var validateOptions = exports.validateOptions = function validateOptions(options) {
  if (options.translationTransform !== undefined && typeof options.translationTransform !== 'function') {
    throw new Error('react-localize-redux: Invalid translationTransform function.');
  }
  return options;
};

var getTranslationsForLanguage = exports.getTranslationsForLanguage = function getTranslationsForLanguage(language, languages, translations) {
  // no language! return no translations 
  if (!language) {
    return {};
  }

  var languageCode = language.code;

  var languageIndex = getIndexForLanguageCode(languageCode, languages);
  return Object.keys(translations).reduce(function (prev, key) {
    return _extends({}, prev, _defineProperty({}, key, translations[key][languageIndex]));
  }, {});
};

var storeDidChange = exports.storeDidChange = function storeDidChange(store, onChange) {
  var currentState = void 0;

  function handleChange() {
    var nextState = store.getState();
    if (nextState !== currentState) {
      onChange(currentState);
      currentState = nextState;
    }
  }

  var unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

// Thanks react-redux for utility function
// https://github.com/reactjs/react-redux/blob/master/src/utils/warning.js
var warning = exports.warning = function warning(message) {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {}
};