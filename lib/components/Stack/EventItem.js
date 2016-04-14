var React = require('react'),
  Boot = require('react-bootstrap'),
  TimeAgo = require('_/components/Common/TimeAgo');

module.exports = React.createClass({
  render: function () {
    var stateClass = this.stateClass(this.props.event.severity),
      renderedMessage = this.renderMessage();
    return (
      <div className="DeployItem">
        <div className="DeployItem row">
          <div className="col-md-9 commit">
            <Boot.Label bsStyle={stateClass}>{this.props.event.type}</Boot.Label> {renderedMessage}
          </div>
          <div className="col-md-3 time">
            <TimeAgo date={this.props.event._createdAt} />
          </div>
        </div>
      </div>
    );
  },

  stateClass: function (state) {
    switch (state) {
      case 'info':
        return 'info';
        break;
      case 'warn':
        return 'warning';
        break;
      case 'error':
        return 'warning';
        break;
      case 'fatal':
        return 'danger';
        break;
    }
  },

  renderMessage: function () {
    var event = this.props.event,
      message = this.props.event.message,
      params = this.props.params,
      workerRegex = /{{worker}}/,
      deployRegex = /{{deploy}}/,
      stackRegex = /{{stack}}/,
      appRegex = /{{app}}/,
      worker, app, stack, deploy, build;
    if (workerRegex.test(message)) {
      message = message.replace(workerRegex, event.context.workerId);
    }
    if (deployRegex.test(message)) {
      message = message.replace(deployRegex, event.context.deployId);
    }
    if (stackRegex.test(message)) {
      stack = this.props.stackStore.get(params.stack);
      message = message.replace(stackRegex, (stack && stack.name) || 'loading...');
    }
    if (appRegex.test(message)) {
      app = this.props.appStore.get(params.stack);
      message = message.replace(appRegex, (app && app.name) || 'loading...');
    }
    return message;
  }
});
