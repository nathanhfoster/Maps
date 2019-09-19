import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import GoogleMap from 'google-map-react'
import Marker from './Marker'
import SuperCluster from 'points-cluster'
import MarkerCluster from './MarkerCluster'
import { K_CIRCLE_SIZE, K_STICK_SIZE } from './Marker/styles'
import { styles } from './styles'
import PolygonSystem from './PolygonSystem'
import { setMapZoom, setMapCenter, setMapBounds } from '../../../actions/MetaActions'
import { GOOGLE_MAP_CONTROL_POSITIONS } from './constants'
import Svg from './Svg'
import MapControl from './MapControl'
import toBounds from './functions/toBounds'

const SHOW_PARLAY_MIN_ZOOM = 19

const mapDispatchToProps = {
  setMapZoom,
  setMapCenter,
  setMapBounds
}

class RadiusMap extends PureComponent {
  constructor(props) {
    super(props)
    this.map = null

    this.state = {
      userLocation: {},
      showingInfoWindow: false,
      shouldRenderPolygons: true,
      activeMarker: {},
      selectedPlace: {},
      userLocation: {},
      mapInstance: null,
      mapApi: null,
      places: [],
      clusters: [],
      mapOptions: {
        center: [38.620744200000004, -121.25949069999999],
        zoom: 4
      }
    }
  }

  static propTypes = {
    toggleKey: PropTypes.string,
    initialCenter: PropTypes.object,
    controls: PropTypes.array,
    markers: PropTypes.array,
    polygons: PropTypes.array,
    controls: PropTypes.arrayOf(PropTypes.object.isRequired),
    onCenterChange: PropTypes.func,
    onZoomChange: PropTypes.func,
    onHoverKeyChange: PropTypes.func,
    userLocation: PropTypes.object,

    setMapZoom: PropTypes.func.isRequired,
    setMapCenter: PropTypes.func.isRequired,
    setMapBounds: PropTypes.func.isRequired,

    apiKey: PropTypes.string,
    bootstrapURLKeys: PropTypes.any,
    height: PropTypes.any.isRequired,
    width: PropTypes.any.isRequired,
    defaultCenter: PropTypes.arrayOf(PropTypes.number.isRequired),
    center: PropTypes.arrayOf(PropTypes.number.isRequired),
    defaultZoom: PropTypes.number,
    zoom: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onChildClick: PropTypes.func,
    onChildMouseDown: PropTypes.func,
    onChildMouseUp: PropTypes.func,
    onChildMouseMove: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    onZoomAnimationStart: PropTypes.func,
    onZoomAnimationEnd: PropTypes.func,
    onDrag: PropTypes.func,
    onMapTypeIdChange: PropTypes.func,
    onTilesLoaded: PropTypes.func,
    onGoogleApiLoaded: PropTypes.func,
    yesIWantToUseGoogleMapApiInternals: PropTypes.bool,
    options: PropTypes.objectOf(PropTypes.any),
    distanceToMouse: PropTypes.func,
    hoverDistance: PropTypes.number,
    debounced: PropTypes.bool,
    margin: PropTypes.array,
    googleMapLoader: PropTypes.any,
    draggable: PropTypes.bool,
    style: PropTypes.any,
    resetBoundsOnResize: PropTypes.bool,
    layerTypes: PropTypes.arrayOf(PropTypes.string.isRequired) // ['TransitLayer', 'TrafficLayer']
  }

  static defaultProps = {
    toggleKey: '', // Refreshes map instance if this changes
    height: 500,
    width: '100%',
    center: [38.620744200000004, -121.25949069999999],
    defaultCenter: [38.620744200000004, -121.25949069999999],
    bounds: [
      46.55127582874266,
      -129.69113235508883,
      14.509102613864272,
      -92.95285110508881,
      14.509102613864272,
      -129.69113235508883,
      46.55127582874266,
      -92.95285110508881
    ],
    zoom: 4,
    controls: [],
    markers: [],
    polygons: [],
    useGoogleMapApi: false,
    shouldFitCoordsToBounds: true,
    shouldShowParlay: false,
    options: {
      gestureHandling: 'greedy',
      disableDefaultUI: false,
      scrollwheel: true,
      zoomControl: true,
      zoomControlOptions: {
        position: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM
      },
      minZoom: 0,
      maxZoom: 22,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: true
    }
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      height,
      width,
      defaultCenter,
      markers,
      polygons,
      controls,
      center,
      zoom,
      bounds,
      toggleKey,
      useGoogleMapApi,
      shouldFitCoordsToBounds,
      shouldShowParlay
    } = props

    const markersInBounds = markers.filter(e => this.isCoordsInBounds(e.location))
    const polygonsInBounds = polygons.filter(
      p => p.filter(c => c.filter(e => this.isCoordsInBounds(e)).length > 0).length > 0
    )

    const clusters = this.createClusters(center, zoom, bounds, markersInBounds)

    let { options } = props
    if (shouldShowParlay) options = { ...options, minZoom: SHOW_PARLAY_MIN_ZOOM }

    this.setState({
      height,
      width,
      defaultCenter,
      clusters,
      markers: markersInBounds,
      polygons: polygonsInBounds,
      controls,
      center,
      zoom,
      bounds,
      toggleKey,
      useGoogleMapApi,
      shouldFitCoordsToBounds,
      shouldShowParlay,
      options
    })
  }

  componentWillUnmount() {}

  getClusters = (center, zoom, bounds, markers) => {
    const { minZoom, maxZoom } = this.props
    const clusters = SuperCluster(markers, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60
    })
    return clusters({ center, zoom, bounds })
  }

  createClusters = (center, zoom, bounds, markers) => {
    let clusters = []
    if (markers.length === 0) return clusters
    else
      return this.getClusters(center, zoom, bounds, markers).map(
        ({ wx, wy, numPoints, points }) => ({
          lat: wy,
          lng: wx,
          numPoints,
          id: `${numPoints}_${points[0].id}`,
          points
        })
      )
  }

  isCoordsInBounds = coords => {
    const { mapInstance } = this.state

    if (!mapInstance) return true
    else if (Array.isArray(coords)) {
      const [lat, lng] = coords
      return mapInstance.getBounds().contains({ lat, lng })
    } else if (coords.hasOwnProperty('lat') && coords.hasOwnProperty('lng')) {
      return mapInstance.getBounds().contains(coords)
    } else return false
  }

  handleChange = ({ bounds, center, marginBounds, size, zoom }) => {
    // console.log('handleChange: ', zoom)
    const { lat, lng } = center
    const Center = [lat, lng]
    const Bounds = Object.keys(bounds)
      .map(key => {
        const { lat, lng } = bounds[key]
        return [lat, lng]
      })
      .flat(1)

    const { setMapBounds } = this.props
    setMapBounds(bounds)
    this.panTo(Center, zoom)
  }

  onClick = ({ event, lat, lng, x, y }) => {
    // console.log('onClick: ', event)
    // if (this.state.showingInfoWindow) {
    //   this.setState({
    //     showingInfoWindow: false,
    //     activeMarker: null
    //   })
    // }
  }

  onChildClick = e => console.log('onChildClick: ', e)
  onChildMouseDown = e => console.log('onChildMouseDown: ', e)
  onChildMouseUp = e => console.log('onChildMouseUp: ', e)
  onChildMouseMove = e => console.log('onChildMouseMove: ', e)
  onChildMouseEnter = key => {
    // console.log('onChildMouseEnter: ', key)
  }
  onChildMouseLeave = key => {
    // console.log('onChildMouseLeave: ', key)
  }
  onZoomAnimationStart = () => {
    // console.log('onZoomAnimationStart')
    this.setState({ shouldRenderPolygons: false })
  }
  onZoomAnimationEnd = () => {
    // console.log('onZoomAnimationEnd')
    this.setState({ shouldRenderPolygons: true })
  }
  onDrag = map => {
    // console.log('onDrag: ', map)
  }
  onMapTypeIdChange = e => console.log('onMapTypeIdChange: ', e)
  onTilesLoaded = () => {
    // console.log('onTilesLoaded')
  }

  onGoogleApiLoaded = (
    map,
    maps,
    useGoogleMapApi,
    shouldFitCoordsToBounds,
    shouldShowParlay,
    markers,
    polygons
  ) => {
    // console.log('onGoogleApiLoaded: ', shouldShowParlay)
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      shouldFitCoordsToBounds: false
    })

    if (useGoogleMapApi) {
      PolygonSystem(map, maps, polygons)
    }

    if (shouldFitCoordsToBounds) {
      const coords = polygons.length > 0 ? polygons : markers
      if (coords.length > 0) toBounds(map, maps, coords)
    }

    if (shouldShowParlay) {
      // REP.Layer.Google.Initialize(map, { Return_Buildings: true })
    }
  }

  distanceToMouse = (markerPos, mousePos) => {
    const x = markerPos.x
    const y = markerPos.y - K_STICK_SIZE - K_CIRCLE_SIZE / 2
    const distanceKoef = 2

    return (
      distanceKoef *
      Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y))
    )
  }

  panTo = (center, zoom) => {
    const { setMapZoom, setMapCenter } = this.props
    setMapCenter(center)
    setMapZoom(zoom)
  }

  shouldMapLoad = () => {
    const { defaultCenter } = this.props
    const [latitude, longitude] = defaultCenter
    if (latitude != null && longitude != null) {
      return true
    } else {
      console.log('shouldMapLoad failed: ', defaultCenter)
      return false
    }
  }

  renderClusters = clusters =>
    clusters.map(item => {
      const { id, lat, lng, numPoints, points, ...props } = item
      if (numPoints === 1) {
        const { lat, lng, ...props } = points[0]
        return (
          <Marker
            key={id}
            lat={lat}
            lng={lng}
            {...props}
            zIndex={1}
            $hover={this.props.hoverKey === id}
          />
        )
      }

      return (
        <MarkerCluster
          key={id}
          lat={lat}
          lng={lng}
          points={points}
          {...props}
          // $hover={this.props.hoverKey === id}
        />
      )
    })

  renderMarkers = markers =>
    markers.map(item => {
      const { id, ...props } = item
      return <Marker key={id} {...props} zIndex={1} $hover={this.props.hoverKey === id} />
    })

  renderPolygons = coordinates => {
    const { shouldRenderPolygons, zoom, bounds, mapInstance } = this.state

    if (!shouldRenderPolygons || !mapInstance || bounds.length === 0 || coordinates.length === 0)
      return null
    else
      return (
        <Svg
          lat={bounds[0]}
          lng={bounds[1]}
          coordinates={coordinates}
          bounds={bounds}
          zoom={zoom}
        />
      )
  }

  renderControls = controls => {
    const { mapInstance, mapApi } = this.state
    if (!mapInstance) return null
    //console.log(mapApi.ControlPosition[)
    return (
      <Fragment>
        {controls.map((e, i) => {
          const { controlPosition, items } = e
          return (
            <MapControl key={i} map={mapInstance} mapApi={mapApi} controlPosition={controlPosition}>
              {items.map((control, j) => {
                const { Component, ...props } = control
                return <Component key={j} {...this.props} {...props} />
              })}
            </MapControl>
          )
        })}
      </Fragment>
    )
  }

  render() {
    const {
      height,
      width,
      defaultCenter,
      clusters,
      markers,
      polygons,
      controls,
      center,
      zoom,
      bounds,
      toggleKey,
      places,
      mapInstance,
      mapApi,
      useGoogleMapApi,
      shouldFitCoordsToBounds,
      shouldShowParlay,
      options
    } = this.state

    return (
      this.shouldMapLoad() && (
        <div
          style={{
            ...styles().GoogleMapWrapper,
            height,
            width
          }}
        >
          <GoogleMap
            key={toggleKey}
            //ref={map => (this.map = map)}
            // apiKey={GOOGLE_KEY}
            bootstrapURLKeys={{ key: GOOGLE_KEY }}
            defaultCenter={defaultCenter}
            initialCenter={center}
            center={center}
            zoom={zoom}
            onChange={this.handleChange}
            onClick={this.onClick}
            onChildClick={this.onChildClick}
            onChildMouseDown={this.onChildMouseDown}
            onChildMouseUp={this.onChildMouseUp}
            onChildMouseMove={this.onChildMouseMove}
            onChildMouseEnter={this.onChildMouseEnter}
            onChildMouseLeave={this.onChildMouseLeave}
            onZoomAnimationStart={this.onZoomAnimationStart}
            onZoomAnimationEnd={this.onZoomAnimationEnd}
            onDrag={this.onDrag}
            onMapTypeIdChange={this.onMapTypeIdChange}
            onTilesLoaded={this.onTilesLoaded}
            onGoogleApiLoaded={({ map, maps }) =>
              this.onGoogleApiLoaded(
                map,
                maps,
                useGoogleMapApi,
                shouldFitCoordsToBounds,
                shouldShowParlay,
                markers,
                polygons
              )
            }
            yesIWantToUseGoogleMapApiInternals={useGoogleMapApi}
            options={options}
            hoverDistance={K_CIRCLE_SIZE / 2}
            distanceToMouse={this.distanceToMouse}
            panTo={this.panTo}
          >
            {this.renderPolygons(polygons)}
            {this.renderClusters(clusters)}
            {/* {this.renderMarkers(markers)} */}
            {this.renderControls(controls)}
          </GoogleMap>
        </div>
      )
    )
  }
}
export default reduxConnect(null, mapDispatchToProps)(RadiusMap)
