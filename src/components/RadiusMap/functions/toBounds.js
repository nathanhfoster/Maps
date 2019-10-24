const toBounds = (map, maps, coords) => {
  const bounds = new maps.LatLngBounds()

  const extendBounds = (lat, lng) => {
    const latLng = new maps.LatLng(lat, lng)
    bounds.extend(latLng)
  }

  const extendCoordsBounds = coords =>
    coords.forEach(coord => {
      if (coord.hasOwnProperty('lat') && coord.hasOwnProperty('lng')) {
        extendBounds(coord.lat, coord.lng)
      } else if (Array.isArray(coord)) {
        extendCoordsBounds(coord)
      }
    })

  extendCoordsBounds(coords)

  map.fitBounds(bounds)
}

export default toBounds
