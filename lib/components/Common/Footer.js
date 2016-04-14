var React = require('react'),
  Boot = require('react-bootstrap'),
  combo = [];

module.exports = React.createClass({
  render: function () {
    return (
      <div className="Footer">
        <Boot.Grid>
          <Boot.Row>
            <div className="text-muted text-center">
              <a href="https://github.com/dowjones/servo-docs#servo-the-paas" target="_blank">
                Servo <Boot.Glyphicon glyph="heart"/> Developers
              </a>
            </div>
          </Boot.Row>
        </Boot.Grid>
      </div>
    );
  }
});

document.onkeypress = function(e) {
  var code = e.keyCode;
  if (code === 115) return combo = [1];
  else if (code === 101 && combo.length === 1) combo.push(2);
  else if (code === 114 && combo.length === 2) combo.push(3);
  else if (code === 118 && combo.length === 3) combo.push(4);
  else if (code === 111 && combo.length === 4) {
    var audio = new Audio('/audio/servo' + Math.floor(Math.random()*(5)+1) + '.mp3');
    audio.play();
    combo = [];
  }
  else combo = [];
};
