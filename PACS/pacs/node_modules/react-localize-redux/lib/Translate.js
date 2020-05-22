'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translate = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _locale = require('./locale');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_LOCALE_STATE_NAME = 'locale';
var DEFAULT_REDUX_STORE_KEY = 'store';

var Translate = exports.Translate = function (_React$Component) {
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
      this.unsubscribeFromStore = (0, _utils.storeDidChange)(this.getStore(), this.onStateDidChange);
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

      var prevActiveLanguage = (0, _locale.getActiveLanguage)(prevLocaleState);
      var curActiveLanguage = (0, _locale.getActiveLanguage)(curLocaleState);

      var prevOptions = (0, _locale.getOptions)(prevLocaleState);
      var curOptions = (0, _locale.getOptions)(curLocaleState);

      var prevTranslations = (0, _locale.getTranslationsForActiveLanguage)(prevLocaleState);
      var curTranslations = (0, _locale.getTranslationsForActiveLanguage)(curLocaleState);

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
        var translation = _server2.default.renderToStaticMarkup(children);
        var defaultLanguage = locale.options.defaultLanguage || locale.languages[0].code;
        store.dispatch((0, _locale.addTranslationForLanguage)(_defineProperty({}, id, translation), defaultLanguage));
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
      var translateFn = (0, _locale.getTranslate)(this.getStateSlice());
      var activeLanguage = (0, _locale.getActiveLanguage)(this.getStateSlice());
      var languages = (0, _locale.getLanguages)(this.getStateSlice());
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
  store: _propTypes2.default.shape({
    subscribe: _propTypes2.default.func.isRequired,
    dispatch: _propTypes2.default.func.isRequired,
    getState: _propTypes2.default.func.isRequired
  }),
  getLocaleState: _propTypes2.default.func,
  storeKey: _propTypes2.default.string
};