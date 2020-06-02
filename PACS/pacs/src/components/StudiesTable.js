import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Table, Input, Button, Space } from 'antd';
import { Layout, Menu } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";



class StudiesTable extends React.Component {
  constructor(props) {
    super(props);
    this.setState.bind(this);
  }                                                                                                                                                                                                                                                                                                                                                                                  
  state = {
    searchText: '',
    searchedColumn: '',
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
    console.log(this.props.data)
    const columns = [
      {
        title: 'Patient Name',
        dataIndex: 'patient_name',
        key: 'patient_name',
        width: '15%',
        ...this.getColumnSearchProps('patient_name'),
      },
      {
        title: 'Study ID',
        dataIndex: 'study_id',
        key: 'study_id',
        width: '35%',
        ...this.getColumnSearchProps('study_id'),
        render: text => (<div>
          <a href = {`/studies/${text}`}>
            {text}
          </a>
        </div>),
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
    const { Header, Content, Footer } = Layout;
    return (
      <div>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
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
                <Table columns={columns} dataSource={this.props.data} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>2020 PACS-VTS</Footer>
        </Layout>
      </div>
      )
  }
}



export default StudiesTable;
