var React = require('react'),
  Link = require('react-router').Link,
  Boot = require('react-bootstrap'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State],

  render: function () {
    var regionName = 'virginia',
      app = this.props.app,
      git = 'foo',
      source = app.source,
      padding = true,
      cost = null;

    if (app.summary && app.summary.cost) {
      padding = false;
      cost = (app.summary.cost * 24 * 30).toFixed(0);
    }
    return (
      <Boot.Col xs={12} sm={6} md={4} lg={4} className="AppBadge">
        <div className="wrapper hvr-glow">
          <div className="contents">
            <Link to="app" params={{org: this.getParams().org, region: this.getParams().region, app: app.handle}}>
              <div className="name text-center">
                  {app.displayName || app.name}
              </div>

              <div className="repo text-center">
                <i className="github-icon" />
                <span className="source">
                    {source}
                </span>
              </div>
              <Boot.Row className="details text-center">
                <div className="stacks text-center" title="Active Stacks">
                  <Boot.Glyphicon glyph="tasks"/> {app.summary.stacks || 0}
                </div>
                <div className="people text-center" title="Members">
                  <Boot.Glyphicon glyph="user"/> {app.summary.users || '-'}
                </div>
                <div className="deploys text-center" title="Total Deployments">
                  <Boot.Glyphicon glyph="cloud-upload"/> {app.summary.deploys || 0}
                </div>
                  {(cost) ?
                    <div className="deploys text-center" title="Estimated Monthly Cost">
                      <Boot.Glyphicon glyph="usd"/>{cost}
                    </div>
                    : null}
              </Boot.Row>
            </Link>
          </div>
        </div>
      </Boot.Col>
    )
  }
});
