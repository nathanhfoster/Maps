const GooglePolygon = ({
  paths,
  strokeColor,
  strokeOpacity,
  strokeWeight,
  fillColor,
  fillOpacity
}) => {
  return new google.maps.Polygon({
    paths,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    fillColor,
    fillOpacity
  })
}

export default GooglePolygon
