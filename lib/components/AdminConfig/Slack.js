import React from 'react';
import {State as RouterState} from 'react-router';
import {Col, Row, Input, Panel} from 'react-bootstrap';
import AdminStore from '_/stores/admin';
import StoreStatus from '_/components/Common/StoreStatus';
import CreateButton from './CreateButton';
import MultiConfig from './MultiConfig';


//TODO: can we abstract this page?
export default React.createClass({
  mixins: [RouterState],
  displayName: 'Slack',

  getInitialState() {
    const params = this.getParams();
    params.configUrl = 'slack';
    return {
      configs: new AdminStore(params).register(this, 'configs'),
      newTeam: null,
      newUrl: null,
    };
  },
  render() {
    const multiConfigList = this.state.configs.data.map( config => {
      const {id, team, webhookUrl} = config;
      return <MultiConfig
        items={{team, webhookUrl}}
        label='slack'
        key={id}
        onSave={this._saveChange.bind(null, id)}
        onDelete={this._delConfig.bind(null, id)}
        />
    });

    const header = (<h1>
      Accounts: Slack
        <small className='pull-right'>
          <StoreStatus store={this.state.configs} />
        </small>
    </h1>);

    return(
      <Panel header={header}>
        <Row>
          <Col md={10}><Row>
          <Col md={6}><h4>Team</h4></Col>
          <Col md={6}><h4>Webhook Url</h4></Col>
          </Row></Col>
        </Row>
        {multiConfigList}
        <hr />
        <CreateButton
          onSubmit={this._createSlack}
          disabled={ !(this.state.newTeam && this.state.newUrl) }>
          <Col xs={12} md={6}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='Team'
              value={this.state.newTeam}
              onChange={this._changeInput.bind(null, 'newTeam')}/>
          </Col>
          <Col xs={12} md={6}>
            <Input type='text'
              style={{fontFamily:'monospace'}}
              placeholder='WebHookUrl'
              value={this.state.newUrl}
              onChange={this._changeInput.bind(null, 'newUrl')}></Input>
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
  _delConfig(key, cb) {
    this.state.configs.del(key, cb);
  },
  _createSlack(cb) {
    this.state.configs.post({
      team: this.state.newTeam,
      webhookUrl: this.state.newUrl
    }, (err, result) => {
      this.setState({newTeam: null, newUrl: null});
      cb(err, result);
    });
  },
  _saveChange(id, items, cb) {
    // TODO: display errors when puts fail
    this.state.configs.put(id, items, cb);
  },

  _postChange(fn, object) {
    this.state.configs.post(object, (err, result) => {
      // Properly display errors & result
      if (err) console.error(err);
    });
  }
});
