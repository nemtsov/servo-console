var React = require('react'),
  Boot = require('react-bootstrap'),
  NotificationDestination = require('./NotificationDestination'),
  EventMap = require('./EventMap.json');


module.exports = React.createClass({
  displayName: 'NotificationItem',

  getInitialState: function () {
    var services = Object.keys(EventMap),
      notification = this.props.notification && JSON.parse(JSON.stringify(this.props.notification)),
      type = notification && notification.type && notification.type.match(/([A-Z][a-z]+)/g) || [],
      service = (type[2] ? (type[0] + type[1]) : type[0]) || services[0];

    return {
      editing: this.props.initialEditing,
      service: service,
      event: (type[2] ? type[2] : type[1]) || EventMap[service][0],
      destinations: notification && notification.destinations || [{
        transport: 'slack',
        address: '',
        team: ''
      }]
    };
  },

  selectService: function (event) {
    var service = event.target.value,
      events = EventMap[service];
    this.setState({
      service: service,
      event: events[0]
    });
  },

  selectEvent: function (event) {
    this.setState({event: event.target.value});
  },

  updateDestination: function (index, key, value) {
    var currentDestinations = this.state.destinations.slice(0);
    currentDestinations[index][key] = value;
    this.setState({destinations: currentDestinations});
  },

  removeDestination: function (index) {
    var destinations = this.state.destinations;
    this.setState({destinations: destinations.slice(0, index).concat(destinations.slice(index+1, destinations.length))});
  },

  addDestination: function () {
    var currentDestinations = this.state.destinations.slice(0);
    currentDestinations.push({
      transport: 'slack',
      address: '',
      team: ''
    });
    this.setState({destinations: currentDestinations});
  },

  save: function () {
    var self = this,
      notification = {
        type: this.state.service + this.state.event,
        destinations: this.state.destinations.map(function (destination) {
          var temp = {transport: destination.transport.toLowerCase(), address: destination.address};
          if (destination.transport.match('slack')) temp.team = destination.team || self.props.slackTeams[0];
          return temp;
        })
      };
    if (this.props.initialEditing)
      return this.props.add(notification, function () {
        this.props.cancel();
      }.bind(this));

    this.props.update(this.props.notification.id, notification, function () {
      this.toggleEditingState();
    }.bind(this));
  },

  toggleEditingState: function () {
    this.setState({editing: !this.state.editing});
  },

  cancel: function () {
    if (this.props.initialEditing) return this.props.cancel();

    var services = Object.keys(EventMap),
      notification = JSON.parse(JSON.stringify(this.props.notification)),
      type = notification.type.match(/([A-Z][a-z]+)/g),
      service = type[2] ? (type[0] + type[1]) : type[0];


    this.setState({
      service: service,
      event: type[2] ? type[2] : type[1],
      destinations: notification.destinations
    }, this.toggleEditingState);
  },

  remove: function () {
    this.props.remove(this.props.notification.id);
  },

  render: function () {
    var isEditing = this.state.editing,
      services = Object.keys(EventMap),
      events = EventMap[this.state.service],
      notification = this.props.notification;

    return (
      <Boot.Row>
        <Boot.Col md={3}>
          <Boot.Row>
            <Boot.Col md={6}>
              {
                isEditing ?
                <Boot.Input type='select' value={this.state.service} onChange={this.selectService}>
                  {services.map(function (service, index) {
                    return <option value={service} key={index}>{service}</option>
                  })}
                </Boot.Input> :
                <h4>{this.state.service}</h4>
              }
            </Boot.Col>
            <Boot.Col md={6}>
              {
                isEditing ?
                <Boot.Input type='select' value={this.state.event} onChange={this.selectEvent}>
                  {events.map(function (event, index) {
                    return <option value={event} key={index}>{event}</option>
                  })}
                </Boot.Input> :
                <h4>{this.state.event}</h4>
              }
            </Boot.Col>
          </Boot.Row>
        </Boot.Col>
        <Boot.Col md={7}>
          {
            isEditing ?
            <Boot.Well className='destWell'>
              <Boot.Row>
                <Boot.Col md={12}>
                {
                  this.state.destinations.map(function (destination, index) {
                    return <NotificationDestination
                              key={index}
                              index={index}
                              destination={destination}
                              transports={this.props.transports}
                              slackTeams={this.props.slackTeams}
                              update={this.updateDestination}
                              remove={this.removeDestination}
                              editing={true}/>
                  }.bind(this))
                }
                  <Boot.Row>
                    <Boot.Col md={2}>
                      <Boot.Button onClick={this.addDestination} bsStyle='success' bsSize="small" className='addDestButton'>Add a destination</Boot.Button>
                    </Boot.Col>
                    <Boot.Col md={10}/>
                  </Boot.Row>
                </Boot.Col>
              </Boot.Row>
            </Boot.Well>:
            <Boot.Well className='destWell'>
            {
                this.state.destinations.map(function (destination, index) {
                  return <NotificationDestination key={index} destination={destination}/>
                })
            }
            </Boot.Well>
          }
        </Boot.Col>
        <Boot.Col md={2}>
        {
          isEditing ?
          <Boot.Row>

            <Boot.Col md={3}>
              <Boot.Button onClick={this.save} bsStyle='primary'><i className="fa fa-floppy-o"></i></Boot.Button>
            </Boot.Col>
            <Boot.Col md={5}>
              <Boot.Button onClick={this.cancel} bsStyle='danger'><i className="fa fa-ban"></i></Boot.Button>
            </Boot.Col>
          </Boot.Row> :
          <Boot.Row>
            <Boot.Col md={3}>
              <Boot.Button bsStyle='primary' onClick={this.toggleEditingState} ><i className="fa fa-pencil"></i></Boot.Button>
            </Boot.Col>
            <Boot.Col md={5}>
              <Boot.Button bsStyle='danger' onClick={this.remove} ><i className="fa fa-trash-o"></i></Boot.Button>
            </Boot.Col>
          </Boot.Row>
        }
        </Boot.Col>
      </Boot.Row>
    )
  }
});
