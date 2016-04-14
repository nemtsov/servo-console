var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  DistributionStore = require('_/stores/distribution'),
  CreateDistributionModal = require('./CreateDistributionModal'),
  DeleteDistributionModal = require('./DeleteDistributionModal'),
  PermissionModal = require('./Permission/PermissionModal'),
  OriginList = require('./OriginList'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      distributions: new DistributionStore(params).register(this, 'distributions'),
      distributionId: null,
      error: null
    };
  },

  selectDistribution: function (distributionId) {
    this.setState({distributionId: distributionId});
  },

  clearDistributionSelection: function () {
    this.setState({distributionId: null})
  },

  render: function () {
    var self = this,
      params = this.getParams(),
      selectedDistribution = this.state.distributionId,
      distribution = (selectedDistribution) ? this.state.distributions.get(selectedDistribution) : null;
    return (
      <div className="DistributionPage">
        <Header />
        {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
        <Boot.Grid>
          <div className="Title">
            <h1>Site Control <small><sup>beta</sup></small></h1>
          </div>
          <Boot.Well>
            Site Control allows you to create DNS based load balanced endpoints which take client location, origin
            health, custom weights and failover rules into consideration. Changes take approximately 1 minute
            to take effect. Distributions are global and can be managed through any Servo region. <strong>This feature
            is currently in beta and should only be used by those explicitly included in the beta!</strong>
          </Boot.Well>
          <Boot.Row>
            <Boot.Col md={4}>
              <Boot.Panel className="distributions">
                <h3>
                  Distributions
                  <Boot.ModalTrigger modal={<CreateDistributionModal store={this.state.distributions} />}>
                    <Boot.Button bsStyle="success" bsSize="small" pullRight>
                      <Boot.Glyphicon glyph="plus"/> New
                    </Boot.Button>
                  </Boot.ModalTrigger>
                <StoreStatus store={this.state.distributions} iconOnly />
                </h3>
                <Boot.ListGroup fill>
                  {this.state.distributions.data.map(function (distribution) {
                    return <a href="#" key={distribution.id}
                              onClick={self.selectDistribution.bind(self, distribution.id)}
                              className={(distribution.id === selectedDistribution) ? 'list-group-item active' : 'list-group-item'}>
                      {distribution.id}
                    </a>
                  })}
                </Boot.ListGroup>
              </Boot.Panel>
            </Boot.Col>
            <Boot.Col md={8}>
              {(this.state.distributionId && distribution) ?
                <div className="panel panel-default">
                  <h4>
                    <strong>Endpoint  </strong>
                      <Boot.ModalTrigger modal={<PermissionModal params={params} distribution={selectedDistribution}/>}>
                        <Boot.Button bsSize='small'>
                          <i className='fa fa-key'></i>
                        </Boot.Button>
                      </Boot.ModalTrigger>
                      {distribution.endpoint}

                    <Boot.ModalTrigger modal={<DeleteDistributionModal store={this.state.distributions}
                      distributionId={selectedDistribution} hide={this.clearDistributionSelection}/>}>
                      <Boot.Button className="pull-right" bsStyle="danger" bsSize="small">
                        Delete Distribution
                      </Boot.Button>
                    </Boot.ModalTrigger>
                  </h4>
                  <OriginList distributionId={this.state.distributionId} />
                </div>
              : <Boot.Panel>
                Select a distribution to see more details
              </Boot.Panel>}
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
