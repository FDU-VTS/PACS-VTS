'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localize = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _locale = require('./locale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(slice, getStateSlice) {
  return function (state) {
    var scopedState = getStateSlice ? getStateSlice(state) : slice && state[slice] || state;

    var language = (0, _locale.getActiveLanguage)(scopedState);
    var currentLanguage = language ? language.code : undefined;
    var translate = (0, _locale.getTranslate)(scopedState);

    return {
      currentLanguage: currentLanguage,
      translate: translate
    };
  };
};
var localize = exports.localize = function localize(Component) {
  var slice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var getStateSlice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return (0, _reactRedux.connect)(mapStateToProps(slice, getStateSlice))(Component);
};