import React, {Component} from 'react';
import DicomService from '../services/DicomService';
import './DicomViewer.css'
import SliderIn from './SliderIn'
import 'antd/dist/antd.css';
import { Button, Tooltip } from 'antd';
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
import BrightnessSlider from './BrightnessSlider'
const THREE = window.THREE = require('three');

require('three/examples/js/postprocessing/EffectComposer.js');
require('three/examples/js/postprocessing/ShaderPass.js');
require('three/examples/js/postprocessing/RenderPass.js');
require('three/examples/js/shaders/DotScreenShader.js');
require('three/examples/js/shaders/BrightnessContrastShader.js');
require('three/examples/js/shaders/CopyShader.js');

var first = true;
class DicomViewer1 extends Component {
    constructor(props) {
        super(props);
        this.onSetInstance = this.props.onSetInstance || function () {
        };
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
        this.maxValue = this.props.maxValue;
        this.rayCaster = new THREE.Raycaster();
        this.state = {
            seedPoint: new THREE.Vector2(-1,-1),
            brightness:0,
            contrast:0,
        }
        this.setState = this.setState.bind(this);
        
    }

    onWindowRisize = () => {
        this.camera.aspect = this.node.clientWidth / this.node.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.node.clientWidth, this.node.clientHeight);
    };
    onSetBrightness = (value) => {
        this.setState({brightness:value});
    }

    onSetContrast = (value) => {
        this.setState({contrast:value});
    }
    onMouseClick = (e) => {
        const scene = this.scene;
        const camera = this.camera;
        const rayCaster = this.rayCaster;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const array = DicomViewer1.getMousePosition(e.target, clientX, clientY);
        const vecPos = new THREE.Vector2(array[0] * 2 - 1, -(array[1] * 2) + 1);
        rayCaster.setFromCamera(vecPos, camera);
        const intersects = rayCaster.intersectObjects(scene.children);
        if (intersects && intersects.length > 0) {
            const intersectedImg = intersects[0];
            const uv = intersectedImg.uv;
            if (uv) {
                console.log(uv);
                this.setState({seedPoint: new THREE.Vector2(uv.x, uv.y)});
            }
        }
    };

    static getMousePosition(dom, x, y) {
        const boundingBox = dom.getBoundingClientRect();
        return [
            (x - boundingBox.left) / boundingBox.width, (y - boundingBox.top) / boundingBox.height
        ];
    }

    componentDidMount() {
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, this.node.clientWidth / this.node.clientHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.node.clientWidth, this.node.clientHeight);
        this.node.onclick = this.onMouseClick;
        this.composer=new THREE.EffectComposer(this.renderer);
        
    }
    componentWillMount() {
        console.log("willmount", this.props.instance)
        //alert("componentWillMount");
    }


    componentWillReceiveProps(nextProps) {
        //alert("componentWillReceiveProps");
    }

    shouldComponentUpdate() {
        //alert("shouldComponentUpdate");
        return true;        // 记得要返回true
    }

    componentWillUpdate() {
         //alert("componentWillUpdate");

    }

    componentDidUpdate() {
        console.log("window1属性", this.props.window)
        //alert("componentDidUpdate")
        const alt = `didupdate ${this.props.rotation}`
        // alert(alt);
        const isLoaded = this.props.isLoaded;
        const instance = this.props.instance;
        var url = `/api/instances/${instance?instance.id:instance}/image`;
        //设置场景 渲染器 和  相机
        const w = parseFloat(instance?instance['columns']:instance);
        const h = parseFloat(instance?instance['rows']:instance);
        // console.log("长宽",w,h)
        
        this.node.appendChild(this.renderer.domElement);
        // this.node.addEventListener('click', alert("fuck"));
        this.node.addEventListener('resize', this.onWindowResize, false);
        const seedPoint = this.state.seedPoint;
        const vertShader = document.getElementById('mainVert').textContent;
        const fragShader = document.getElementById(this.props.colorScale + 'Frag').textContent;
        new THREE.TextureLoader().load(url, (texture) => {
            const uniforms = {
                texture: {
                    type: 't', value: texture
                },
                seedPoint: {
                    value: seedPoint
                },
                imgSize: {
                    value: new THREE.Vector2(w, h)
                }
            };
            // console.log("scalesize");
            // console.log(this.props.scalesize);
            const geometry = new THREE.PlaneGeometry(3, 3);
            const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertShader,
                fragmentShader: fragShader
            });
            
            


            if(first === true){
                // alert("第一次渲染")
                this.rect = new THREE.Mesh(geometry, material);
                console.log("第一次height");
                console.log(this.rect.geometry.parameters.height);
                if (this.props.rotation === 'left' && !this.props.flagzoom && this.props.window){
                    this.rect.rotation.z -= 0.5;
                }                
                else if (this.props.rotation === 'right' && !this.props.flagzoom && this.props.window)
                    this.rect.rotation.z += 0.5;
                // else
                //     this.rect.rotation.z = 0.0;
                
                    if(this.props.ifzoom === 'in' && this.props.flagzoom && this.props.window) {
                        if(this.camera.fov > 0){this.camera.fov -=5;}
                        else{this.camera.fov=0;}
                        // this.rect.geometry.parameters.height += 0.5;
                        // this.rect.geometry.parameters.width +=0.5;
                        this.camera.fov -=10;
                    }
                    else if(this.props.ifzoom === 'out' && this.props.flagzoom && this.props.window){
                        if(this.camera.fov < 180){this.camera.fov +=5;}
                        else{this.camera.fov=180;}
                        // this.rect.geometry.parameters.height -= 0.5;
                        // this.rect.geometry.parameters.width -=0.5;
                    }

                this.scene.add(this.rect);
                this.camera.position.z = 3.5;
                first = false;
            }
            if (this.props.rotation === 'left' && !this.props.flagzoom && this.props.window){
                this.rect.rotation.z -= 0.5;
            }                
            else if (this.props.rotation === 'right' && !this.props.flagzoom && this.props.window)
                this.rect.rotation.z += 0.5;
            // else
            //     this.rect.rotation.z = 0.0;
            
            if(this.props.ifzoom === 'in' && this.props.flagzoom && this.props.window){
                if(this.camera.fov > 0){this.camera.fov -=5;}
                else{this.camera.fov=0;}
                // this.rect.geometry.parameters.height += 0.5;
                // this.rect.geometry.parameters.width +=0.5;
            }
            else if(this.props.ifzoom === 'out' && this.props.flagzoom && this.props.window){
                if(this.camera.fov < 180){this.camera.fov +=5;}
                else{this.camera.fov=180;}
                // this.rect.geometry.parameters.height -= 0.5;
                // this.rect.geometry.parameters.width -=0.5;
            }
            // else{
            //     this.rect.geometry.parameters.height = 3;
            //     this.rect.geometry.parameters.width = 3;
            // }
            
            //console.log("第二次height");
            //console.log(this.rect.geometry.parameters.height);
            //const height = this.rect.geometry.parameters.height;
            //console.log(height);
            //console.log(this.rect.geometry);
            // console.log(this.rect.rotation.z);
            // console.log("camera角度");
            // console.log(this.camera.fov);
            this.scene.add(this.rect);
            this.rect.material = material;
            //this.rect.geometry = geometry;
            this.rect.needsUpdate = true;
            this.camera.matrixWorldNeedsUpdate = true;
            this.camera.updateProjectionMatrix();
            console.log("当前拖动序号", instance.id)
            this.renderPass=new THREE.RenderPass(this.scene,this.camera);
            this.composer.addPass(this.renderPass)
            var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
            effectCopy.renderToScreen = true;
            this.BrightnessContrastShader=new THREE.ShaderPass(THREE.BrightnessContrastShader);
            this.BrightnessContrastShader.uniforms['brightness'].value=this.state.brightness;
            this.BrightnessContrastShader.uniforms['contrast'].value=this.state.contrast;
            this.composer.addPass(this.BrightnessContrastShader);
            this.composer.addPass(effectCopy);
            this.renderer.render(this.scene, this.camera); 
            this.composer.render();
            // this.animate()
        });

        
    }
    animate =() => {
        requestAnimationFrame( this.animate );
        //this.cube.rotation.x += 0.05;
        //this.cube.rotation.y += 0.05;
       // this.cube.rotation.z += 0.1;
        this.renderer.render( this.scene, this.camera );
      }
    componentWillUnmount() {
        //alert("componentWillUnmount");
    }

   
    

    animate =() => {
      requestAnimationFrame( this.animate );
    //   this.cube.rotation.x += 0.05;
    //   this.cube.rotation.y += 0.05;
     // this.cube.rotation.z += 0.1;
      this.renderer.render( this.scene, this.camera );
    }


    render() {
        //alert("父组件render了")
        let instance = this.props.instance;
        let maxValue = this.props.maxValue;
        console.log('viewer组件获取的instance',instance)
        console.log("获取的最大值",maxValue)
        return (
            <div ref={node => this.node = node} style={{height: window.innerHeight/2}}>
                <div>
                    <SliderIn onSetInstance={this.onSetInstance} maxValue={maxValue} inputValue={instance?instance['instance_number']:1}/>
                </div>
                <div className={'rightTop'}>
                    
                    <BrightnessSlider onSetColorScale={this.onSetColorScale}  onSetContrast={this.onSetContrast} onSetBrightness={this.onSetBrightness}/>
                </div>
                <div className={'leftTop'} >
                    <div>img:{instance?instance.id:instance}</div>
                    <div>
                        Patient ID: {instance?instance.parent.patient['patient_id']:instance}
                    </div>
                    <div>
                        Patient Name: {instance?instance.parent.patient['patient_name']:instance}
                    </div>
                    <div>
                        Series ID: {instance?instance.parent.series['id']:instance}
                    </div>
                    <div>
                        Instance: {instance?instance['instance_number']:instance}
                    </div>
                    <div>
                        Modality: {instance?instance.parent.series['modality']:instance}
                    </div>
                    <div>
                        Size: {instance?instance['columns']:instance}x{instance?instance['rows']:instance}
                    </div>
                    <div>
                        Color Scheme: {instance?instance['photometric_interpretation']:instance}
                    </div>
                </div>
                <div>
                    &nbsp
                    <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />} onClick={this.onPrevInstance}/>
                    &nbsp
                    <Button type="primary" shape="circle" icon={<ArrowRightOutlined onClick={this.onNextInstance}/>} />
                    &nbsp
                    <Button type="primary" shape="circle" icon={<ZoomInOutlined onClick={this.onZoomin}/>} />
                    &nbsp
                    <Button type="primary" shape="circle" icon={<ZoomOutOutlined onClick={this.onZoomout}/>} />
                    &nbsp
                    <Button type="primary" shape="circle" icon={<CaretRightOutlined onClick={this.onPlay}/>} />
                    &nbsp
                    <Button type="primary" shape="circle" icon={<RedoOutlined onClick={this.onRotateLeft}/>} />
                    &nbsp
                    <Button type="primary" shape="circle" icon={<UndoOutlined onClick={this.onRotateRight}/>} />
                </div>
                
            </div>
        )
    }
}

export default DicomViewer1;
