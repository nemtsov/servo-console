var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'AccessControl',

  getInitialState: function () {
    return {
      isEditing: false,
      isSaving: false,
      changes: [],
      type: "CIDR",
      address: "10.0.0.0/8",
      protocol: "tcp",
      port: "80"
    };
  },

  updateText: function (key, event) {
    var newState = {},
      value = event.target.value,
      addressBooks = this.props.addressBooks || [],
      address;
    newState[key] = value;
    if (key === "type") {
      if (value === "Book")
        newState.address = addressBooks[0].name;
      if (value === "CIDR")
        newState.address = "10.0.0.0/8";
    }
    this.setState(newState);
  },

  remove: function (index) {
    var temp  = this.state.changes.map(function (rule) {
      return rule;
    });
    temp.splice(index, 1);
    this.setState({changes: temp});
  },

  add: function () {
    var isIngress = this.props.isIngress,
      temp  = this.state.changes.map(function (rule) {
        return rule;
      });

    if (!isIngress)
      temp.push([this.state.type, this.state.address, this.state.protocol, this.state.port, this.state.port].join(':'));
    else {
      temp.push([this.state.type, this.state.address].join(':'));
    }

    this.setState({
      changes: temp,
      type: "CIDR",
      address: '0.0.0.0/8',
      protocol: "tcp",
      port: "80"
    });
  },

  saveChanges: function () {
    this.props.saveChanges(this.state.changes, function (err) {
      this.setState({isSaving: false});
      if (err) return console.error(err);
      this.toggleEdit();
    }.bind(this));
    this.setState({isSaving: true});
  },

  toggleEdit: function () {
    var changes = this.props.rules.map(function (rule) {
      return rule;
    });
    this.setState({
      changes: changes,
      isEditing: !this.state.isEditing
    });
  },

  render: function () {
    var rules = this.state.isEditing ? this.state.changes : this.props.rules,
      isEmpty = rules.length === 0,
      isEditing = this.state.isEditing,
      isIngress = this.props.isIngress,
      isBook = this.state.type.match('Book'),
      addressBooks = this.props.addressBooks || [],
      self = this;

    return (
      <Boot.Row className="access-control">
        <Boot.Col md={12}>
          <Boot.Row>
            <Boot.Col md={6}>
              <h3>
                {this.props.title}
              </h3>
            </Boot.Col>
            <Boot.Col md={2}>
              <Boot.Button onClick={isEditing ? this.saveChanges : this.toggleEdit}
                  bsStyle={isEditing ? "success" : "primary"}
                  disabled={isEditing ? this.state.isSaving : isEditing}>
                {isEditing ? 'Save' : 'Edit'}
              </Boot.Button>
            </Boot.Col>
            <Boot.Col md={2}>
              {
                isEditing ?
                  <Boot.Button onClick={this.toggleEdit} bsStyle="danger">Cancel</Boot.Button> :
                  null
              }
            </Boot.Col>
            <Boot.Col md={2}/>
          </Boot.Row>
          {
            !isEmpty || isEditing ?
              <Boot.Row>
                <Boot.Col md={10}>
                  <Boot.Row>
                    <Boot.Col md={7}>
                      <h4>{isIngress ? "From" : "To"}</h4>
                    </Boot.Col>
                    <Boot.Col md={3}>
                      <h4>{isIngress ? null : 'Protocol'}</h4>
                    </Boot.Col>
                    <Boot.Col md={2}>
                      <h4>{isIngress ? null : 'Port'}</h4>
                    </Boot.Col>
                  </Boot.Row>
                </Boot.Col>
                <Boot.Col md={2}/>
              </Boot.Row> :
              <Boot.Row>
                <Boot.Col md={8}>
                  <h4>No rule configured</h4>
                </Boot.Col>
                <Boot.Col md={4}/>
              </Boot.Row>
          }
          {
            rules.map(function (source, index) {
              var sourceInfo = source.split(':'),
                address =  sourceInfo.length > 1 ? sourceInfo[1] : sourceInfo[0],
                protocol = sourceInfo[2],
                port = sourceInfo[3];
              return (
                  <Boot.Row key={index}>
                    <Boot.Col md={10}>
                      <Boot.Row>
                        <Boot.Col md={7}>
                          <h4>{address}</h4>
                        </Boot.Col>
                        <Boot.Col md={3}>
                          <h4>{isIngress ? null : protocol}</h4>
                        </Boot.Col>
                        <Boot.Col md={2}>
                          <h4>{isIngress ? null : port}</h4>
                        </Boot.Col>
                      </Boot.Row>
                    </Boot.Col>
                    <Boot.Col md={2}>
                      {
                        isEditing ?
                        <Boot.Button onClick={self.remove.bind(self, index)} bsStyle="danger">
                          <Boot.Glyphicon glyph="trash"/>
                        </Boot.Button>
                        : null
                      }
                    </Boot.Col>
                  </Boot.Row>
                )
            })
          }
          {
            isEditing ?
            <Boot.Row>
              <Boot.Col md={10}>
                <Boot.Row>
                  <Boot.Col md={3}>
                    <Boot.Input type="select" onChange={this.updateText.bind(this, 'type')} value={this.state.type}>
                      {addressBooks.legnth ? <option value="Book">Block</option> : null}
                      <option value="CIDR">CIDR</option>
                    </Boot.Input>
                  </Boot.Col>
                  <Boot.Col md={4}>
                    {
                      isBook ?
                      <Boot.Input type="select" onChange={this.updateText.bind(this, 'address')} value={this.state.address}>
                        {
                          addressBooks.map(function (addressBook, index) {
                            return <option key={index} value={addressBook.name}>{addressBook.name}</option>
                          })
                        }
                      </Boot.Input> :
                      <Boot.Input type='text' onChange={this.updateText.bind(this, 'address')} value={this.state.address}/>
                    }
                  </Boot.Col>
                  <Boot.Col md={3}>
                    {isIngress ? null :
                      <Boot.Input type="select" onChange={this.updateText.bind(this, 'protocol')} value={this.state.protocol}>
                        <option value="tcp">tcp</option>
                        <option value="udp">udp</option>
                      </Boot.Input>}
                  </Boot.Col>
                  <Boot.Col md={2}>
                    {
                      isIngress ?
                        null :
                        <Boot.Input type='text' onChange={this.updateText.bind(this, 'port')} value={this.state.port}/>
                    }
                  </Boot.Col>
                </Boot.Row>
              </Boot.Col>
              <Boot.Col md={2}>
                <Boot.Button onClick={this.add} bsStyle="success">
                  <Boot.Glyphicon glyph="plus"/>
                </Boot.Button>
              </Boot.Col>
            </Boot.Row>
            : null
          }
        </Boot.Col>
      </Boot.Row>
    );
  }
});
