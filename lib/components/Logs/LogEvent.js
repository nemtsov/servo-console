var React = require('react'),
  Boot = require('react-bootstrap'),
  moment = require('moment');

module.exports = React.createClass({
  render: function () {
    var event = this.props.event,
      workerColor = this.props.options.workerColors[this.props.event.workerId],
      workerStyle = {backgroundColor: workerColor};
    return (
      <div className="LogEvent">
        {(this.props.options.timestamp) ?
          <span className="timestamp">
            {
              (this.props.options.timezone === 'utc') ?
              moment(event._createdAt).utc().format("MM-DD-YY HH:mm:ss.SSS") :
              moment(event._createdAt).format("MM-DD-YY HH:mm:ss.SSS")
            }
          </span>
          : null}
        {(this.props.options.worker) ?
          <div className="worker" style={workerStyle}>{event.workerId}</div>
          : null}
        <span className="message">{event.message}</span>
        <div style={{clear: 'both'}}/>
      </div>
    );
  }
});