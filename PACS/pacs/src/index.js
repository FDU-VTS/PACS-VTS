import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {localeReducer as locale, initialize, addTranslation} from 'react-localize-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import StudiesPage from "./pages/StudiesPage";
import PatientsPage from "./pages/PatientsPage";
import StudySeriesPage from "./pages/StudySeriesPage";
import SeriesViewerPage from "./pages/SeriesViewerPage";
import Three from "./pages/Three"
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(combineReducers({locale}));

ReactDOM.render(                                                      
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path='/studies' component={StudiesPage}/>
        <Route path='/patients' component={PatientsPage}/>
        <Route path='/studies/:id' component={StudySeriesPage}/>
        <Route path='/seriesviewer' component={SeriesViewerPage}/>
        <Route path='/three' component={Three}/>
      </div>
      </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();