import React, {Component} from 'react';
// import * as THREE from 'three';
import DicomService from '../services/DicomService';
import './DicomViewer.css'
import SliderIn from './SliderIn'
import BrightnessSlider from './BrightnessSlider'
const THREE = window.THREE = require('three');

require('three/examples/js/postprocessing/EffectComposer.js');
require('three/examples/js/postprocessing/ShaderPass.js');
require('three/examples/js/postprocessing/RenderPass.js');
require('three/examples/js/shaders/DotScreenShader.js');
require('three/examples/js/shaders/BrightnessContrastShader.js');
require('three/examples/js/shaders/CopyShader.js');


var uv = undefined;
var uv2 = undefined;
var first = true;
class DicomViewer extends Component {
    constructor(props) {
        super(props);
        this.rayCaster = new THREE.Raycaster();
        this.state = {
            seedPoint: new THREE.Vector2(-1,-1),
            brightness:0,
            contrast:0,
        }
        this.setState = this.setState.bind(this);
        this.onSetInstance = this.props.onSetInstance || function () {
        };
        this.onSetColorScale = this.props.onSetColorScale || function () {
        };
    }

    onSetBrightness = (value) => {
        this.setState({brightness:value});
    }

    onSetContrast = (value) => {
        this.setState({contrast:value});
    }
    
    onWindowRisize = () => {
        this.camera.aspect = this.node.clientWidth / this.node.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.node.clientWidth, this.node.clientHeight);
    };

    onMouseClick = (e) => {
        const scene = this.scene;
        const camera = this.camera;
        const rayCaster = this.rayCaster;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const array = DicomViewer.getMousePosition(e.target, clientX, clientY);
        const vecPos = new THREE.Vector2(array[0] * 2 - 1, -(array[1] * 2) + 1);
        rayCaster.setFromCamera(vecPos, camera);
        const intersects = rayCaster.intersectObjects(scene.children); 
        
        if (intersects && intersects.length > 0) {
            const intersectedImg = intersects[0];
            if(uv===undefined){
                uv = intersectedImg.uv;
                this.setState({seedPoint: new THREE.Vector2(uv.x, uv.y)});
            }
            else if(uv2===undefined){
                uv2 = intersectedImg.uv;
                this.setState({seedPoint: new THREE.Vector2(uv2.x, uv2.y)});
            }
            else {
                uv=undefined;
                uv2=undefined;
                // this.scene.children.remove()
                this.scene.children.shift();
                // console.log("孩儿们",this.scene.children);
            }
            
            
            if (uv && uv2) {
                
                var a = uv.x - uv2.x;
                var b = uv.y - uv2.y;
                var dist = Math.sqrt(a*a+b*b)
                var geometryline = new THREE.Geometry();
                geometryline.vertices.push(
                    new THREE.Vector3(uv.x*3-1.5, uv.y*3-1.5, 0),
                    new THREE.Vector3(uv2.x*3-1.5, uv2.y*3-1.5, 0)
                );
                geometryline.colors.push(
                    new THREE.Color( 0xFF0000 ), 
                    new THREE.Color( 0xFF0000 )
                )
                var materialline = new THREE.LineBasicMaterial({ vertexColors: true });
                this.line = new THREE.Line(geometryline, materialline);
                this.scene.add(this.line)
                // console.log('坐标',intersectedImg.point,uv);
                // alert(`${uv.x} ${uv.y}`);
                setTimeout(()=>{alert(`测量距离为${dist}`)},100);
                
                
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
        //alert("componentDidUpdate")
        const alt = `didupdate ${this.props.rotation}`
        // alert(alt);
        const instance = this.props.instance;
        const url = `/api/instances/${instance?instance.id:instance}/image`;
        //设置场景 渲染器 和  相机
        const w = parseFloat(instance['columns']);
        const h = parseFloat(instance['rows']);
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
                fragmentShader: fragShader,
            });
            
            


            if(first === true){
                // alert("第一次渲染")
                this.rect = new THREE.Mesh(geometry, material);
                console.log("第一次height");
                console.log(this.rect.geometry.parameters.height);
                if (this.props.rotation === 'left' && !this.props.flagzoom){
                    this.rect.rotation.z -= 0.5;
                }                
                else if (this.props.rotation === 'right' && !this.props.flagzoom)
                    this.rect.rotation.z += 0.5;
                // else
                //     this.rect.rotation.z = 0.0;
                
                    if(this.props.ifzoom === 'in' && this.props.flagzoom){
                        if(this.camera.fov > 0){this.camera.fov -=5;}
                        else{this.camera.fov=0;}
                        // this.rect.geometry.parameters.height += 0.5;
                        // this.rect.geometry.parameters.width +=0.5;
                        this.camera.fov -=10;
                    }
                    else if(this.props.ifzoom === 'out' && this.props.flagzoom){
                        if(this.camera.fov < 180){this.camera.fov +=5;}
                        else{this.camera.fov=180;}
                        // this.rect.geometry.parameters.height -= 0.5;
                        // this.rect.geometry.parameters.width -=0.5;
                    }
                this.scene.add(this.rect);
                this.camera.position.z = 3.5;
                first = false;
            }
            if (this.props.rotation === 'left' && !this.props.flagzoom){
                this.rect.rotation.z -= 0.5;
            }                
            else if (this.props.rotation === 'right' && !this.props.flagzoom)
                this.rect.rotation.z += 0.5;
            // else
            //     this.rect.rotation.z = 0.0;
            
            if(this.props.ifzoom === 'in' && this.props.flagzoom){
                if(this.camera.fov > 0){this.camera.fov -=5;}
                else{this.camera.fov=0;}
                // this.rect.geometry.parameters.height += 0.5;
                // this.rect.geometry.parameters.width +=0.5;
            }
            else if(this.props.ifzoom === 'out' && this.props.flagzoom){
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
        let maxValue = this.props.maxValue;
        let instance = this.props.instance;
        console.log('viewer组件获取的instance',instance)
        return (
            <div ref={node => this.node = node} style={{height: window.innerHeight}}>
                <div>
                    
                    <SliderIn  onSetInstance={this.onSetInstance} maxValue={maxValue} inputValue={instance?instance['instance_number']:1}/>
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
                
            </div>
        )
    }
}

export default DicomViewer;