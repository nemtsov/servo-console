var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  render: function() {
    return(
      <div>
        <h3>The Basics</h3>
        Servo is a Platform as a Service to help engineers run <strong>web services</strong> in the cloud. It takes
        care of the undifferentiating tasks of configuring servers, load balancer, firewalls, dns, etc. and lets
        engineers focus on their applications. Basically, you can get up and running with production-grade environment
        with best-in-breed practices within a few minutes.

        <h3>Vernacular</h3>
        <dl>
          <dt>Org</dt>
          <dd>An isolated Servo environment with separate permissions and networks.</dd>
          <dt>Region</dt>
          <dd>An AWS region, pretty simple.</dd>
          <dt>App</dt>
          <dd>A codebase from specific code repository within a specific Org and Region.</dd>
          <dt>Stack</dt>
          <dd>An isolated instance of an App, very similar to environments. Servo supports the concept of <i>n</i>
          number of Stacks of an App. You can have a traditional set of stacks like <i>dev</i>, <i>staging</i>,
          and <i>production</i> or you can create Stacks for each team member or stakeholder group.</dd>
          <dt>Build</dt>
          <dd>A specific commit from the GitHub repo that has gone through a user-defined build script. This script
          is usually used to install dependencies, compile assets, and run tests. Builds are stored as immutable
          artifacts on AWS S3 in the Region.</dd>
          <dt>Deploy</dt>
          <dd>An event to push code and config changes to a stack.</dd>
        </dl>

        <h3>Quick Overview</h3>
        <ol>
          <li>Push code to GitHub</li>
          <li>Create an App in Servo linked to the GitHub repo</li>
          <li>Create a Stack</li>
          <li>Run a Build of the commit you would like to Deploy</li>
          <li>After the Build completes, Deploy the Build to the Stack</li>
          <li>Configure the Network Access for the Stack to allow traffic</li>
          <li>Access the Stack through one of the Endpoint links on the Stack page</li>
          <li>Take some time for yourself with all the time you just saved!</li>
        </ol>
      </div>
    );
  }
});