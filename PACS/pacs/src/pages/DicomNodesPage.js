import React, {Component} from 'react';
import StudiesService from "../services/DicomService";
import * as axios from "axios";
import DicomNodesTable from '../components/DicomNodesTable'


class DicomNodesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dicomNodes: [],
            newDicomNode: {},
            patients: [],
            studies: [],
            patientsList: [],
            studiesList: []
        };
        this.setState = this.setState.bind(this);
    }

    componentDidMount() {
        
    }
    componentWillMount() {
        
        // console.log("开始获取Patients")
        
            StudiesService.findPatients(patientList => {
                const show=[];
                // console.log("找到Patients了 如下")
                // console.log(patientList);
                patientList.map(study => {
                    //for(var i=0;i<100000;i++){
                        show.push({
                            id: study.id,
                            patient_name: study.patient_name,
                            patient_id: study.patient_id,
                            patient_sex: study.patient_sex,
                            patient_birthdate: study.patient_birthdate,
                            patient_age: study.patient_age,
                            images_count: study.images_count,
                        })
                    //}
                });
                this.setState({
                    patients: patientList,
                    patientsList: show})
            });

            StudiesService.findStudies(studyList => {
                const show=[];
                // console.log("获取到studies了")
                // console.log(studyList);
                studyList.map(study => {
                    show.push({
                        patient_id: study.patient["patient_id"],
                        patient_name: study.patient["patient_name"],
                        study_id: study.id,
                        study_description: study.study_description,
                        modality: study.modalities[0],
                        images_count: study.images_count,
                    })
                });
                this.setState({
                    studies: studyList,
                    studiesList: show})
            });

            StudiesService.findSeries(serieList => {
                const show=[];
                // console.log("获取到series了")
                // console.log(serieList);
                serieList.map(series => {
                    show.push({
                        id:series.id,
                        patient_position:series.patient_position,
                        modality:series.modality,
                        body_part_examined:series.body_part_examined,
                        series_number:series.series_number,
                        protocol_name:series.protocol_name,
                        images_count:series.images_count
                    })
                });
                this.setState({
                    series: serieList,
                    seriesList: show})
            });
    }
    onAddDicomNode = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const params = this.state.newDicomNode;
        params[name] = value;
        this.setState({
            newDicomNode: params
        })
        const newDicomNode = this.state.newDicomNode;
        // console.log("上传了");
        axios.post('/api/dcm/upload', JSON.stringify(newDicomNode),
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'text/html; charset=UTF-8',
                    'Accept': 'application/octet-stream'
                }
            }
        )
    };

    onDeleteDicomNode = (dicomNode) => {
        axios.delete(
            `/api/patients/${dicomNode}`
        )
    };

    onDownloadImages = (dicomNode) => {
        
    };

    render() {

        return (
            <div>
                <DicomNodesTable onAddDicomNode={this.onAddDicomNode} onDeleteDicomNode={this.onDeleteDicomNode}
                patientsdata={this.state.patientsList} studiesdata={this.state.studiesList}
                seriesdata={this.state.seriesList}/>
            </div>
        )
    }
}

export default DicomNodesPage;