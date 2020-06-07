import React, {Component} from 'react';
import StudiesService from "../services/DicomService";
import StudiesTable from '../components/StudiesTable';


//初始化需要再此页面显示表格的数组  

class StudiesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studies: [],
            showList: [],
        };
        this.setState.bind(this);
    }


    componentWillMount() {
        StudiesService.findStudies(studyList => {
            const show=[];
            console.log("获取到studies了")
            console.log(studyList);
            studyList.map(study => {
                show.push({
                    patient_name: study.patient["patient_name"],
                    study_id: study.id,
                    study_description: study.study_description,
                    modality: study.modalities[0],
                    images_count: study.images_count,
                })
            });
            this.setState({
                studies: studyList,
                showList: show})
        });
    }

    render() { 
        return (
            <div>
                <StudiesTable data={this.state.showList}/>
            </div>
        )
    }
}


export default StudiesPage;