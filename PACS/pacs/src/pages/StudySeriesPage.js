import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import StudiesTable from '../components/StudiesTable';
import StudiesService from "../services/DicomService";
import StudySeriesTable from '../components/StudySeriesTable';


class StudySeriesPage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                studies: [],
                showList: [],
                studyId: props.match.params.id,
            };
            
            this.setState.bind(this);
        }
    
        componentWillMount() {
            
            console.log("开始获取series")
            console.log("id如下");
            console.log(this.state.studyId);
            StudiesService.findStudyById(this.state.studyId, study => {
                console.log("找到series了 如下")

                console.log(study);
                    const show = ({
                        patient_name: study.patient["patient_name"],
                        patient_id: study.patient["patient_id"],
                        patient_gender: study.patient["patient_sex"],
                        patient_age: study.patient["patient_age"],
                        study_description: study.study_description,
                        study_date: study.study_date,
                        study_referring_physician: study.study_referring_physician,
                        series_id: study.id,
                        series_modality: study.series["0"]["modality"],
                        series_body_part_examined: study.series["0"]["body_part_examined"],
                        series_patient_position: study.series["0"]["patient_position"],
                        series_number: study.series["0"]["series_number"],
                        series_images_count: study.series["0"]["images_count"],
                    })
                console.log(show)   
                this.setState({
                    studies: study,
                    showList: show})
            });
            
            
    
        }
    
        render() {
            const studies = this.state.studies;
            console.log("showlist",this.state.showList)
            return (
                <div>
                    <StudySeriesTable data={this.state.showList}/>
                </div>
            )
        }
    }
    
    
    export default StudySeriesPage;