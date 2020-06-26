import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Slider, InputNumber, Row, Col } from 'antd';

const style = {
    display: 'inline-block',
    height: 300,
    marginLeft: 10,
  };

class BrightnessMiniSlider extends React.Component {
  constructor(props) {
    super(props);
    this.setState.bind(this);
    this.onSetColorScale = this.props.onSetColorScale || function () {
    };
    this.onSetBrightness = this.props.onSetBrightness || function () {
    };
    this.onSetContrast = this.props.onSetContrast || function () {
    };
    // this.onSetGamma = this.props.onSetGamma || function () {
    // };
    this.onSetWindowLevel = this.props.onSetWindowLevel || function () {
    };
    this.onSetFloor = this.props.onSetFloor || function () {};
    this.onSetCeil= this.props.onSetCeil|| function () {};
    // console.log("函数", this.onSetColorScale)
  }
  state = {
    floor: -2000,
    ceil: 2000,
  };

  onChange1 = value => {
    const input = 'brightness' + value;
    // console.log(input)
    this.onSetBrightness(value/10);
  };
  onChange2 = value => {
    // console.log(input)
    this.onSetContrast(value/10);
  };
  // onChange3 = value => {
  //   // console.log(input)
  //   // console.log(value);
  //   var input = [0,1];
  //   input[0] = value[0] / 255;
  //   input[1] = value[1] / 255;
  //   console.log(input)
  //   this.onSetGamma(input);

  // };

  onChange3 = value => {
    // console.log(input)
    // console.log(value);
    var floor;
    var ceil;
    floor = value[0];
    ceil = value[1];
    var input = [0,0];
    input[0] = floor;
    input[1] = ceil;
    this.onSetWindowLevel(input);
    this.setState({floor:floor, ceil:ceil});
  };

  onChangeFloor = value => {
    var floor;
    floor = value;
    this.onSetFloor(floor);
    this.setState({floor:floor});
    // console.log(this.state.floor)
  }
  onChangeCeil = value => {
    var ceil;
    ceil = value;
    this.onSetCeil(ceil);
    this.setState({ceil:ceil});
  }

  componentDidUpdate() {
  }

  render() {
    const floor = this.state.floor;
    const ceil = this.state.ceil;
    return (
      <div>
        
        {/* <p style={{color:'white'}}>窗位</p >
            <Slider vertical range defaultValue={[0,255]} min={0} max={255} onChange={this.onChange3}/>
        </div> 
        <div style={style}> */}
        <div>
          <br/>
        <p style={{color:'white',margin: '0 280px 0px 0px'}}>窗位</p >
        <Row style={{width:"100",marginRight:'-55px'}}>
        <Col span={4}>
        <InputNumber 
            min={-2000}
            max={ceil}
            style={{ margin: '0 60px 0px 0px' }}
            value={floor}
            onChange={this.onChangeFloor}
          />  
        </Col>
        <Col span={40}>
        <div style={{width:"300px",padding:"0px 20px 0px 10px"}}>
        <Slider range defaultValue={[-2000,2000]} value={[floor,ceil]} min={-2000} max={2000} onChange={this.onChange3}/>
        </div> 
        </Col>
        
        <Col span={4}>
        <InputNumber 
            min={floor}
            max={2000}
            style={{ margin: '0 60px 0px 0px' }}
            value={ceil}
            onChange={this.onChangeCeil}
          />
        </Col>
        </Row> 
        <br/>
        <br/> 
        </div>
        <div style={{margin: '0 100px 0px 0px'}}>
        
        <div style={style}>
        <p style={{color:'white'}}>亮度</p >
            <Slider vertical defaultValue={0} min={-10} max={10} onChange={this.onChange1}/>
        </div>  
        <div style={style}>
        <p style={{color:'white'}}>对比度</p >
            <Slider vertical defaultValue={0} min={-10} max={10} onChange={this.onChange2}/>
        </div> 
       
        </div>
      </div>
        
        
    );
  }
}




export default BrightnessMiniSlider;