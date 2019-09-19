import React from 'react'
import PropTypes from 'prop-types'
import Polyline from './Polyline'
import toPoints from '../functions/toPoints'

const Group = ({ bounds, coords, options, ptCorner, zoom }) => {
  ptCorner = ptCorner || toPoints(bounds[0], bounds[1], zoom)
  const polylines = coords.map((c, i) => (
    <Polyline
      key={i}
      bounds={bounds}
      coords={c}
      ptCorner={ptCorner}
      options={options}
      zoom={zoom}
    />
  ))
  return <g {...options}>{polylines}</g>
}

Group.propTypes = {
  coords: PropTypes.array,
  ptCorner: PropTypes.object,
  bounds: PropTypes.array,
  zoom: PropTypes.number,
  options: PropTypes.object
}

export default Group
