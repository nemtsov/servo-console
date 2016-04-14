var React = require('react'),
  Boot = require('react-bootstrap'),
  TimeAgo = require('_/components/Common/TimeAgo');

module.exports = React.createClass({
  render: function () {
    var error = this.props.store.error,
      loading = this.props.store.loading,
      refreshed = this.props.store.refreshed,
      hideUpdated = this.props.hideUpdated,
      iconOnly = this.props.iconOnly;

    if (iconOnly) {
      return (
        <div className="StoreStatus">
          <div className="loading">
            {(loading) ? <i className="fa fa-refresh fa-spin"></i> : ''}
          </div>
          <div className="error">
            {(error && !loading) ? errorIcon(error) : ''}
          </div>
        </div>
      )
    }

    return (
      <div className="StoreStatus">
        <div className="loading">
          {(loading) ? <i className="fa fa-refresh fa-spin"></i> : ''}
        </div>
        <div className="updated">
          {hideUpdated ? '' : 'Updated'} {(refreshed) ? <TimeAgo date={refreshed} /> : 'never'}
        </div>
        <div className="error">
          {(error) ? errorIcon(error) : ''}
        </div>
      </div>
    )
  }
});

function errorIcon(error) {
  return <Boot.OverlayTrigger placement="top"
    overlay={<Boot.Tooltip>{errorMessageNormalizer(error)}</Boot.Tooltip>}>
    <i className="fa fa-exclamation-triangle"></i>
  </Boot.OverlayTrigger>;
}

function errorMessageNormalizer(error) {
  if (/CORS request rejected/.test(error.message)) {
    return 'Unable to connect to Servo Core';
  } else {
    return error.message;
  }
}
