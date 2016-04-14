var React = require('react'),
  Boot = require('react-bootstrap'),
  instanceTypes = require('_/constants/instanceTypes');

module.exports = React.createClass({
  render: function () {
    var self = this,
      settings = {},
      minCost, maxCost;
    Object.keys(this.props.settings).forEach(function (setting) {
      if (self.props.settings[setting] === 'default') {
        settings[setting] = self.props.defaults[setting];
      } else {
        settings[setting] = self.props.settings[setting];
      }
    });
    minCost = monthlyCost(settings.InstanceType) * parseInt(settings.MinWorkers) || 0;
    maxCost = monthlyCost(settings.InstanceType) * parseInt(settings.MaxWorkers) || 0;
    return <Boot.Panel className="summary">
      <Boot.Row className="costs">
        <Boot.Col xs={12} className="text-center">Estimated Monthly Costs</Boot.Col>
      </Boot.Row>
      <Boot.Row className="costs">
        <Boot.Col xs={4} xsOffset={1} className="text-center dollars">${minCost}</Boot.Col>
        <Boot.Col xs={2} className="text-center hyphen">-</Boot.Col>
        <Boot.Col xs={4} className="text-center dollars">${maxCost}</Boot.Col>
      </Boot.Row>
      <Boot.Row>
        <Boot.Col xs={4} xsOffset={1} className="text-center">at min scale</Boot.Col>
        <Boot.Col xs={2}></Boot.Col>
        <Boot.Col xs={4} className="text-center">at max scale</Boot.Col>
      </Boot.Row>
      <h3>
        This stack will scale up if the average CPU of all workers goes
        <strong> above {settings.ScaleUpThreshold}% </strong>
        for <strong>{settings.ScaleUpDuration} {(parseInt(settings.ScaleUpDuration) < 2) ? 'minute' : 'minutes'} </strong>
        to <strong>{settings.MaxWorkers} {(parseInt(settings.MaxWorkers) < 2) ? 'worker' : 'workers'} maximum</strong>.
        When the average CPU of all workers stays <strong>below {settings.ScaleDownThreshold}%</strong> for
        <strong> {settings.ScaleDownDuration} {(parseInt(settings.ScaleDownDuration) < 2) ? 'minute' : 'minutes'}</strong>,
        the stack will scale down to as few
        as <strong>{settings.MinWorkers} {(parseInt(settings.MinWorkers) < 2) ? 'worker' : 'workers'}</strong>.
      </h3>
      {(parseInt(settings.MinWorkers) === 1) ?
        <Boot.Alert bsStyle="warning">
          <i className="fa fa-exclamation-circle"></i> A minimum worker capacity of 1 can leave
          your application with no redundancy
        </Boot.Alert>
      : null}
    </Boot.Panel>
  }
});

function monthlyCost(instanceType) {
  var instance = instanceTypes.filter(function (type) {
    return (type.value === instanceType)
  })[0];
  if (!instance) return 0;
  return Math.floor(instance.cost * 24 * 30);
}