var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  PopUp = require('_/components/Common/PopUp'),
  AppStar = require('_/components/Common/AppStar'),
  AppStore = require('_/stores/app'),
  StackStore = require('_/stores/stack'),
  Router = require('react-router'),
  StackBadge = require('_/components/App/StackBadge'),
  AppIcon = require('_/components/Icons/App'),
  CreateStackModal = require('_/components/App/CreateStackModal');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      apps: new AppStore(params).register(this, 'apps'),
      stacks: new StackStore(params).register(this, 'stacks'),
      editingName: false,
      newName: null
    };
  },

  onDelete: function () {
    var params = this.getParams(),
      app = params.app,
      region = params.region,
      self = this;

    this.state.apps.del(app, function(err) {
      if (err) return self.setState({error: err});
      self.transitionTo('region', params);
    });
  },

  editName: function () {
    this.setState({editingName: true, newName: this.state.apps.get(this.getParams().app).name});
  },

  handleNameEdit: function (event) {
    this.setState({newName: event.target.value});
  },

  cancelNameEdit: function () {
    this.setState({editingName: false, newName: null});
  },

  saveNameChanges: function () {
    var self = this;
    this.state.apps.put(this.getParams().app, {name: this.state.newName}, function (err) {
      if (err) return self.setState({error: err});
      self.setState({editingName: false, newName: null});
    });
  },

  render: function () {
    var params = this.getParams(),
      app = this.state.apps.get(params.app),
      gitUrl = (app) ? 'http://' + app.source : null;
    return (
      <div className="AppPage">
        <Header />
        {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
        <Boot.Grid>
          <div className="Title">
            <h1>
              <AppIcon size="32" /><span> </span>
              {(this.state.editingName) ?
              <div className="nameEdit">
                <Boot.Input type="text" value={this.state.newName}
                          onChange={this.handleNameEdit} groupClassName="nameChangeInput" />
                <small>
                  <Boot.Glyphicon glyph="ok" onClick={this.saveNameChanges}/>
                  <Boot.Glyphicon glyph="remove" onClick={this.cancelNameEdit}/>
                  <span> </span>*this will only change the display name
                </small>
              </div>:
              <span>
                {(app) ? app.name : 'Loading'}
                <small><Boot.Glyphicon glyph="pencil" onClick={this.editName}/></small>
              </span>}
            </h1>
            <div className="pull-right"><a href={gitUrl} target='_blank'>
              <i className="fa fa-github-square"/> {(app) ? app.source : 'unknown'}
            </a></div>
          </div>

          <div className="options">
            <Boot.ModalTrigger modal={<CreateStackModal store={this.state.stacks}/>}>
              <Boot.Button bsStyle="success">
                <Boot.Glyphicon glyph="plus"/> Create New Stack
              </Boot.Button>
            </Boot.ModalTrigger>
            <Boot.ModalTrigger modal={<PopUp action={this.onDelete} message={"Are you sure you want to delete this application?"}/>}>
              <Boot.Button bsStyle="danger"><i className="fa fa-trash"></i> Delete App</Boot.Button>
            </Boot.ModalTrigger>
            <Boot.DropdownButton bsStyle="primary" title="Configure">
              <li><Link to="docker" params={params}>Docker Registry</Link></li>
              <li><Link to="appPermissions" params={params}>Permissions</Link></li>
            </Boot.DropdownButton>
          </div>

          <Boot.Panel>
            <h3>Stacks <small>{params.org} : {params.region} : {params.app}</small></h3>
            <div className="pull-right">
              <StoreStatus store={this.state.stacks} />
            </div>
            {this.state.stacks.data.map(function (stack) {
              var route = {
                org: params.org,
                region: params.region,
                app: params.app,
                stack: stack.handle
              };
              return <Router.Link key={stack.id} to="stack" params={route}>
                  <div><StackBadge stack={stack} name={stack.name}/></div>
                </Router.Link>;
            })}
            {(this.state.stacks.data.length) ? null :
              <div className="text-center">
                Looks like this app doesn't have any stacks yet.<br />
                You can create as many stacks as needed to suit your needs.
              </div>
            }
          </Boot.Panel>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
