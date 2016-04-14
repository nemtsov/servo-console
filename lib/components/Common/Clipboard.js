/*
 Based on work by: https://github.com/nihey/react-clipboard/
*/

var React = require('react');
var Boot = require('react-bootstrap');
var Clipboard = require('clipboard');

var counter = 0;
module.exports= React.createClass({
  displayName: 'ClipboardButton',

  getInitialState: function() {
    return {
      id: '__react_clipboard_' + (counter++) + '__',
    };
  },
  // Returns props matching prefix.
  // Removes prefix from values if remove==true
  propsWith(regexp, remove) {
    var object = {};
    if (remove !== false && remove !== true) {
      remove = false;
    }
    Object.keys(this.props).forEach(function(key) {
      if (key.search(regexp) !== -1) {
        var objectKey = remove ? key.replace(regexp, '') : key;
        object[objectKey] = this.props[key];
      }
    }, this);

    return object;
  },

  componentDidMount: function() {
    this.clipboard = new Clipboard('#'+ this.state.id, this.props.options);

    var callbacks = this.propsWith(/^on/, true);
    Object.keys(callbacks).forEach(function(callback) {
      this.clipboard.on(callback.toLowerCase(), this.props['on' + callback]);
    }, this);
  },
  componentWillUnmount: function() {
    this.clipboard && this.clipboard.destroy();
  },
  getDefaultProps: function() {
    return {
      options: {},
    };
  },
  render: function() {
    return <Boot.Button id={this.state.id}
      className={this.props.className}
      style={this.props.style}
      bsStyle={this.props.bsStyle}
      data-clipboard-text={this.props['text']}
      data-clipboard-target={this.props['target']}>
      {this.props.children}
    </Boot.Button>;
  },
});
