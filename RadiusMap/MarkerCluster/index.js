import React, { Fragment, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import Marker from '../Marker'
import MarkerCounter from './MarkerCounter'

const MarkerCluster = ({
  points,
  hoveredChildKey,
  zoom,
  selectSite,
  setMapCenterBoundsZoom,
  $onMouseAllow
}) => {
  const shouldRenderMarkerCounter = points.length > 2
  const markerCounterValue = points.length - 2

  const markers = points.slice(0, 2)

  const renderMarkers = useMemo(
    () =>
      markers.map(marker => {
        const { id, ...props } = marker
        const markerHover = hoveredChildKey === id
        return (
          <Marker
            {...props}
            $dimensionKey={id}
            $hover={markerHover}
            $onMouseAllow={$onMouseAllow}
            selectSite={selectSite}
            setMapCenterBoundsZoom={setMapCenterBoundsZoom}
            zoom={zoom}
            inGroup
          />
        )
      }),
    [markers, hoveredChildKey]
  )

  return (
    <Fragment>
      {renderMarkers}
      {shouldRenderMarkerCounter && <MarkerCounter>+{markerCounterValue}</MarkerCounter>}
    </Fragment>
  )
}

MarkerCluster.propTypes = {
  $dimensionKey: PropTypes.string,
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $onMouseAllow: PropTypes.func,
  $hover: PropTypes.bool,
  $prerender: PropTypes.bool,
  lat: PropTypes.number,
  lng: PropTypes.number,
  points: PropTypes.array
}

export default memo(MarkerCluster)
