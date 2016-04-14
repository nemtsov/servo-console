var React = require('react'),
  Boot = require('react-bootstrap'),
  WelcomeModal = require('_/components/Region/WelcomeModal');

module.exports = React.createClass({

  getInitialState: function (){
    return { showBanner: true };
  },

  close: function(){
    this.setState({ showBanner: false });
  },

  render: function () {
    return <div></div>;
    var what = 'First of all, Servo is awesome.\n Second of all, Servo is a Platform as a Service that allows developers put their application in the cloud with only a few clicks.',
      help = "Don't hesitate to ask for help on our Slack channel or email our team.";

    if (this.state.showBanner) {
      return (
      <div className="WelcomeBanner">
        <div className="close" onClick={this.close}>
          <i className="fa fa-times-circle-o" />
        </div>
        <Boot.Grid>
          <Boot.Row className="intro">
            <h1>Welcome to Servo!</h1>
            <p>Servo is like a Platform as a Service, but so much more. It's here to help with all the
              things that every application needs from deployment, to monitoring, to performance testing,
              etc. It can get you up and running with a world-class, production-grade
              environment for your application in minutes. It's written by developers, for developers!</p>
          </Boot.Row>
          <Boot.Row>
            <Boot.ModalTrigger modal={<WelcomeModal content={what} />}>
              <Boot.Col sm={6} md={3}>
              <div className="wrapper hvr-grow">
                <i className="fa fa-puzzle-piece" />
                <br />What is Servo
              </div>
              </Boot.Col>
            </Boot.ModalTrigger>
            <Boot.Col sm={6} md={3}>
              <div className="wrapper hvr-grow">
                <i className="fa fa-rocket" />
                <br />Get Started
              </div>
            </Boot.Col>
            <Boot.ModalTrigger modal={<WelcomeModal content={help} />}>
              <Boot.Col sm={6} md={3}>
                <div className="wrapper hvr-grow">
                  <i className="fa fa-medkit" />
                  <br />Get Help
                </div>
              </Boot.Col>
            </Boot.ModalTrigger>
            <Boot.Col sm={6} md={3}>
              <div className="wrapper hvr-grow">
                <i className="fa fa-group" />
                <br />Get Involved
              </div>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
      </div>);
    } else {
      return(
        <div></div>
      );
    }
  }
});
