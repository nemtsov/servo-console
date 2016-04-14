import React from 'react';
import {
  Row, Col, Input, Button, Alert
} from 'react-bootstrap';


export default React.createClass({
  displayName: 'CreateButton',
  propTypes: {
    children: React.PropTypes.any.isRequired,
    disabled: React.PropTypes.bool,
    text: React.PropTypes.string,
    onSubmit: React.PropTypes.func,
  },

  getDefaultProps(){
    return {
      text: 'Add',
      disabled: false,
      onSubmit: (cb)=>{alert('No submit handler provided') && cb();}
    }
  },

  getInitialState() {
    return {
      done: true,
      loading: false,
    };
  },

  render(){
    // const childrenWithProps = React.Children.map(this.props.children, (Child) =>{
    //   // Don't do anythign right now. maybe pass down disabled props.
    //     return <Child/>
    // });
    const childrenWithProps = this.props.children;
    if (this.state.done) {
      return (
        <Row>
          <Col xs={12}>
            <Button
              bsStyle='primary'
              onClick={this._openForm} block
            > {this.props.text}
            </Button>
          </Col>
        </Row>
      )
    }
    return (
      <Row>
        <Col md={10}>
          {childrenWithProps}
        </Col>
        <Col md={2}>
          <Button block
            disabled={this.props.disabled || this.state.loading}
            bsStyle="primary"
            onClick={this._handleSubmit}>Submit</Button>
        </Col>
        {(this.state.error) ?
        <Col md={12}>
          <Alert bsStyle='danger'>
            <h4>Something went wrong </h4>
            <p>{this.state.error}</p>
          </Alert>
        </Col> : null}
      </Row>
    )
  },
  _openForm() {
    this.setState({
      done: false
    });
  },
  _handleSubmit() {
    this.setState({loading: true, error: null});
    this.props.onSubmit((err, result) =>{
      if (err) {
        this.setState({
          error: err.message,
          loading: false
        });
      } else {
        this.setState({
          loading: false,
          done: true
        });
      }
    })
  }
});
