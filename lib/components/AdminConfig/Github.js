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
  displayName: 'Github',
  getInitialState() {
    const params = this.getParams();
    params.configUrl = 'gitsources';
    return {
      configs: new AdminStore(params).register(this, 'configs')
    };
  },
  render() {
    const multiConfigList = this.state.configs.data.map( config => {
      const {id, source, token, urlPrefix} = config
      return <MultiConfig
        items={{source, urlPrefix, token}}
        label='github'
        key={id}
        onSave={this._saveChange.bind(null, id)}
        onDelete={this._delConfig.bind(null, id)}
        />
    });

    const header = (<h1>
      Accounts: Github
        <small className='pull-right'>
          <StoreStatus store={this.state.configs} />
        </small>
    </h1>);

    return(
      <Panel header={header}>
        <Row>
          <Col md={10}><Row>
          <Col md={4}><h4>Source</h4></Col>
          <Col md={4}><h4>UrlPrefix</h4></Col>
          <Col md={4}><h4>Token</h4></Col>
          </Row></Col>
        </Row>
        {multiConfigList}
        <CreateButton
          onSubmit={this._createConfig}
          disabled={ !(this.state.newSource && this.state.newUrlPrefix && this.state.newToken) }>
          <Col xs={12} md={4}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Source'
              value={this.state.newSource}
              onChange={this._changeInput.bind(null, 'newSource')}/>
          </Col>
          <Col xs={12} md={4}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Url Prefix'
              value={this.state.newUrlPrefix}
              onChange={this._changeInput.bind(null, 'newUrlPrefix')}></Input>
          </Col>
          <Col xs={12} md={4}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Token'
              value={this.state.newToken}
              onChange={this._changeInput.bind(null, 'newToken')}></Input>
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
      source: this.state.newSource,
      urlPrefix: this.state.newUrlPrefix,
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
    this.state.configs.put(id, items, cb);
  }
});
