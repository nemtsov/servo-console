var React = require('react'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  PermissionRender = require('_/components/Common/PermissionRender'),
  Link = require('react-router').Link,
  AppBadge = require('_/components/Region/AppBadge'),
  WelcomeBanner = require('_/components/Region/WelcomeBanner'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  CreateAppModal = require('_/components/Region/CreateAppModal'),
  Boot = require('react-bootstrap'),
  AppStore = require('_/stores/app'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State],

  displayName: 'RegionPage',

  getInitialState: function () {
    var params = this.getParams();
    return {
      apps: new AppStore(params).register(this, 'apps'),
      sortOption: 'activityWeek',
      filter: '',
      loaded: false
    };
  },

  sortOptions: [
    {name: 'activityDay', display: 'Most Active Today'},
    {name: 'activityWeek', display: 'Most Active This Week'},
    {name: 'activityAll', display: 'Most Active All Time'},
    {name: 'recent', display: 'Recently Added'}
  ],

  sortApps: function (apps) {
    apps.forEach(function (app) {
      if (!app.summary) app.summary = {};
      if (!app.summary.activity) app.summary.activity = {};
    });
    switch (this.state.sortOption) {
      case 'activityDay':
        apps.sort(function (a, b) {return b.summary.activity.day - a.summary.activity.day});
        break;
      case 'activityWeek':
        apps.sort(function (a, b) {return b.summary.activity.week - a.summary.activity.week});
        break;
      case 'activityAll':
        apps.sort(function (a, b) {return b.summary.activity.all - a.summary.activity.all});
        break;
      case 'recent':
        apps.sort(function (a, b) {return new Date(b.createdAt) - new Date(a.createdAt)})
    }
    return apps;
  },

  filterApps: function (apps) {
    var regex = new RegExp(this.state.filter, 'i');
    return apps.filter(function (app) {
      return (regex.test(app.name) || regex.test(app.repo));
    });
  },

  onSelectSortOption: function (event) {
    this.setState({sortOption: event.target.value});
  },

  onSearchChange: function (event) {
    this.setState({filter: event.target.value});
  },

  renderLoading: function () {
    if (!this.state.loaded)
      return <LoadingBar/>
  },

  cleanUpError: function () {
    this.setState({error: null});
  },

  render: function () {
    var params = this.getParams();
    var apps = this.filterApps(this.state.apps.data);
    apps = this.sortApps(apps);

    return (
        <div className="RegionPage">
          <Header />
          <WelcomeBanner />
          <Boot.Grid>
            <div className="form-inline options">
              <Boot.ModalTrigger modal={<CreateAppModal store={this.state.apps} />}>
                  <Boot.Button bsStyle="success">
                    <Boot.Glyphicon glyph="plus"/> Create New App
                  </Boot.Button>
              </Boot.ModalTrigger>

              <Boot.Glyphicon glyph="search" className="searchIcon"/>
              <Boot.Input type="search" value={this.state.filter} placeholder="Search Apps" ref="search" onChange={this.onSearchChange}></Boot.Input>
              <Boot.Input id="sort" className='control search' type="select"  value={this.state.sortOption} onChange={this.onSelectSortOption}>
                    {this.sortOptions.map(function (option) {
                      return <option key={option.name} value={option.name}>{'Sort by ' + option.display}</option>;
                    })}
              </Boot.Input>
              <Link to="distributions" params={params}>
                <Boot.Button className='pull-right'>
                  Site Control <sup>beta</sup>
                </Boot.Button>
              </Link>
              <PermissionRender userrole='owner' className="pull-right">
                <Link to="adminConfigs" params={params}>
                  <Boot.Button>
                    <i className='fa fa-wrench'></i> Core Configs
                  </Boot.Button>
                </Link>
              </PermissionRender>
            </div>

            <Boot.Panel>
              <h3>Applications <small>{params.org} : {params.region}</small></h3>
              <div className="pull-right">
                <StoreStatus store={this.state.apps} />
              </div>
              <div className="badges">
                {apps.map(function (app) {
                  return <AppBadge key={app.id} app={app} toggleStar={this.toggleStar} />;
                }.bind(this))}
              </div>
            </Boot.Panel>
          </Boot.Grid>
          <Footer />
        </div>
    );
  }
});
