import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import Svg from '../Svg'
import GooglePolygon from '../PolygonSystem/GooglePolygon'
import cloneDeep from 'lodash/cloneDeep'
import { formatBoundaries } from '../../../services/map'
import { fetchDrawnSite } from '../../../../actions/MetaActions'

const mapDispatchToProps = { fetchDrawnSite }

class DrawingManager extends PureComponent {
  constructor(props) {
    super(props)

    const {
      mousePos: { lat, lng }
    } = props

    this.state = {
      drawingPolyline: false,
      drawingPolylineIndex: 0,
      shouldCompletePolygon: false,
      polygon: {
        lat,
        lng,
        boundary: [{ lat, lng }]
      }
    }
  }

  static propTypes = {
    $dimensionKey: PropTypes.string,
    $geoService: PropTypes.object,
    $getDimensions: PropTypes.func,
    $hover: PropTypes.bool,
    $onMouseAllow: PropTypes.func,
    $prerender: PropTypes.bool,
    bounds: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
    lat: PropTypes.any.isRequired,
    lng: PropTypes.any.isRequired,
    mousePos: PropTypes.any.isRequired,
    options: PropTypes.any,
    height: PropTypes.any.isRequired,
    width: PropTypes.any.isRequired,
    toggleDrawingMode: PropTypes.func.isRequired,
    shouldRenderPolygons: PropTypes.bool.isRequired,
    fetchDrawnSite: PropTypes.func.isRequired
  }

  static defaultProps = {
    height: 0,
    width: 0,
    zoom: 0,
    mousePos: {},
    options: {
      strokeWidth: 1,
      stroke: '#d35400',
      strokeOpacity: 1,
      fill: '#f1c40f',
      fillOpacity: 0.25
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
    const { $dimensionKey, $geoService, bounds, mousePos, options, shouldRenderPolygons } = props

    if ($geoService) {
      height = $geoService.getHeight()
      width = $geoService.getWidth()
      zoom = $geoService.getZoom()
    }

    this.setState({
      bounds,
      mousePos,
      height,
      width,
      zoom,
      options,
      shouldRenderPolygons
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handlePolygonStart = (polygon, drawingPolylineIndex) => {
    this.setState({
      drawingPolyline: true,
      polygon,
      drawingPolylineIndex: drawingPolylineIndex + 1
    })
  }

  handlePolygonComplete = polygon => {
    const { toggleDrawingMode, fetchDrawnSite } = this.props
    const {
      mousePos: { lat, lng }
    } = this.state
    const Polygon = GooglePolygon({ paths: polygon.boundary })
    const paths = Polygon.getPath()
    const acres = new google.maps.geometry.spherical.computeArea(paths) * 0.000247105
    const boundaries = formatBoundaries(paths.getArray())
    const newSite = {
      siteType: 'USER_DEFINED',
      acreage: acres,
      boundary: boundaries
    }
    fetchDrawnSite(newSite)
    toggleDrawingMode()
    this.setState({
      polygon: {
        lat,
        lng,
        boundary: [{ lat, lng }]
      },
      shouldCompletePolygon: false,
      drawingPolyline: false,
      drawingPolylineIndex: 0
    })
  }

  shouldCompletePolygon = (point, centerOfCircle) => {
    const radius = Math.pow(0.00005, 2)
    const distance =
      Math.pow(point.lat - centerOfCircle.lat, 2) + Math.pow(point.lng - centerOfCircle.lng, 2)

    if (distance < radius) {
      return true
    }
    return false
  }

  handleClick = (polygon, drawingPolyline, { lat, lng }) => {
    const { shouldCompletePolygon, drawingPolylineIndex } = this.state
    let newPolygon = cloneDeep(polygon)

    if (!drawingPolyline) {
      newPolygon = {
        lat,
        lng,
        boundary: [{ lat, lng }]
      }
      this.handlePolygonStart(newPolygon, drawingPolylineIndex)
    } else if (shouldCompletePolygon) {
      const firstPolyline = newPolygon.boundary[0]
      const lastPolylineIndex = newPolygon.boundary.length - 1
      newPolygon.boundary[lastPolylineIndex] = firstPolyline
      this.handlePolygonComplete(newPolygon)
    } else {
      this.setState({ drawingPolylineIndex: drawingPolylineIndex + 1 })
    }
  }

  handleMouseMove = (polygon, drawingPolyline, mousePos, options) => {
    if (!drawingPolyline) return
    // console.log(mousePos)
    const { drawingPolylineIndex } = this.state
    let newPolygon = cloneDeep(polygon)
    newPolygon.boundary[drawingPolylineIndex] = { lat: mousePos.lat, lng: mousePos.lng }

    const fillOpacity = this.shouldCompletePolygon(mousePos, newPolygon) ? 1 : 0.25
    const newOptions = { ...options, fillOpacity }

    this.setState({
      polygon: newPolygon,
      options: newOptions,
      shouldCompletePolygon: fillOpacity === 1
    })
  }

  renderPolygon = polygon => {
    const { bounds, options, shouldRenderPolygons, height, width, zoom } = this.state

    if (!shouldRenderPolygons) return null
    else {
      const { lat, lng, boundary } = polygon
      return (
        <Svg
          key="userDefinedPolygon"
          lat={bounds.ne.lat}
          lng={bounds.nw.lng}
          center={[lat, lng]}
          bounds={bounds}
          coords={boundary}
          options={options}
          height={height}
          width={width}
          zoom={zoom}
        />
      )
    }
  }

  toggleMouseMove = toggle => {
    const { $onMouseAllow } = this.props
    if ($onMouseAllow) $onMouseAllow(toggle)
  }

  render() {
    const { polygon, drawingPolyline, mousePos, options } = this.state

    return (
      <div
        onClick={() => this.handleClick(polygon, drawingPolyline, mousePos)}
        onMouseMove={() => this.handleMouseMove(polygon, drawingPolyline, mousePos, options)}
      >
        {this.renderPolygon(polygon)}
      </div>
    )
  }
}
export default reduxConnect(null, mapDispatchToProps)(DrawingManager)
