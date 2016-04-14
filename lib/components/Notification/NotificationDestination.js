var React = require('react'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  placeholders = {
    SMS: '555-123-4567',
    Voice: '555-123-4567',
    OpsGenie: 'Team Name',
    Webhook: 'https://some-domain.com/foo',
    Email: 'john.doe@email.com',
    Slack: '#channel or @user'
  };

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  displayName: 'NotificationDestination',

  update: function (key, event) {
    this.props.update(this.props.index, key, event.target.value);
  },

  remove: function () {
    this.props.remove(this.props.index);
  },

  addIcon: function (transport) {
    switch(transport){
      case 'Slack':
        return (<div><i className="fa fa-slack"> </i> {transport}</div>);
        break;
      case 'Email':
        return (<div><i className="fa fa-envelope"> </i> {transport}</div>);
        break;
      case 'OpsGenie':
        return (<div><i className="fa fa-bullseye"> </i> {transport}</div>);
        break;
      case 'Voice':
        return (<div><i className="fa fa-phone"> </i> {transport}</div>);
        break;
      case 'Sms':
        return (<div><i className="fa fa-mobile"> </i> SMS</div>);
        break;
      case 'Webhook':
        return (<div><i className="fa fa-cog"> </i> {transport}</div>);
        break;
    }
  },

  render: function () {
    var isEditing = this.props.editing,
      destination = this.props.destination,
      transports = this.props.transports,
      slackTeams = this.props.slackTeams,
      transport = destination.transport.charAt(0).toUpperCase() + destination.transport.slice(1);

    return (
      <Boot.Row>
        <Boot.Col md={3}>
          {
            isEditing ?
            <Boot.Input className='transportDropdown' type='select' value={transport} onChange={this.update.bind(this, 'transport')}>
              {transports.map(function (transport, index) {
                return <option value={transport} key={index}>{transport}</option>
              })}
            </Boot.Input> :
            <h5> {this.addIcon(transport)}</h5>
          }

        </Boot.Col>
        <Boot.Col md={transport.match('Slack') ? 4 : 8}>
          {
            isEditing ?
            <Boot.Input type='text' value={destination.address} placeholder={placeholders[transport]} onChange={this.update.bind(this, 'address')}/> :
            <h5>{destination.address}</h5>
          }
        </Boot.Col>
        {
          transport.match('Slack') ?
          <Boot.Col md={4}>
          {
            isEditing ?
            <Boot.Input type='select' value={destination.team} onChange={this.update.bind(this, 'team')}>
              {slackTeams.map(function (team) {
                return <option key={team} value={team}>{team}</option>
              })}
            </Boot.Input> : <h5><i className="fa fa-users"/> {destination.team}</h5>

          }
          </Boot.Col>
          :null
        }
        <Boot.Col md={1}>
          {
            isEditing ?
            <Boot.Button onClick={this.remove} bsStyle='danger'><i className="fa fa-trash-o"></i></Boot.Button> :
            null
          }
        </Boot.Col>
      </Boot.Row>
    )
  }
});
