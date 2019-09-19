import React, { memo } from 'react'
import { Fab } from '@material-ui/core'
import { MyLocation } from '@material-ui/icons'

const styles = { marginRight: 6 }

const onClick = ({ defaultCenter, center, zoom, setMapCenter, setMapZoom, toggleKey }) => {
  setMapCenter(defaultCenter)
  setMapZoom(zoom)
}

const MyLocationButton = props => (
  <Fab
    style={styles}
    color="default"
    size="medium"
    aria-label="myLocation"
    onClick={() => onClick(props)}
  >
    <MyLocation />
  </Fab>
)

export default memo(MyLocationButton)
