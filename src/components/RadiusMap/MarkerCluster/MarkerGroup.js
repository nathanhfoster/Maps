import React, { memo } from 'react'

const hoverStyles = {
  transform: 'perspective(1px) translate3d(0, 0, 0) scale3d(1.1, 1.1, 1)',
  transition: '-webkit-transform 0.25s cubic-bezier(0.485, 1.65, 0.545, 0.835)',
  willChange: 'transform',
  backgroundRepeat: 'no-repeat',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'subpixel-antialiased'
}

const MarkerGroup = props => {
  const { children, hover } = props

  return <div style={hover ? hoverStyles : {}}>{children}</div>
}

export default memo(MarkerGroup)
