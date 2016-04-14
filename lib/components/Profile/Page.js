import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Router from 'react-router';
import PopUp from '_/components/Common/Popup';
import Header from '_/components/Common/Header';
import Footer from '_/components/Common/Footer';
import User from './User';
import Tokens from './Tokens';
const {Link} = Router;


module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],
  displayName: 'Profile',

  getInitialState () {
    const params = this.getParams();
    const setting = params.setting;
    return {
      page: setting || 'user'
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: this.getParams().setting || 'user'
    });
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
                  <h1>Profile</h1>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={2}>
                <ul className="nav nav-pills nav-stacked">
                  <li role="presentation" className={(this.state.page === 'user') ? 'active' : null}>
                    <Link to='profile' params={{setting: 'user'}} query={this.getQuery()}>User</Link>
                  </li>
                  <li role="presentation" className={(this.state.page === 'tokens') ? 'active' : null}>
                    <Link to='profile' params={{setting: 'tokens'}} query={this.getQuery()}>Tokens</Link>
                  </li>
                  <li role="presentation" className='disabled'>
                      <a>MFA</a>
                  </li>
                  <li role="presentation" className='disabled'>
                      <a>Preferences</a>
                  </li>
                </ul>
              </Col>
              <Col md={10}>
                {(this.state.page === 'user') ? <User region={region}/> : null}
                {(this.state.page === 'tokens') ? <Tokens region={region}/> : null}
              </Col>
            </Row>
          </Grid>
          <Footer />
      </div>
    )
  }
});
