import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Marker from '../Marker'

import MarkerGroup from './MarkerGroup'
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
    const { points } = props
    this.setState({ clusterFaceMarkers: points.slice(0, 2), points })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderClusterFaceMarkers = clusterFaceMarkers =>
    clusterFaceMarkers.map(marker => {
      const { id, lat, lng } = marker
      return <Marker key={id} lat={lat} lng={lng} name={id} inGroup />
    })

  render() {
    const { $dimensionKey, $hover } = this.props
    const { clusterFaceMarkers, points } = this.state
    const shouldRenderMarkerCounter = points.length > 2

    return (
      <MarkerGroup length={points.length} hover={$hover}>
        {/* {this.renderClusterFaceMarkers(clusterFaceMarkers)} */}
        {shouldRenderMarkerCounter && <MarkerCounter>+{points.length - 2}</MarkerCounter>}
      </MarkerGroup>
    )
  }
}
export default MarkerCluster
