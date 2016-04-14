var React = require('react'),
  Boot = require('react-bootstrap'),
  NotificationItem = require('./NotificationItem'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    return {
      adding: false
    };
  },

  toggleAddingState: function () {
    return this.setState({adding: !this.state.adding});
  },

  render: function () {
    return (
      <Boot.Row>
        <Boot.Col md={12}>
          <Boot.Row>
            <Boot.Col md={3}>
              <Boot.Row>
                <Boot.Col md={6}>
                  <h4>Service</h4>
                </Boot.Col>
                <Boot.Col md={6}>
                  <h4>Event</h4>
                </Boot.Col>
              </Boot.Row>
            </Boot.Col>
            <Boot.Col md={6}>
              <h4>Destinations</h4>
            </Boot.Col>
            <Boot.Col md={3}/>
          </Boot.Row>
          {
            this.props.notifications.map(function (notification, index) {
              return <NotificationItem key={index} notification={notification}/>
            })
          }
          {!this.state.adding ?
            <Boot.Row>
              <Boot.Col md={4}>
                <Boot.Button onClick={this.toggleAddingState}>Add</Boot.Button>
              </Boot.Col>
              <Boot.Col md={10}/>
            </Boot.Row> :
            <NotificationItem initialEditing={this.state.adding} cancel={this.toggleAddingState}/>
          }
        </Boot.Col>
      </Boot.Row>
    );
  }
});
