import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { locationStyle } from './styles'

import PreviewBox from './PreviewBox'
import Stick from './Stick'

class Marker extends PureComponent {
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
    boundaries: PropTypes.object,
    clientId: PropTypes.string,
    clientName: PropTypes.string,
    engagingContacts: PropTypes.array,
    lastActivity: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    location: PropTypes.array,
    siteDescription: PropTypes.string,
    state: PropTypes.string,
    zIndex: PropTypes.number,
    zipcode: PropTypes.string,
    score: PropTypes.string,
    inGroup: PropTypes.bool
  }

  static defaultProps = { inGroup: false }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      $dimensionKey,
      $geoService,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      boundaries,
      clientId,
      clientName,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      location,
      siteDescription,
      state,
      zIndex,
      zipcode,
      score,
      inGroup
    } = props
    this.setState({
      $dimensionKey,
      $geoService,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      boundaries,
      clientId,
      clientName,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      location,
      siteDescription,
      state,
      zIndex,
      zipcode,
      score,
      inGroup
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const {
      $dimensionKey,
      $geoService,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      boundaries,
      clientId,
      clientName,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      location,
      siteDescription,
      state,
      zIndex,
      zipcode,
      score,
      inGroup
    } = this.state

    const style = {
      ...locationStyle,
      zIndex: $hover ? 1000 : zIndex
    }

    const shouldShowPreview = $hover && clientName != 'Me'

    const ComponentProps = {
      $dimensionKey,
      clientName,
      siteDescription,
      score,
      lastActivity,
      shouldShowPreview
    }

    return (
      <div style={style}>
        {shouldShowPreview && <PreviewBox {...ComponentProps} />}
        <Stick {...ComponentProps} />
      </div>
    )
  }
}
export default Marker
