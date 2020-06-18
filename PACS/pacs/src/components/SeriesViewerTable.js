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
    DownOutlined,
    StepForwardOutlined,
    FastForwardOutlined,
    ControlOutlined
  } from '@ant-design/icons';
import {Link} from "react-router-dom";
import DicomViewer from './DicomViewer';

// http://315v841f37.zicp.vip/

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
        this.onMPlay = this.props.onMPlay || function () {
        };
        this.onFPlay = this.props.onFPlay || function () {
        };
        this.onZoomin = this.props.onZoomin || function () {
        };
        this.onZoomout = this.props.onZoomout || function () {
        };
        this.onRotateLeft = this.props.onRotateLeft || function () {
        };
        this.onRotateRight = this.props.onRotateRight || function () {
        };
        this.onSetColorScale = this.props.onSetColorScale || function () {
        };
        this.onPlugin = this.props.onPlugin || function () {
        };
      }
      
      render() {
        const menu1 = (
          <Menu>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale("main")}>
                main
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale("heatmap")}>
                heatmap
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('inverseHeatmap')}>
                inverseHeatmap
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('hotRed')} >
                hotRed
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('hotGreen')} >
                hotGreen
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('hotBlue')}>
                hotBlue
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('inverse')}>
                inverse
              </a >
            </Menu.Item>
          </Menu>
        );
        const menu2 = (
          <Menu>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale("main")}>
                main
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('sobel')}>
                sobel
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('sharpen')} >
                sharpen
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('emboss')} >
                emboss
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('laplacian')}>
                laplacian
              </a >
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onSetColorScale('medianBlur')}>
                medianBlur
              </a >
            </Menu.Item>
          </Menu>
        );
        console.log("plugins3",this.props.data);
        const ids = [];
        this.props.data.map(plugin=>{
          ids.push({
            singleid:plugin.plugin_id
          });
        })
        console.log("id",ids[0],"+",ids[1]);
        const id1=ids[0]
          const menu3 = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onPlugin(this.props.instance.id)}>
                  fcm
                </a >
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={()=>this.onPlugin(this.props.instance.id)}>
                  kmeans
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
                      Color<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={menu2}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                      Filter<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={menu3}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={searchstyle}>
                      Plugins<DownOutlined style={searchbuttonstyle}/>
                      </a >
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <CaretRightOutlined style={buttonstyle} onClick={this.onPlay}/>
                </Menu.Item>
                <Menu.Item>
                  <StepForwardOutlined style={buttonstyle} onClick={this.onMPlay}/>
                </Menu.Item>
                <Menu.Item>
                  <FastForwardOutlined style={buttonstyle} onClick={this.onFPlay}/>
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