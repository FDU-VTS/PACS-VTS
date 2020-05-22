import React, {Component} from 'react';
import { Card, Col, Row } from 'antd';
import { Layout, Menu } from 'antd';
import {Link} from "react-router-dom";
import 'antd/dist/antd.css';
import '../index.css';


class StudySeriesTable extends Component {;
    constructor(props) {
        super(props);
        this.setState.bind(this);
      }
    render() {
        const { Header, Content, Footer } = Layout;
        let study = this.props.data;
        console.log("获取到的类型", typeof(study))
        return (
            <div>
                {/* <p>{study.patient_name}</p >              */}
                <Layout>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <div className="logo" />
                        <Menu theme="dark" mode="horizontal" >
                        <Menu.Item key="1" >
                            <Link to='/patients'>Patients</Link>
                        </Menu.Item>
                        <Menu.Item key="2" >
                            <Link to='/studies'>Studies</Link>
                        </Menu.Item>
                        <Menu.Item key="3" >
                            <Link to='/dicom_nodes'>DICOMServer</Link>
                        </Menu.Item>
                        </Menu>
                    </Header>
                    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                        
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                            <Row gutter={16} style={ {background: 'grey' , padding: '40px'}}>
                                <Col span={8}>
                                    <Card title="Patient" bordered={false}>
                                    <h5>Patient Name: {study.patient_name}</h5>
                                    <h5>Patient ID: {study.patient_id}</h5>
                                    <h5>Patient Gender: {study.patient_gender}</h5>
                                    <h5>Patient Age: {study.patient_age}</h5>
                                    <br />
                                    <br />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Study" bordered={false}>
                                    <h5>Study Description: {study.study_description}</h5>
                                    <h5>Study Date: {study.study_date}</h5>
                                    <h5>Referring Physician: {study.study_referring_physician}</h5>
                                    <br />
                                    <br />
                                    <br />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Series " bordered={false}>
                                    <h5>Series ID: {study.series_id}</h5>
                                    <h5>Description: {study.study_description}</h5>
                                    <h5>Modality: {study.series_modality}</h5>
                                    <h5>Body Part Examined: {study.series_body_part_examined}</h5>
                                    <h5>Series Number: {study.series_number}</h5>
                                    <h5>Images Count: {study.series_images_count}</h5>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>PACS-VTS</Footer>
                </Layout>
            </div>
            
        )
        
    }
}
export default StudySeriesTable;