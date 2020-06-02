import React, {Component} from 'react';
import DicomService from '../services/DicomService';
import DicomViewer from '../components/DicomViewer';
import SeriesViewerTable from '../components/SeriesViewerTable';

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
            flagzoom:false
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

    nextInstance = () => {
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index: 0, rotation: null});
        else
            this.setState({index: currentInstanceId + 1, rotation: null});
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
            flagzoom:this.state.flagzoom
        };
        
        return (
            <div>
                {/* 把一个instance传过去 */}
                <SeriesViewerTable onPrevInstance={this.prevInstance} onNextInstance={this.nextInstance} 
                onZoomin={this.zoomin} onZoomout={this.zoomout}
                onRotateLeft={this.rotateLeft} onRotateRight={this.rotateRight}/>
                <DicomViewer instance={instance} {...viewerProps}/>
            </div>
        )
    }
}

export default SeriesViewerPage; 