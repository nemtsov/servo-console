var React = require('react'),
  Boot = require('react-bootstrap'),
  instanceTypes = require('_/constants/instanceTypes');

module.exports = React.createClass({
  displayName: 'WorkerSettingItem',

  update: function (event) {
    this.props.update(this.props.item.key, event.target.key);
  },

  revert: function () {
    this.props.revert(this.props.item.key);
  },

  remove: function () {
    this.props.remove(this.props.item.key);
  },

  render: function () {
    var isInstanceType = !!this.props.item.key.match('InstanceType'),
      key = this.props.item.key;

    return (
      <Boot.Row>
        <Boot.Col md={3}>
          <h4>{key}</h4>
        </Boot.Col>
        <Boot.Col md={8}> 
          {!isInstanceType? 
            <Boot.Input type="text" value={this.props.item.value} onChange={this.update}/>:
            <Boot.Input type="select" value={this.props.item.value} onChange={this.update}>
              {
                instanceTypes.map(function (type) {
                  return <option key={type.value} value={type.value}> {type.description} ({type.value}) </option>
                })
              }
            </Boot.Input>
          }        
        </Boot.Col>
        <Boot.Col md={1}>
          <Boot.Button bsStyle="danger" bsSize="small" onClick={this.remove}>Remove</Boot.Button>
        </Boot.Col>
      </Boot.Row>
    );
  }
});