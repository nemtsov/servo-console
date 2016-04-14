import React from 'react';
import {
  Row, Col, Panel,
  Button, Input, ButtonGroup
} from 'react-bootstrap';

const PropTypes = React.PropTypes;

const MultiConfig = React.createClass({
  propTypes: {
    onSave: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    items: PropTypes.object,
    onDelete: PropTypes.func,
  },

  getInitialState() {
    return({
      items: {...this.props.items},
      editing: false,
      loading: false,
      changed: false,
      decrypted: false,
    });
  },

  render() {
    var buttonStyle, faIcon, isEncrypted;

    isEncrypted = false;
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

    const items = Object.keys(this.state.items).map( (itemKey, idx) => {
      return (
        <Col key={itemKey} md={Math.floor(12 / Object.keys(this.state.items).length)}>
          <Input type='text'
            style={{fontFamily:'monospace'}}
            value={this.state.items[itemKey]}
            onChange={this._onChange.bind(null, itemKey)}
            onKeyUp={e => (e.keyCode === 27) ? this._reset() : null }
            buttonAfter={isEncrypted ? <Button style={{padding: '9px'}}><i className='fa fa-eye'></i></Button> : null}
            disabled={this.state.loading || !this.state.editing} ></Input>
        </Col>
      )
    });
    return (
      <Row>
        <Col xs={10}>
          <Row> {items} </Row>
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
  _reset() {
    this.setState({
      items: {...this.props.items},
      editing: false,
      changed: false
    });
  },
  _onChange(key, e) {
    var changed = false;
    if(this.props.items[key] !== e.target.value) {
      changed = true;
    }

    const items = this.state.items;
    items[key] = e.target.value

    this.setState({
      items: items,
      changed: changed
    });
  },
  _onEditClick(e) {
    const editing = this.state.editing;
    if (editing && this.state.changed) {
      this.setState({
        loading: true
      });
      this.props.onSave(this.state.items, (err, data) => {
        // TODO: Display error and reset value to this.props.value
        if (err) {
          console.error(err);
          return this.setState({
            items: {...this.props.items},
            loading: false
          });
        };
        this.setState({loading: false})
      });
    }
    this.setState({
      editing: !editing
    });
  },
  _onDeleteClick(e) {
    this.setState({
      loading: true
    }, () => {
      this.props.onDelete((err, data) => {
        if (err) console.error(err);
        this.setState({loading:false});
      });
    })
  },
});

export default MultiConfig;
