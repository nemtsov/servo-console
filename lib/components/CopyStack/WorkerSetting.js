var React = require('react'),
  Boot = require('react-bootstrap'),
  WorkerSettingItem = require('./WorkerSettingItem');

module.exports = React.createClass({
  displayName: 'CopyWorkerSetting',

  render: function () {
    var workerSettings = this.props.workerSettings;

    return (
      <Boot.Row>
        <Boot.Col md={12}>
          <Boot.Row>
            <Boot.Col md={12}>
              <h2>Worker Settings</h2>
            </Boot.Col>
          </Boot.Row>
          <Boot.Well>
            {
              workerSettings.length ?
              <Boot.Row>
                <Boot.Col md={3}><h3>Setting Name</h3></Boot.Col>
                <Boot.Col md={9}><h3>Value</h3></Boot.Col>
              </Boot.Row> : 
              <Boot.Row>
                <Boot.Col md={12}><h3>No worker setting to be copied</h3></Boot.Col>
              </Boot.Row>              
            }
            {
              workerSettings.map(function (config) {
                return <WorkerSettingItem key={config.key} item={config} update={this.props.update} revert={this.props.revert} remove={this.props.remove}/>;
              }, this)
            }
          </Boot.Well>
        </Boot.Col>
      </Boot.Row>    
      
    );
  }
});