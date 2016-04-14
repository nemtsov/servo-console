var React = require('react'),
  Boot = require('react-bootstrap'),
  PermissionRender = require('_/components/common/PermissionRender'),
  request = require('_/stores/request');


module.exports = React.createClass({
  getInitialState: function () {
    return {editing: false, change: null, secretVisible: false, secretVal: null};
  },

  render: function () {
    var name = this.props.item.key.substr(4),
      secret = (this.props.item.secret),
      value = this.props.item.value,
      deployed = this.props.item.deployed,
      editing = this.state.editing,
      error = this.state.error;

    return (
      <tr>
        <td>
          {name} <i className="fa fa-trash" onClick={this.deleteConfig}></i>
          {(deployed === false) ? <span> <Boot.OverlayTrigger placement="right"
            overlay={<Boot.Tooltip>This has not yet been deployed</Boot.Tooltip>}>
            <i className="fa fa-exclamation-triangle"></i>
            </Boot.OverlayTrigger></span> : null}
        </td>
        <td>
          {(secret) ?
            <div>
              <PermissionRender userrole='owner' style={{paddingRight: '5px', cursor: 'pointer'}}>
                <i className='fa fa-eye' onClick={this.showSecret}></i>
              </PermissionRender>
              <i className="fa fa-lock">   {(this.state.secretVal && this.state.secretVisible) ? this.state.secretVal : 'Encrypted Secret'}</i>


            </div>
            : null}
          {(!secret && !editing) ?
            <span>{value} <i className="fa fa-pencil" onClick={this.startEditing}></i></span> : null}
          {(editing) ? <div className="form-inline">
            <input type="text" onChange={this.handleEditChange} onKeyDown={this.handleKeyDown}
                   className="form-control changeInput" id="name" value={this.state.change}/>
            <Boot.Button bsStyle="success" onClick={this.saveChanges}>Save</Boot.Button>
            <Boot.Button bsStyle="danger" onClick={this.stopEditing}>Cancel</Boot.Button>
            {(error) ? <Boot.Alert bsStyle="danger">{error}</Boot.Alert> : null}
          </div> : null}
        </td>
      </tr>
    );
  },

  showSecret:  function() {
    var path = this.props.store._path + '/' + this.props.item.id + '/plaintext';
    var self = this;
    if (this.state.secretVisible) {
      return this.setState({secretVisible: false});
    }
    if (this.state.secretVal) {
      return this.setState({secretVisible: true});
    }
    // Get secret component does not have it
    request.get(path, function(err, res, body) {
      if (err) return console.error(err);
      self.setState({
        secretVal: body.value,
        secretVisible: true
      })
    });
  },
  startEditing: function () {
    this.setState({
      editing: true,
      change: this.props.item.value
    });
  },

  stopEditing: function () {
    this.setState({editing: false, change: null, error: null})
  },

  handleEditChange: function (event) {
    this.setState({change: event.target.value});
  },

  saveChanges: function () {
    var self = this;
    this.props.store.put(this.props.item.id, {value: this.state.change, secret: this.props.item.secret}, function (err) {
      if (err) return self.setState({error: err});
      self.setState({editing: false});
    })
  },

  deleteConfig: function () {
    var self = this;
    this.props.store.del(this.props.item.id, function (err) {
      if (err) return self.setState({error: err});
    })
  },

  handleKeyDown: function (event) {
    var enterKey = 13;
    if (event.keyCode === enterKey) this.saveChanges();
  }
});
