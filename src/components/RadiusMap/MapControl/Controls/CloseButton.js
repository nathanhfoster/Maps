import React, { memo } from 'react'
import { Fab } from '@material-ui/core'
import { Close } from '@material-ui/icons'

const styles = { position: 'absolute', top: 0, right: 0, margin: 6, zIndex: 9999 }

const CloseButton = ({ onClick }) => (
  <Fab style={styles} color="default" size="medium" aria-label="exit" onClick={onClick}>
    <Close />
  </Fab>
)

export default memo(CloseButton)
