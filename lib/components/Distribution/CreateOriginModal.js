var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  getInitialState: function (){
    return {
      error: null,
      saving: false,
      address: '',
      region: 'virginia',
      weight: 100,
      suspended: false,
      failover: false,
      healthType: 'TCP',
      healthPort: 80,
      healthPath: null
    }
  },

  regions: [
    'virginia', 'oregon', 'ireland', 'frankfurt', 'tokyo', 'singapore', 'sydney', 'brazil', 'california'
  ],

  create: function (event) {
    var self = this,
      origin = {
        address: this.state.address,
        region: this.state.region,
        weight: this.state.weight,
        suspended: this.state.suspended,
        failover: this.state.failover,
        health: {
          type: this.state.healthType,
          port: this.state.healthPort
        }
      };
    if (this.state.healthPath) origin.health.path = this.state.healthPath;
    this.setState({saving: true});
    this.props.store.post(origin, function (err) {
      self.setState({saving: false});
      if (err) return self.setState({error: err});
      self.props.onRequestHide(event);
    });
  },

  changeAddress: function (event) {
    this.setState({address: event.target.value});
  },

  changeRegion: function (event) {
    this.setState({region: event.target.value});
  },

  changeWeight: function (event) {
    this.setState({weight: parseInt(event.target.value)});
  },

  changeSuspended: function (event) {
    this.setState({suspended: event.target.checked});
  },

  changeFailover: function (event) {
    this.setState({failover: event.target.checked});
  },

  changeHealthType: function (event) {
    this.setState({healthType: event.target.value});
    if (event.target.value !== 'TCP' && !this.state.healthPath) this.setState({healthPath: '/_health'});
    if (event.target.value === 'TCP') this.setState({healthPath: null});
    if (event.target.value === 'HTTP') this.setState({healthPort: 80});
    if (event.target.value === 'HTTPS') this.setState({healthPort: 443});
  },

  changeHealthPort: function (event) {
    this.setState({healthPort: parseInt(event.target.value)});
  },

  changeHealthPath: function (event) {
    this.setState({healthPath: event.target.value});
  },

  render: function() {
    var weightOptions = [];
    for (var i = 0; i < 256; i++) {
      weightOptions.push(<option value={i} key={i}>{i}</option>)
    }

    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide} bsStyle="primary" title="New Site Control Origin"
        animation={true} refs="modal">
        <div className="modal-body">
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <form className="form-horizontal">
            <Boot.Input type="text" label="Address" placeholder="Origin address (like foo.bar.com)"
                    onChange={this.changeAddress} value={this.state.address}
                    labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
            <Boot.Input type="select" label="Region closest to the origin for latency-based client geolocation"
                        onChange={this.changeRegion} value={this.state.region}
                        labelClassName="col-xs-6" wrapperClassName="col-xs-4">
              {this.regions.map(function (region) {
                return <option value={region} key={region}>{region}</option>
              })}
            </Boot.Input>
            <Boot.Input type="select" label="Weight value relative to other available origins the same region"
                        onChange={this.changeWeight} value={this.state.weight}
                        labelClassName="col-xs-6" wrapperClassName="col-xs-2">
              {weightOptions.map(function (option) {
                return option;
              })}
            </Boot.Input>
            <Boot.Input type="select" label="Health check protocol" value={this.state.healthType}
                        onChange={this.changeHealthType}
                        labelClassName="col-xs-6" wrapperClassName="col-xs-4">
              <option value="TCP">TCP Port Availability</option>
              <option value="HTTP">HTTP GET Request</option>
              <option value="HTTPS">HTTPS GET Request</option>
            </Boot.Input>
            <Boot.Input type="text" label="Health check port" value={this.state.healthPort}
                        onChange={this.changeHealthPort}
                        labelClassName="col-xs-6" wrapperClassName="col-xs-2" />
            {(this.state.healthType !== 'TCP') ?
              <Boot.Input type="text" label="Health check request path" value={this.state.healthPath}
                          onChange={this.changeHealthPath}
                        labelClassName="col-xs-6" wrapperClassName="col-xs-4" />
            : null}

            <Boot.Input type="checkbox" label="This origin should only be used for failover"
                        onChange={this.changeFailover}
                        wrapperClassName="col-xs-offset-2 col-xs-10"
                        checked={this.state.failover} />
            <Boot.Input type="checkbox" label="This origin should be suspended upon creation"
                        onChange={this.changeSuspended}
                        wrapperClassName="col-xs-offset-2 col-xs-10"
                        checked={this.state.suspended} />
            <Boot.Button className="center-block" bsStyle="success"
                         onClick={this.create} disabled={(this.state.saving)}>
              <i className="fa fa-check"></i> Create
            </Boot.Button>
          </form>
        </div>
      </Boot.Modal>
    );
  }
});
