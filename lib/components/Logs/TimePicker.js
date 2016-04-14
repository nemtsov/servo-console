var React = require('react'),
  Boot = require('react-bootstrap'),
  moment = require('moment');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      startingValue: '15m',
      endingValue: 'now',
      starting: this.timeConverter('15m'),
      ending: 'now'
    };
  },

  render: function () {
    return (
      <div className="TimePicker">
        <div className="starting">
          <div className="form-horizontal">
            <label className="col-sm-3 control-label" htmlFor="timeSelect">Starting</label>
            <div className="col-sm-9">
              <select className="form-control" id="timeSelect"
                      value={this.state.startingValue} onChange={this.startSelectChangeHandler}>
                <option value="15m">15 minutes ago</option>
                <option value="30m">30 minutes ago</option>
                <option value="1h">1 hour ago</option>
                <option value="6h">6 hours ago</option>
                <option value="24h">24 hours ago</option>
                <option value="3d">3 days ago</option>
                <option value="1w">1 week ago</option>
                <option value="2w">2 weeks ago</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ending">
          <div className="form-horizontal">
            <label className="col-sm-3 control-label" htmlFor="timeSelect">Ending</label>
            <div className="col-sm-9">
              <select className="form-control" id="timeSelect"
                      value={this.state.endingValue} onChange={this.endSelectChangeHandler}>
                <option value="now">Right Now</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  },

  startSelectChangeHandler: function (event) {
    var value = event.target.value;
    if (value === 'custom') return; //handle custom
    var time = this.timeConverter(value);
    this.setState({startingValue: value, starting: time});
    this.sendUpdate(this.timeConverter(value), null);
  },

  endSelectChangeHandler: function (event) {
    var value = event.target.value;
    if (value === 'custom') return; //handle custom
    if (value === 'now') {
      this.setState({endingValue: value, ending: value});
      return this.sendUpdate(null, value);
    }
    var time = this.timeConverter(value);
    this.setState({startValue: value, starting: time});
    this.sendUpdate(null, time);
  },

  sendUpdate: function (start, end) {
    this.props.handler(start || this.state.starting, end || this.state.ending);
  },

  timeConverter: function (ago) {
    switch (ago) {
      case '15m':
        return moment().subtract(15, 'm').valueOf();
      break;
      case '30m':
        return moment().subtract(30, 'm').valueOf();
      break;
      case '1h':
        return moment().subtract(1, 'h').valueOf();
      break;
      case '6h':
        return moment().subtract(6, 'h').valueOf();
      break;
      case '24h':
        return moment().subtract(24, 'h').valueOf();
      break;
      case '3d':
        return moment().subtract(1, 'd').valueOf();
      break;
      case '1w':
        return moment().subtract(1, 'w').valueOf();
      break;
      case '2w':
        return moment().subtract(2, 'w').valueOf();
      break;
    }
  }
});