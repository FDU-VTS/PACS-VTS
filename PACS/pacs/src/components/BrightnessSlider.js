import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Slider, InputNumber, Row, Col } from 'antd';

const style = {
    display: 'inline-block',
    height: 300,
    marginLeft: 70,
  };

class BrightnessSlider extends React.Component {
  constructor(props) {
    super(props);
    this.setState.bind(this);
    this.onSetColorScale = this.props.onSetColorScale || function () {
    };
    this.onSetBrightness = this.props.onSetBrightness || function () {
    };
    this.onSetContrast = this.props.onSetContrast || function () {
    };
    // console.log("函数", this.onSetColorScale)
  }
  

  onChange1 = value => {
    const input = 'brightness' + value;
    // console.log(input)
    this.onSetBrightness(value/10);
  };
  onChange2 = value => {
    // console.log(input)
    this.onSetContrast(value/10);
  };
  

  componentDidUpdate() {

  }

  render() {
    return (
      <div>
        <div style={style}>
        <p style={{color:'white'}}>亮度</p>
            <Slider vertical defaultValue={0} min={-10} max={10} onChange={this.onChange1}/>
        </div>  
        <div style={style}>
        <p style={{color:'white'}}>对比度</p>
            <Slider vertical defaultValue={0} min={-10} max={10} onChange={this.onChange2}/>
        </div> 
      </div>
        
        
    );
  }
}




export default BrightnessSlider;