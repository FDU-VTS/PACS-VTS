import React, {Component} from 'react';
import DicomService from '../services/DicomService';
import PluginsService from "../services/PluginsService";
import DicomViewer from '../components/DicomViewer';
import SeriesViewerTable from '../components/SeriesViewerTable';
import SliderIn from '../components/SliderIn'
import {Grid} from "semantic-ui-react";
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import * as axios from 'axios';
import { ControlOutlined } from '@ant-design/icons';
// const THREE = window.THREE = require('three');

class SeriesViewerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instances: [],
            seriesId: props.match.params.id,
            instanceTags: {},
            index: 0,
            instance: {},
            showTags: false,
            playTimerId: null,
            isLoaded: false,
            rotation: null,
            colorScale: 'main',
            animation: false,
            viewMode: 'one',
            animationId: undefined,
            ifzoom: null,
            flagzoom:false,
            ifplay:false,
            installedPlugins:[],
            rtx:'off',
            measure:'clear',
        };
        this.setState = this.setState.bind(this);
    }

    componentWillMount() {
        const seriesId = this.state.seriesId;
        const index = this.state.index;
        if(!this.state.isLoaded) {

            DicomService.findInstancesBySeriesId(seriesId, instances => {
                this.setState({instances: instances, isLoaded:true,});
                // console.log("instances1",this.state.instances);
            })
            
        }
        const show = [];
        PluginsService.findPlugins(Plugins => {
            // installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
            //     pluginsMap[plugin.name] = plugin;
            //     return pluginsMap;
            // }, {});
            // console.log("plugins",Plugins);
            Plugins.map(plugin => {
                show.push({
                    plugin_id: plugin.id,
                    plugin_name: plugin.name,
                });
            })           
            this.setState({installedPlugins:show});
            //console.log("plugins2",this.state.installedPlugins);
        });

    }

    onClear = () => {
        this.setState({rtx:'off',
                    measure:'clear'})
    }

    onDistance = () => {
        this.setState({rtx:'on',
                    measure:'distance'})
    }

    onAngle = () => {
        this.setState({rtx:'on',
                    measure:'angle'})
    }

    onArea = () => {
        this.setState({rtx:'on',
                    measure:'area'})
    }

    onPlugin = (instanceid) => {
            axios.post(
                `/api/instances/${instanceid}/process/by_plugin/3/image`,{
                    headers:{
                        'Content-Type':'image/jpeg'
                    }
                }
            ).then((response)=>{
                // console.log("newinstance",response);
                const seriesId = this.state.seriesId;
                DicomService.findInstancesBySeriesId(seriesId, instances => {
                    this.setState({instances: instances, isLoaded:true,});
                    // console.log("instances2",this.state.instances);
                })
                const show = [];
                PluginsService.findPlugins(Plugins => {
                    // installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                    //     pluginsMap[plugin.name] = plugin;
                    //     return pluginsMap;
                    // }, {});
                    // console.log("plugins",Plugins);
                    Plugins.map(plugin => {
                        show.push({
                            plugin_id: plugin.id,
                            plugin_name: plugin.name,
                        });
                    })           
                    this.setState({installedPlugins:show});
                    //console.log("plugins2",this.state.installedPlugins);
                });
            }).catch((err) => {
                alert(err.response.data['message']);
                this.setState({});
            })
        //}
        
    };

    setInstance = (indexInput) => {
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (indexInput > instancesCount)
            return;
        else
            this.setState({index: indexInput, rotation: null});
        this.setState({flagzoom: false});
    }

    setColorScale = (inputText) => {
        this.setState({colorScale: inputText,});
    }

    nextInstance = () => {
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index: 0, rotation: null});
        else
            this.setState({index: currentInstanceId + 1, rotation: null});
        this.setState({flagzoom: false});
    };

    prevInstance = () => {
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId === 0) {
            this.setState({index: instancesCount - 1, rotation: null});
        }
        else {
            this.setState({index: currentInstanceId - 1, rotation: null});
        }
        this.setState({flagzoom: false});
    };

    play = () => {
        if(!this.state.ifplay){
            this.setState({ifplay:true});  
            this.setState({flagzoom: false});      
            this.timer = setInterval(() => {(
                this.nextInstance()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay:false})}
        this.setState({flagzoom: false});
    };

    mplay = () => {
        if(!this.state.ifplay){
            this.setState({ifplay:true});  
            this.setState({flagzoom: false});      
            this.timer = setInterval(() => {(
                this.mnextInstance()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay:false})}
        this.setState({flagzoom: false});
    };

    fplay = () => {
        if(!this.state.ifplay){
            this.setState({ifplay:true});  
            this.setState({flagzoom: false});      
            this.timer = setInterval(() => {(
                this.fnextInstance()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay:false})}
        this.setState({flagzoom: false});
    };

    mnextInstance = () => {
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 3 >= instancesCount)
            this.setState({index: 0, rotation: null});
        else
            this.setState({index: currentInstanceId + 3, rotation: null});
        this.setState({flagzoom: false});
    };

    fnextInstance = () => {
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 5 >= instancesCount)
            this.setState({index: 0, rotation: null});
        else
            this.setState({index: currentInstanceId + 5, rotation: null});
        this.setState({flagzoom: false});
    };


    zoomin = () => {
        this.setState({ifzoom: 'in',flagzoom:true});
    };

    zoomout = () => {
        this.setState({ifzoom: 'out',flagzoom:true});
    };

    rotateLeft = () => {
        this.setState({rotation: 'left',flagzoom:false});
    };

    rotateRight = () => {
        this.setState({rotation: 'right',flagzoom:false});
    };
    setColorScale = (color) => {
        this.setState({colorScale: color});
    };

    render() {
        // console.log(this.state.instances)
        const index = this.state.index;
        const instances = this.state.instances;
        const instance = instances[index]
        const instance2 = instances[index+1]
        // const seriesId = instance.id;
        if(instances && instances.length > 0){
            // console.log("测试",instances,instance,instance.id);
        }
        const viewerProps = {
            style: {
                height: window.innerHeight
            },
            colorScale: this.state.colorScale,
            rotation:this.state.rotation,
            ifzoom:this.state.ifzoom,
            flagzoom:this.state.flagzoom,
            ifplay:this.state.ifplay,
            rtx:this.state.rtx,
            measure:this.state.measure,
        };
        const instanceLength = (this.state.instances || []).length;
        
        return (
            <div style={{background:"black"}} tabIndex={'0'} >
                {/* 把一个instance传过去 */}
                {/* <SliderIn onSetInstance={this.setInstance} maxValue={instanceLength}/> */}
                <SeriesViewerTable data={this.state.installedPlugins} instance={instance} 
                onClear = {this.onClear}
                onDistance = {this.onDistance}
                onAngle = {this.onAngle}
                onArea = {this.onArea}
                onPlugin={this.onPlugin}
                onPrevInstance={this.prevInstance} onNextInstance={this.nextInstance} 
                onPlay={this.play} onZoomin={this.zoomin} onZoomout={this.zoomout}
                onRotateLeft={this.rotateLeft} onRotateRight={this.rotateRight} onMNextInstance={this.mnextInstance} onFNextInstance={this.fnextInstance} 
                onPlay={this.play} onMPlay={this.mplay} onFPlay={this.fplay} onSetColorScale={this.setColorScale}/>
                {/* <SliderIn onSetInstance={this.setInstance} maxValue={instanceLength}/> */}
                {/* <DicomViewer instance={instance} {...viewerProps}/> */}
                <Row>
                    <Col span={20}>
                        <DicomViewer instance={instance} {...viewerProps} maxValue={instanceLength} onSetInstance={this.setInstance} onSetColorScale={this.setColorScale}/>
                    </Col>
                    <Col span={11}>
                        {/* <DicomViewer2 instance={instance} {...viewerProps}/> */}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default SeriesViewerPage; 