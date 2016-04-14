var React = require('react'),
  Boot = require('react-bootstrap'),
  moment = require('moment');

module.exports = React.createClass({
  timeago: function () {
    this.setState({timeago: timeagoMessage(this.props.date)});
  },

  getInitialState: function () {
    return {timeago: timeagoMessage(this.props.date)};
  },

  componentWillReceiveProps: function () {
    this.setState({timeago: timeagoMessage(this.props.date)});
  },

  componentDidMount: function () {
    this._interval = setInterval(this.timeago, 1000);
  },

  componentWillUnmount: function () {
    clearInterval(this._interval);
  },

  render: function () {
    var tooltip = <Boot.Tooltip>{moment(this.props.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Boot.Tooltip>;
    return (
      <Boot.OverlayTrigger placement="bottom" overlay={tooltip}>
        <span className="TimeAgo">{this.state.timeago}</span>
      </Boot.OverlayTrigger>
    )
  }
});

function timeagoMessage(date) {
  if (!date) return 'never';
  var then = new Date(date).valueOf(),
    now = Date.now(),
    seconds = Math.round(Math.abs(now-then)/1000),
    suffix = then < now ? 'ago' : 'from now',
    value, unit;

  if (seconds < 30){
    return 'a few seconds ' + suffix;
  } else if (seconds < 60){
    return 'less than a minute '  + suffix;
  } else if (seconds < 60*60) {
    value = Math.round(seconds/60);
    unit = 'minute';
  } else if (seconds < 60*60*24) {
    value = Math.round(seconds/(60*60));
    unit = 'hour'
  } else if (seconds < 60*60*24*7) {
    value = Math.round(seconds/(60*60*24));
    unit = 'day';
  } else if (seconds < 60*60*24*30) {
    value = Math.round(seconds/(60*60*24*7));
    unit = 'week';
  } else if (seconds < 60*60*24*365) {
    value = Math.round(seconds/(60*60*24*30));
    unit = 'month';
  } else {
    value = Math.round(seconds/(60*60*24*365));
    unit = 'year';
  }
  if (value !== 1){
    unit += 's'
  }
  return value + ' ' + unit + ' ' + suffix
}