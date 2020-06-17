import React, {Component} from 'react';
import { Card, Col, Row, Button, Layout, Menu} from 'antd';
import {Link} from "react-router-dom";
import 'antd/dist/antd.css';
import '../index.css';
import ReactDOM from 'react-dom';
import { Table, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

var cl = [0,0,0,0];
var index = 0;
class StudytoSeriesTable extends Component {;
    constructor(props) {
        super(props);
        this.setState.bind(this);
      }
      state = {
        searchText: '',
        searchedColumn: '',
        CompareList:[0,0,0,0],
        index:0,
      };

      onGetList = (id) => {
        if(index < 4){
          cl[index] = id;
          this.setState({
            CompareList: cl,
          })
          index = index + 1;
          console.log("加入对比",id, cl)
        }
        else {
          alert("只能添加四个")
        }
      }
         
      getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          ),
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };
    
    render() {
        const { Header, Content, Footer } = Layout;
        let study = this.props.data;
        console.log("获取到的类型", typeof(study))
        console.log(this.props.data.series)
    const columns = [
      {
        title: 'Series ID',
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
        render: text => (<div>            
            <Space size="middle">
              <a href={`/series/${text}`}>
                  {text}
              </a>
              <Button onClick={() => this.onGetList(text)}>加入对比</Button>
            </Space>
        </div>),
      },
      {
        title: 'Modality',
        dataIndex: 'modality',
        key: 'modality',
        ...this.getColumnSearchProps('modality'),
      },
      {
        title: 'Body Part Examined',
        dataIndex: 'body_part_examined',
        key: 'body_part_examined',
        ...this.getColumnSearchProps('body_part_examined'),
      },
      {
        title: 'Patient Position',
        dataIndex: 'patient_position',
        key: 'patient_position',
        ...this.getColumnSearchProps('patient_position'),
      },
      {
        title: 'Series Number',
        dataIndex: 'series_number',
        key: 'series_number',
        ...this.getColumnSearchProps('series_number'),
      },
      {
        title: 'Image Count',
        dataIndex: 'images_count',
        key: 'images_count',
        //...this.getColumnSearchProps('images_count'),
      },
    ];

    const list = this.state.CompareList;
    console.log("跳转名单",list)
        return (
            <div>
                {/* <p>{study.patient_name}</p>              */}
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
                            <Link to='/api/dcm/upload'>DICOMServer</Link>
                        </Menu.Item>
                        </Menu>
                    </Header>
                    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                        
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                            <Row style={ {background: 'lightgrey' , padding: '30px'}}>
                                <Col span={12}>
                                    <Card title="Patient" bordered={false}>
                                        <h5>Patient Name: {study.patient_name}</h5>
                                        <h5>Patient ID: {study.patient_id}</h5>
                                        <h5>Patient Gender: {study.patient_gender}</h5>
                                        <h5>Patient Age: {study.patient_age}</h5>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="Study" bordered={false}>
                                        <h5>Study Description: {study.study_description}</h5>
                                        <h5>Study Date: {study.study_date}</h5>
                                        <h5>Referring Physician: {study.study_referring_physician}</h5>
                                        <h5>&nbsp;</h5>
                                    </Card>
                                </Col>                               
                            </Row>
                            <Table columns={columns} dataSource={this.props.data.series}/>
                            <Button size={"large"} type={"primary"} style={{margin:"0px 0px 0px 10px"}} href={`/miniseries/${list[0]}/${list[1]}/${list[2]}/${list[3]}`} >提交对比</Button>

                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>2020 PACS-VTS</Footer>
                </Layout>
            </div>
            
        )
        
    }
}
export default StudytoSeriesTable;