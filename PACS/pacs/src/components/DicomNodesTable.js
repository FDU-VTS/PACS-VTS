import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Layout, Menu } from 'antd';
import {Link} from "react-router-dom";
import { UploadOutlined, 
         DeleteOutlined,
         MenuUnfoldOutlined,
        MenuFoldOutlined,
        PieChartOutlined,
        DesktopOutlined,
        ContainerOutlined, } from '@ant-design/icons';
import { Upload, Button } from 'antd';
import { Table, Input, Space,Tabs, Select} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


class DicomNodesTable extends React.Component {
  constructor(props) {
    super(props);
    this.setState.bind(this);
    this.onAddDicomNode = this.props.onAddDicomNode || function () {
    };
    this.onDeleteDicomNode = this.props.onDeleteDicomNode || function () {
    };
  }
  state = {
    collapsed: false,
    searchText: '',
    searchedColumn: '',
    tabPosition: 'left',
  };

  changeTabPosition = tabPosition => {
    this.setState({ tabPosition });
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

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
    const columns_patients = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
        render: text => (<div>            
          <Space size="middle">
            <a>{text}</a>
            <Button onClick={() => this.onDeleteDicomNode(text)}>Delete</Button>
          </Space>
      </div>),
      },
      {
        title: 'Patient ID',
        dataIndex: 'patient_id',
        key: 'patient_id',
        ...this.getColumnSearchProps('patient_id'),
      },
      {
        title: 'Patient Name',
        dataIndex: 'patient_name',
        key: 'patient_name',
        ...this.getColumnSearchProps('patient_name'),
      },
      {
        title: 'Patient Gender',
        dataIndex: 'patient_sex',
        key: 'patient_sex',
        ...this.getColumnSearchProps('patient_sex'),
      },
      {
        title: 'Patient Birthdate',
        dataIndex: 'patient_birthdate',
        key: 'patient_birthdate',
        ...this.getColumnSearchProps('patient_birthdate'),
      },
      {
        title: 'Patient Age',
        dataIndex: 'patient_age',
        key: 'patient_age',
        ...this.getColumnSearchProps('patient_age'),
      },
      {
        title: 'Images Count',
        dataIndex: 'images_count',
        key: 'images_count',
        //...this.getColumnSearchProps('images_count'),
      },
    ];
    const columns_studies = [
      {
        title: 'Study ID',
        dataIndex: 'study_id',
        key: 'study_id',
        ...this.getColumnSearchProps('study_id'),
        render: text => (<div>            
          <Space size="middle">
            <a>{text}</a>
            <Button onClick={() => this.onDeleteDicomNode(text)}>Delete</Button>
          </Space>
      </div>),
      },
      {
        title: 'Patient Name',
        dataIndex: 'patient_name',
        key: 'patient_name',
        ...this.getColumnSearchProps('patient_name'),
      },
      {
        title: 'Patient ID',
        dataIndex: 'patient_id',
        key: 'patient_id',
        ...this.getColumnSearchProps('patient_id'),
      },
      {
        title: 'Study Description',
        dataIndex: 'study_description',
        key: 'study_description',
        ...this.getColumnSearchProps('study_description'),
      },
      {
        title: 'Modality',
        dataIndex: 'modality',
        key: 'modality',
        ...this.getColumnSearchProps('modality'),
      },
      {
        title: 'Images Count',
        dataIndex: 'images_count',
        key: 'images_count',
        //...this.getColumnSearchProps('images_count'),
      },
    ];
    const columns_series = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
        render: text => (<div>            
          <Space size="middle">
            <a>{text}</a>
            <Button onClick={() => this.onDeleteDicomNode(text)}>Delete</Button>
          </Space>
      </div>),
      },
      {
        title: 'Patient Position',
        dataIndex: 'patient_position',
        key: 'patient_position',
        ...this.getColumnSearchProps('patient_position'),
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
        title: 'Series Number',
        dataIndex: 'series_number',
        key: 'series_number',
        ...this.getColumnSearchProps('series_number'),
      },
      {
        title: 'Protocol Name',
        dataIndex: 'protocol_name',
        key: 'protocol_name',
        ...this.getColumnSearchProps('protocol_name'),
      },
      {
        title: 'Images Count',
        dataIndex: 'images_count',
        key: 'images_count',
        //...this.getColumnSearchProps('images_count'),
      },
    ];
    const { Header, Content, Footer, Sider } = Layout;
    const { TabPane } = Tabs;
    // console.log("patientdata");
    // console.log(this.props.patientdata)
    // console.log(Menu.Item.selectedKeys);
    return (
        <div>
           <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['3']}>
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
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><UploadOutlined />
                      UPLOAD
                      </span>} key="1">
                        <Upload>
                            <Button>
                            <UploadOutlined onClick={this.onAddDicomNode}/> Upload
                            </Button>
                        </Upload>
                    </TabPane>
                    <TabPane tab={<span><DeleteOutlined />
                      DELETE
                    </span>} key="2">
                    <Tabs tabPosition={this.state.tabPosition}>
                      <TabPane tab="Patients" key="1">
                        <Table columns={columns_patients} dataSource={this.props.patientsdata} />
                      </TabPane>
                      <TabPane tab="Studies" key="2">
                        <Table columns={columns_studies} dataSource={this.props.studiesdata} />
                      </TabPane>
                      <TabPane tab="Series" key="3">
                        <Table columns={columns_series} dataSource={this.props.seriesdata} />
                      </TabPane>
                    </Tabs>
                    </TabPane>
                </Tabs>   
        
             </Content>
             <Footer style={{ textAlign: 'center' }}>2020 PACS-VTS</Footer>
            </Layout>
        
        </div>
        )
  }
}



export default DicomNodesTable;