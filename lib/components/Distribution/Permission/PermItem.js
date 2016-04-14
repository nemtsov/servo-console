import React from 'react';
import Boot from 'react-bootstrap';

module.exports = React.createClass({
  getInitialState() {
    return {
      editing: false,
      disabled: false
    };
  },

  toggleEditingState() {
    this.setState({editing: !this.state.editing});
  },

  updatePermission() {
    this.setState({disabled: true});
    this.props.updatePermission(this.props.perm.username, this.refs.userrole.getValue(), () => {
      this.toggleEditingState();
      this.setState({disabled: false});
    });
  },

  removePermission() {
    this.setState({disabled: true});
    this.props.removePermission(this.props.perm.username, () => {
      this.toggleEditingState();
      this.setState({disabled: false});
    });
  },

  render() {
    const editing = this.state.editing;
    const perm = this.props.perm;
    const memberColor = perm.userrole.match('owner') ? 'primary' : 'info';

    return (
      <div className="PermItem form-inline">
        {perm.username}
        {editing ?
          <Boot.Input type='select' ref='userrole'>
            <option value='member'>member</option>
            <option value='owner'>owner</option>
          </Boot.Input> :
          <Boot.Label bsStyle={memberColor}>{perm.userrole}</Boot.Label>
        }
        {editing ?
          <Boot.Button bsStyle='info' bsSize='small' disabled={this.state.disabled} onClick={this.updatePermission}>Save</Boot.Button> :
          <Boot.Glyphicon glyph="pencil" onClick={this.toggleEditingState}/>
        }
        {editing ?
          <Boot.Button bsStyle='danger' bsSize='small' onClick={this.toggleEditingState}>Cancel</Boot.Button> :
          <Boot.Glyphicon glyph="trash" onClick={this.removePermission}/>
        }
      </div>
    );
  }
});
