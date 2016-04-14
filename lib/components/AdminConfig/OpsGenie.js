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
  displayName: 'OpsGenie',
  getInitialState() {
    const params = this.getParams();
    params.configUrl = 'opsgenie';
    return {
      configs: new AdminStore(params).register(this, 'configs')
    };
  },
  render() {
    const multiConfigList = this.state.configs.data.map( config => {
      const {id, url, key} = config
      return <MultiConfig
        items={{url, key}}
        label='twilio'
        key={id}
        onSave={this._saveChange.bind(null, id)}
        onDelete={this._delConfig.bind(null, id)}
        />
    });

    const header = (<h1>
      Accounts: OpsGenie
        <small className='pull-right'>
          <StoreStatus store={this.state.configs} />
        </small>
    </h1>);

    return(
      <Panel header={header}>
        <Row>
          <Col md={10}><Row>
          <Col md={6}><h4>Url</h4></Col>
          <Col md={6}><h4>Key</h4></Col>
          </Row></Col>
        </Row>
        {multiConfigList}
        <CreateButton
          onSubmit={this._createConfig}
          disabled={ !(this.state.newUrl && this.state.newKey) }>
          <Col xs={12} md={6}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Url'
              value={this.state.newUrl}
              onChange={this._changeInput.bind(null, 'newUrl')}/>
          </Col>
          <Col xs={12} md={6}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Key'
              value={this.state.newKey}
              onChange={this._changeInput.bind(null, 'newKey')}></Input>
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
      url: this.state.newUrl,
      key: this.state.newKey,
    }, (err, result)=>{
      this.setState({url: null, key: null});
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
