var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { getTranslate, addTranslationForLanguage, getLanguages, getOptions, getActiveLanguage, getTranslationsForActiveLanguage } from './locale';
import { storeDidChange } from './utils';


var DEFAULT_LOCALE_STATE_NAME = 'locale';
var DEFAULT_REDUX_STORE_KEY = 'store';

export var Translate = function (_React$Component) {
  _inherits(Translate, _React$Component);

  function Translate(props, context) {
    _classCallCheck(this, Translate);

    var _this = _possibleConstructorReturn(this, (Translate.__proto__ || Object.getPrototypeOf(Translate)).call(this, props, context));

    if (!_this.getStore()) {
      throw new Error('react-localize-redux: Unable to locate redux store in context. Ensure your app is wrapped with <Provider />.');
    }

    if (!_this.getStateSlice().languages) {
      throw new Error('react-localize-redux: cannot find languages ensure you have correctly dispatched initialize action.');
    }

    _this.state = {
      hasUpdated: false
    };

    _this.onStateDidChange = _this.onStateDidChange.bind(_this);
    _this.addDefaultTranslation();
    return _this;
  }

  _createClass(Translate, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.unsubscribeFromStore = storeDidChange(this.getStore(), this.onStateDidChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribeFromStore();
    }
  }, {
    key: 'onStateDidChange',
    value: function onStateDidChange(prevState) {
      var prevLocaleState = this.getStateSlice(prevState);
      var curLocaleState = this.getStateSlice();

      var prevActiveLanguage = getActiveLanguage(prevLocaleState);
      var curActiveLanguage = getActiveLanguage(curLocaleState);

      var prevOptions = getOptions(prevLocaleState);
      var curOptions = getOptions(curLocaleState);

      var prevTranslations = getTranslationsForActiveLanguage(prevLocaleState);
      var curTranslations = getTranslationsForActiveLanguage(curLocaleState);

      var hasActiveLangaugeChanged = prevActiveLanguage.code !== curActiveLanguage.code;
      var hasOptionsChanged = prevOptions !== curOptions;
      var hasTranslationsChanged = prevTranslations !== curTranslations;

      if (hasActiveLangaugeChanged || hasOptionsChanged || hasTranslationsChanged) {
        this.setState({ hasUpdated: true });
      }
    }
  }, {
    key: 'addDefaultTranslation',
    value: function addDefaultTranslation() {
      var locale = this.getStateSlice();
      var _props = this.props,
          id = _props.id,
          children = _props.children;


      if (children === undefined || typeof children === 'function') {
        return;
      }

      if (locale.options.ignoreTranslateChildren) {
        return;
      }

      if (id !== undefined) {
        var store = this.getStore();
        var translation = ReactDOMServer.renderToStaticMarkup(children);
        var defaultLanguage = locale.options.defaultLanguage || locale.languages[0].code;
        store.dispatch(addTranslationForLanguage(_defineProperty({}, id, translation), defaultLanguage));
      }
    }
  }, {
    key: 'getStore',
    value: function getStore() {
      var storeKey = this.context.storeKey;

      return this.context[storeKey || DEFAULT_REDUX_STORE_KEY];
    }
  }, {
    key: 'getStateSlice',
    value: function getStateSlice(myState) {
      var _context = this.context,
          getLocaleState = _context.getLocaleState,
          storeKey = _context.storeKey;

      var state = myState || this.getStore().getState();
      return getLocaleState !== undefined ? getLocaleState(state) : state[DEFAULT_LOCALE_STATE_NAME] || state;
    }
  }, {
    key: 'render',
    value: function render() {
      var translateFn = getTranslate(this.getStateSlice());
      var activeLanguage = getActiveLanguage(this.getStateSlice());
      var languages = getLanguages(this.getStateSlice());
      var _props2 = this.props,
          _props2$id = _props2.id,
          id = _props2$id === undefined ? '' : _props2$id,
          data = _props2.data,
          options = _props2.options;

      return typeof this.props.children === 'function' ? this.props.children(translateFn, activeLanguage, languages) : translateFn(id, data, options);
    }
  }]);

  return Translate;
}(React.Component);

Translate.contextTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }),
  getLocaleState: PropTypes.func,
  storeKey: PropTypes.string
};