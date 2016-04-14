var React = require('react');


module.exports = React.createClass({

  render:function(){
    return(
      <div>
        <label className={this.props.edited ? "edited" : ""}>{this.props.labelTag} {this.props.unit}</label>
        <input className="slider" type="range" min={this.props.min} defaultValue={this.props.defaultValue} max={this.props.max} onChange={this.props.sliderUpdate}/>
      </div>
    )
  }
});