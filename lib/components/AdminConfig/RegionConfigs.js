import React from 'react';
import {Row, Col, Panel, Input} from 'react-bootstrap';
import {State as RouterState} from 'react-router';
import ConfigStore from '_/stores/config';
import StoreStatus from '_/components/Common/StoreStatus';
import {regionConfigs} from '_/constants/defaultConfigs';
import ConfigItem from './ConfigItem';
import CreateButton from './CreateButton';


export default React.createClass({
  mixins: [RouterState],
  displayName: 'RegionConfigs',
  getInitialState() {
    const params = this.getParams();
    return {
      configs: new ConfigStore(params, {refresh: 120}).register(this, 'configs'),
      newName: null,
      newValue: null
    };
  },

  render() {
    const configList = this.state.configs.data.sort( (a,b)=>{
      if (a.key<b.key) return -1;
      else if (a.key > b.key) return 1;
      else return 0;
    }).map((config) => {
      return <ConfigItem name={config.key} {...config} onSave={this._saveChange} onDelete={this._delConfig}/>;
    });

    const missingList = [];
    regionConfigs.forEach(defConfig => {
      if (!this.state.configs.data.some( config => config.key === defConfig.key) ) {
        missingList.push(<ConfigItem name={defConfig.key} {...defConfig} onSave={this._postConfig} />);
      };
    });

    const header = (<h1>
      Region Configs
        <small className='pull-right'>
          <StoreStatus store={this.state.configs} />
        </small>
    </h1>);
    return(
      <Panel header={header}>
        {missingList}
        <hr/>
        {configList}
        <hr />
        <CreateButton
          onSubmit={this._createConfig}
          disabled={ !(this.state.newName && this.state.newValue) }>
          <Col xs={12} md={5}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Name'
              value={this.state.newName}
              onChange={this._changeInput.bind(null, 'newName')}/>
          </Col>
          <Col xs={12} md={5}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Value'
              value={this.state.newValue}
              onChange={this._changeInput.bind(null, 'newValue')}></Input>
          </Col>
          <Col xs={12} md={2}>
            <Input ref='secret' type="checkbox" label="Secret?"/>
          </Col>
        </CreateButton>
      </Panel>
    )
  },
  _changeInput(stateName, e) {
    this.setState({
      [stateName]: e.target.value.replace(' ', '')
    });
  },
  _saveChange(name, key, value, isSecret,  cb) {
    // TODO: display errors when puts fail
    this.state.configs.put(key, {value}, cb);
  },
  _postConfig(name, key, value, secret, cb) {
    this.state.configs.post({
      key: name,
      secret, value
    }, cb);
  },
  _delConfig(name, key, cb) {
    this.state.configs.del(key, cb);
  },
  _createConfig(cb) {
    this.state.configs.post({
      key: this.state.newName,
      value: this.state.newValue,
      secret: this.refs.secret.getChecked()
    }, (err, result)=>{
      this.setState({newName: null, newValue: null});
      cb(err, result);
    });
  }
});
