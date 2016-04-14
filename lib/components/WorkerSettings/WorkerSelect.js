var React = require('react'),
  Boot = require('react-bootstrap'),
  instanceTypes = require('_/constants/instanceTypes');

module.exports = React.createClass({
  getInitialState: function () {
    return {saving: false, error: null};
  },

  render: function () {
    var self = this,
      inherited = self.props.defaults.InstanceType,
      current = self.props.current.InstanceType,
      deployed = self.props.deployed.InstanceType,
      defaultInstanceType = instanceTypes.filter(function (type) {
        return (type.value === inherited);
      })[0],
      alreadyDeployed = false;

    if (current === 'default' && defaultInstanceType && deployed === defaultInstanceType.value)
      alreadyDeployed = true;
    if (current === deployed) alreadyDeployed = true;

    return <div className="form-group">
      <label htmlFor="instanceType">
        <span>Worker Type </span>
        {(!alreadyDeployed) ?
          <span><Boot.OverlayTrigger placement="right" overlay={
              <Boot.Tooltip>
                This has not yet been deployed.<br/>
                The current deployed setting is {deployed}.
              </Boot.Tooltip>
              }><i className="fa fa-exclamation-triangle"></i>
          </Boot.OverlayTrigger> </span>: null}
        {(self.state.saving) ? <i className="fa fa-cog fa-spin"></i> : null}
        {(self.state.error) ? <Boot.Label bsStyle="danger">{self.state.error.message}</Boot.Label> : null}
      </label>
      <select className="form-control" id="instanceType"
              value={this.props.current.InstanceType} onChange={this.handleChange}>
        <option value="default">
          Default Setting - {(defaultInstanceType) ?
        defaultInstanceType.description + ' (' + defaultInstanceType.value + ')' : null}
        </option>
        {instanceTypes.map(function (type) {
          return <option key={type.value} value={type.value}>
            {type.description} ({type.value})
          </option>
        })}
      </select>
    </div>;
  },

  handleChange: function (event) {
    var self = this,
      value = event.target.value,
      currentConfig = filterKeys(this.props.store.data, 'InstanceType');
    this.setState({saving: true, error: null});
    if (value === 'default') return this.props.store.del(currentConfig.id, done);
    if (currentConfig.id) this.props.store.put(currentConfig.id, {value: value}, done);
    else this.props.store.post({key: 'InstanceType', value: value}, done);

    function done (err) {
      self.setState({error: err, saving: false});
    }
  }
});

function filterKeys(configs, key) {
  return configs.filter(function (config) {
      return (config.key === key)
    })[0] || {};
}