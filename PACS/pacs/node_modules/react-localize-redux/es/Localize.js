import React from 'react';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from './locale';


var mapStateToProps = function mapStateToProps(slice, getStateSlice) {
  return function (state) {
    var scopedState = getStateSlice ? getStateSlice(state) : slice && state[slice] || state;

    var language = getActiveLanguage(scopedState);
    var currentLanguage = language ? language.code : undefined;
    var translate = getTranslate(scopedState);

    return {
      currentLanguage: currentLanguage,
      translate: translate
    };
  };
};

export var localize = function localize(Component) {
  var slice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var getStateSlice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return connect(mapStateToProps(slice, getStateSlice))(Component);
};