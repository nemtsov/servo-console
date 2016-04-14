var React = require('react'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  TransportsStore = require('_/stores/transports'),
  NotificationStore = require('_/stores/notification'),
  NotificationItem = require('./NotificationItem'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  displayName: 'NotificationPage',

  getInitialState: function () {
    var params = this.getParams();
    return {
      notifications: new NotificationStore(params).register(this, 'notifications'),
      transports: new TransportsStore(params).register(this, 'transports'),
      adding: false
    };
  },

  toggleAddingState: function () {
    return this.setState({adding: !this.state.adding});
  },

  addNotification: function (notification, cb) {
    this.state.notifications.post(notification, function (err) {
      if (err) return this.setState({error:err.message || err});
      cb();
    }.bind(this));
  },

  updateNotification: function (id, notification, cb) {
    this.state.notifications.put(id, notification, function (err) {
      if (err) return this.setState({error:err.message || err});
      cb();
    }.bind(this));
  },

  removeNotification: function (id, cb) {
    this.state.notifications.del(id, function (err) {
      if (err) return this.setState({error: err.message || err});
    });
  },

  parseTransports: function (transports) {
    var types = ['Email', 'Webhook'];
    transports.forEach(function (transport) {
      if (transport.type === 'Twilio') {
        types.push('Sms');
        types.push('Voice');
      } else {
        types.push(transport.type);
      }
    });
    return types;
  },

  getSlackTeam: function (transports) {
    var teams = [];
    transports.forEach(function (transport) {
      if (transport.type === 'Slack')
        teams = transport.teams;
    });
    if (this.props.editing && teams.length > 0 && !this.props.destination.team) {
      this.props.update(this.props.index, 'team', teams[0]);
    }
    return teams;
  },

  render: function () {
    var params = this.getParams(),
      stackLevel = !!params.stack,
      transports = this.parseTransports(this.state.transports.data),
      slackTeams = this.getSlackTeam(this.state.transports.data),
      notifications = this.state.notifications.data;

    return (
      <div>
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Notifications</h1>
            <StoreStatus store={this.state.notifications} />
          </div>
          <Boot.Well>
            Here you can configure notifications based on events that occur within the context of this stack. There
            are separate transport options for alerting such as email, voice and sms. There is also the option of
            sending webhook notifications to external systems for integrating with Servo.
          </Boot.Well>
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error}</Boot.Alert> : null}
          <Boot.Panel>
            <Boot.Row>
              <Boot.Col md={12}>
                <Boot.Row>
                  <Boot.Col md={3}>
                    <Boot.Row>
                      <Boot.Col md={6}>
                        <h3>Service</h3>
                      </Boot.Col>
                      <Boot.Col md={6}>
                        <h3>Event</h3>
                      </Boot.Col>
                    </Boot.Row>
                  </Boot.Col>
                  <Boot.Col md={6}>
                    <h3>Destinations</h3>
                  </Boot.Col>
                  <Boot.Col md={3}/>
                </Boot.Row>
                {
                  notifications.map(function (notification, index) {
                    return <NotificationItem
                              key={notification.id}
                              notification={notification}
                              transports={transports}
                              slackTeams={slackTeams}
                              remove={this.removeNotification}
                              update={this.updateNotification}/>
                  }.bind(this))
                }
                {!this.state.adding ?
                  <Boot.Row>
                    <Boot.Col md={2}>
                      <Boot.Button onClick={this.toggleAddingState} bsStyle='primary'>Add</Boot.Button>
                    </Boot.Col>
                    <Boot.Col md={10}/>
                  </Boot.Row> :
                  <NotificationItem
                    initialEditing={this.state.adding}
                    transports={transports}
                    slackTeams={slackTeams}
                    add={this.addNotification}
                    cancel={this.toggleAddingState}/>
                }
              </Boot.Col>
            </Boot.Row>
          </Boot.Panel>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
