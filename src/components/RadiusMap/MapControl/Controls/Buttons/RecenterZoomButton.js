import React, { memo } from 'react'
import { Fab } from '@material-ui/core'
import { ZoomOut } from '@material-ui/icons'
import defaultStyles from './defaultStyles'
import { withStyles } from '@material-ui/core/styles'
import { CENTER_OF_US, DEFAULT_ZOOM } from '../../../constants'

const styles = theme => ({
  root: {
    ...defaultStyles
  }
})

const onClick = ({ setMapCenterBoundsZoom, toggleKey }) => {
  setMapCenterBoundsZoom({ center: CENTER_OF_US, zoom: DEFAULT_ZOOM })
}

const RecenterZoomButton = props => {
  const { root } = props.classes
  return (
    <Fab className={root} size="medium" aria-label="myLocation" onClick={() => onClick(props)}>
      <ZoomOut />
    </Fab>
  )
}

export default memo(withStyles(styles)(RecenterZoomButton))
