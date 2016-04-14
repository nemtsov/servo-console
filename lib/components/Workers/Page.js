var React = require('react'),
  PopUp = require('_/components/Common/PopUp'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  WorkerStatus = require('./WorkerStatus'),
  Boot = require('react-bootstrap'),
  WorkerStore = require('_/stores/worker'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      workers: new WorkerStore(params).register(this, 'workers')
    };
  },

  render: function () {
    var params = this.getParams(),
      workers = this.state.workers.data;

    return (
      <div>
        <Header/>
        <Boot.Grid>
          <Boot.Row>
            <Boot.Col md={7}>
              <div className="Title">
                <h1>Workers</h1>
              </div>
            </Boot.Col>
            <Boot.Col md={5}>
              <div className="pull-right">
                <StoreStatus store={this.state.workers} />
              </div>
            </Boot.Col>
          </Boot.Row>

          <Boot.Row>
            <Boot.Col md={12} sm={12}>
              <Boot.Panel>
              <Boot.Row style={{"textAlign": "center"}}>
                <Boot.Col md={4}>
                  <Boot.Row>
                    <Boot.Col md={4}>
                      Server Name
                    </Boot.Col>
                    <Boot.Col md={4}>
                      Online
                    </Boot.Col>
                    <Boot.Col md={4}>
                      Server Status
                    </Boot.Col>
                  </Boot.Row>
                </Boot.Col>
                <Boot.Col md={6}>
                  <Boot.Row>
                    <Boot.Col md={3}>
                      CPU Usage
                    </Boot.Col>
                    <Boot.Col md={3}>
                      Memory Usage
                    </Boot.Col>
                    <Boot.Col md={3}>
                      Disk IO
                    </Boot.Col>
                    <Boot.Col md={3}>
                      Fullest Disk
                    </Boot.Col>
                  </Boot.Row>
                </Boot.Col>
                <Boot.Col md={2}>
                  Last Update
                </Boot.Col>
              </Boot.Row>
                <Boot.Row>
                  {workers.map(function (worker) {
                    return <WorkerStatus key={worker.id} worker={worker} context={params}/>;
                  })}
                </Boot.Row>
              </Boot.Panel>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
