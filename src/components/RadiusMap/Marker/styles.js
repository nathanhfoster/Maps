const K_CIRCLE_SIZE = 34
const K_STICK_SIZE = 10
const K_STICK_WIDTH = 3
const K_BORDER_WIDTH = 2

const locationStyle = {
  position: 'absolute',
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE + K_STICK_SIZE,
  left: -K_CIRCLE_SIZE / 2,
  top: -(K_CIRCLE_SIZE + K_STICK_SIZE)
}

const locationCircleStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE,
  border: `${K_BORDER_WIDTH}px solid #689f38`,
  borderRadius: K_CIRCLE_SIZE,
  color: '#689f38',
  backgroundColor: 'white',
  textAlign: 'center',
  boxShadow:
    '0px 1px 5px 0px 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  fontSize: 12,
  fontWeight: 'bold',
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const locationCircleStyleHover = {
  ...locationCircleStyle,
  border: `${K_BORDER_WIDTH}px solid #689f38`,
  color: '#689f40',
  transform: 'perspective(1px) translate3d(0, 0, 0) scale3d(1.1, 1.1, 1)',
  transition: '-webkit-transform 0.25s cubic-bezier(0.485, 1.65, 0.545, 0.835)',
  willChange: 'transform',
  backgroundRepeat: 'no-repeat',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'subpixel-antialiased',
  transformOrigin: '15px 60px 0px',
  zIndex: 6000,
  boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
}

const locationStickStyleShadow = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2 + K_BORDER_WIDTH,
  top: K_CIRCLE_SIZE + 2,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#689f40',
  boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
}

const locationStickStyle = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2 + K_BORDER_WIDTH,
  top: K_CIRCLE_SIZE + K_BORDER_WIDTH,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#689f38'
}

const locationStickStyleHover = {
  ...locationStickStyle,
  willChange: 'transform',
  transition: '-webkit-transform 1s cubic-bezier(0.485, 1.65, 0.545, 0.835)'
}

export {
  locationStyle,
  locationCircleStyle,
  locationCircleStyleHover,
  locationStickStyle,
  locationStickStyleHover,
  locationStickStyleShadow,
  K_CIRCLE_SIZE,
  K_STICK_SIZE
}
