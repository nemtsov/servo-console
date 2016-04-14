var React = require('react'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  StackStore = require('_/stores/stack'),
  ConfigStore = require('_/stores/config'),
  EnvVar = require('./EnvVar'),
  WorkerSetting = require('./WorkerSetting'),
  Router = require('react-router'),
  async = require('async'),
  WorkerSettingKeys = ['MaxWorkers', 'MinWorkers', 'ScaleUpThreshold', 'ScaleDownThreshold',
    'ScaleUpDuration', 'ScaleDownDuration', 'InstanceType'];

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  displayName: 'CopyStackPage',

  getInitialState: function () {
    var params = this.getParams();
    return {
      stacks: new StackStore(params, {refresh: 0}).register(this, 'stacks'),
      configs: new ConfigStore(params, {refresh: 0}),
      copying: false,
      configValues: []
    };
  },

  componentDidMount: function () {
    this.state.configs.addListener(this.setInitialConfigs);
    this.state.configs.get();
  },

  componentWillUnmount: function () {
    this.state.configs.removeListener(this.setInitialConfigs);
  },

  setInitialConfigs: function () {
    this.setState({
      configValues: this.state.configs.data.map(function (config) {
        var newConfig = {
          key: config.key,
          value: config.value
        };
        if (config.secret) {
          newConfig.secret = true;
          newConfig.md5 = config.md5;
        }
        return newConfig;
      })
    });
  },

  update: function (key, value) {
    var current = JSON.parse(JSON.stringify(this.state.configValues));

    for (var i = 0; i < current.length; i++) {
      if (current[i].key === key) {
        current[i].value = value;
        if (!current[i].changed) current[i].changed = true;
        if (current[i].secret) {
          delete current[i].md5;
        }
        break;
      }
    }

    this.setState({configValues: current});
  },

  revert: function (key) {
    var current = JSON.parse(JSON.stringify(this.state.configValues));
    for (var i = 0; i < current.length; i++) {
      if (current[i].key === key) {
        for (var j = 0; j < this.state.configs.data.length; j++) {
          if (this.state.configs.data[j].key === key) {
            var config = this.state.configs.data[j],
              origin = {
                key: config.key,
                value: config.value
              };
            if (config.secret) {
              origin.secret = true;
              origin.md5 = config.md5;
            }
            current[i] = origin;
            break;
          }
        }
        break;
      }
    }

    this.setState({configValues: current});
  },

  remove: function (key) {
    var current = JSON.parse(JSON.stringify(this.state.configValues)),
      index = 0;
    for (index = 0; index < current.length; index++) {
      if (current[index].key === key)
        break;
    }
    current = current.slice(0, index).concat(current.slice(index+1, current.length));

    this.setState({configValues: current});
  },

  copy: function () {
    var self = this;
    this.setState({
      err: null,
      copying: true
    });
    async.auto({
      stack: function (done) {
        if (self.state.newStack) return done(null, self.state.newStack);
        self.state.stacks.post({name: self.refs.stackName.getValue()}, function (err, stack) {
          if (err) return done(err);
          self.setState({newStack: stack});
          done(null, stack);
        });
      },
      params: ['stack', function (done, results) {
        var params = self.getParams();
          params.stack = results.stack.handle;
        done(null, params);
      }],
      configs: ['params', function (done, results) {
        var configsToSave = self.state.configValues.filter(function (config) {
          return (/^env\./.test(config.key) || WorkerSettingKeys.indexOf(config.key) !== -1);
        }),
        configStore = new ConfigStore(results.params, {refresh: 0});
        async.map(configsToSave, function (config, done) {
          configStore.post(config, function (err, config) {
            done(err);
          });
        }, done);
      }]
    }, function (err, results) {
      if (err) return self.setState({err: err, copying: false});
      self.transitionTo('stack', results.params);
    });
  },

  render: function () {
    var params = this.getParams(),
      envVariables = this.state.configValues
        .filter(function (config) {
          return (/^env\./.test(config.key));
        })
        .sort(function (a, b) {
          if (a.key < b.key) return -1;
          if (a.key > b.key) return 1;
          return 0;
        }
      ),
      workerSettings = this.state.configValues
        .filter(function (config) {
          return ( WorkerSettingKeys.indexOf(config.key) !== -1 );
        }
      );

    return (
      <div className="CopyStackPage">
        <Header/>
        <Boot.Grid>
          <Boot.Row>
            <Boot.Col md={12}>
              <div className="Title">
                <h1>
                  <i className="fa fa-clone"></i> Copying stack {params.stack}
                </h1>
              </div>
            </Boot.Col>
          </Boot.Row>
          <Boot.Row className='stack-name-row'>
            <Boot.Col md={6}>
              <Boot.Row>
                <Boot.Col md={1}>
                  <h2 className='stack-name-label'>To</h2>
                </Boot.Col>
                <Boot.Col md={11}>
                  <Boot.Input ref='stackName' type='text' placeholder='New Stack Name'/>
                </Boot.Col>
              </Boot.Row>
            </Boot.Col>
            <Boot.Col md={6}/>
          </Boot.Row>
          <Boot.Row>
            <Boot.Col md={12}>
              {this.state.err ? <Boot.Alert bsStyle="danger">{this.state.err.message}</Boot.Alert> : null}
            </Boot.Col>
          </Boot.Row>
          <EnvVar envVariables={envVariables} update={this.update} revert={this.revert} remove={this.remove}/>
          <WorkerSetting workerSettings={workerSettings} update={this.update} revert={this.revert} remove={this.remove}/>
          <Boot.Row>
            <Boot.Col md={10}/>
            <Boot.Col md={2}>
              <Boot.Row>
                <Boot.Col md={6}>
                  {
                    (workerSettings.length !== 0 || envVariables.length !== 0) ?
                    <Boot.Button bsStyle="primary" onClick={this.copy} disabled={this.state.copying}>Copy</Boot.Button> :
                    null
                  }
                </Boot.Col>
                <Boot.Col md={6}>
                  <Router.Link to="stack" params={params}>
                    <Boot.Button bsStyle="danger" disabled={this.state.copying}>Cancel</Boot.Button>
                  </Router.Link>
                </Boot.Col>
              </Boot.Row>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
