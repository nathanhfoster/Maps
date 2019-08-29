import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "reactstrap";
import GoogleMap from "google-map-react";
import ProjectLocation from "../ProjectLocation";
import { K_CIRCLE_SIZE, K_STICK_SIZE } from "../ProjectLocation/styles.js";
import "./styles.css";
import "./stylesM.css";
import { getUserLocation, watchUserLocation } from "../../actions/User";
import { SearchProjects } from "../../actions/Projects";

const { REACT_APP_GOOGLE_API_KEY } = process.env;

const mapStateToProps = ({ User, Projects, Window }) => ({
  User,
  Projects,
  Window
});

const mapDispatchToProps = {
  getUserLocation,
  watchUserLocation,
  SearchProjects
};

class RadiusMap extends PureComponent {
  constructor(props) {
    super(props);
    this.watchID = null;
    this.state = {
      userLocation: {},
      shouldSetInitialCenter: true,
      center: null,
      zoom: 11,
      markers: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      userLocation: {}
    };
  }

  static propTypes = {
    userLocation: PropTypes.object,
    google: PropTypes.object,
    zoom: PropTypes.number,
    initialCenter: PropTypes.object,
    markers: PropTypes.array,
    zoom: PropTypes.number,
    onCenterChange: PropTypes.func,
    onZoomChange: PropTypes.func,
    onHoverKeyChange: PropTypes.func,
    userLocation: PropTypes.object,
    getUserLocation: PropTypes.func.isRequired,
    watchUserLocation: PropTypes.func.isRequired
  };

  static defaultProps = {
    center: [38.620744200000004, -121.25949069999999],
    zoom: 10
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getUserLocation, watchUserLocation, SearchProjects } = this.props;
    SearchProjects();
    getUserLocation();
    this.watchID = watchUserLocation();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Projects } = props;
    let { location } = User;
    const markers = this.getMarkers(location, Projects.projectList.items);

    location.speed = Number(location.speed * 2.23694); // meters per second to mph
    location.altitude = Number(location.altitude * 3.28084); // meters to feet

    this.setState({ markers, userLocation: location });
  };

  getMarkers = (userLocation, projects) => {
    let markers = [
      {
        id: "Me",
        boundaries: { coordinates: [], type: null },
        clientId: null,
        clientName: null,
        engagingContacts: [],
        lastActivity: null,
        location: [userLocation.latitude, userLocation.longitude],
        siteDescription: null,
        state: null,
        zipcode: null,
        _score: null
      }
    ]
      .concat(projects)
      .map(
        e =>
          (e = {
            ...e,
            lat: e.location[0],
            lng: e.location[1]
          })
      );

    return markers;
  };

  componentWillUnmount() {
    const { geolocation } = navigator;
    geolocation.clearWatch(this.watchID);
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  _onBoundsChange = (center, zoom) => {
    this._panTo(center, zoom);
  };

  _distanceToMouse = (markerPos, mousePos) => {
    const x = markerPos.x;
    const y = markerPos.y - K_STICK_SIZE - K_CIRCLE_SIZE / 2;
    const distanceKoef = 2;

    return (
      distanceKoef *
      Math.sqrt(
        (x - mousePos.x) * (x - mousePos.x) +
          (y - mousePos.y) * (y - mousePos.y)
      )
    );
  };

  _panTo = (center, zoom) => this.setState({ center, zoom });

  createMapOptions = () => {
    return {
      disableDefaultUI: true,
      gestureHandling: "greedy"
    };
  };

  locationButton = (latitude, longitude) => {
    const zoom =
      this.state.zoom + 4 < 18 ? this.state.zoom + 4 : this.state.zoom;
    this._panTo([latitude, longitude], zoom);
  };

  mapCanLoad = () => {
    const { latitude, longitude } = this.state.userLocation;
    if (latitude != null && longitude != null) {
      if (this.state.shouldSetInitialCenter) {
        this.setState({
          center: [latitude, longitude],
          shouldSetInitialCenter: false
        });
      }
      return true;
    } else return false;
  };

  renderMarkers = markers =>
    markers.map(place => {
      const { id, ...coords } = place;
      return (
        <ProjectLocation
          key={id}
          {...coords}
          text={id}
          zIndex={1}
          // use your hover state (from store, react-controllables etc...)
          $hover={this.props.hoverKey === id}
        />
      );
    });

  render() {
    const { Window } = this.props;
    const { markers, center, zoom, userLocation } = this.state;
    const { altitude, latitude, longitude, speed } = userLocation;

    return (
      <div>
        {this.mapCanLoad() ? (
          <div
            className="GoogleMapWrapper"
            style={{
              height: Window.height - 128,
              width: Window.width
            }}
          >
            <GoogleMap
              // apiKey={REACT_APP_GOOGLE_API_KEY}
              bootstrapURLKeys={{
                key: REACT_APP_GOOGLE_API_KEY,
                libraries: ["visualization"]
              }}
              defaultCenter={[latitude, longitude]}
              initialCenter={center}
              center={center}
              zoom={zoom}
              onClick={this.onMapClicked}
              onBoundsChange={this._onBoundsChange}
              onChildClick={this._onChildClick}
              onChildMouseEnter={this._onChildMouseEnter}
              onChildMouseLeave={this._onChildMouseLeave}
              options={this.createMapOptions}
              hoverDistance={K_CIRCLE_SIZE / 2}
              distanceToMouse={this._distanceToMouse}
              panTo={this._panTo}
            >
              {this.renderMarkers(markers)}
            </GoogleMap>
            <Button
              bsClass="sheenButton locationButton sheen"
              bsSize="large"
              onClick={() => this.locationButton(latitude, longitude)}
            >
              <i className="fas fa-map-marker-alt fa-2x" />
            </Button>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(RadiusMap)
);
