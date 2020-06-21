import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Slider, InputNumber, Row, Col } from 'antd';


class Three extends React.Component {
  constructor(props) {
    super(props);
    this.setState.bind(this);
    this.onSetInstance = this.props.onSetInstance || function () {
    };
  }
  state = {
    inputValue: 1,
    maxValue: this.props.maxValue
  };

  onChange = value => {
    this.onSetInstance(value);
    this.setState({
      inputValue: value,
    });
  };

  componentDidUpdate() {

  }

  render() {
    const { inputValue } = this.state;

    const maxValue = this.props.maxValue;
    // console.log("序列长度", maxValue)
    return (
      <Row>
        <Col span={20}>
          <Slider
            min={1}
            max={maxValue-1}
            onChange={this.onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={maxValue-1}
            style={{ margin: '0 16px' }}
            value={inputValue}
            onChange={this.onChange}
          />
        </Col>
      </Row>
    );
  }
}




export default Three;