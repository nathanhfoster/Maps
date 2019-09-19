import React, { Fragment, memo } from 'react'
import PropTypes from 'prop-types'
import { history } from 'store'
import {
  K_CIRCLE_SIZE,
  locationCircleStyle,
  locationCircleStyleHover,
  locationStickStyle,
  locationStickStyleHover,
  locationStickStyleShadow
} from './styles'

const infoClick = $dimensionKey => history.push(`/v2/projects/${$dimensionKey}`)

const ClientNameCharacterStyle = {
  fontSize: K_CIRCLE_SIZE - 4,
  fontWeight: 900,
  fontFamily: 'Arial Bold'
}

const infoStyle = {
  fontSize: K_CIRCLE_SIZE,
  fontWeight: 900,
  fontFamily: 'Comic Sans MS'
}

const ClientNameCharacter = clientName => {
  if (!clientName) clientName = '?'
  return <span style={ClientNameCharacterStyle}>{clientName.charAt(0).toUpperCase()}</span>
}

const Info = $dimensionKey => (
  <span style={infoStyle} onClick={() => infoClick($dimensionKey)}>
    i
  </span>
)

const Stick = ({ $dimensionKey, clientName, shouldShowPreview }) => {
  let text = ClientNameCharacter(clientName)
  let circleStyle = locationCircleStyle
  let stickStyle = locationStickStyle
  if (shouldShowPreview) {
    text = Info($dimensionKey)
    circleStyle = locationCircleStyleHover
    stickStyle = locationStickStyleHover
  }
  return (
    <Fragment>
      <div style={locationStickStyleShadow} />
      <div style={circleStyle}>{text}</div>
      <div style={stickStyle} />
    </Fragment>
  )
}

Stick.propTypes = {
  $dimensionKey: PropTypes.string,
  clientName: PropTypes.string,
  shouldShowPreview: PropTypes.bool
}

export default memo(Stick)
