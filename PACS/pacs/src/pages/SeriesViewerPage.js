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
            flagimage:false,
            instancesid:undefined,
            pluginsid:undefined
        };
        this.setState = this.setState.bind(this);
        this.onPlugin = this.onPlugin.bind(this);
    }

    componentWillMount() {
        const seriesId = this.state.seriesId;
        const index = this.state.index;
        if(!this.state.isLoaded) {

            DicomService.findInstancesBySeriesId(seriesId, instances => {
                const len=instances.length;
                 instances.map(instance =>{
                     instance['instance_number']=(len-instance['instance_number'])+1
                 })
                this.setState({instances: instances.reverse(), isLoaded:true,});
            })
            
        }
        const show = [];
        PluginsService.findPlugins(Plugins => {
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

    componentDidUpdate(){
        // console.log("flagnew",this.state.flagimage);
    }

    onPlugin(instanceid,pluginid) {
        // PluginsService.onPlugin1(instanceid,pluginid,instance => {
        //     this.setState({instances:instance});
        // });
        console.log("子传父",instanceid, pluginid);
        const id1=instanceid;
        const id2=pluginid;
        this.setState({flagzoom: false, flagimage:true});
        this.setState({instancesid: id1, pluginsid: id2});
        console.log("id",this.state.instancesid,this.state.pluginsid);
    }

    // onPlugin1 (instanceid,pluginid,f){
    //     fetch(
    //         `/api/instances/${instanceid}/process/by_plugin/${pluginid}/image`,{
    //             method:"POST",
    //             headers:{
    //                 'Content-Type':'image/jpeg;charset=base64;'
    //             }
    //         }
    //     ).then((response)=>{
    //         console.log("newinstance",response);
    //         if (response.status >= 200 && response.status < 300) {
    //             return response;
    //         }
    //         console.log(response.status);
    //         const error = new Error(`HTTP Error ${response.statusText}`);
    //         error.status = response.statusText;
    //         error.response = response;
    //         throw error;
    //     }).then(response => {           
    //         return response.json();
    //     }).then(f);
        //.catch((err) => {
        //     alert(err.response?err.response.data['message']:err.response);
        //     //this.setState({});
        // })
    //}
    

    noPlugin = () => {
        this.setState({flagzoom: false, flagimage:false});
    }

    onClear = () => {
        this.setState({rtx:'off',
                    measure:'clear'})
        this.setState({flagzoom: false});
    }

    onDistance = () => {
        this.setState({rtx:'on',
                    measure:'distance'})
        this.setState({flagzoom: false});
    }

    onAngle = () => {
        this.setState({rtx:'on',
                    measure:'angle'})
        this.setState({flagzoom: false});
    }

    onArea = () => {
        this.setState({rtx:'on',
                    measure:'area'})
        this.setState({flagzoom: false, rotation: null});
    }

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


    turnoff = () => {
        this.setState({flagzoom:false,
        rotation:null})
    }

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
        this.setState({flagzoom: false, rotation:null});
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
            flagimage:this.state.flagimage,
            instancesid:this.state.instancesid,
            pluginsid:this.state.pluginsid
        };
        const instanceLength = (this.state.instances || []).length;
        // console.log("flag",this.state.flagimage);
        return (
            <div style={{background:"black"}} tabIndex={'0'} >
                {/* 把一个instance传过去 */}
                {/* <SliderIn onSetInstance={this.setInstance} maxValue={instanceLength}/> */}
                <SeriesViewerTable data={this.state.installedPlugins} instance={instance} 
                onClear = {this.onClear}
                onDistance = {this.onDistance}
                onAngle = {this.onAngle}
                onArea = {this.onArea}
                onPlugin={this.onPlugin} noPlugin={this.noPlugin}
                onPrevInstance={this.prevInstance} onNextInstance={this.nextInstance} 
                onPlay={this.play} onZoomin={this.zoomin} onZoomout={this.zoomout}
                onRotateLeft={this.rotateLeft} onRotateRight={this.rotateRight} onMNextInstance={this.mnextInstance} onFNextInstance={this.fnextInstance} 
                onPlay={this.play} onMPlay={this.mplay} onFPlay={this.fplay} onSetColorScale={this.setColorScale}/>
                {/* <SliderIn onSetInstance={this.setInstance} maxValue={instanceLength}/> */}
                {/* <DicomViewer instance={instance} {...viewerProps}/> */}
                <Row>
                    <Col span={20}>
                        <DicomViewer instance={instance} {...viewerProps} turnoff={this.turnoff} maxValue={instanceLength} onSetInstance={this.setInstance} onSetColorScale={this.setColorScale}/>
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