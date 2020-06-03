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
            flagzoom:false,
<<<<<<< HEAD
            ifplay:false
=======
            ifplay:false,
>>>>>>> 9cabfc2b08f87656aabae051911ed8a2bdbd6b67
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
        // alert("下一曲")
        const currentInstanceId = this.state.index;
        const instancesCount = (this.state.instances || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index: 0, rotation: null});
        else
            this.setState({index: currentInstanceId + 1, rotation: null});
<<<<<<< HEAD
        this.setState({flagzoom: false});
=======
        this.setState({flagzoom:false});
>>>>>>> 9cabfc2b08f87656aabae051911ed8a2bdbd6b67
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
<<<<<<< HEAD
        this.setState({flagzoom: false});
    };

    play = () => {
        if(!this.state.ifplay){
            this.setState({ifplay:true});  
            this.setState({flagzoom: false});      
            this.timer = setInterval(() => {(
                this.nextInstance()
                )
            }, 1000);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay:false})}
        this.setState({flagzoom: false});
=======
        this.setState({flagzoom:false});
>>>>>>> 9cabfc2b08f87656aabae051911ed8a2bdbd6b67
    };

    play = () => {
        this.timer = setInterval(() => {(
            this.nextInstance()
            )
        }, 1000);
        // if(!this.state.ifplay){
            // setTimeout(this.nextInstance(), 1000)
        // }

    }

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
            flagzoom:this.state.flagzoom,
            ifplay:this.state.ifplay
        };
        
        return (
            <div>
                {/* 把一个instance传过去 */}
                <SeriesViewerTable onPrevInstance={this.prevInstance} onNextInstance={this.nextInstance} 
<<<<<<< HEAD
                onPlay={this.play} onZoomin={this.zoomin} onZoomout={this.zoomout}
                onRotateLeft={this.rotateLeft} onRotateRight={this.rotateRight}/>
=======
                onZoomin={this.zoomin} onZoomout={this.zoomout}
                onRotateLeft={this.rotateLeft} onRotateRight={this.rotateRight} onPlay={this.play}/>
>>>>>>> 9cabfc2b08f87656aabae051911ed8a2bdbd6b67
                <DicomViewer instance={instance} {...viewerProps}/>
            </div>
        )
    }
}

export default SeriesViewerPage; 