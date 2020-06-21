import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Slider, InputNumber, Row, Col } from 'antd';


class SliderIn extends React.Component {
  constructor(props) {
    super(props);
    this.setState.bind(this);
    this.onSetInstance = this.props.onSetInstance || function () {
    };
  }
  state = {
    inputValue: this.props.inputValue,
    maxValue: this.props.maxValue
  };

  onChange = value => {
    this.onSetInstance(value-1);
    this.setState({
      inputValue: value,
    });
  };

  componentDidUpdate() {

  }

  render() {
    const inputValue = this.props.inputValue;

    const maxValue = this.props.maxValue;
    // console.log("序列长度", maxValue)
    return (
      <Row>
        <Col span={20}>
          <Slider
            min={0}
            max={maxValue}
            onChange={this.onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={maxValue}
            style={{ margin: '0 16px' }}
            value={inputValue}
            onChange={this.onChange}
          />
        </Col>
      </Row>
    );
  }
}




export default SliderIn;