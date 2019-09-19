import React, { memo } from 'react'
import { Fab } from '@material-ui/core'
import { Map } from '@material-ui/icons'

const styles = { margin: 6 }

const ParlayMapButton = ({ onClick }) => (
  <Fab style={styles} color="default" size="medium" aria-label="exit" onClick={onClick}>
    <Map />
  </Fab>
)

export default memo(ParlayMapButton)
