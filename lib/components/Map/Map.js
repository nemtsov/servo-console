var React = require('react'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  render: function () {
    var org = this.props.org;
    return (
      <div>
        <svg className="RegionMap"  viewBox="0 0 1100 668" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(60.000000, 55.000000)" stroke="#FFFFFF" fill="#D8D8D8">
              <rect x="540" y="420" width="80" height="60"></rect>
              <rect x="100" y="40" width="140" height="180"></rect>
              <rect x="240" y="11" width="100" height="169"></rect>
              <rect x="100" y="220" width="80" height="40"></rect>
              <rect x="160" y="260" width="40" height="40"></rect>
              <rect x="200" y="280" width="160" height="140"></rect>
              <rect x="240" y="420" width="60" height="140"></rect>
              <rect x="0" y="40" width="100" height="60"></rect>
              <rect x="80" y="140" width="20" height="80"></rect>
              <rect x="360" y="0" width="100" height="80"></rect>
              <rect x="300" y="420" width="40" height="60"></rect>
              <rect x="520" y="240" width="140" height="180"></rect>
              <rect x="420" y="240" width="100" height="40"></rect>
              <rect x="440" y="280" width="80" height="40"></rect>
              <rect x="660" y="240" width="40" height="40"></rect>
              <rect x="460" y="100" width="40" height="20"></rect>
              <rect x="480" y="120" width="80" height="120"></rect>
              <rect x="560" y="60" width="440" height="180"></rect>
              <rect x="520" y="60" width="40" height="60"></rect>
              <rect x="660" y="40" width="240" height="20"></rect>
              <rect x="740" y="240" width="100" height="60"></rect>
              <rect x="880" y="380" width="140" height="120"></rect>
              <rect x="840" y="240" width="80" height="140"></rect>
              <rect x="920" y="340" width="100" height="40"></rect>
              <rect x="1020" y="500" width="40" height="20"></rect>
              <rect x="440" y="160" width="40" height="80"></rect>
            </g>
            <g className="regions" transform="translate(0.000000, 162.000000)">
              <g onClick={this.handleClick.bind(this, 'sydney')}
                 transform="translate(929.000000, 317.000000)" className={this.activeRegion('sydney')}>
                <rect fill="#1777E6" x="7" y="0" width="161" height="54" rx="25"></rect>
                <rect className="fill" x="0" y="0" width="161" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="20" y="40">Sydney</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'tokyo')}
                 transform="translate(932.000000, 32.000000)" className={this.activeRegion('tokyo')}>
                <rect fill="#1777E6" x="7" y="0" width="137" height="54" rx="25"></rect>
                <rect className="fill" x="0" y="0" width="137" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="20" y="40">Tokyo</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'singapore')}
                 transform="translate(746.000000, 177.000000)" className={this.activeRegion('singapore')}>
                <rect fill="#1777E6" x="7" y="0" width="205" height="54" rx="25"></rect>
                <rect className="fill" x="0" y="0" width="205" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="20" y="40">Singapore</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'ireland')}
                 transform="translate(540.000000, -30.000000)" className={this.activeRegion('ireland')}>
                <rect fill="#1777E6" x="0" y="0" width="149" height="54" rx="25"></rect>
                <rect className="fill" x="7" y="0" width="149" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="27" y="40">Ireland</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'brazil')}
                 transform="translate(373.000000, 273.000000)" className={this.activeRegion('brazil')}>
                <rect fill="#1777E6" x="0" y="0" width="130" height="54" rx="25"></rect>
                <rect className="fill" x="7" y="0" width="130" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="27" y="40">Brazil</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'california')}
                 transform="translate(6.000000, 77.000000)" className={this.activeRegion('california')}>
                <rect fill="#1777E6" x="7" y="0" width="193" height="54" rx="25"></rect>
                <rect className="fill" x="0" y="0" width="193" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="20" y="40">California</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'virginia')}
                 transform="translate(252.000000, 27.000000)" className={this.activeRegion('virginia')}>
                <rect fill="#1777E6" x="0" y="0" width="156" height="54" rx="25"></rect>
                <rect className="fill" x="7" y="0" width="156" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="27" y="40">Virginia</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'oregon')}
                 transform="translate(11.000000, 0.000000)" className={this.activeRegion('oregon')}>
                <rect fill="#1777E6" x="7" y="0" width="160" height="54" rx="25"></rect>
                <rect className="fill" x="0" y="0" width="160" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="20" y="40">Oregon</tspan>
                </text>
              </g>
              <g onClick={this.handleClick.bind(this, 'frankfurt')}
                 transform="translate(440.000000, 35.000000)" className={this.activeRegion('frankfurt')}>
                <rect fill="#1777E6" x="7" y="0" width="180" height="54" rx="25"></rect>
                <rect className="fill" x="0" y="0" width="180" height="54" rx="25"></rect>
                <text fontFamily="Helvetica Neue" fontSize="36" fontWeight="normal" fill="#FFFFFF">
                  <tspan x="20" y="40">Frankfurt</tspan>
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  },

  handleClick: function (region) {
    if (this.props.org.regions.indexOf(region) === -1) return;
    if (!localStorage.getItem('token')) this.transitionTo('login', null, {region: region});
    this.transitionTo('region', {org: this.props.org.handle, region: region});
  },

  activeRegion: function (region) {
    return (this.props.org.regions.indexOf(region) !== -1) ? 'active' : null;
  }
});