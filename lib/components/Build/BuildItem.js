var React = require('react'),
  Boot = require('react-bootstrap'),
  TimeAgo = require('_/components/Common/TimeAgo'),
  Router = require('react-router'),
  request = require('_/stores/request'),
  regions = require('_/constants/regions'),
  moment = require('moment');

module.exports = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    var open = (this.props.build.state === 'PENDING' || this.props.build.state === 'BUILDING');
    if (open) this.getBuildReport();
    if (open) this.getArtifactLink();
    return({
      open: open,
      report: null,
      error: null,
      logView: 1,
      artifactLink: null
    });
  },

  render: function () {
    var open = this.state.open,
      error = this.state.error,
      report = this.state.report,
      build = this.props.build,
      params = this.getParams(),
      commitLink = 'https://' + build.source + '/commit/' + build.commit.sha,
      platform = build.manifest.platform;

    if (platform === 'nodejs') platform = <img src="/images/nodejs.png" />;
    if (platform === 'docker') platform = <img src="/images/docker.png" />;
    if (platform === 'rubyonrails') platform = <img src="/images/rubyonrails.png" />;

    return (
      <Boot.ListGroupItem className="BuildItem">
        <div className="summary" onClick={this.toggleOpen}>
          <div className="expand">
            <Boot.Glyphicon glyph={(open) ? "chevron-down" : "chevron-right"}/>
          </div>
          <Boot.Label bsStyle={this.styleMap[build.state]}>{build.state}</Boot.Label>
          <div className="sha">{build.commit.sha.slice(0,7)}</div>
          {build.commit.message}
        </div>
        <div className={(open) ? 'collapse in' : 'collapse'}>
          {(error) ? <Boot.Alert bsStyle="danger">{error.message || error}</Boot.Alert> : null}
          <div className="pull-right">
            <Router.Link to={'/orgs/' + params.org + '/regions/' + params.region + '/apps/' + params.app +
              '/stacks/' + params.stack + '/deploys/new#' + build.id}>
              <Boot.Button disabled={(build.state !== 'COMPLETE')}>Deploy to {params.stack}</Boot.Button>
            </Router.Link>
          </div>
          <p className="platform">
            <strong>Platform</strong> {platform}<br />
            <strong>Started</strong> {moment(build._createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}<br />
            {(build._updatedAt) ?
              <span><strong>Duration</strong> {Math.ceil((build._updatedAt - build._createdAt) / 1000)} seconds</span>
              : null }
            {(this.state.artifactLink) ? <span><br/><strong>Build Artifact</strong> <a href={this.state.artifactLink}>
              Download Tarball</a></span> : null}
          </p>
          <p>
            <strong>Commit Details</strong><br />
            <a href={commitLink} target="_blank">{build.commit.sha}</a><br />
            Authored by {(build.commit.author) ? build.commit.author.name : null}
            {' <' + ((build.commit.author) ? build.commit.author.email : null) + '>'}<br />
            Committed by {(build.commit.committer) ? build.commit.committer.name : null}
            {' <' + ((build.commit.committer) ? build.commit.committer.email : null) + '>'}<br />
          </p>
          <strong>Build Commands</strong>
          <ul>
          {build.manifest.build.commands.map(function (cmd) {
            return <li key={cmd}>{cmd}</li>
          })}
          </ul>
          <Boot.Nav bsStyle='pills' activeKey={this.state.logView}>
            <Boot.NavItem eventKey={1} onClick={this.selectLog.bind(this, 1)}>Build Log</Boot.NavItem>
            <Boot.NavItem eventKey={2} onClick={this.selectLog.bind(this, 2)}>STDOUT</Boot.NavItem>
            <Boot.NavItem eventKey={3} onClick={this.selectLog.bind(this, 3)}>STDERR</Boot.NavItem>
          </Boot.Nav>
          <pre>
            {(this.state.logView === 1 && report) ? report.log.join("\n") : null}
            {(this.state.logView === 2 && report) ? report.stdout : null}
            {(this.state.logView === 3 && report) ? report.stderr : null}
          </pre>
        </div>
      </Boot.ListGroupItem>
    );
  },

  selectLog: function (index) {
    this.setState({logView: index});
  },

  toggleOpen: function () {
    if (!this.state.report) this.getBuildReport();
    if (!this.state.open) this.getArtifactLink();
    this.setState({open: !this.state.open});
  },

  getBuildReport: function () {
    var self = this,
      params = this.getParams(),
      path = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' +
        params.app + '/builds/' + this.props.build.id + '/report';
    request.get(path, function (err, data, body) {
      if (err && self.props.build.state === 'PENDING') err = null;
      self.setState({report: body, error: err});
      if (self.state.open && (self.props.build.state === 'PENDING' || self.props.build.state === 'BUILDING'))
        setTimeout(self.getBuildReport, 5000);
    })
  },

  getArtifactLink: function () {
    if (this.props.build.state !== 'COMPLETE') return;
    var self = this,
      params = this.getParams(),
      path = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' +
        params.app + '/builds/' + this.props.build.id + '/artifact';
    request.get(path, function (err, data, body) {
      var url = (body && body.url) ? body.url : null;
      self.setState({artifactLink: url});
      setTimeout(self.getArtifactLink, 60000);
    })
  },

  styleMap: {PENDING: 'warning', BUILDING: 'info', COMPLETE: 'success', FAILED: 'danger'}
});