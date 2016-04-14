var React = require('react'),
  Header = require('_/components/Common/Header'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  Basics = require('./Basics'),
  Node = require('./Node'),
  Network = require('./Network'),
  Troubleshooting = require('./Troubleshooting'),
  Docker = require('./Docker');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    return {
      page: 'basics'
    };
  },

  render: function() {
    return(
      <div className="HelpPage">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Servo User Guide</h1>
          </div>
          <Boot.Row>
            <Boot.Col md={2}>
              <ul className="nav nav-pills nav-stacked">
                <li role="presentation" className={(this.state.page === 'basics') ? 'active' : null}>
                  <a href="#" onClick={this.changePage.bind(this, 'basics')}>The Basics</a>
                </li>
                <li role="presentation" className={(this.state.page === 'docker') ? 'active' : null}>
                  <a href="#" onClick={this.changePage.bind(this, 'docker')}>Docker Platform</a>
                </li>
                <li role="presentation" className={(this.state.page === 'node') ? 'active' : null}>
                  <a href="#" onClick={this.changePage.bind(this, 'node')}>Node.js Platform</a>
                </li>
                <li role="presentation" className={(this.state.page === 'network') ? 'active' : null}>
                  <a href="#" onClick={this.changePage.bind(this, 'network')}>Networking</a>
                </li>
                <li role="presentation" className={(this.state.page === 'troubleshooting') ? 'active' : null}>
                  <a href="#" onClick={this.changePage.bind(this, 'troubleshooting')}>Troubleshooting</a>
                </li>
              </ul>
            </Boot.Col>
            <Boot.Col md={10}>
              {(this.state.page === 'basics') ? <Basics/> : null}
              {(this.state.page === 'docker') ? <Docker/> : null}
              {(this.state.page === 'node') ? <Node/> : null}
              {(this.state.page === 'network') ? <Network/> : null}
              {(this.state.page === 'troubleshooting') ? <Troubleshooting/> : null}
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
      </div>
    );
  },

  changePage: function (page) {
    this.setState({page: page});
  }
});