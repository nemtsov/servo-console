var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'StackBadge',

  render: function(){
    var stack = this.props.stack;
    return(
      <Boot.Col xs={6} sm={6} md={4} lg={3} className="stack-badge">
        <div className="wrapper hvr-glow">
          <div className="contents">
            <div className="stack-name text-center">{this.props.name}</div>
          </div>
          <Boot.Row className="details text-center">
            <div className="deploys text-center" title="Deploys">
              <i className="fa fa-cloud-upload" /> -
            </div>
            <div className="cost text-center" title="Estimated Monthly Cost">
              <Boot.Glyphicon glyph="usd" /> -
            </div>
            <div className="workers text-center" title="Running Workers">
              <i className="fa fa-server" /> -
            </div>
          </Boot.Row>
        </div>
      </Boot.Col>
    );
  }
});
