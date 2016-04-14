var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  TimePicker = require('./TimePicker'),
  LogStore = require('_/stores/logs'),
  LogEvent = require('./LogEvent');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams(),
      starting = new Date(new Date().getTime() - 15 * 60 * 1000).getTime();
    this.workerColors = {};
    this.tailEnd = true;
    this.store = new LogStore(params, 'app', {createdAfter: starting}).register(this, 'logs');
    return {
      logs: this.store,
      showWorker: true,
      showTimestamp: true,
      showDeploy: false,
      timezone: 'local',
      starting: starting,
      ending: new Date().getTime(),
      filter: null
    };
  },

  componentDidUpdate: function () {
    if (!this.tailEnd) return;
    var logWindow = document.getElementById("logWindow");
    if (logWindow) logWindow.scrollTop = logWindow.scrollHeight;
  },

  render: function () {
    var displayOptions = {
      worker: this.state.showWorker,
      timestamp: this.state.showTimestamp,
      deploy: this.state.showDeploy,
      timezone: this.state.timezone,
      workerColors: this.determineWorkerColors(this.state.logs.data)
    };
    return (
      <div className="LogsPage">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Log Explorer</h1>
          </div>
        </Boot.Grid>
        <div className="viewport">
          <Boot.Grid>
            <Boot.Row>
              <Boot.Col md={3}>
                <Boot.Panel>
                  <div className="form-horizontal search">
                    <div className="input-group">
                      <input type="text" className="form-control" value={this.state.filter} placeholder="Search term"
                             onChange={this.filterChangeHandler} onKeyDown={this.filterKeyHandler}/>
                      <span className="input-group-btn">
                        <button className="btn btn-default" type="button"><i className="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>
                  <TimePicker handler={this.timeRangeHandler} />
                  <div className="form-inline">
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" checked={displayOptions.timestamp}
                               onChange={this.timestampChangeHandler}/> Show Timestamps</label>
                    </div>
                    {(displayOptions.timestamp) ?
                      <select className="form-control pull-right"
                              value={displayOptions.timezone} onChange={this.timezoneChangeHandler}>
                        <option value="local">Local</option>
                        <option value="utc">UTC</option>
                      </select>
                      : null}
                  </div>
                  <div className="form-inline">
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" checked={displayOptions.worker}
                               onChange={this.workerChangeHandler}/> Show Workers</label>
                    </div>
                  </div>
                  {(this.state.logs.error) ? <Boot.Alert bsStyle="danger">{this.state.logs.error.message}</Boot.Alert> : null}
                </Boot.Panel>
              </Boot.Col>
              <Boot.Col md={9}>
                <Boot.Panel className="logWindow" id="logWindow" onScroll={this.scrollHandler}>
                  {(this.state.logs.loading && !this.state.logs.loaded) ? 'Loading...' : null}
                  {this.state.logs.data.map(function (event) {
                    return <LogEvent key={event.id} event={event} options={displayOptions}/>;
                  })}
                </Boot.Panel>
              </Boot.Col>
            </Boot.Row>
          </Boot.Grid>
        </div>
      </div>
    );
  },

  timeRangeHandler: function (start, end) {
    this.setState({starting: start, ending: end});
    this.updateStore(start, end);
  },

  determineWorkerColors: function (data) {
    var colors = this.workerColors,
      next = this.nextWorkerColor || 1,
      available = ['#1777E6', '#0099CC', '#00CC99', '#996633', '#FF9900', '##9900FF', '#FF6699', '#669999'];
    data.forEach(function (event) {
      if (colors[event.workerId]) return;
      colors[event.workerId] = available[next];
      (next >= available.length) ? next = 1 : next++;
    });
    this.nextWorkerColor = next;
    this.workerColors = colors;
    return colors;
  },

  timestampChangeHandler: function (event) {
    this.setState({showTimestamp: event.target.checked});
  },

  timezoneChangeHandler: function (event) {
    this.setState({timezone: event.target.value});
  },

  workerChangeHandler: function (event) {
    this.setState({showWorker: event.target.checked});
  },

  filterChangeHandler: function (event) {
    this.setState({filter: event.target.value});
  },

  filterKeyHandler: function (event) {
    var enterKey = 13;
    if (event.keyCode === enterKey) this.updateStore();
  },

  scrollHandler: function (event) {
    var bottom = event.target.scrollHeight,
      pos = event.target.scrollTop + event.target.offsetHeight -2;
    this.tailEnd = (bottom <= pos + 10);
    (this.tailEnd) ? this.store.resumeRefresh() : this.store.pauseRefresh();
  },

  updateStore: function (start, end) {
    var params = this.getParams(),
      options = {createdAfter: start || this.state.starting};
    if (this.state.filter) options.filter = encodeURIComponent(this.state.filter);
    this.store.close();
    this.store = new LogStore(params, 'app', options).register(this, 'logs');
    this.setState({logs: this.store})
  }
});
