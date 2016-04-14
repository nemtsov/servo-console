import React from 'react';
import {
  Grid, Row, Col,
  Panel,
  Button, Input,
  Nav, NavItem
} from 'react-bootstrap';
import Router from 'react-router';
import RegionConfigs from './RegionConfigs';
import Github from './Github';
import Twilio from './Twilio';
import Slack from './Slack';
import OpsGenie from './Opsgenie';
import Header from '_/components/Common/Header';
import Footer from '_/components/Common/Footer';

const {Link} = Router;

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],
  displayName: 'AdminConfig',

  getInitialState: function() {
    const {config} = this.getParams();
    return {
      page: config || 'global'
    };
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      page: this.getParams().config || 'global'
    });
  },
  handleSelect(key) {
    const params = this.getParams();
    params.config = key;
    this.transitionTo('adminConfigs', params);
  },

  render () {
    // TODO: Is this region actually needed?
    const params = this.getParams();
    const region = this.getQuery().region;
    return(
      <div>
        <Header/>
          <Grid>
            <Row>
              <Col md={7}>
                <div className="Title">
                  <h1>Admin </h1>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={2}>
                <Nav bsStyle='pills' stacked activeKey={this.state.page} onSelect={this.handleSelect}>
                  <NavItem eventKey='global'> <i className='fa fa-globe'></i>  Global</NavItem>
                  <NavItem eventKey='github'><i className='fa fa-github'></i> Github</NavItem>
                  <NavItem eventKey='slack'><i className='fa fa-slack'></i> Slack</NavItem>
                  <NavItem eventKey='twilio'><i className='fa fa-phone'></i> Twilio</NavItem>
                  <NavItem eventKey='opsgenie'><i className='fa fa-paper-plane'></i> OpsGenie</NavItem>
                  <NavItem eventKey='addressBook' disabled><i className='fa fa-book'></i> Address Book</NavItem>
                </Nav>
              </Col>
              <Col md={10}>
                {(this.state.page === 'global') ?<RegionConfigs />: null}
                {(this.state.page === 'github') ?<Github/>: null}
                {(this.state.page === 'slack') ? <Slack/> : null}
                {(this.state.page === 'twilio') ? <Twilio/> : null}
                {(this.state.page === 'opsgenie') ?  <OpsGenie/>: null}
              </Col>
            </Row>
          </Grid>
          <Footer />
      </div>
    )
  }
});
