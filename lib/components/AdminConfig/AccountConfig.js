/*
  Abstraction Work in progress.
*/
import React from 'react';
import Router from 'react-router';
import {Panel} from 'react-bootstrap';
import ConfigItem from './ConfigItem';
import CreateButton from './CreateButton';
import AdminStore from '_/stores/admin';
import StoreStatus from '_/components/Common/StoreStatus';


export default React.createClass({
  mixins: [Router.State, Router.Navigation],
  displayName: 'Accounts',

  getInitialState() {
    const params = this.getParams();
    params.configUrl = this.props.endpoint;
    const options = this.props.options;
    return {
      configs: new AdminStore(params, {objectKey: this.props.keyName}).register(this, 'configs')
    }
  },

  render() {
    const configList = this.state.configs.data.map((config) =>{
      return <ConfigItem
        name={config[this.props.name]}
        value={config[this.props.value]}
        key={config[this.props.keyName]}
        onSave={this._saveChange}/>;
    });

    const header = (<h1>
      Accounts: {this.props.service}
        <small className='pull-right'>
          <StoreStatus store={this.state.configs} />
        </small>
    </h1>);

    return(
      <Panel header={header}>
        {configList}
        <CreateButton text={this.props.buttonText}>
          {this.props.form}
        </CreateButton>
      </Panel>
    )
  },
  _saveChange(name, key, value, isSecret, cb) {
    const update ={};
    update[this.props.value] = value;
    this.state.configs.put(key, update, cb);
  },

  _postChange(fn, object) {
    // object should be {key, value, isSecret}
    this.state.configs.post(object, (err, result) => {
      // Properly display errors & result
      if (err) console.error(err);
    });
  }
});
