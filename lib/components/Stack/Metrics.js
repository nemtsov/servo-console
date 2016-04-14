var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  render: function () {
    return (
      <div className="Metrics">
        <Boot.Row>
          <Boot.Col md={12}>
            <h4>
              <Boot.Label bsStyle="info">4 Running Workers</Boot.Label>
              <Boot.Label bsStyle="info">4,235 Requests/Min</Boot.Label>
              <Boot.Label bsStyle="danger">CPU 91%</Boot.Label>
              <Boot.Label bsStyle="success">Apdex 99%</Boot.Label>
              <Boot.Label bsStyle="success">Avg Response Time 34ms</Boot.Label>
              <Boot.Label bsStyle="warning">Error Rate 6%</Boot.Label>
            </h4>
          </Boot.Col>
        </Boot.Row>
      </div>
    );
  }
});