var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  BuildStore = require('_/stores/build'),
  AppStore = require('_/stores/app'),
  BranchStore = require('_/stores/branches'),
  CommitStore = require('_/stores/commits'),
  Router = require('react-router'),
  TimeAgo = require('_/components/Common/TimeAgo'),
  BuildIcon = require('_/components/Icons/Build'),
  BuildItem = require('./BuildItem'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    var params = this.getParams();
    return({
      apps: new AppStore(params).register(this, 'apps'),
      builds: new BuildStore(params).register(this, 'builds'),
      branches: new BranchStore(params).register(this, 'branches'),
      commitInput: null,
      currentBranch: 'master',
      startingBuild: false,
      'commits_master': new CommitStore(params, 'master').register(this, 'commits_master')
    });
  },

  render: function() {
    var self = this,
      branch = this.state.currentBranch,
      builds = this.state.builds.data,
      builtCommits = builds.map(function (build) {
        if (build.state !== 'FAILED') return build.commit.sha;
      }),
      commits = this.state['commits_' + branch].data.filter(function (commit) {
        return (builtCommits.indexOf(commit.sha) === -1);
      });

    return(<div className="BuildPage">
      <Header />
      <Boot.Grid>
        <div className="Title">
          <h1><BuildIcon size="32" /> Builds</h1>
        </div>

        <Boot.Row>
          <Boot.Col md={5}>
            {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error}</Boot.Alert> : null}
            <Boot.Panel>
              <h3>Start a New Build<br /><small>Specify commit hash or select one below</small></h3>
              <Boot.Input type='text' value={this.state.commitInput} placeholder='Commit Hash'
                          onChange={this.commitInputChange}
                          buttonAfter={<Boot.Button bsStyle='success' onClick={this.startBuild}>
                              {(this.state.startingBuild) ?
                                <i className="fa fa-refresh fa-spin"></i> : <i className="fa fa-bolt"></i>} Start Build
                              </Boot.Button>}/>
              <div className="form-inline pull-right branches">
                <Boot.Input  type='select' value={this.state.currentBranch}
                            onChange={this.selectBranch} label="Branches/Tags">
                  {this.state.branches.data.map(function (obj) {
                    return(<option key={obj.name} value={obj.name}>{obj.name.slice(0, 50)}</option>);
                  })}
                </Boot.Input>
              </div>
              <Boot.Table className="build-table" fill>
                <tbody>
                {
                  commits ? commits.map(function (commit) {
                    var selected = (commit.sha === self.state.commitInput),
                      style = (selected) ? 'commit selected' : 'commit';
                    return(
                      <tr key={commit.sha} onClick={self.selectCommit.bind(self, commit.sha)} className={style}>
                        <td>
                          <div className='sha'>{commit.sha.slice(0,7)}</div>
                          {commit.author.name} - <TimeAgo date={commit.author.date} /><br />
                          {commit.message}
                        </td>
                      </tr>
                    );
                  }) : <tr><td><i>No commits available</i></td></tr>
                }
                </tbody>
              </Boot.Table>
            </Boot.Panel>
          </Boot.Col>

          <Boot.Col md={7}>
            <Boot.Panel className="existing-builds">
              <h3>Existing Builds</h3>
              <div className="pull-right">
                <StoreStatus store={this.state.builds} />
              </div>
              <Boot.ListGroup fill>
              {builds ? builds.map(function (build) {
                return <BuildItem build={build} key={build.id}/>
              }) : <tr><td><i>No commits available</i></td></tr>}
              </Boot.ListGroup>
            </Boot.Panel>
          </Boot.Col>
        </Boot.Row>

      </Boot.Grid>
      <Footer />
    </div>);
  },

  selectCommit: function (sha) {
    this.setState({commitInput: sha});
  },

  commitInputChange: function (event) {
    this.setState({commitInput: event.target.value});
  },

  startBuild: function() {
    var self = this,
      commit = this.state.commitInput,
      obj = {commit: commit};

    this.setState({startingBuild: true});
    this.state.builds.post(obj, function(err) {
      if (err) return self.setState({error: err.message, startingBuild: false});
      self.setState({startingBuild: false, commitInput: null});
    });
  },

  selectBranch: function(event) {
    var branch = event.target.value,
      params = this.getParams(),
      state = {currentBranch: branch},
      commitStoreName = 'commits_' + branch;

    if (!this.state[commitStoreName])
      state[commitStoreName] = CommitStore(params, branch).register(this, commitStoreName);
    this.setState(state);
  }
});