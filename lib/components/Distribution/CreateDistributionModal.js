var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  getInitialState: function (){
    return {
      saving: false,
      nameInputValue: ''
    }
  },

  create: function (event) {
    var self = this,
      distribution = {
        id: this.state.nameInputValue
      };
    this.setState({saving: true});
    this.props.store.post(distribution, function (err) {
      self.setState({saving: false});
      if (err) return self.setState({error: err});
      self.props.onRequestHide(event);
    });
  },

  handleNameChange: function (e){
    this.setState({nameInputValue: e.target.value});
  },

  handleSourceChange: function (e){
    this.setState({sourceInputValue: e.target.value});
  },

  render: function() {
    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide} bsStyle="primary" title="New Site Control Distribution"
        animation={true} refs="modal" className="CreateAppModal create-modal">
        <div className="modal-body">
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <form>
            <h4>Distribution ID</h4>
            <Boot.Input type="text" onChange={this.handleNameChange} value={this.state.nameInputValue}
                        onFocus={this.nameFocus}/>
            <Boot.Button className="center-block" bsStyle="success"
                         onClick={this.create} disabled={(this.state.saving)}>
              <i className="fa fa-check"></i> Create
            </Boot.Button>
          </form>
        </div>
      </Boot.Modal>
    );
  }
});
