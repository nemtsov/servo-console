import React from 'react';
import {Col, Row, Input, Panel} from 'react-bootstrap';
import {State as RouterState} from 'react-router';
import ConfigItem from './ConfigItem';
import MultiConfig from './MultiConfig';
import AdminStore from '_/stores/admin';
import StoreStatus from '_/components/Common/StoreStatus';
import CreateButton from './CreateButton';


//TODO: can we abstract this page?
export default React.createClass({
  mixins: [RouterState],
  displayName: 'Twilio',
  getInitialState() {
    const params = this.getParams();
    params.configUrl = 'twilio';
    return {
      configs: new AdminStore(params).register(this, 'configs')
    };
  },
  render() {
    const multiConfigList = this.state.configs.data.map( config => {
      const {id, accountSid, token, phone} = config
      return <MultiConfig
        items={{accountSid, token, phone}}
        label='twilio'
        key={id}
        onSave={this._saveChange.bind(null, id)}
        onDelete={this._delConfig.bind(null, id)}
        />
    });

    const header = (<h1>
      Accounts: Twilio
        <small className='pull-right'>
          <StoreStatus store={this.state.configs} />
        </small>
    </h1>);

    return(
      <Panel header={header}>
        <Row>
          <Col md={10}><Row>
          <Col md={4}><h4>AccountSID</h4></Col>
          <Col md={4}><h4>Token</h4></Col>
          <Col md={4}><h4>Phone</h4></Col>
          </Row></Col>
        </Row>
        {multiConfigList}
        <CreateButton
          onSubmit={this._createConfig}
          disabled={ !(this.state.newAccount && this.state.newToken && this.state.newPhone) }>
          <Col xs={12} md={4}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='AccountSid'
              value={this.state.newAccount}
              onChange={this._changeInput.bind(null, 'newAccount')}/>
          </Col>
          <Col xs={12} md={4}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Token'
              value={this.state.newToken}
              onChange={this._changeInput.bind(null, 'newToken')}></Input>
          </Col>
          <Col xs={12} md={4}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Phone'
              value={this.state.newPhone}
              onChange={this._changeInput.bind(null, 'newPhone')}></Input>
          </Col>
        </CreateButton>
      </Panel>
    )
  },
  _changeInput(stateName, e) {
    this.setState({
      [stateName]: e.target.value
    });
  },
  _createConfig(cb){
    this.state.configs.post({
      accountSid: this.state.newAccount,
      phone: this.state.newPhone,
      token: this.state.newToken
    }, (err, result)=>{
      this.setState({newSource: null, newUrlPrefix: null, newToken: null});
      cb(err, result);
    });
  },
  _delConfig(key, cb) {
    this.state.configs.del(key, cb);
  },
  _saveChange(id, items, cb) {
    // TODO: display errors when puts fail
    this.state.configs.put(id, items, cb);
  }
});
