import React, {Component} from 'react';
import StudiesService from "../services/DicomService";
import StudytoSeriesTable from '../components/StudytoSeriesTable';


//初始化需要再此页面显示表格的数组  

class StudytoSeriesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            showList: [],
            studyId: props.match.params.id,
        };
        this.setState.bind(this);
    }

    componentWillMount() {           
        // console.log("开始获取series")
        // console.log("id如下");
        // console.log(this.state.studyId);
        StudiesService.findStudyById(this.state.studyId, study => {
            // console.log("找到series了 如下")
            // console.log(study);          
            const show = ({
                    patient_name: study.patient["patient_name"],
                    patient_id: study.patient["patient_id"],
                    patient_gender: study.patient["patient_sex"],
                    patient_age: study.patient["patient_age"],
                    study_description: study.study_description,
                    study_date: study.study_date,
                    study_referring_physician: study.study_referring_physician,
                    series: study.series,
                });
            // console.log(show)   
            this.setState({
                series: study,
                showList: show})
        });
    }

    render() { 
        return (
            <div>
                <StudytoSeriesTable data={this.state.showList}/>
            </div>
        )
    }
}


export default StudytoSeriesPage;