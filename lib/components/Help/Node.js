var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  render: function() {
    return(
      <div>
        <h3>Node.js</h3>
        Servo follows several common patterns in the Node.js community. It will run a single node process on each EC2
        instance and scale instances horizontally.

        <h3>Requirements</h3>
        <ul>
          <li>Meet the requirements of a <a target="_blank" href="http://12factor.net/">12 Factor App</a>.</li>
          <li>A <strong>package.json</strong> in the root of the repository.</li>
          <li>A <strong>server.js</strong> in the root of the repository that is the entrypoint for the application.</li>
          <li>The node process must bind to the port specified through the environment variable PORT.</li>
          <li>The application logs must be written to stdout.</li>
        </ul>
      </div>
    );
  }
});