var React = require('react'),
  PermItem = require('./PermItem'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  weight = {member: 0, owner: 1};

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    return {
      adding: false,
      disabled: false
    };
  },

  toggleAddingState: function () {
    this.setState({adding: !this.state.adding});
  },

  sortPerms: function (permA, permB) {
    var weightA = weight[permA.userrole],
      weightB = weight[permB.userrole];
    if (weightA !== weightB) return weightA < weightB;
    return permA.username > permB.username;
  },

  addPermission: function () {
    var username = this.refs.username.getValue(),
      userrole = this.refs.userrole.getValue();

    this.setState({disabled: true});

    this.props.addPermission(username, userrole, function () {
      this.toggleAddingState();
      this.setState({disabled: false});
    }.bind(this));
  },

  render: function () {
    var params = this.getParams(),
      isStack = (params.stack);

    return (
      <Boot.Panel>
        <h3>
          Local {(isStack) ? 'Stack' : 'App'} Permissions
          <Boot.Button bsStyle="success" disabled={this.state.adding} onClick={this.toggleAddingState}>
            <Boot.Glyphicon glyph="plus"/> Add
          </Boot.Button>
        </h3>
        {this.state.adding ?
          <div className="PermItem form-inline">
            <Boot.Input type='text' ref='username' placeholder="Email address"/>
            <Boot.Input type='select' ref='userrole'>
              <option value='member'>member</option>
              <option value='owner'>owner</option>
            </Boot.Input>
            <Boot.Button bsStyle='info' bsSize='small'
                         disabled={this.state.disabled}
                         onClick={this.addPermission}>Save</Boot.Button>
            <Boot.Button bsStyle='danger' bsSize='small'
                         disabled={this.state.disabled}
                         onClick={this.toggleAddingState}>Cancel</Boot.Button>
          </div> : null}
        {this.props.permissions.sort(this.sortPerms).map(function (perm, index) {
          return <PermItem key={index}
                           perm={perm}
                           removePermission={this.props.removePermission}
                           updatePermission={this.props.updatePermission}/>
        }.bind(this))}
      </Boot.Panel>
    );
  }
});
