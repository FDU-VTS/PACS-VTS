import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {localeReducer as locale, initialize, addTranslation} from 'react-localize-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import StudiesPage from "./pages/StudiesPage"
import PatientsPage from "./pages/PatientsPage"
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import StudySeriesPage from "./pages/StudySeriesPage"
import Three from "./pages/Three"
import SeriesViewerPage from "./pages/SeriesViewerPage"
import StudytoSeriesPage from "./pages/StudytoSeriesPage"
import SeriesViewerminiPage from "./pages/SeriesViewerminiPage"
import PatienttoStudyPage from "./pages/PatienttoStudyPage"
import DicomNodesPage from "./pages/DicomNodesPage";
import Test from "./pages/Test"
// import Slider from './components/Slider'

const store = createStore(combineReducers({locale}));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path='/studies' component={StudiesPage}/>
        <Route path='/patients' component={PatientsPage}/>
        <Route path='/patienttostudy/:id' component={PatienttoStudyPage}/>
        <Route path='/app' component={App}/>
        <Route path='/studies/:id' component={StudySeriesPage}/>
        <Route path='/series/:id' component={SeriesViewerPage}/>
        <Route path='/studiestoseries/:id' component={StudytoSeriesPage}/>
        <Route path='/api/dcm/upload' component={DicomNodesPage}/>
        <Route path='/miniseries/:id1/:id2/:id3/:id4' component={SeriesViewerminiPage}/>
        <Route path='/threetest' component={Three}/>
        <Route path='/test' component={Test}/>
        <Route exact path='/' component={PatientsPage}/>
      </div>
      </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
 // "proxy": "http://315v841f37.zicp.vip/",