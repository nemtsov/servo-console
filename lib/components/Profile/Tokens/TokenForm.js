var React = require('react'),
  Boot = require('react-bootstrap'),
  regions = require('_/constants/regions'),
  request = require('_/stores/request');


/*
  Create Token Form
*/
module.exports = React.createClass({
  displayName: 'TokenForm',
  getInitialState: function() {
    return {
      done: true,
      tokenName: '',
      loading: false,
    };
  },
  render: function(){
    if(this.state.done) {
      return (
        <Boot.Row><Boot.Col xs={12}>
          <Boot.Button bsStyle='primary' onClick={this.openForm} block>Create Token</Boot.Button>
        </Boot.Col></Boot.Row>

      )
    } else {
      var disabled = (this.state.tokenName.length <=0);
        return (
          <Boot.Row>
            <Boot.Col md={10} className="form-horizontal" >
              <Boot.Input type='text' label='Token Name'
                onChange={this.handleChange}
                value={this.state.tokenName}
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'/>
            </Boot.Col>
            <Boot.Col md={2} className="form-horizontal">
              <Boot.Button block
                disabled={disabled || this.state.loading}
                bsStyle="primary"
                onClick={this.handleSubmit}>Submit</Boot.Button>
            </Boot.Col>
          </Boot.Row>
        )
    }
  },
  openForm: function(){
    this.setState({
      done: false
    });
  },
  handleChange: function(e) {
    this.setState({tokenName: e.target.value});
  },
  handleSubmit: function(){
    if (!this.state.tokenName)
      return this.props.setAlert({message: 'Error: No Token Name'});

    var self = this;
    self.setState({loading: true});
    self.props.addToken(this.state.tokenName, function () {
      self.setState({
        loading: false,
        done: true,
        tokenName: ''
      });
    });
  }
})
