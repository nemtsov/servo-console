var React = require('react'),
  Boot = require('react-bootstrap'),
  EnvVarItem = require('./EnvVarItem');

module.exports = React.createClass({
  displayName: 'CopyEnvVar',

  render: function () {
    var envVariables = this.props.envVariables;

    return (
      <Boot.Row>
        <Boot.Col md={12}>
          <Boot.Row>
            <Boot.Col md={12}>
              <h2>Environment Variables</h2>
            </Boot.Col>
          </Boot.Row>
          <Boot.Well>
            {
              envVariables.length ?
              <Boot.Row>
                <Boot.Col md={3}><h3>Variable Name</h3></Boot.Col>
                <Boot.Col md={5}><h3>Value</h3></Boot.Col>
                <Boot.Col md={4}><h3>Secret</h3></Boot.Col>
              </Boot.Row> : 
              <Boot.Row>
                <Boot.Col md={12}><h3>No environment variable to be copied</h3></Boot.Col>
              </Boot.Row>              
            }
            {
              envVariables.map(function (config) {
                return <EnvVarItem key={config.key} item={config} update={this.props.update} revert={this.props.revert} remove={this.props.remove}/>;
              }, this)
            }
          </Boot.Well>
        </Boot.Col>
      </Boot.Row>
    );
  }
});
