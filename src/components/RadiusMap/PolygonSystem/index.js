import Polygon from './Polygon'

const PolygonProps = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35
}

const testCoordinates = [
  [
    { lat: 26.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 }
  ],
  [
    { lat: 25.773, lng: -80.18 },
    { lat: 18.465, lng: -66.117 },
    { lat: 32.32, lng: -64.756 },
    { lat: 25.773, lng: -80.18 }
  ]
]

const getPolygons = coordinates =>
  coordinates.map(c =>
    Polygon({
      ...PolygonProps,
      paths: c
    })
  )

const PolygonSystem = (map, maps, polygonCoordinates) => {
  const Polygons = getPolygons(polygonCoordinates)
  return Polygons.forEach(e => e.setMap(map))
}

export default PolygonSystem
