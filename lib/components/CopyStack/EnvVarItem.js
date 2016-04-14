var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'EnvVarItem',

  update: function (event) {
    this.props.update(this.props.item.key, event.target.value);
  },

  revert: function () {
    this.props.revert(this.props.item.key);
  },

  remove: function () {
    this.props.remove(this.props.item.key);
  },

  render: function () {
    var key = this.props.item.key.substr(4),
      value = this.props.item.value,
      isSecret = this.props.item.secret,
      isChanged = this.props.item.changed,
      isValid = (value !== '');

    if (isSecret && !isChanged)
      value = 'Encrypted Value';

    return (
      <Boot.Row>
        <Boot.Col md={3}>
          <h4>{key}</h4>
        </Boot.Col>
        <Boot.Col md={5}> 
          <Boot.Input type="text" value={value} bsStyle={isValid ? 'success' : 'error'} onChange={this.update}/>
        </Boot.Col>
        <Boot.Col md={4}>
          <Boot.Row>
            <Boot.Col md={4}>
              <Boot.Row>
                <Boot.Col md={3}/>
                <Boot.Col md={2}>
                  {isSecret ? <i className="fa fa-user-secret"/> : null}
                </Boot.Col>
                <Boot.Col md={7}/>
              </Boot.Row>
            </Boot.Col>
            <Boot.Col md={4}>
              <Boot.Button bsStyle="primary" onClick={this.revert} disabled={!isChanged}>Revert</Boot.Button>
            </Boot.Col>
            <Boot.Col md={4}>
              <Boot.Button bsStyle="danger" onClick={this.remove}>Remove</Boot.Button>
            </Boot.Col>
          </Boot.Row>
        </Boot.Col>
      </Boot.Row>
    );
  }
});