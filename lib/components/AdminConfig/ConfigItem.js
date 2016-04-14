import React from 'react';
import {
  Row,
  Col,
  Panel,
  Button,
  Input,
  ButtonGroup
} from 'react-bootstrap';
const PropTypes = React.PropTypes;

const ConfigItem = React.createClass({
  propTypes: {
    onSave: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func
  },
  getInitialState() {
    return({
      value: this.props.value,
      editing: false,
      loading: false,
      changed: false,
      decrypted: false,
    });
  },

  render() {
    var buttonStyle, faIcon, isEncrypted;
    var value = this.state.value;
    if(this.props.secret && !this.state.changed && this.state.value && !this.state.decrypted) {
      value = '--Encrypted--';
      isEncrypted = true;
    }

    if (!this.state.editing) {
      buttonStyle = 'success';
      faIcon = 'fa fa-pencil';
    } else if (!this.state.changed) {
      buttonStyle = 'info';
      faIcon = 'fa fa-times';
    } else {
      buttonStyle = 'primary';
      faIcon = 'fa fa-floppy-o';
    }


    return (
      <Row>
        <Col xs={10} className='form-horizontal'>
          <Input type='text'
            style={{fontFamily:'monospace'}}
            label={this.props.name}
            value={value}
            onChange={this._onChange}
            onKeyUp={e => (e.keyCode === 27) ? this._reset() : null }
            buttonAfter={isEncrypted ? <Button onClick={this._showSecret} style={{padding: '9px'}}><i className='fa fa-eye'></i></Button> : null}
            labelClassName='col-xs-2'
            wrapperClassName='col-xs-10' disabled={this.state.loading || !this.state.editing}
          />
        </Col>
        <Col xs={2}>
          <ButtonGroup>
            <Button bsStyle={buttonStyle}
              style={{
                paddingTop: '9px',
                paddingBottom: '9px',
                marginRight: '5px'
              }}
              onClick={this._onEditClick}
              disabled={this.state.loading}
              >
              <i className={faIcon}></i>
            </Button>
            <Button bsStyle='danger'
              style={{
                paddingTop: '9px',
                paddingBottom: '9px'
              }}
              onClick={this._onDeleteClick}
              disabled={this.state.loading || !this.props.onDelete}
              >
              <i className='fa fa-trash'></i>
            </Button>
          </ButtonGroup>

        </Col>
      </Row>
    )
  },
  _showSecret() {
    // Figure out how to get encrypted values
  },
  _onChange(e) {
    var changed = false;
    if(this.props.value !== e.target.value) {
      changed = true;
    }
    this.setState({
      value: e.target.value,
      changed: changed
    })
  },
  _onDeleteClick(e){
    this.setState({
      loading: true
    }, () => {
      this.props.onDelete(this.props.name, this.props.id, (err, data) => {
        if (err) console.error(err);
        this.setState({loading:false});
      });
    })
  },
  _reset(){
    this.setState({
      value: this.props.value,
      editing: false,
      changed: false
    });
  },
  _onEditClick(e) {
    const editing = this.state.editing;
    if (this.state.editing) {
      if(this.state.changed) {
        this.setState({
          loading: true
        });
        this.props.onSave(this.props.name, this.props.id, this.state.value, this.props.secret, (err, data) => {
          // TODO: Display error and reset value to this.props.value
          if (err) {
            console.error(err);
            return this.setState({
              value: this.props.value,
              loading: false
            });
          };
          this.setState({loading: false})
        });
      }
    }
    this.setState({
      editing: !editing
    });
  },
});

export default ConfigItem;
