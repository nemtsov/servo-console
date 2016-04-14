var React = require('react'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  DeleteOriginModal = require('./DeleteOriginModal'),
  PermissionModal = require('./Permission/PermissionModal'),
  TimeAgo = require('_/components/Common/TimeAgo');

module.exports = React.createClass({
  mixins: [Router.State],

  getInitialState: function () {
    return {
      error: null,
      saving: false,
      open: false,
      weight: this.props.origin.weight,
      suspended: this.props.origin.suspended
    }
  },

  originStatus: function (origin) {
    var healthPercentage = this.originHealthPercentage(origin);
    if (origin.suspended) return 'suspended';
    if (healthPercentage === 100) return 'online';
    if (healthPercentage < 18) return 'offline';
    return 'degraded';
  },

  statusStyleMap: {
    suspended: 'default',
    online: 'success',
    offline: 'danger',
    degraded: 'warning'
  },

  originHealthPercentage: function (origin) {
    if (!origin.health.status) return 0;
    var health = 0;
    origin.health.status.forEach(function (status) {
      if (status.healthy) health++;
    });
    return Math.ceil(100 * health / origin.health.status.length);
  },

  toggleOpen: function () {
    this.setState({open: !this.state.open});
  },

  changeWeight: function (event) {
    this.setState({weight: parseInt(event.target.value)});
  },

  changeSuspended: function (event) {
    this.setState({suspended: event.target.checked});
  },

  updateOrigin: function () {
    var self = this,
      change = {};
    if (this.props.origin.weight !== this.state.weight) change.weight = this.state.weight;
    if (this.props.origin.suspended !== this.state.suspended) change.suspended = this.state.suspended;
    this.setState({saving: true});
    this.props.store.put(this.props.origin.id, change, function (err) {
      self.setState({saving: false});
      if (err) self.setState({error: err});
    })
  },

  render: function() {
    var store = this.props.store,
      origin = this.props.origin,
      status = this.originStatus(origin),
      params = this.getParams(),
      weightOptions = [],
      changed = (origin.weight !== this.state.weight || origin.suspended !== this.state.suspended),
      weights = 0,
      weight;

    store.data.forEach(function (o) {
      if (o.region === origin.region && o.failover === origin.failover) weights += o.weight
    });
    weight = Math.ceil(origin.weight / weights * 100);

    for (var i = 0; i < 256; i++) {
      weightOptions.push(<option value={i} key={i}>{i}</option>)
    }

    return (
      <li className="list-group-item OriginItem">
        <div className="summary" onClick={this.toggleOpen}>
          <div className="expand">
            <Boot.Glyphicon glyph={(this.state.open) ? "chevron-down" : "chevron-right"}/>
          </div>
          <Boot.Label bsStyle={this.statusStyleMap[status]}>{status}</Boot.Label>
          {(origin.failover) ? <Boot.Label bsStyle="warning">failover</Boot.Label> : null}
          <Boot.ModalTrigger modal={<PermissionModal params={params} distribution={this.props.origin.distributionId} origin={this.props.origin.id}/>}>
            <Boot.Button bsSize='small'>
              <i className='fa fa-key'></i>
            </Boot.Button>
          </Boot.ModalTrigger>
          {' ' + origin.address}
        </div>
        <div className={(this.state.open) ? 'details' : 'hidden'}>
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <Boot.Row>
            <Boot.Col md={6} className="form-horizontal">
              <Boot.Row>
                <Boot.Col md={6}>
                  <Boot.Input type="select" labelClassName="col-xs-4" wrapperClassName="col-xs-8" label="Weight"
                              placeholder="select" value={this.state.weight} onChange={this.changeWeight}>
                    {weightOptions.map(function (option) {
                      return option;
                    })}
                  </Boot.Input>
                </Boot.Col>
                <Boot.Col md={6}>
                  <Boot.Button disabled={(!changed || this.state.saving) ? true : false}
                               bsStyle={(changed) ? 'primary' : 'default'}
                               onClick={this.updateOrigin}>
                    {(this.state.saving) ? 'Saving' : 'Save Changes'}
                  </Boot.Button>
                </Boot.Col>
              </Boot.Row>
              <Boot.Row>
                <Boot.Col md={6}>
                  <Boot.Input type="checkbox" label="Suspended" wrapperClassName="col-xs-offset-2 col-xs-10"
                              checked={this.state.suspended} onChange={this.changeSuspended} />
                </Boot.Col>
                <Boot.Col md={6}>
                  <Boot.ModalTrigger modal={<DeleteOriginModal store={store} origin={origin}/>}>
                    <Boot.Button bsStyle="danger">Delete Origin</Boot.Button>
                  </Boot.ModalTrigger>
                </Boot.Col>
              </Boot.Row>
            </Boot.Col>
            <Boot.Col md={6}>
              <div><strong>REGION</strong> {origin.region}</div>
              <div>
                <strong>HEALTH</strong> {origin.health.type}:{origin.health.port}
                {(origin.health.path) ? origin.health.path : null}
              </div>
              <div><strong>WEIGHT</strong> {origin.weight} ({weight}% in {origin.region}
                {(origin.failover) ? ' for failover' : ''})</div>
            </Boot.Col>
          </Boot.Row>
          <hr />
          {(origin.health.status) ?origin.health.status.map(function (status) {
            return <div key={status.sourceIpAddress} className="healthStatus">
              Check from {status.sourceIpAddress} <TimeAgo date={status.time}/><br/>{status.message}
            </div>
          }) : null}
        </div>
      </li>
    );
  }
});
