import React from 'react';
import { Layout, Button, Menu, Dropdown} from 'antd';
import {
    BankOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CaretRightOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    RedoOutlined,
    UndoOutlined,
    DownOutlined
  } from '@ant-design/icons';
import {Link} from "react-router-dom";
import DicomViewer from './DicomViewer';

// http://315v841f37.zicp.vip/
const menu1 = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href=" ">
          it's ok
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a >
      </Menu.Item>
    </Menu>
  );
const menu2 = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a >
      </Menu.Item>
    </Menu>
  );
  const menu3 = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a >
      </Menu.Item>
    </Menu>
  );
  const menu4 = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a >
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a >
      </Menu.Item>
    </Menu>
  );
class SeriesViewerTable extends React.Component {
    constructor(props) {
        super(props);
        this.setState.bind(this);
        this.onNextInstance = this.props.onNextInstance || function () {
        };
        this.onPrevInstance = this.props.onPrevInstance || function () {
        };
        this.onPlay = this.props.onPlay || function () {
        };
        this.onZoomin = this.props.onZoomin || function () {
        };
        this.onZoomout = this.props.onZoomout || function () {
        };
        this.onRotateLeft = this.props.onRotateLeft || function () {
        };
        this.onRotateRight = this.props.onRotateRight || function () {
        };
      }
      
      render() {
        const { Header, Content } = Layout;
        const buttonstyle = {color:'white', fontSize:30};
        const searchbuttonstyle = {color:'white', fontSize:25};
        const searchstyle = {color:"white",fontSize:"20px"};
        return (
          <div>
             <Layout>
              <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
                <Menu theme="dark" mode="horizontal">
                <Menu.Item>
                  <Link to='/studies'>
                      <BankOutlined style={buttonstyle}/>               
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <ArrowLeftOutlined style={buttonstyle} onClick={this.onPrevInstance}/>
                </Menu.Item>
                <Menu.Item>
                  <ArrowRightOutlined style={buttonstyle} onClick={this.onNextInstance}/>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={menu1}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                      广告位招租1<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={menu2}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                      广告位招租2<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={menu3}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                      广告位招租3<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <CaretRightOutlined style={buttonstyle} onClick={this.onPlay}/>
                </Menu.Item>
                <Menu.Item>
                  <ZoomInOutlined style={buttonstyle} onClick={this.onZoomin}/>
                </Menu.Item>
                <Menu.Item>
                  <ZoomOutOutlined style={buttonstyle} onClick={this.onZoomout}/>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={menu4}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                      广告位招租4<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <RedoOutlined style={buttonstyle} onClick={this.onRotateLeft}/>
                </Menu.Item>
                <Menu.Item>
                  <UndoOutlined style={buttonstyle} onClick={this.onRotateRight}/>
                </Menu.Item>
                </Menu>
              </Header>
              <Content style={{backgroundColor:"black"}}>
                <br></br>
                <br></br>
                <br></br>
              </Content>
            </Layout>           
          </div>
          )
      }
}
export default SeriesViewerTable;