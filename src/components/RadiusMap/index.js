import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import GoogleMap from 'google-map-react'

import SuperCluster from 'points-cluster'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'

import Svg from './Svg'
import DrawingManager from './DrawingManager'
import MapControl from './MapControl'
import LocationList from '../../components/LocationList'
import toBounds from './functions/toBounds'
import {
  resetProject,
  resetProjects,
  setProjectsSearchProps,
  fetchProjectIfNeeded
} from '../../../actions/ProjectActions'
import {
  setMapCenterBoundsZoom,
  fetchParlaySite,
  setMapSites,
  selectSite
} from '../../../actions/MetaActions'
import {
  GOOGLE_MAP_CONTROL_POSITIONS,
  CENTER_OF_US,
  DEFAULT_ZOOM,
  DEFAULT_MARKER_MIN_ZOOM,
  DEFAULT_MARKER_MAX_ZOOM,
  DEFAULT_MARKER_CLUSTER_RADIUS,
  DEFAULT_POLYGON_MIN_ZOOM,
  DEFAULT_POLYGON_MAX_ZOOM,
  DEFAULT_PARLAY_MIN_ZOOM,
  DEFAULT_PARLAY_MAX_ZOOM
} from './constants'
import { K_CIRCLE_SIZE, K_STICK_SIZE } from './Marker/styles'
import styles from './styles'
import './styles.css'

const mapStateToProps = ({
  projects: {
    activeProject: { item },
    search
  },
  meta: {
    map: { zoom, center, bounds, sites, siteDescription }
  }
}) => ({ item, search, zoom, center, bounds, sites, siteDescription })

const mapDispatchToProps = {
  resetProject,
  resetProjects,
  setProjectsSearchProps,
  fetchProjectIfNeeded,

  setMapCenterBoundsZoom,
  fetchParlaySite,
  setMapSites,
  selectSite
}

class RadiusMap extends PureComponent {
  mapRef = null
  mousePosRef = { x: null, y: null, lat: null, lng: null } // Used so we don't have to update state and rerender
  constructor(props) {
    super(props)
    let { shouldShowParlay, showParlayMinZoom, showParlayMaxZoom, options } = props

    if (shouldShowParlay) {
      options = {
        ...options,
        zoom: showParlayMinZoom,
        minZoom: showParlayMinZoom,
        maxZoom: showParlayMaxZoom
      }
    }

    this.state = {
      showingInfoWindow: false,
      shouldRenderPolygons: true,
      activeMarker: {},
      selectedPlace: {},
      mapInstance: null,
      mapApi: null,
      markerClusters: [],
      options,
      mousePos: {}
    }
  }

  static propTypes = {
    // RadiusMap
    toggleKey: PropTypes.string,
    initialCenter: PropTypes.object,
    locations: PropTypes.arrayOf(PropTypes.any),
    sites: PropTypes.arrayOf(PropTypes.any).isRequired,
    locationsList: PropTypes.arrayOf(PropTypes.any),
    showMarkersMinZoom: PropTypes.number,
    showMarkersMaxZoom: PropTypes.number,
    markerClusterRadius: PropTypes.number,
    showPolygonsMinZoom: PropTypes.number,
    showPolygonsMaxZoom: PropTypes.number,
    controls: PropTypes.arrayOf(PropTypes.object.isRequired),
    onCenterChange: PropTypes.func,
    onZoomChange: PropTypes.func,
    onHoverKeyChange: PropTypes.func,
    toggleDrawingMode: PropTypes.func,
    drawingMode: PropTypes.bool,
    shouldShowParlay: PropTypes.bool,
    shouldFitCoordsToBounds: PropTypes.bool,
    bounds: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
    setHoveredChildKey: PropTypes.func.isRequired,
    hoveredChildKey: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,

    // Redux actions
    setMapCenterBoundsZoom: PropTypes.func.isRequired,
    fetchParlaySite: PropTypes.func,

    // GoogleMap from google-map-react
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
    handleZoomChange: PropTypes.func,
    onZoomAnimationStart: PropTypes.func,
    onZoomAnimationEnd: PropTypes.func,
    onDrag: PropTypes.func,
    onMapTypeIdChange: PropTypes.func,
    onTilesLoaded: PropTypes.func,
    onGoogleApiLoaded: PropTypes.func,
    yesIWantToUseGoogleMapApiInternals: PropTypes.bool,
    draggable: PropTypes.bool,
    options: PropTypes.objectOf(PropTypes.any),
    distanceToMouse: PropTypes.func,
    hoverDistance: PropTypes.number,
    debounced: PropTypes.bool,
    margin: PropTypes.array,
    googleMapLoader: PropTypes.any,
    style: PropTypes.any,
    resetBoundsOnResize: PropTypes.bool,
    layerTypes: PropTypes.arrayOf(PropTypes.string.isRequired) // ['TransitLayer', 'TrafficLayer']
  }

  static defaultProps = {
    toggleKey: '', // Refreshes map instance if this changes
    height: 500,
    width: '100%',
    center: CENTER_OF_US,
    defaultCenter: CENTER_OF_US,
    bounds: {
      nw: { lat: 46.55127582874266, lng: -129.69113235508883 },
      se: { lat: 14.509102613864272, lng: -92.95285110508881 },
      sw: { lat: 14.509102613864272, lng: -129.69113235508883 },
      ne: { lat: 46.55127582874266, lng: -92.95285110508881 }
    },
    zoom: DEFAULT_ZOOM,
    controls: [],
    locations: [],
    sites: [],
    locationsList: [],
    showMarkersMinZoom: DEFAULT_MARKER_MIN_ZOOM,
    showMarkersMaxZoom: DEFAULT_MARKER_MAX_ZOOM,
    markerClusterRadius: DEFAULT_MARKER_CLUSTER_RADIUS,
    showPolygonsMinZoom: DEFAULT_POLYGON_MIN_ZOOM,
    showPolygonsMaxZoom: DEFAULT_POLYGON_MAX_ZOOM,
    showParlayMinZoom: DEFAULT_PARLAY_MIN_ZOOM,
    showParlayMaxZoom: DEFAULT_PARLAY_MAX_ZOOM,
    useGoogleMapApi: true,
    drawingMode: false,
    shouldFitCoordsToBounds: true,
    shouldShowParlay: false,
    draggable: true,
    options: {
      gestureHandling: 'greedy',
      minZoom: 0,
      maxZoom: 22,
      disableDefaultUI: false,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
      scrollwheel: true,
      zoomControl: true,
      zoomControlOptions: {
        position: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM
      }
    }
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  componentDidUpdate(prevProps, prevState) {}

  getState = props => {
    const { mapRef } = this
    const {
      height,
      width,
      defaultCenter,
      controls,
      center,
      zoom,
      bounds,
      sites,
      toggleKey,
      useGoogleMapApi,
      drawingMode,
      shouldFitCoordsToBounds,
      shouldShowParlay,
      draggable,
      locations,
      locationsList,
      showMarkersMinZoom,
      showMarkersMaxZoom,
      showPolygonsMinZoom,
      showPolygonsMaxZoom,
      hoveredChildKey,
      item
    } = props

    let attachedSites = []
    let selectedSites = []
    const shouldRenderMarkerClusterPolygons = item.id && item.sites.length === 0

    for (let i = 0; i < sites.length; i++) {
      const site = sites[i]
      const { _attached, _selected } = site
      if (_attached && !_selected) attachedSites.push(site)
      else if (_selected) selectedSites.push(site)
    }

    const markers = this.filterLocationCoordsInBounds(locations)
    const markerClusters = this.createClusters(markers, { ...props })

    const sitePolygons = this.filterLocationCoordsInBounds(attachedSites.concat(selectedSites))
    let polygonClusters = this.createClusters(sitePolygons, { ...props })

    if (shouldRenderMarkerClusterPolygons) polygonClusters = polygonClusters.concat(markerClusters)

    const shouldRenderMarkers = this.zoomWithinRange(showMarkersMinZoom, showMarkersMaxZoom, zoom)
    const shouldRenderPolygons = this.zoomWithinRange(
      showPolygonsMinZoom,
      showPolygonsMaxZoom,
      zoom
    )

    this.setState({
      height,
      width,
      defaultCenter,
      attachedSites,
      selectedSites,
      markerClusters,
      polygonClusters,
      sites,
      controls,
      center,
      zoom,
      bounds,
      toggleKey,
      useGoogleMapApi,
      drawingMode,
      shouldFitCoordsToBounds,
      shouldShowParlay,
      draggable,
      locationsList,
      shouldRenderMarkers,
      shouldRenderPolygons,
      hoveredChildKey
    })
  }

  componentWillUnmount() {}

  zoomWithinRange = (min, max, zoom) => zoom >= min && zoom <= max

  filterLocationCoordsInBounds = locations => {
    let markers = []
    markers = locations.reduce((result, item) => {
      const { location, boundaries, boundary, center, ...props } = item
      const isProjectListItem = boundaries && boundaries.coordinates
      const isActiveProjectItem = boundary && boundary.length > 0
      if (isProjectListItem) {
        const { coordinates } = boundaries
        const [lat, lng] = location
        return result.concat({
          ...props,
          lat,
          lng,
          boundaries: coordinates.map(b =>
            b.map(c => {
              const [lat, lng] = c
              return { lat, lng }
            })
          )
        })
      } else if (isActiveProjectItem) {
        const [lat, lng] = this.props.center
        return result.concat({
          ...props,
          lat,
          lng,
          boundary: boundary.map(b => {
            const [lat, lng] = b
            return { lat, lng }
          })
        })
      }
      return result
    }, [])
    return markers
  }

  getMarkerClusters = ({
    markers,
    center,
    zoom,
    bounds,
    showMarkersMinZoom,
    showMarkersMaxZoom,
    markerClusterRadius
  }) => {
    const markerClusters = SuperCluster(markers, {
      minZoom: showMarkersMinZoom,
      maxZoom: showMarkersMaxZoom,
      radius: markerClusterRadius
    })

    return markerClusters({ center, zoom, bounds })
  }

  createClusters = (markers, { ...props }) => {
    let markerClusters = []
    if (markers.length === 0) return markerClusters
    else
      markerClusters = this.getMarkerClusters({ markers, ...props }).map(
        ({ wx, wy, numPoints, points }) => ({
          lat: wy,
          lng: wx,
          numPoints,
          id: points[0].id,
          points
        })
      )
    return markerClusters
  }

  handleChange = ({ bounds, center, marginBounds, size, zoom }) => {
    // console.log('handleChange bounds: ', bounds)
    const centerToArray = Object.values(center)
    this.panTo(centerToArray, zoom, bounds)
  }

  onClick = ({ event, lat, lng, x, y }) => {
    const { fetchParlaySite } = this.props
    const { shouldShowParlay, shouldRenderPolygons, drawingMode, sites } = this.state
    // console.log('onClick: ', event)
    const hasUserDefinedSite = sites.find(
      site => site.siteType === 'USER_DEFINED' && site._attached
    )
    if (shouldShowParlay && shouldRenderPolygons && !drawingMode && !hasUserDefinedSite)
      fetchParlaySite(lat, lng)
  }

  onChildClick = id => {
    const { fetchParlaySite } = this.props
    const { shouldShowParlay, shouldRenderPolygons, drawingMode, sites } = this.state
    const { x, y, lat, lng } = this.mousePosRef
    // console.log('onChildClick: ', id, markerClusters)
    const hasUserDefinedSite = sites.find(
      site => site.siteType === 'USER_DEFINED' && site._attached
    )
    if (shouldShowParlay && shouldRenderPolygons && !drawingMode && !hasUserDefinedSite)
      fetchParlaySite(lat, lng)
  }
  onChildMouseDown = e => {
    // console.log('onChildMouseDown: ', e)
  }
  onChildMouseUp = e => {
    // console.log('onChildMouseUp: ', e)
  }
  onChildMouseMove = e => {
    // console.log('onChildMouseMove: ', e)
  }
  onChildMouseEnter = key => {
    // console.log('onChildMouseEnter: ', key)
    const { setHoveredChildKey } = this.props
    setHoveredChildKey(key)
  }
  onChildMouseLeave = key => {
    // console.log('onChildMouseLeave: ', key)
    const { setHoveredChildKey } = this.props
    setHoveredChildKey('')
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
  onMapTypeIdChange = e => {
    // console.log('onMapTypeIdChange: ', e)
  }
  onTilesLoaded = () => {
    // console.log('onTilesLoaded')
  }

  distanceToMouse = (pointPos, mousePos) => {
    const { shouldRenderMarkers, shouldRenderPolygons } = this.state
    let markerX = 0
    let markerY = 0
    let mouseX = 0
    let mouseY = 0

    if (shouldRenderPolygons) {
      const { lat, lng } = pointPos
      markerX = lat
      markerY = lng
      mouseX = mousePos.lat
      mouseY = mousePos.lng
      // console.log('pointPos: ', pointPos)
      // console.log('mousePos: ', mousePos)
    } else if (shouldRenderMarkers) {
      const { x, y } = pointPos
      markerX = x
      markerY = y - K_STICK_SIZE - K_CIRCLE_SIZE / 2
      mouseX = mousePos.x
      mouseY = mousePos.y
    }

    const distanceKoef = 2

    const distanceToMouse =
      distanceKoef *
      Math.sqrt((markerX - mouseX) * (markerX - mouseX) + (markerY - mouseY) * (markerY - mouseY))

    //console.log('distanceToMouse: ', distanceToMouse)
    this.mousePosRef = mousePos

    return distanceToMouse
  }

  panTo = (center, zoom, bounds) => {
    const { setMapCenterBoundsZoom } = this.props
    setMapCenterBoundsZoom({ center, zoom, bounds })
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    const { shouldFitCoordsToBounds, shouldShowParlay, polygonClusters } = this.state

    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      shouldFitCoordsToBounds: false
    })

    if (shouldFitCoordsToBounds && polygonClusters.length > 0 && polygonClusters.points) {
      const { points } = polygonClusters
      const coords = points.map(p => {
        const { boundary, boundaries } = p
        return boundary || boundaries
      })
      toBounds(map, maps, coords)
    }

    if (shouldShowParlay) {
      REP.Layer.Google.Initialize(map, { Return_Buildings: true })
    }
  }

  renderMarkerClusters = markerClusters => {
    const { selectSite, setMapCenterBoundsZoom } = this.props
    const { shouldRenderMarkers, hoveredChildKey, zoom } = this.state
    if (!shouldRenderMarkers) return null
    else
      return markerClusters.map(item => {
        const { id, numPoints, points, ...props } = item
        if (numPoints === 1) {
          const { id, ...props } = points[0]
          return (
            <Marker
              {...props}
              key={id}
              hoveredChildKey={hoveredChildKey}
              selectSite={selectSite}
              setMapCenterBoundsZoom={setMapCenterBoundsZoom}
              zoom={zoom}
            />
          )
        } else
          return (
            <MarkerCluster
              {...props}
              key={id}
              points={points}
              hoveredChildKey={hoveredChildKey}
              selectSite={selectSite}
              setMapCenterBoundsZoom={setMapCenterBoundsZoom}
              zoom={zoom}
            />
          )
      })
  }

  renderPolygons = polygonClusters => {
    const { shouldRenderPolygons, drawingMode, bounds, mapInstance, hoveredChildKey } = this.state
    if (!shouldRenderPolygons || drawingMode || !mapInstance) return null
    else
      return polygonClusters.map((cluster, i) => {
        const { id, lat, lng, numPoints, points } = cluster

        return points.map(point => {
          const { id, _id, boundary, lat, lng, boundaries, ...props } = point
          const key = `${_id || id}`
          return (
            <Svg
              {...props}
              key={key}
              lat={bounds.ne.lat}
              lng={bounds.nw.lng}
              center={[lat, lng]}
              bounds={bounds}
              coords={boundary || boundaries}
              hoveredChildKey={hoveredChildKey}
            />
          )
        })
      })
  }

  renderDrawingManager = (height, width) => {
    const { toggleDrawingMode } = this.props
    const { mapApi, shouldRenderPolygons, drawingMode, bounds } = this.state
    const { mousePosRef } = this
    return (
      mapApi &&
      drawingMode && (
        <DrawingManager
          key="drawingManager"
          lat={bounds.ne.lat}
          lng={bounds.nw.lng}
          bounds={bounds}
          mousePos={mousePosRef}
          toggleDrawingMode={toggleDrawingMode}
          shouldRenderPolygons={shouldRenderPolygons}
          height={height}
          width={width}
        />
      )
    )
  }

  renderControls = controls => {
    const { mapInstance, mapApi } = this.state
    if (!mapInstance) return null
    return controls.map((control, i) => {
      const { controlPosition, items } = control
      return (
        <MapControl
          key={i}
          map={mapInstance}
          mapApi={mapApi}
          controlPosition={controlPosition}
          {...this.props}
        >
          {items.map((control, j) => {
            const { Component, ...props } = control
            return <Component {...props} key={j} />
          })}
        </MapControl>
      )
    })
  }

  render() {
    const { setMapCenterBoundsZoom, fetchParlaySite, showPolygonsMinZoom } = this.props
    const {
      height,
      width,
      defaultCenter,
      attachedSites,
      selectedSites,
      markerClusters,
      polygonClusters,
      sites,
      locationsList,
      center,
      zoom,
      toggleKey,
      useGoogleMapApi,
      options,
      draggable,
      hoveredChildKey,
      controls,
      drawingMode,
      mapInstance,
      mapApi
    } = this.state

    const shouldRenderList = locationsList.length > 0

    // console.log(this.props)

    return (
      <div
        style={{
          height,
          width,
          display: 'flex'
        }}
      >
        {shouldRenderList && (
          <div style={styles().LocationListWrapper}>
            <LocationList
              defaultCenter={defaultCenter}
              clientsListItems={locationsList}
              projectListItems={markerClusters}
              attachedSites={attachedSites}
              selectedSites={selectedSites}
              hoveredChildKey={hoveredChildKey}
              onChildMouseEnter={this.onChildMouseEnter}
              onChildMouseLeave={this.onChildMouseLeave}
              showPolygonsMinZoom={showPolygonsMinZoom}
            />
          </div>
        )}
        <div
          style={styles(shouldRenderList).GoogleMapWrapper}
          className={drawingMode ? 'CursorStyle' : ''}
        >
          <GoogleMap
            ref={ref => (this.mapRef = ref)}
            key={toggleKey}
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
            onGoogleApiLoaded={this.onGoogleApiLoaded}
            yesIWantToUseGoogleMapApiInternals={useGoogleMapApi}
            options={options}
            hoverDistance={K_CIRCLE_SIZE / 2}
            distanceToMouse={this.distanceToMouse}
            draggable={draggable}
          >
            {this.renderDrawingManager(height, width)}
            {this.renderPolygons(polygonClusters)}
            {this.renderMarkerClusters(markerClusters)}
            {this.renderControls(controls)}
          </GoogleMap>
        </div>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(RadiusMap)
