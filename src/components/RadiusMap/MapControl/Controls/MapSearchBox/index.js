import React, { PureComponent, Component } from 'react'
import { styles } from './styles'
import './styles.css'

class MapSearchBox extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { map, mapApi } = this.props
    this.searchBox = new mapApi.places.SearchBox(this.searchInput)
    this.searchBox.addListener('places_changed', this.onPlacesChanged)
    this.searchBox.bindTo('bounds', map)
  }

  componentWillUnmount() {
    const { mapApi } = this.props
    mapApi.event.clearInstanceListeners(this.searchInput)
  }

  onPlacesChanged = () => {
    const { map, addplace } = this.props
    const selected = this.searchBox.getPlaces()
    const { 0: place } = selected
    if (!place.geometry) return
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport)
    } else {
      map.setCenter(place.geometry.location)
      map.setZoom(17)
    }
    // Can add additional prop from the project container
    // addplace(selected)
    this.searchInput.blur()
  }

  clearSearchBox = () => {
    this.searchInput.value = ''
  }

  render() {
    return (
      <div style={styles().containerStyles}>
        <input
          ref={ref => {
            this.searchInput = ref
          }}
          style={styles().inputStyles}
          type="text"
          onFocus={this.clearSearchBox}
          placeholder="Enter a location"
        />
      </div>
    )
  }
}

export default MapSearchBox
