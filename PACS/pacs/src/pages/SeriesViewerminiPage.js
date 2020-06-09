import React, {Component} from 'react';
import DicomService from '../services/DicomService';
import DicomViewer from '../components/DicomViewer';
import DicomViewer1 from '../components/DicomViewer1';
import DicomViewer2 from '../components/DicomViewer2';
import DicomViewer3 from '../components/DicomViewer3';
import DicomViewer4 from '../components/DicomViewer4';
import SeriesViewerTable from '../components/SeriesViewerTable';
import SliderIn from '../components/SliderIn'
import {Grid} from "semantic-ui-react";
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { Texture } from 'three';

const instance0 = {
    id:'',
    parent:{
        patient:{
            patient_id:'',
            patient_name:'',
        },
        series:{
            id:'',
            modality:'',
        },
        study:{
            study_date:''
        }
    },
    color_space:null,
    columns:0,
    image:'',
    instance_number:0,
    largest_image_pixel_value:null,
    photometric_interpretation: "",
    pixel_aspect_ratio: null,
    pixel_spacing: "",
    rows: 0,
    smallest_image_pixel_value: null,
    sop_instance_uid: '',

}

const instances0 = [instance0];

class SeriesViewerminiPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instances: [],
            instances1: [],
            instances2: [],
            instances3: [],
            instances4: [],
            seriesId :props.match.params.id3,
            seriesId1: props.match.params.id1,
            seriesId2: props.match.params.id2,
            seriesId3: props.match.params.id3,
            seriesId4: props.match.params.id4,
            instanceTags: {},
            index:0,
            index1: 0,
            index2: 0,
            index3: 0,
            index4: 0,
            instance:{},
            instance1: {},
            instance2: {},
            instance3: {},
            instance4: {},
            showTags: false,
            playTimerId: null,
            isLoaded: false,
            isLoaded1: false,
            isLoaded2: false,
            isLoaded3: false,
            isLoaded4: false,
            rotation: null,
            rotation1: null,
            rotation2: null,
            rotation3: null,
            rotation4: null,
            colorScale: 'main',
            colorScale1: 'main',
            colorScale2: 'main',
            colorScale3: 'main',
            colorScale4: 'main',
            animation: false,
            viewMode: 'one',
            animationId: undefined,
            ifzoom: null,
            ifzoom1: null,
            ifzoom2: null,
            ifzoom3: null,
            ifzoom4: null,
            flagzoom:false,
            flagzoom1:false,
            flagzoom2:false,
            flagzoom3:false,
            flagzoom4:false,
            ifplay:false,
            ifplay1:false,
            ifplay2:false,
            ifplay3:false,
            ifplay4:false,
            window:false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,
        };
        this.setState = this.setState.bind(this);
    }

    componentWillMount() {
        const seriesId = this.state.seriesId;
        const index = this.state.index;
        const seriesId1 = this.state.seriesId1;
        const index1 = this.state.index1;
        const seriesId2 = this.state.seriesId2;
        const index2 = this.state.index2;
        const seriesId3 = this.state.seriesId3;
        const index3 = this.state.index3;
        const seriesId4 = this.state.seriesId4;
        const index4 = this.state.index4;
        console.log("seriesId",seriesId1,seriesId2,seriesId3,seriesId4)
        if(!this.state.isLoaded) {
            DicomService.findInstancesBySeriesId(seriesId, instances => {
                this.setState({instances: instances, isLoaded:true,});
                console.log("instances",this.state.instances);
            })
        }

        if(!this.state.isLoaded1) {
            if(seriesId1===0){
                this.setState({instances1: instances0, isLoaded1:true,});
                console.log("instances1",this.state.instances1);
            }
            else{
                DicomService.findInstancesBySeriesId(seriesId1, instances1 => {
                    this.setState({instances1: instances1, isLoaded1:true,});
                    console.log("instances1",this.state.instances1);
                })
            }
            
        }

        if(!this.state.isLoaded2) {
            if(seriesId2===0){
                this.setState({instances2: instances0, isLoaded2:true,});
                console.log("instances2",this.state.instances2);
            }
            else{
                DicomService.findInstancesBySeriesId(seriesId2, instances2 => {
                    this.setState({instances2: instances2, isLoaded2:true,});
                    console.log("instances2",this.state.instances2);
                })
            }
            
        }

        if(!this.state.isLoaded3) {
            if(seriesId3===0){
                this.setState({instances3: instances0, isLoaded3:true,});
                console.log("instances3",this.state.instances3);
            }
            else{
                DicomService.findInstancesBySeriesId(seriesId3, instances3 => {
                    this.setState({instances3: instances3, isLoaded3:true,});
                    console.log("instances3",this.state.instances3);
                })
            }
            
        }

        if(!this.state.isLoaded4) {
            if(seriesId4===0){
                this.setState({instances4: instances0, isLoaded4:true,});
                console.log("instances4",this.state.instances4);
            }
            else{
                DicomService.findInstancesBySeriesId(seriesId4, instances4 => {
                    this.setState({instances4: instances4, isLoaded4:true,});
                    console.log("instances4",this.state.instances4);
                })
            }
            
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
    setInstance1 = (indexInput) => {
        const currentInstanceId = this.state.index1;
        const instancesCount = (this.state.instances1 || []).length;
        if (instancesCount === 0)
            return;
        if (indexInput > instancesCount)
            return;
        else
            this.setState({index1: indexInput, rotation1: null});
        this.setState({flagzoom1: false,
                       window1:false,
                       window2:false,
                       window3:false,
                       window4:false,
        });
    }

    setInstance2 = (indexInput) => {
        const currentInstanceId = this.state.index2;
        const instancesCount = (this.state.instances2 || []).length;
        if (instancesCount === 0)
            return;
        if (indexInput > instancesCount)
            return;
        else
            this.setState({index2: indexInput, rotation2: null});
        this.setState({flagzoom2: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,
        });
    }

    setInstance3 = (indexInput) => {
        const currentInstanceId = this.state.index3;
        const instancesCount = (this.state.instances3 || []).length;
        if (instancesCount === 0)
            return;
        if (indexInput > instancesCount)
            return;
        else
            this.setState({index3: indexInput, rotation3: null});
        this.setState({flagzoom3: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    }

    setInstance4 = (indexInput) => {
        const currentInstanceId = this.state.index4;
        const instancesCount = (this.state.instances4 || []).length;
        if (instancesCount === 0)
            return;
        if (indexInput > instancesCount)
            return;
        else
            this.setState({index4: indexInput, rotation4: null});
        this.setState({flagzoom4: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
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
        this.setState({flagzoom: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };
    nextInstance1 = () => {
        const currentInstanceId = this.state.index1;
        const instancesCount = (this.state.instances1 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index1: 0, rotation1: null});
        else
            this.setState({index1: currentInstanceId + 1, rotation1: null});
        this.setState({flagzoom1: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    nextInstance2 = () => {
        const currentInstanceId = this.state.index2;
        const instancesCount = (this.state.instances2 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index2: 0, rotation2: null});
        else
            this.setState({index2: currentInstanceId + 1, rotation2: null});
        this.setState({flagzoom2: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    nextInstance3 = () => {
        const currentInstanceId = this.state.index3;
        const instancesCount = (this.state.instances3 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index3: 0, rotation3: null});
        else
            this.setState({index3: currentInstanceId + 1, rotation3: null});
        this.setState({flagzoom3: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    nextInstance4 = () => {
        const currentInstanceId = this.state.index4;
        const instancesCount = (this.state.instances4 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId + 1 === instancesCount)
            this.setState({index4: 0, rotation4: null});
        else
            this.setState({index4: currentInstanceId + 1, rotation4: null});
        this.setState({flagzoom4: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
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
        this.setState({flagzoom: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    prevInstance1 = () => {
        // alert("1上一曲")
        const currentInstanceId = this.state.index1;
        const instancesCount = (this.state.instances1 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId === 0) {
            this.setState({index1: instancesCount - 1, rotation1: null});
        }
        else {
            this.setState({index1: currentInstanceId - 1, rotation1: null});
        }
        this.setState({flagzoom1: false});
    };

    prevInstance2 = () => {
        // alert("2上一曲")
        const currentInstanceId = this.state.index2;
        const instancesCount = (this.state.instances2 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId === 0) {
            this.setState({index2: instancesCount - 1, rotation2: null});
        }
        else {
            this.setState({index2: currentInstanceId - 1, rotation2: null});
        }
        this.setState({flagzoom2: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    prevInstance3 = () => {
        const currentInstanceId = this.state.index3;
        const instancesCount = (this.state.instances3 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId === 0) {
            this.setState({index3: instancesCount - 1, rotation3: null});
        }
        else {
            this.setState({index3: currentInstanceId - 1, rotation3: null});
        }
        this.setState({flagzoom3: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    prevInstance4 = () => {
        const currentInstanceId = this.state.index4;
        const instancesCount = (this.state.instances4 || []).length;
        if (instancesCount === 0)
            return;
        if (currentInstanceId === 0) {
            this.setState({index4: instancesCount - 1, rotation4: null});
        }
        else {
            this.setState({index4: currentInstanceId - 1, rotation4: null});
        }
        this.setState({flagzoom4: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
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
        this.setState({flagzoom: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    play1 = () => {
        if(!this.state.ifplay1){
            this.setState({ifplay1:true});  
            this.setState({flagzoom1: false});      
            this.timer = setInterval(() => {(
                this.nextInstance1()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay1:false})}
        this.setState({flagzoom1: false});
    };

    play2 = () => {
        if(!this.state.ifplay2){
            this.setState({ifplay2:true});  
            this.setState({flagzoom2: false});      
            this.timer = setInterval(() => {(
                this.nextInstance2()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay2:false})}
        this.setState({flagzoom2: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    play3 = () => {
        if(!this.state.ifplay3){
            this.setState({ifplay3:true});  
            this.setState({flagzoom3: false});      
            this.timer = setInterval(() => {(
                this.nextInstance3()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay3:false})}
        this.setState({flagzoom3: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    play4 = () => {
        if(!this.state.ifplay4){
            this.setState({ifplay4:true});  
            this.setState({flagzoom4: false});      
            this.timer = setInterval(() => {(
                this.nextInstance4()
                )
            }, 100);
        }
        else{
            clearInterval(this.timer);
            this.setState({ifplay4:false})}
        this.setState({flagzoom4: false,
            window1:false,
            window2:false,
            window3:false,
            window4:false,});
    };

    zoomin = () => {
        
        this.setState({ifzoom: 'in',flagzoom:true});
    };

    zoomin1 = () => {
        this.setState({ifzoom1: 'in',
                       flagzoom1:true,
                       window1:true,
                       window2:false,
                       window3:false,
                       window4:false,
    });
    };
    zoomin2 = () => {
        this.setState({ifzoom2: 'in',
                        flagzoom2:true,
                        window1:false,
                        window2:true,
                        window3:false,
                        window4:false,
                    });
    };
    zoomin3 = () => {
        this.setState({ifzoom3: 'in',flagzoom3:true,
        window1:false,
        window2:false,
        window3:true,
        window4:false,});
    };
    zoomin4 = () => {
        this.setState({ifzoom4: 'in',flagzoom4:true,
        window1:false,
        window2:false,
        window3:false,
        window4:true,});
    };

    zoomout = () => {
        this.setState({ifzoom: 'out',flagzoom:true});
    };

    zoomout1 = () => {
        this.setState({ifzoom1: 'out',flagzoom1:true,
        window1:true,
        window2:false,
        window3:false,
        window4:false,});
    };

    zoomout2 = () => {
        this.setState({ifzoom2: 'out',flagzoom2:true,
        window1:false,
        window2:true,
        window3:false,
        window4:false,});
    };
    zoomout3 = () => {
        this.setState({ifzoom3: 'out',flagzoom3:true,
        window1:false,
        window2:false,
        window3:true,
        window4:false,});
    };
    zoomout4 = () => {
        this.setState({ifzoom4: 'out',flagzoom4:true,
        window1:false,
        window2:false,
        window3:false,
        window4:true,});
    };

    rotateLeft = () => {
        this.setState({rotation: 'left',flagzoom:false,});
    };

    rotateLeft1 = () => {
        this.setState({rotation1: 'left',flagzoom1:false,
        window1:true,
        window2:false,
        window3:false,
        window4:false,});
    };

    rotateLeft2 = () => {
        this.setState({rotation2: 'left',flagzoom2:false,
        window1:false,
        window2:true,
        window3:false,
        window4:false,});
    };
    rotateLeft3 = () => {
        this.setState({rotation3: 'left',flagzoom3:false,
        window1:false,
        window2:false,
        window3:true,
        window4:false,});
    };
    rotateLeft4 = () => {
        this.setState({rotation4: 'left',flagzoom4:false,
        window1:false,
        window2:false,
        window3:false,
        window4:true,});
    };

    rotateRight = () => {
        this.setState({rotation: 'right',flagzoom:false});
    };

    rotateRight1 = () => {
        this.setState({rotation1: 'right',flagzoom1:false,
        window1:true,
        window2:false,
        window3:false,
        window4:false,});
    };

    rotateRight2 = () => {
        this.setState({rotation2: 'right',flagzoom2:false,
        window1:false,
        window2:true,
        window3:false,
        window4:false,});
    };

    rotateRight3 = () => {
        this.setState({rotation3: 'right',flagzoom3:false,
        window1:false,
        window2:false,
        window3:true,
        window4:false,});
    };

    rotateRight4 = () => {
        this.setState({rotation4: 'right',flagzoom4:false,
        window1:false,
        window2:false,
        window3:false,
        window4:true,});
    };

    render() {
        console.log(this.state.instances)
        const index = this.state.index;
        const index1 = this.state.index1;
        const index2 = this.state.index2;
        const index3 = this.state.index3;
        const index4 = this.state.index4;
        const instances = this.state.instances;
        const instances1 = this.state.instances1;
        const instances2 = this.state.instances2;
        const instances3 = this.state.instances3;
        const instances4 = this.state.instances4;
        const instance = instances[index]
        const instance1 = instances1[index1]
        const instance2 = instances2[index2]
        const instance3 = instances3[index3]
        const instance4 = instances4[index4]
        console.log('获取到的instance1', instance1)
        console.log('获取到的instance2', instance2)
        console.log('获取到的instance3', instance3)
        console.log('获取到的instance4', instance4)
        // const seriesId = instance.id;

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
        const viewerProps1 = {
            style: {
                height: window.innerHeight
            },
            colorScale: this.state.colorScale1,
            rotation:this.state.rotation1,
            ifzoom:this.state.ifzoom1,
            flagzoom:this.state.flagzoom1,
            ifplay:this.state.ifplay1,
            window:this.state.window1,
        };
        const viewerProps2 = {
            style: {
                height: window.innerHeight
            },
            colorScale: this.state.colorScale2,
            rotation:this.state.rotation2,
            ifzoom:this.state.ifzoom2,
            flagzoom:this.state.flagzoom2,
            ifplay:this.state.ifplay2,
            window:this.state.window2,
        };
        const viewerProps3 = {
            style: {
                height: window.innerHeight
            },
            colorScale: this.state.colorScale3,
            rotation:this.state.rotation3,
            ifzoom:this.state.ifzoom3,
            flagzoom:this.state.flagzoom3,
            ifplay:this.state.ifplay3,
            window:this.state.window3,
        };
        const viewerProps4 = {
            style: {
                height: window.innerHeight
            },
            colorScale: this.state.colorScale4,
            rotation:this.state.rotation4,
            ifzoom:this.state.ifzoom4,
            flagzoom:this.state.flagzoom4,
            ifplay:this.state.ifplay4,
            window:this.state.window4,
        };

        const instanceLength = (this.state.instances || []).length;
        const instanceLength1 = (this.state.instances1 || []).length;
        const instanceLength2 = (this.state.instances2 || []).length;
        const instanceLength3 = (this.state.instances3 || []).length;
        const instanceLength4 = (this.state.instances4 || []).length;
        
        return (
            <div style={{background:"black"}} tabIndex={'0'} >
                <br/>
                <br/>
                <Row gutter={2}>
                    <Col span={11} push={1} style={{borderStyle:"solid",borderColor:"rgba(12, 153, 196, 0.837)",borderWidth:'1px',padding:'10px 0px 70px 15px'}}>
                        <DicomViewer1 instance={instance1} {...viewerProps1} onSetInstance={this.setInstance1} maxValue={instanceLength1}
                        onPrevInstance={this.prevInstance1} onNextInstance={this.nextInstance1} 
                        onPlay={this.play1} onZoomin={this.zoomin1} onZoomout={this.zoomout1}
                        onRotateLeft={this.rotateLeft1} onRotateRight={this.rotateRight1}/>
                        
                    </Col>
                    <Col span={11} push={1} style={{borderStyle:"solid",borderColor:"rgba(12, 153, 196, 0.837)",borderWidth:'1px',padding:'10px 0px 70px 15px'}}>
                        <DicomViewer2 instance={instance2} {...viewerProps2} onSetInstance={this.setInstance2} maxValue={instanceLength2}
                        onPrevInstance={this.prevInstance2} onNextInstance={this.nextInstance2} 
                        onPlay={this.play2} onZoomin={this.zoomin2} onZoomout={this.zoomout2}
                        onRotateLeft={this.rotateLeft2} onRotateRight={this.rotateRight2}/>
                    </Col>
                </Row>

                <Row>
                    <Col span={11} push={1} style={{borderStyle:"solid",borderColor:"rgba(12, 153, 196, 0.837)",borderWidth:'1px',padding:'10px 0px 70px 15px'}}>
                        <DicomViewer3 instance={instance3} {...viewerProps3} onSetInstance={this.setInstance3} maxValue={instanceLength3}
                        onPrevInstance={this.prevInstance3} onNextInstance={this.nextInstance3} 
                        onPlay={this.play3} onZoomin={this.zoomin3} onZoomout={this.zoomout3}
                        onRotateLeft={this.rotateLeft3} onRotateRight={this.rotateRight3}/>
                    </Col>
                    <Col span={11} push={1} style={{borderStyle:"solid",borderColor:"rgba(12, 153, 196, 0.837)",borderWidth:'1px',padding:'10px 0px 70px 15px'}}>
                        <DicomViewer4 instance={instance4} {...viewerProps4} onSetInstance={this.setInstance4} maxValue={instanceLength4}
                        onPrevInstance={this.prevInstance4} onNextInstance={this.nextInstance4} 
                        onPlay={this.play4} onZoomin={this.zoomin4} onZoomout={this.zoomout4}
                        onRotateLeft={this.rotateLeft4} onRotateRight={this.rotateRight4}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default SeriesViewerminiPage; 