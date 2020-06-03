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
const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
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
        this.onPlay = this.props.onPlay || function() {
        };
      }
      
      render() {
        const { Header, Content } = Layout;
        const buttonstyle = {color:'white', fontSize:30,width:60};
        const searchbuttonstyle = {color:'white', fontSize:25};
        const searchstyle = {color:"white",fontSize:"25px", width:"100px"};
        return (
          <div>
             <Layout>
              <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
                <Link to='/studies'>
                    <BankOutlined style={buttonstyle}/>               
                </Link>
                <ArrowLeftOutlined style={buttonstyle} onClick={this.onPrevInstance}/>
                <ArrowRightOutlined style={buttonstyle} onClick={this.onNextInstance}/>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;广告位招租1<DownOutlined style={searchbuttonstyle}/>
                    &nbsp;&nbsp;&nbsp;</a>
                </Dropdown>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color:"white",
                fontSize:"25px"}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;广告位招租2<DownOutlined style={searchbuttonstyle}/>
                    &nbsp;&nbsp;&nbsp;</a>
                </Dropdown>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color:"white",
                fontSize:"25px"}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;广告位招租3<DownOutlined style={searchbuttonstyle}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;</a>
                </Dropdown>
                <CaretRightOutlined style={buttonstyle} onClick={this.onPlay}/>
                <ZoomInOutlined style={buttonstyle} onClick={this.onZoomin}/>
                <ZoomOutOutlined style={buttonstyle} onClick={this.onZoomout}/>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color:"white",
                fontSize:"25px"}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;广告位招租4<DownOutlined style={searchbuttonstyle}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;</a>
                </Dropdown>
                <RedoOutlined style={buttonstyle} onClick={this.onRotateLeft}/>
                <UndoOutlined style={buttonstyle} onClick={this.onRotateRight}/>
              </Header>
              <Content>
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