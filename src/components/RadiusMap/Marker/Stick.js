import React, { Fragment, memo } from 'react'
import PropTypes from 'prop-types'
import { history } from 'store'
import { ZoomIn } from '@material-ui/icons'
import {
  K_CIRCLE_SIZE,
  K_BORDER_WIDTH,
  locationCircleStyle,
  locationCircleStyleHover,
  locationStickStyle,
  locationStickStyleHover,
  locationStickStyleShadow
} from './styles'

import { DEFAULT_MARKER_MAX_ZOOM } from '../constants'

const infoClick = ({ $dimensionKey, center, selectSite, setMapCenterBoundsZoom }) => {
  selectSite($dimensionKey)
  setMapCenterBoundsZoom({ center })
  history.push(`/v2/projects/${$dimensionKey}`)
}

const zoomClick = ({ center, setMapCenterBoundsZoom }) =>
  setMapCenterBoundsZoom({ center, zoom: DEFAULT_MARKER_MAX_ZOOM })

const clientNameCharacterStyle = {
  fontFamily: 'Arial Bold'
}

const infoStyle = {
  fontFamily: 'Comic Sans MS'
}

const zoomStyle = {
  fontSize: 14
}

const ClientNameCharacter = clientName => {
  if (!clientName) clientName = 'P'
  return <span style={clientNameCharacterStyle}>{clientName.charAt(0).toUpperCase()}</span>
}

const Info = props => (
  <span style={infoStyle} onClick={() => infoClick(props)}>
    i
  </span>
)

const Zoom = props => (
  <span style={zoomStyle} onClick={() => zoomClick(props)}>
    <ZoomIn />
  </span>
)

const Stick = props => {
  const { clientName, shouldShowPreview, inGroup, zoom } = props
  let text = ClientNameCharacter(clientName)
  let circleStyle = locationCircleStyle
  let stickStyle = locationStickStyle

  const zoomOffset = DEFAULT_MARKER_MAX_ZOOM - 3

  if (shouldShowPreview) {
    if (zoom <= zoomOffset) text = Zoom(props)
    else text = Info(props)
    circleStyle = locationCircleStyleHover
    stickStyle = locationStickStyleHover
  }

  return (
    <Fragment>
      {!inGroup && <div style={locationStickStyleShadow} />}
      <div style={circleStyle}>{text}</div>
      {!inGroup && <div style={stickStyle} />}
    </Fragment>
  )
}

Stick.propTypes = {
  $dimensionKey: PropTypes.string,
  clientName: PropTypes.string,
  shouldShowPreview: PropTypes.bool,
  inGroup: PropTypes.bool,
  center: PropTypes.arrayOf(PropTypes.number.isRequired),
  selectSite: PropTypes.func.isRequired,
  setMapCenterBoundsZoom: PropTypes.func.isRequired
}

export default memo(Stick)
