import React, {Component} from 'react';
import DicomService from '../services/DicomService';
import DicomViewer from '../components/DicomViewer';
import DicomViewer2 from '../components/DicomViewer copy';
import SeriesViewerTable from '../components/SeriesViewerTable';
import SliderIn from '../components/SliderIn'
import {Grid} from "semantic-ui-react";
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';


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
            ifplay:false
        };
        this.setState = this.setState.bind(this);
    }

    componentWillMount() {
        const seriesId = this.state.seriesId;
        const index = this.state.index;
        if(!this.state.isLoaded) {

            DicomService.findInstancesBySeriesId(seriesId, instances => {
                this.setState({instances: instances, isLoaded:true,});
                console.log("instances",this.state.instances);
            })
            
        }
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

    render() {
        console.log(this.state.instances)
        const index = this.state.index;
        const instances = this.state.instances;
        const instance = instances[index]
        const instance2 = instances[index+1]
        // const seriesId = instance.id;
        if(instances && instances.length > 0){
            console.log("测试",instances,instance,instance.id);
        }
        const viewerProps = {
            style: {
                height: window.innerHeight
            },
            colorScale: this.state.colorScale,
            rotation:this.state.rotation,
            ifzoom:this.state.ifzoom,
            flagzoom:this.state.flagzoom,
            ifplay:this.state.ifplay
        };
        const instanceLength = (this.state.instances || []).length;
        
        return (
            <div style={{background:"black"}} tabIndex={'0'} >
                {/* 把一个instance传过去 */}
                {/* <SliderIn onSetInstance={this.setInstance} maxValue={instanceLength}/> */}
                <SeriesViewerTable onPrevInstance={this.prevInstance} onNextInstance={this.nextInstance} 
                onPlay={this.play} onZoomin={this.zoomin} onZoomout={this.zoomout}
                onRotateLeft={this.rotateLeft} onRotateRight={this.rotateRight}/>
                <SliderIn onSetInstance={this.setInstance} maxValue={instanceLength}/>
                {/* <DicomViewer instance={instance} {...viewerProps}/> */}
                <Row>
                    <Col span={11}>
                        <DicomViewer instance={instance} {...viewerProps}/>
                    </Col>
                    <Col span={11}>
                        <DicomViewer2 instance={instance} {...viewerProps}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default SeriesViewerPage; 