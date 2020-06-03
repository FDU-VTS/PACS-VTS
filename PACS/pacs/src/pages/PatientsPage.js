import React, {Component} from 'react';
import StudiesService from "../services/DicomService";
import PatientsTable from '../components/PatientsTable';


//初始化需要再此页面显示表格的数组  

class PatientsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studies: [],
            showList: [],
        };
        this.setState.bind(this);
    }

    
    componentWillMount() {
        
        console.log("开始获取Patients")
        
            StudiesService.findPatients(studyList => {
                const show=[];
                console.log("找到Patients了 如下")
                console.log(studyList);
                studyList.map(study => {
                    //for(var i=0;i<100000;i++){
                        show.push({
                            patient_name: study.patient_name,
                            patient_id: study.patient_id,
                            patient_sex: study.patient_sex,
                            patient_birthdate: study.patient_birthdate,
                            patient_age: study.patient_age,
                            images_count: study.images_count,
                        })
                    //}
                    show.push({
                        patient_name: study.patient_name,
                        patient_id: study.patient_id,
                        patient_sex: study.patient_sex,
                        patient_birthdate: study.patient_birthdate,
                        patient_age: study.patient_age,
                        images_count: study.images_count,
                    })
                });
                this.setState({
                    studies: studyList,
                    showList: show})
            });

        
        

    }

    render() {
        const studies = this.state.studies;    
        return (
            <div>
                <PatientsTable data={this.state.showList}/>
            </div>
        )
    }
}


export default PatientsPage;