var React = require('react'),
  Boot = require('react-bootstrap'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State],

  render: function () {
    var params = this.getParams(),
      crumbs = [],
      manualCrumbs = [];

    delete params.deploy;

    if(/^\/profile/.test(this.getPathname())) params =[];
    if (/stacks\/[\w-]+\/environmentVariables$/.test(document.URL)) manualCrumbs.push('variables');
    if (/stacks\/[\w-]+\/workerSettings$/.test(document.URL)) manualCrumbs.push('worker settings');
    if (/stacks\/[\w-]+\/builds$/.test(document.URL)) manualCrumbs.push('builds');
    if (/stacks\/[\w-]+\/logs$/.test(document.URL)) manualCrumbs.push('logs');
    if (/stacks\/[\w-]+\/network$/.test(document.URL)) manualCrumbs.push('network');
    if (/\/deploys\//.test(document.URL)) manualCrumbs.push('deploy');
    if (/apps\/[\w-]+\/docker$/.test(document.URL)) manualCrumbs.push('docker');
    if (/stacks\/[\w-]+\/newrelic$/.test(document.URL)) manualCrumbs.push('newrelic');
    if (/stacks\/[\w-]+\/permissions$/.test(document.URL) || /apps\/\w+\/permissions$/.test(document.URL)) manualCrumbs.push('permissions');
    if (/stacks\/[\w-]+\/notifications$/.test(document.URL)) manualCrumbs.push('notifications');
    if (/stacks\/[\w-]+\/workers$/.test(document.URL)) manualCrumbs.push('workers');
    if (/sitecontrol$/.test(document.URL)) manualCrumbs.push('site control');

    Object.keys(params).forEach(function (key, index, arr) {
      var value = params[key],
        link = key;
      if (index + 1 === arr.length && !manualCrumbs.length) {
        crumbs.push(value);
      } else {
        crumbs.push(<Router.Link to={link} params={params}>{value}</Router.Link>)
      }
    });

    crumbs = crumbs.concat(manualCrumbs);

    return (
      <div className="Breadcrumbs mobile-hide">
        <ol>
          {crumbs.map(function (crumb, index) {
            return <li key={index}>{crumb}</li>;
          })}
        </ol>
      </div>
    )
  }
});
