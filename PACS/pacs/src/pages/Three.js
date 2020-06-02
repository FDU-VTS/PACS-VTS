import React, { Component } from 'react';
import * as THREE from 'three';

class Three extends Component {
   
    componentDidMount() {
        this.init()
    }
    
    init = () => {
        const scene =  new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, this.mount.clientWidth / this.mount.clientHeight, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        renderer.setSize(this.mount.clientWidth, this.mount.clientHeight );
        this.mount.appendChild( renderer.domElement );
        camera.position.z = 5;
      
        this.createCube()
        this.createLine()
        this.animate();
        
    }

    createCube = () => {
      const geometry = new THREE.BoxGeometry( 1, 2, 1, 4 );
      const material = new THREE.MeshBasicMaterial( { color: 0x1E90FF } );
      const cube = new THREE.Mesh( geometry, material );
      this.cube = cube
      this.scene.add( cube );
    }

    createLine = () => {
      const material = new THREE.LineBasicMaterial({color: 0x0f00ff}) //定义线的材质
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(-2, 0, 0))
      geometry.vertices.push(new THREE.Vector3( 0, 2, 0) ); //相当于是从 将前两个坐标连成一条线
      // geometry.vertices.push(new THREE.Vector3( 2, 0, 0) );
      const line = new THREE.Line(geometry, material)
      this.line = line
      line.position.x = -1
      line.position.y = 2
      this.scene.add(line)
    }

    animate =() => {
      requestAnimationFrame( this.animate );
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.line.rotation.x += 0.02
      this.renderer.render( this.scene, this.camera );
    }

    componentWillUnmount() {
        this.mount.removeChild(this.renderer.domElement)
      }
    render() {
        return (
            <div
                id= "canvas"
                style={{ width: '600px', height: '600px',background:'#888' }}
                ref={(mount) => { this.mount = mount }}
            />
        );
    }
}
//   ReactDOM.render(<Scene />, document.getElementById('canvas'))

export default Three;