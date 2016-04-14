var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  render: function() {
    return(
      <div>
        <h3>Docker Platform</h3>
        Servo supports the use of Docker as a packaging format to allow engineers to express their custom needs for
        how to Build and Deploy their application. Servo deploys a single Docker container to each EC2 instance
        and scales horizontally just like our other platforms.

        <h3>Requirements</h3>
        <ul>
          <li>Meet the requirements of a <a target="_blank" href="http://12factor.net/">12 Factor App</a>.</li>
          <li>A <strong>Dockerfile</strong> in the root of the repository.</li>
          <li>The HTTP server inside the container must bind to the port specified through the environment variable
            PORT. This is set to port 80 for easy integration with existing containers.</li>
          <li>The application logs must be written to the stdout of the container. Basically, whatever is available
            by running <i>docker logs ...</i> will be picked up by Servo.</li>
        </ul>
      </div>
    );
  }
});