var React = require('react'),
  Boot = require('react-bootstrap'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  WorkerStatusStore = require('_/stores/workerStatus'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State],

  getInitialState: function () {
    var params = JSON.parse(JSON.stringify(this.props.context));
    params.workerId = this.props.worker.id;
    return {
      workerStatus: new WorkerStatusStore(params).register(this, 'workerStatus'),
      showDetails: false
    };
  },

  toggleDetails: function () {
    this.setState({showDetails: !this.state.showDetails});
  },

  render: function () {
    var status = 'gray',
      worker = this.props.worker,
      workerStatus = this.state.workerStatus.data[0];
    if (workerStatus)
      status = workerStatus.status;

    return (
      <Boot.Col md={12}>
        <Boot.Row style={{"textAlign": "center"}}>
          <Boot.Col md={4}>
            <Boot.Row>
              <Boot.Col md={4}>
                {worker.newrelicLink ? <a href={worker.newrelicLink} target="_blank"> {worker.id} </a> : worker.id}
              </Boot.Col>
              <Boot.Col md={4}>
                {(workerStatus && workerStatus._health) ? workerStatus._health : '-'}
              </Boot.Col>
              <Boot.Col md={4}>
                <i className='fa fa-circle' style={{color: status}}></i>
              </Boot.Col>
            </Boot.Row>
          </Boot.Col>
          <Boot.Col md={6}>
            <Boot.Row>
              <Boot.Col md={3}>
                {workerStatus ? workerStatus.cpu + '%' : '-'}
              </Boot.Col>
              <Boot.Col md={3}>
                {workerStatus ? workerStatus.memory + '%' : '-'}
              </Boot.Col>
              <Boot.Col md={3}>
                {workerStatus ? workerStatus.diskIO + '%' : '-'}
              </Boot.Col>
              <Boot.Col md={3}>
                {workerStatus ? workerStatus.fullestDisk + '%' : '-'}
              </Boot.Col>
            </Boot.Row>
          </Boot.Col>
          <Boot.Col md={2}>
            <StoreStatus store={this.state.workerStatus} hideUpdated={true}/>
          </Boot.Col>
        </Boot.Row>
      </Boot.Col>
    );
  }
});
