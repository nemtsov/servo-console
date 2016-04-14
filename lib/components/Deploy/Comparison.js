var React = require('react'),
  Boot = require('react-bootstrap'),
  BuildStore = require('_/stores/build'),
  ConfigStore = require('_/stores/config'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      builds: new BuildStore(params).register(this, 'builds'),
      configs: new ConfigStore(params).register(this, 'configs')
    };
  },

  render: function() {
    var older = this.props.older,
      newer = this.props.newer,
      olderBuild = (older) ? this.state.builds.get(older.buildId) : null,
      newerBuild = (newer) ? this.state.builds.get(newer.buildId) : null,
      olderBuildLink = (olderBuild) ? 'https://' + olderBuild.source + '/commit/' + olderBuild.commit.sha : null,
      newerBuildLink = (newerBuild) ? 'https://' + newerBuild.source + '/commit/' + newerBuild.commit.sha : null,
      diffLink = (olderBuild && newerBuild) ?
        'https://' + newerBuild.source + '/compare/' + olderBuild.commit.sha + '...' + newerBuild.commit.sha : null,
      envDiff = (older && newer) ? this.envDifferences(older.config, newer.config) : null,
      olderWorker = (older) ? this.workerSummary(older.config) : null,
      newerWorker = (newer) ? this.workerSummary(newer.config) : null,
      different = <Boot.Label bsStyle="warning">different</Boot.Label>,
      same = <Boot.Label bsStyle="info">same</Boot.Label>,
      softwareDifferent = (newerBuild && olderBuild && newerBuild.id !== olderBuild.id),
      workerDifferent = ((olderWorker && newerWorker) && (olderWorker.min !== newerWorker.min ||
        olderWorker.max !== newerWorker.max ||
        olderWorker.type !== newerWorker.type ||
        olderWorker.scaleDown !== newerWorker.scaleDown ||
        olderWorker.scaleUp !== newerWorker.scaleUp)),
      envDifferent = (envDiff && (envDiff.newer.length || envDiff.older.length));

    return(
      <Boot.Row className="Comparison">
        <Boot.Col md={6}>
          <Boot.Panel header="Stack state BEFORE deploy"Stack>
            <h3>Software Version {(softwareDifferent) ? different : same}</h3>
            {(olderBuild) ?
              <div className="software">
                Commit <a href={olderBuildLink} target='blank'>{olderBuild.commit.sha}</a><br />
                [{olderBuild.commit.author.name}] {olderBuild.commit.message}
              </div>
              : null}
            <h3>Worker Settings {(workerDifferent) ? different : same}</h3>
            {(olderWorker) ? <div>
              Between {olderWorker.min} and {olderWorker.max} workers using {olderWorker.type} instances<br />
              {olderWorker.scaleDown}<br />{olderWorker.scaleUp}
              </div> : <i>Loading...</i>}
            <h3>Environment Variables {(envDifferent) ? different : same}</h3>
            {(envDiff && envDiff.older.length) ?
              envDiff.older.map(function (diff) {
                return <div key={diff.key}>
                  <Boot.Label bsStyle="warning">{diff.action}</Boot.Label> {diff.key} <i>{diff.value}</i>
                </div>
              })
              : <i>No Changes</i>}
          </Boot.Panel>
        </Boot.Col>

        <Boot.Col md={6}>
          <Boot.Panel header="Stack state AFTER deploy">
            <h3>
              Software Version {(softwareDifferent) ? different : same}
              {(softwareDifferent) ?
                <span> <a target="_blank" href={diffLink}><small> Show Code Diff</small></a></span> : null}
            </h3>
            {(newerBuild) ?
              <div className="software">
                Commit <a href={newerBuildLink} target='blank'>{newerBuild.commit.sha}</a><br />
                [{newerBuild.commit.author.name}] {newerBuild.commit.message}
              </div>
              : null}
            <h3>Worker Settings {(workerDifferent) ? different : same}</h3>
            {(olderWorker && newerWorker) ? <div>
              Between {newerWorker.min} and {newerWorker.max} workers using {newerWorker.type} instances&nbsp;
              {(olderWorker.min !== newerWorker.min ||
                olderWorker.max !== newerWorker.max ||
                olderWorker.type !== newerWorker.type) ? different : null}<br />
              {newerWorker.scaleDown} {(olderWorker.scaleDown !== newerWorker.scaleDown) ? different : null}
              <br />
              {newerWorker.scaleUp}  {(olderWorker.scaleUp !== newerWorker.scaleUp) ? different : null}
            </div> : <i>Loading...</i>}
            <h3>Environment Variables {(envDifferent) ? different : same}</h3>
            {(envDiff && envDiff.newer.length) ?
              envDiff.newer.map(function (diff) {
                return <div key={diff.key}>
                  <Boot.Label bsStyle="warning">{diff.action}</Boot.Label> <i>{diff.key}</i> {diff.value}
                </div>
              })
            : <i>No Changes</i>}
          </Boot.Panel>
        </Boot.Col>
      </Boot.Row>
    );
  },

  envDifferences: function (a, b) {
    var older = {},
      newer = {},
      diff = {older: [], newer: []};
    a.forEach(function (config) {
      if (config.key.substr(0, 4) !== 'env.') return;
      older[config.key.substr(4)] = (config.encrypted) ? 'encrypted' : config.value;
    });
    b.forEach(function (config) {
      if (config.key.substr(0, 4) !== 'env.') return;
      newer[config.key.substr(4)] = (config.encrypted) ? 'encrypted' : config.value;
    });
    Object.keys(older).forEach(function (key) {
      if (!newer[key]) diff.older.push({action: 'removed', key: key, value: older[key]});
    });
    Object.keys(newer).forEach(function (key) {
      if (!older[key]) return diff.newer.push({action: 'added', key: key, value: newer[key]});
      if (older[key] !== newer[key]) {
        diff.older.push({action: 'changed', key: key, value: older[key]});
        diff.newer.push({action: 'changed', key: key, value: newer[key]});
      }
    });
    return diff;
  },

  workerSummary: function (configs) {
    var summary = {},
      settings = {},
      workerKeys = ['InstanceType', 'ScaleUpThreshold', 'ScaleUpDuration', 'ScaleDownThreshold',
        'ScaleDownDuration', 'MinWorkers', 'MaxWorkers'];
    configs.forEach(function (config) {
      if (workerKeys.indexOf(config.key) !== -1) settings[config.key] = config.value;
    });
    summary.type = settings.InstanceType;
    summary.scaleUp = 'Scale up when CPU is over ' + settings.ScaleUpThreshold + '% for '
      + settings.ScaleUpDuration + ' minutes';
    summary.scaleDown = 'Scale down when CPU is below ' + settings.ScaleDownThreshold + '% for '
      + settings.ScaleDownDuration + ' minutes';
    summary.min = settings.MinWorkers;
    summary.max = settings.MaxWorkers;
    return summary;
  }
});
