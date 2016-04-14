var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  render: function () {
    var title = (this.props.app) ? 'Star ' + this.props.app.name : null;
    return (
      <span className="AppStar" title={title}>
        <i className="fa fa-star-o"></i>
      </span>
    );
  }
});