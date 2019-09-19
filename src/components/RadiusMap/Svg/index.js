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
    $dimensionKey: PropTypes.number,
    $geoService: PropTypes.object,
    $getDimensions: PropTypes.func,
    $hover: PropTypes.bool,
    $onMouseAllow: PropTypes.func,
    $prerender: PropTypes.bool,
    bounds: PropTypes.array,
    coordinates: PropTypes.array,
    options: PropTypes.object,
    zoom: PropTypes.number
  }

  static defaultProps = {
    height: 0,
    width: 0,
    zoom: 0,
    options: {
      strokeWidth: 1,
      stroke: '#28c679',
      strokeOpacity: '0.8',
      fill: '#2aff00',
      fillOpacity: '0.3',
      onMouseEnter: e => {},
      onMouseLeave: e => {},
      onClick: () => {}
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
    let { height, width, zoom } = props
    const {
      $dimensionKey,
      $geoService,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      bounds,
      coordinates,
      options
    } = props

    if ($geoService) {
      height = $geoService.getHeight()
      width = $geoService.getWidth()
      zoom = $geoService.getZoom()
    }

    this.setState({ bounds, coords: coordinates, options, height, width, zoom })
  }

  drawChildenCoords = ({ bounds, coords, options, zoom }) => {
    const ptCorner = toPoints(bounds[0], bounds[1], zoom)

    if (coords[0].hasOwnProperty('lat') && coords[0].hasOwnProperty('lng')) {
      return (
        <Polyline
          key={coords[0].lat + coords[0].lng}
          bounds={bounds}
          coords={coords}
          ptCorner={ptCorner}
          zoom={zoom}
          options={options}
        />
      )
    }

    var children = []
    for (let i = 0; i < coords.length; i++) {
      if (Array.isArray(coords[i])) {
        if (Array.isArray(coords[i][0])) {
          children.push(
            <Group
              key={i}
              bounds={bounds}
              coords={coords[i]}
              ptCorner={ptCorner}
              zoom={zoom}
              options={options}
            />
          )
        } else {
          children.push(this.drawChildenCoords({ bounds, coords: coords[i], options, zoom }))
        }
      }
    }
    return children
  }

  render() {
    const { bounds, coords, options, height, width, zoom } = this.state

    if (coords.length === 0) {
      return null
    }

    return (
      <svg height={height} width={width}>
        {this.drawChildenCoords({ bounds, coords, options, zoom })}
      </svg>
    )
  }
}
export default Svg
