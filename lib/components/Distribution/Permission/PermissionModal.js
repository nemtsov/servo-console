import React from 'react';
import {Modal, Button, Col, Row, Alert} from 'react-bootstrap';
import PermissionStore from '_/stores/permission';
import LocalPermissions from './LocalPermissions';
import InheritedPermissions from './InheritedPermissions';
import StoreStatus from '_/components/Common/StoreStatus';
/*
 * Very Similar to _/components/Permission
 * TODO: Consolidate components
*/
module.exports = React.createClass({
  displayName: 'PermissionModal',

  getInitialState(){
    const orgParams = this.props.params;
    const distParams = {...this.props.params, distribution: this.props.distribution};

    const state = {
      params: distParams,
      orgPermissions: new PermissionStore(orgParams).register(this, 'orgPermissions'),
      distPermissions: new PermissionStore(distParams).register(this, 'distPermissions')
    }

    if (this.props.origin) {
      state.params = {...distParams, origin: this.props.origin};
      state.originPermissions = new PermissionStore({...distParams, origin: this.props.origin}).register(this, 'originPermissions')
    }

    return state;
  },

  addPermission(username, userrole, cb) {
    const params = this.state.params;
    const store = params.origin ? this.state.originPermissions : this.state.distPermissions;

    store.post({username, userrole}, (err) => {
      if (err) this.setState({error: err.message});
      else this.setState({error: null});
      cb();
    });
  },

  updatePermission(username, userrole, cb) {
    const params = this.state.params;
    const store = params.origin ? this.state.originPermissions : this.state.distPermissions;

    store.put(username, {userrole}, (err) => {
      if (err) this.setState({error: err.message});
      else this.setState({error: null});
      cb();
    });
  },

  removePermission(username, cb) {
    const params = this.state.params;
    const store = params.origin ? this.state.originPermissions : this.state.distPermissions;

    store.del(username, (err) => {
      if (err) this.setState({error: err.message});
      else this.setState({error: null});
      cb();
    });
  },

  render() {
    const isOrigin = !!this.state.params.origin;
    return (
      <Modal bsStyle='info' bsSize='large'
        onRequestHide={this.props.onRequestHide}
        title={[<span key={0}>SiteControl Permissions  </span>, <StoreStatus key={1} store={this.state.orgPermissions} iconOnly />]}
        animation={true} refs="modal"
      >
        <div className="modal-body">
          {(this.state.error) ? <Alert bsStyle="danger">{this.state.error}</Alert> : null}
          <Row>
            <Col md={7}>
              <LocalPermissions
                params={this.state.params}
                permissions={ (isOrigin) ? this.state.originPermissions.data : this.state.distPermissions.data}
                addPermission={this.addPermission}
                updatePermission={this.updatePermission}
                removePermission={this.removePermission}/>
            </Col>
            <Col md={5}>
              <InheritedPermissions
                params={this.state.params}
                orgPermissions={this.state.orgPermissions.data}
                distPermissions={this.state.distPermissions.data}/>
            </Col>
          </Row>
          </div>
      </Modal>
    );
  }
});
