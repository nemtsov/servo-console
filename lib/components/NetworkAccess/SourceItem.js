var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  render: function () {
    var source = this.props.source,
      editing = this.props.editing;

    return <div className="SourceItem">
      {(editing) ? <Boot.Button className="removeSource" onClick={this.props.remove}>
        <Boot.Glyphicon glyph="trash"/>
      </Boot.Button> : <Boot.Glyphicon glyph="chevron-right"/>}
      <span className="source">{source}</span>
    </div>
  }

});