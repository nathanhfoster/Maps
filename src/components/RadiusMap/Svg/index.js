import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Group from './Group'
import Polyline from './Polyline'
import toPoints from '../functions/toPoints'

class Svg extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    $dimensionKey: PropTypes.string,
    $geoService: PropTypes.object,
    $getDimensions: PropTypes.func,
    $hover: PropTypes.bool,
    $onMouseAllow: PropTypes.func,
    $prerender: PropTypes.bool,
    bounds: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
    coords: PropTypes.array,
    options: PropTypes.objectOf(PropTypes.any),
    zoom: PropTypes.number,
    zIndex: PropTypes.number,

    clientId: PropTypes.string,
    clientName: PropTypes.string,
    engagingContacts: PropTypes.array,

    lastActivity: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    name: PropTypes.string,
    siteDescription: PropTypes.string,
    state: PropTypes.string,
    height: PropTypes.any,
    width: PropTypes.any,
    zipcode: PropTypes.string,
    _score: PropTypes.number,

    _attached: PropTypes.bool,
    _id: PropTypes.number,
    _selected: PropTypes.bool
  }

  static defaultProps = {
    _attached: false,
    _id: null,
    _selected: false,
    height: 0,
    width: 0,
    zoom: 0,
    zIndex: 1,
    options: {
      strokeWidth: 1,
      stroke: '#c0392b',
      strokeOpacity: 0.8,
      fill: '#e74c3c',
      fillOpacity: 0.3
    }
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    let { height, width, zoom, bounds } = props
    const {
      $dimensionKey,
      $geoService,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      clientId,
      clientName,
      coords,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      name,
      siteDescription,
      state,
      zipcode,
      _score,
      _attached,
      _selected
    } = props

    const options = this.getOptions(props)

    bounds = Object.keys(bounds)
      .map(key => {
        const { lat, lng } = bounds[key]
        return [lat, lng]
      })
      .flat(1)

    if ($geoService) {
      height = $geoService.getHeight()
      width = $geoService.getWidth()
      zoom = $geoService.getZoom()
    }

    this.setState({
      $dimensionKey,
      bounds,
      coords,
      height,
      width,
      zoom,
      clientName,
      siteDescription,
      _score,
      lastActivity,
      options
    })
  }

  getOptions = ({
    $dimensionKey,
    $hover,
    options,
    _attached,
    _selected,
    hoveredChildKey,
    $onMouseAllow
  }) => {
    const newOptions = { ...options }

    if (_selected) {
      newOptions.stroke = '#fed330'
      newOptions.strokeWidth = 2
      newOptions.strokeOpacity = 1
      newOptions.fill = '#fdcb6e'
      newOptions.fillOpacity = 0.3
    }

    if (_attached) {
      newOptions.stroke = '#28c679'
      newOptions.strokeWidth = 1
      newOptions.strokeOpacity = 0.8
      newOptions.fill = '#2aff00'
      newOptions.fillOpacity = 0.3
    }

    if ($dimensionKey && $dimensionKey === hoveredChildKey) {
      newOptions.fillOpacity = 0.6
    }

    return {
      ...newOptions,
      onMouseEnter: () => this.toggleMouseMove(true),
      onMouseLeave: () => this.toggleMouseMove(false)
    }
  }

  drawChildenCoords = ({ bounds, coords, options, zoom }) => {
    const ptCorner = toPoints(bounds[0], bounds[1], zoom)
    //console.log(ptCorner)

    if (coords[0].hasOwnProperty('lat') && coords[0].hasOwnProperty('lng')) {
      return (
        <Polyline
          key={coords[0].lat + coords[0].lng}
          coords={coords}
          ptCorner={ptCorner}
          zoom={zoom}
          options={options}
        />
      )
    }

    let children = []
    for (let i = 0; i < coords.length; i++) {
      if (Array.isArray(coords[i])) {
        if (Array.isArray(coords[i][0])) {
          children.push(
            <Group key={i} coords={coords[i]} ptCorner={ptCorner} zoom={zoom} options={options} />
          )
        } else {
          children.push(this.drawChildenCoords({ bounds, coords: coords[i], options, zoom }))
        }
      }
    }
    return children
  }

  toggleMouseMove = toggle => {
    const { $onMouseAllow } = this.props
    if ($onMouseAllow) $onMouseAllow(toggle)
  }

  render() {
    const { zIndex, $onMouseAllow } = this.props
    const {
      $dimensionKey,
      $hover,
      bounds,
      coords,
      options,
      height,
      width,
      zoom,
      clientName,
      siteDescription,
      _score,
      lastActivity
    } = this.state

    if (coords.length === 0) {
      return null
    }

    return (
      <svg
        height={height}
        width={width}
        onMouseEnter={() => this.toggleMouseMove(false)}
        onMouseLeave={() => this.toggleMouseMove(true)}
      >
        {this.drawChildenCoords({ bounds, coords, options, zoom })}
      </svg>
    )
  }
}
export default Svg
