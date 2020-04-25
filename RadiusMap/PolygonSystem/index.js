import React, { useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import Group from './Group'
import Polyline from './Polyline'
import toPoints from '../functions/toPoints'

// Bright Green
export const DEFAULT_STROKE = '#32ff7e'
// Orange
export const SELECTED_COLOR = '#f39c12'
// Green
export const ATTACHED_COLOR = '#2ecc71'
// Red
export const NOT_ATTACHED_OR_SELECTED_COLOR = '#e74c3c'
export const NOT_ATTACHED_OR_SELECTED_STROKE_COLOR = '#c0392b'

const PolygonSystem = ({
  $dimensionKey,
  $hover,
  $onMouseAllow,
  $getDimensions,
  $prerender,
  $geoService,
  bounds,
  coords,
  options,
  zoom,
  heading,
  tilt,
  id,
  clientId,
  center,
  clientName,
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
  _selected,
  hoveredChildKey,
  setHoveredChildKey,
  getProjectFromId,
  setMapCenterBoundsZoom,
  risk,
  height,
  width,
  pointerEvents,
  onChildMouseEnter,
  onChildMouseLeave
}) => {
  if (coords.length === 0) return null
  // Disable hover events and only allow them on the polyline level

  useEffect(() => {
    if ($onMouseAllow) {
      if (id !== 'userDefinedPolygon') {
        $onMouseAllow(false)
      }
      return () => $onMouseAllow(true)
    }
  }, [])

  bounds = Object.keys(bounds)
    .map(key => {
      const { lat, lng } = bounds[key]
      return [lat, lng]
    })
    .flat(1)

  if ($geoService) {
    // bounds = $geoService.getBounds()
    height = $geoService.getHeight()
    width = $geoService.getWidth()
    zoom = $geoService.getZoom()
  }

  let newOptions = {
    stroke: DEFAULT_STROKE,
    strokeWidth: 1,
    strokeOpacity: 0.9,
    fillOpacity: 0.45
  }

  const detachedMetaMapSite = !(_attached || _selected)

  const exisitingProjectSite = _attached === false && _selected === false

  if (id === 'userDefinedPolygon') {
    newOptions = {
      ...options,
      onClick: () => getProjectFromId && getProjectFromId(clientId, $dimensionKey)
    }
  } else {
    if (_selected) {
      newOptions.fill = SELECTED_COLOR
    } else if (_attached) {
      newOptions.fill = ATTACHED_COLOR
    } else if (detachedMetaMapSite) {
      newOptions.stroke = NOT_ATTACHED_OR_SELECTED_STROKE_COLOR
      newOptions.strokeOpacity = 1
      newOptions.strokeWidth = 2
      newOptions.fillOpacity = 0.3
      newOptions.fill = NOT_ATTACHED_OR_SELECTED_COLOR
    } else if (exisitingProjectSite) {
      newOptions.stroke = NOT_ATTACHED_OR_SELECTED_STROKE_COLOR
      newOptions.strokeOpacity = 1
      newOptions.strokeWidth = 2
      newOptions.fillOpacity = 0.3
      newOptions.fill = NOT_ATTACHED_OR_SELECTED_COLOR
    }

    // Not using $hover so that the other smaller maps don't change opacity when sites are hovered.
    if ($dimensionKey === hoveredChildKey) {
      newOptions.fillOpacity = 0.9
    }

    if (zoom < 15) newOptions.fillOpacity = 1

    const onMouseEnter = () => onChildMouseEnter && onChildMouseEnter($dimensionKey)

    const onMouseLeave = () => onChildMouseLeave && onChildMouseLeave()

    const onClick = () => {
      setMapCenterBoundsZoom({ center })
      getProjectFromId && getProjectFromId(clientId, $dimensionKey)
    }

    newOptions = {
      ...newOptions,
      // Enable hover on polyline
      pointerEvents: 'auto',
      onMouseEnter,
      onMouseLeave,
      onClick
    }
  }

  const drawChildenCoords = coords => {
    const ptCorner = toPoints(bounds[0], bounds[1], zoom, heading, tilt)

    if (coords[0].hasOwnProperty('lat') && coords[0].hasOwnProperty('lng')) {
      return (
        <Polyline
          key={coords[0].lat + coords[0].lng}
          coords={coords}
          ptCorner={ptCorner}
          zoom={zoom}
          heading={heading}
          tilt={tilt}
          options={newOptions}
        />
      )
    }

    let children = []
    for (let i = 0, { length } = coords; i < length; i++) {
      if (Array.isArray(coords[i])) {
        if (Array.isArray(coords[i][0])) {
          children.push(
            <Group
              key={i}
              coords={coords[i]}
              ptCorner={ptCorner}
              zoom={zoom}
              options={newOptions}
            />
          )
        } else {
          children.push(drawChildenCoords(coords[i]))
        }
      }
    }
    return children
  }

  return (
    <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`} style={{ pointerEvents }}>
      {drawChildenCoords(coords)}
    </svg>
  )
}

PolygonSystem.propTypes = {
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
  _selected: PropTypes.bool,
  pointerEvents: PropTypes.oneOf(['auto', 'initial', 'inherit', 'none']).isRequired,
  setMapCenterBoundsZoom: PropTypes.func.isRequired
}

PolygonSystem.defaultProps = {
  _attached: false,
  _id: null,
  _selected: false,
  height: 0,
  width: 0,
  zoom: 0,
  tilt: 0,
  zIndex: 1,
  options: {
    stroke: DEFAULT_STROKE,
    strokeWidth: 1,
    strokeOpacity: 0.8,
    fill: ATTACHED_COLOR,
    fillOpacity: 0.3
  },
  pointerEvents: 'none'
}

const getHover = ({ $hover, hoveredChildKey, $dimensionKey }) =>
  $hover || hoveredChildKey === $dimensionKey

const areEqual = (prevProps, nextProps) => {
  const previoushover = getHover(prevProps)
  const nextHover = getHover(nextProps)

  if (previoushover !== nextHover) return false

  const memoProps = ['bounds', 'options', 'zoom', 'heading', 'tilt']

  for (let i = 0, { length } = memoProps; i < length; i++) {
    const prop = memoProps[i]
    if (prevProps[prop] !== nextProps[prop]) {
      return false
    }
  }

  return true
}

export default memo(PolygonSystem, areEqual)
