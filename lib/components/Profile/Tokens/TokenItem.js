import React from 'react';
import Boot from 'react-bootstrap';
import ClipboardButton from '_/components/Common/Clipboard';

class TokenItem extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'TokenItem';
    this.state = {show: false};
  }

  copySuccess = (e) => {
    this.setState({
      show: true
    }, () => {
      setTimeout(() => {
        this.setState({
          show: false
        });
      }, 750);
    });
  };

  render() {
    var token = this.props.token;
    var idx = this.props.idx;
    var buttonClass= this.state.show ? 'fa-check' : 'fa-clipboard';

    var copyButton= (
        <ClipboardButton
          style={{
            paddingTop: '9px',
            paddingBottom: '9px'
          }}
          bsStyle='success'
          onSuccess={this.copySuccess}
          text={token.val}>
          <i className={'fa ' + buttonClass}> </i>
        </ClipboardButton>
    );

    return (<Boot.Row key={token.name}>
      <Boot.Col xs={10} className='form-horizontal'>
        <Boot.Input type='text'
                    style={{fontFamily:'monospace'}}
                    label={token.name}
                    value={token.val}
                    buttonAfter={copyButton}
                    labelClassName='col-xs-2 tokenLabel'
                    wrapperClassName='col-xs-10' disabled/>
      </Boot.Col>
      <Boot.Col xs={1}>
        <Boot.Button bsStyle='danger'
          style={{
            paddingTop: '9px',
            paddingBottom: '9px'
          }}
          onClick={this.props.onDelete.bind(null, token, idx)}
          disabled={this.props.disabled}>
          <i className='fa fa-trash-o'></i>
        </Boot.Button>
      </Boot.Col>
    </Boot.Row>
  )}
}

// CommonJS export for Compatibility
module.exports = TokenItem;
