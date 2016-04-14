var React = require('react'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  OriginStore = require('_/stores/origin'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  CreateOriginModal = require('./CreateOriginModal'),
  OriginItem = require('./OriginItem');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var distributionId = this.props.distributionId;
    return {
      origins: new OriginStore(this.getParams(), distributionId).register(this, 'origins')
    }
  },

  componentWillReceiveProps: function (props) {
    if (props.distributionId === this.props.distributionId) return;
    this.state.origins.deregister();
    var newOriginStore = new OriginStore(this.getParams(), props.distributionId).register(this, 'origins');
    this.setState({
      origins: newOriginStore
    });
    newOriginStore.refresh();
  },

  render: function() {
    var store = this.state.origins;
    this.state.origins.data.sort(function (a, b) {
      if (a.failover && !b.failover) return 1;
      if (!a.failover && b.failover) return -1;
      return 0;
    });
    return (
      <ul className="OriginList list-group">
        <Boot.ModalTrigger modal={<CreateOriginModal store={this.state.origins} />}>
          <Boot.Button bsStyle="success" bsSize="small" pullRight>
            <Boot.Glyphicon glyph="plus"/> New Origin
          </Boot.Button>
        </Boot.ModalTrigger>
        <StoreStatus store={store} />
        {this.state.origins.data.map(function (origin) {
          return <OriginItem key={origin.id} store={store} origin={origin} />
        })}
      </ul>
    );
  }
});
