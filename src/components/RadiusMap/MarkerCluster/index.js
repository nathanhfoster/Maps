import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import Marker from '../Marker'

import MarkerCounter from './MarkerCounter'

class MarkerCluster extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    $dimensionKey: PropTypes.string,
    $geoService: PropTypes.object,
    $getDimensions: PropTypes.func,
    $onMouseAllow: PropTypes.func,
    $hover: PropTypes.bool,
    $prerender: PropTypes.bool,
    lat: PropTypes.number,
    lng: PropTypes.number,
    points: PropTypes.array,
    selected: PropTypes.bool
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { points, $dimensionKey, $hover, hoveredChildKey, zoom } = props
    const shouldRenderMarkerCounter = points.length > 2
    const markerCounterValue = points.length - 2

    this.setState({
      markers: points.slice(0, 2),
      markerCounterValue,
      shouldRenderMarkerCounter,
      $dimensionKey,
      $hover,
      hoveredChildKey,
      zoom
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderMarkers = (markers, hoveredChildKey) => {
    const { selectSite, setMapCenterBoundsZoom } = this.props
    const { zoom } = this.state
    return markers.map(marker => {
      const { id, ...props } = marker
      return (
        <Marker
          {...props}
          $dimensionKey={id}
          $hover={hoveredChildKey === id}
          selectSite={selectSite}
          setMapCenterBoundsZoom={setMapCenterBoundsZoom}
          zoom={zoom}
          inGroup
        />
      )
    })
  }

  render() {
    const {
      markers,
      markerCounterValue,
      shouldRenderMarkerCounter,
      $dimensionKey,
      $hover,
      hoveredChildKey
    } = this.state

    return (
      <Fragment>
        {this.renderMarkers(markers, hoveredChildKey)}
        {shouldRenderMarkerCounter && <MarkerCounter>+{markerCounterValue}</MarkerCounter>}
      </Fragment>
    )
  }
}
export default MarkerCluster
