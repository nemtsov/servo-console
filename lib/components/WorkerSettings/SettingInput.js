var React = require('react'),
  Boot = require('react-bootstrap'),
  instanceTypes = require('_/constants/instanceTypes');

module.exports = React.createClass({
  getInitialState: function () {
    return {saving: false, error: null, newValue: null};
  },

  render: function () {
    var self = this,
      key = this.props.settingKey,
      current = (this.state.newValue === null) ? this.props.current[key] : this.state.newValue,
      inherited = this.props.defaults[key],
      deployed = this.props.deployed[key],
      alreadyDeployed = false;

    if (this.props.current[key] === 'default' && deployed === inherited) alreadyDeployed = true;
    if (this.props.current[key] === deployed) alreadyDeployed = true;

    return <form className="form-inline SettingInput">
      <Boot.Row>
        <Boot.Col xs={7}>
          <div className="inputTitle">
            <span>{this.props.description} </span>
            {(!alreadyDeployed) ?
              <span><Boot.OverlayTrigger placement="right" overlay={
              <Boot.Tooltip>
                This has not yet been deployed.<br/>
                The current deployed setting is {deployed}.
              </Boot.Tooltip>
              }><i className="fa fa-exclamation-triangle"></i>
              </Boot.OverlayTrigger> </span>: null}
            {(self.state.error) ? <Boot.Label bsStyle="danger">{self.state.error.message}</Boot.Label> : null}
          </div>
        </Boot.Col>
        <Boot.Col xs={5}>
          <div className="pull-right">
            <div className="checkbox">
              <label>
                <input type="checkbox" onChange={self.handleCheckChange}
                       checked={(current === 'default')}/> Use Default
              </label>
            </div>
            <div className="form-group">
              <input type="text" className="form-control"
                     onChange={self.handleTextChange}
                     value={(current === 'default') ? inherited : current}
                     disabled={(current === 'default')} />
            </div>
          </div>
          <div className="pull-right">
            {(self.state.newValue !== null) ?
              <span>
                <button onClick={self.handleSave} className="btn btn-sm btn-primary">Save</button>
                <button onClick={self.handleCancel} className="btn btn-sm btn-default">Cancel</button>
              </span>
              : null}
          </div>
        </Boot.Col>
      </Boot.Row>
    </form>;
  },

  handleCheckChange: function (event) {
    if (event.target.checked) this.setState({newValue: 'default'});
    else this.setState({newValue: this.props.defaults[this.props.settingKey]})
  },

  handleTextChange: function (event) {
    this.setState({newValue: event.target.value});
  },

  handleCancel: function () {
    this.setState({newValue: null, error: null});
  },

  handleSave: function (event) {
    event.preventDefault();
    var self = this,
      key = this.props.settingKey,
      value = (this.state.newValue === 'default') ? 'default' : parseInt(this.state.newValue),
      currentConfig = filterKeys(this.props.store.data, key);
    if (value !== 'default' && isNaN(value))
      return this.setState({error: {message: 'Value must be between 1-100'}});
    if (value !== 'default' && (value > 100 || value < 1))
      return this.setState({error: {message: 'Value must be between 1-100'}});
    this.setState({saving: true, error: null});
    if (value === 'default') {
      if (!currentConfig.id) return this.setState({newValue: null});
      return this.props.store.del(currentConfig.id, done);
    }
    if (currentConfig.id) this.props.store.put(currentConfig.id, {value: value.toString()}, done);
    else this.props.store.post({key: key, value: value.toString()}, done);

    function done (err) {
      self.setState({error: err, saving: false});
      if (!err) self.setState({newValue: null});
    }
  }
});

function filterKeys(configs, key) {
  return configs.filter(function (config) {
      return (config.key === key)
    })[0] || {};
}