import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {localeReducer as locale, initialize, addTranslation} from 'react-localize-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import StudiesPage from "./pages/StudiesPage";
import PatientsPage from "./pages/PatientsPage";
import StudySeriesPage from "./pages/StudySeriesPage";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(combineReducers({locale}));

const languages = [
  {name: 'English', code: 'en'},
  {name: 'Chinese', code: 'ch'}
];

const translations = {
  patient: {
      id: ['Patient ID', '患者编号'],
      patient: ['Patient', '患者'],
      patients: ['Patients', '患者'],
      name: ['Patient Name', '姓名'],
      age: ['Patient Age', '年龄'],
      birthdate: ['Patient Birthdate', '出生日期'],
      gender: ['Patient Gender', '性别'],
      anonymized: ['Anonymized', 'Anonymized'],
      imagesCount: ['Images Count', '影像数目']
  },

  study: {
      study: ['Study', '检查'],
      studies: ['Studies', 'Studies'],
      id: ['Study ID', '检查 ID'],
      date: ['Study Date', '日期'],
      description: ['Study Description', '描述'],
      modality: ['Modality', 'Modality'],
      imagesCount: ['Images Count', '影像数目'],
      referringPhysician: ['Referring Physician', 'Referring Physician'],

  },

  series: {
      series: ['Series', '序列'],
      description: ['Description', '描述'],
      modality: ['Modality', 'Modality'],
      bodyPartExamined: ['Body Part Examined', 'Body Part Examined'],
      patientPosition: ['Patient Position', '患者位置'],
      seriesNumber: ['Series Number', '序列号']
  },

  instance: ['Instance', '实例'],
  plugin: {
      plugin: ['Plugin', '插件'],
      plugins: ['Plugins', '插件'],
      name: ['Name', '名称'],
      author: ['Author', '作者'],
      version: ['Version', '版本'],
      modalities: ['Modalities', 'Modalities'],
      tags: ['Tags', '标签']
  },

  dicomNode: {
      dicomNodes: ['DICOM Servers', 'DICOM服务器'],
      name: ['Name', '名称'],
      protocol: ['Protocol', '协议'],
      aet: ['AET', 'AET'],
      remoteAet: ['Remote AET', '远程 AET'],
      remoteHost: ['Remote Host', '远程 Host'],
      remotePort: ['Remote Port', '远程 Port'],
      add: ['Add', '增加'],
      echo: ['Echo', 'Echo'],
      remoteUrl: ['Remote URL', '远程 URL'],
      instancesUrl: ['Instances URL', '实例 URL'],
      instanceFileUrl: ['Instance File URL', '远程文件 URL'],
      download: ['Download images', '下载影像']
  },

  uploadDicom: {
      uploadDicom: ['Upload images', '上传影像']
  },

  auth: {
      logOut: ['Log Out', '登出']
  },

  translation: {
      language: ['Language', '语言'],
      changeLanguage: ['Change language', '改变语言']
  },
  open: ['Open', '打开'],
  delete: ['Delete', '删除'],
  install: ['Install', '安装'],
  success: ['Success', '成功'],
  fail: ['Fail', '失败'],
  imagesCount: ['Images Count', '影像数目']
};

store.dispatch(initialize(languages, {defaultLanguage: 'en'}));
store.dispatch(addTranslation(translations));

ReactDOM.render(                                                      
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path='/studies' component={StudiesPage}/>
        <Route path='/patients' component={PatientsPage}/>
        <Route path='/studies/:id' component={StudySeriesPage}/>
      </div>
      </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();