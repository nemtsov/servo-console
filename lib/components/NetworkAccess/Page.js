var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  AccessControl = require('./AccessControl'),
  Boot = require('react-bootstrap'),
  DeployStore = require('_/stores/deploy'),
  ConfigStore = require('_/stores/config'),
  AddressBookStroe = require('_/stores/addressBook'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      configs: new ConfigStore(params).register(this, 'configs'),
      addressBooks: new AddressBookStroe(params).register(this, 'addressBooks')
    };
  },

  getConfig: function (isIngress) {
    var config = this.state.configs.data.filter(function (config) {
      return config.key === (isIngress ? 'NetworkIngress' : 'NetworkEgress');
    })[0];
    if (!config) return {value: []};
    if (!Array.isArray(config.value))
      config.value = config.value.split(',');
    return config;
  },

  saveChanges: function (isIngress, rules, cb) {
    var config = this.getConfig(isIngress);
    if (config.id)
      return this.state.configs.put(config.id, {value: rules}, cb);
    this.state.configs.post({key: isIngress ? 'NetworkIngress' : 'NetworkEgress', value: rules}, cb);
  },

  render: function () {
    var isIngress = true,
      ingressRules = this.getConfig(isIngress).value,
      egressRules = this.getConfig(!isIngress).value;
    return (
      <div className="NetworkAccess">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Network Access</h1>
            <StoreStatus store={this.state.configs} />
          </div>
          <Boot.Well>
            Here you can configure the network access to this stack. For now, you can specify
            IP CIDR ranges for the IP addresses that should be able to connect to your stack.
            Think of it as the firewall of the stack. These can be IP addresses from the internal
            network as well as on the public internet. If you want to make the stack publicly
            available on the internet, just add a rule for <strong>0.0.0.0/0</strong>. Changes made
            here take effect immediately and do not require a deploy.
          </Boot.Well>
          <Boot.Row>
            <Boot.Col md={6}>
              <AccessControl title='Ingress Sources' isIngress={isIngress} rules={ingressRules} addressBooks={this.state.addressBooks.data} saveChanges={this.saveChanges.bind(this, true)}/>
            </Boot.Col>
            <Boot.Col md={6}>
              <AccessControl title='Egress Destinations' isIngress={!isIngress} rules={egressRules} addressBooks={this.state.addressBooks.data} saveChanges={this.saveChanges.bind(this, false)}/>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
