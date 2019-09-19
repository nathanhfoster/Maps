import React from 'react'
import PropTypes from 'prop-types'
import toPoints from '../functions/toPoints'

const Polyline = ({ bounds, coords, options, ptCorner, zoom }) => {
  ptCorner = ptCorner || toPoints(bounds[0], bounds[1], zoom)
  const points = coords
    .map(coord => {
      const ptScreen = toPoints(coord.lat, coord.lng, zoom)
      const x = ptScreen.x - ptCorner.x
      const y = ptScreen.y - ptCorner.y
      return `${x},${y}`
    })
    .join(' ')

  return <polyline points={points} {...options} />
}

Polyline.propTypes = {
  coords: PropTypes.array,
  ptCorner: PropTypes.object,
  bounds: PropTypes.array,
  zoom: PropTypes.number,
  options: PropTypes.object
}

export default Polyline
