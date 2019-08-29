import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import "./styles/index.css";
import NavBar from "./components/NavBar";
import ReactRouter from "./ReactRouter";
import { saveReduxState } from "./store/persist";
import { setWindow } from "./actions/App";
import { GetUserSettings } from "./actions/Settings";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { setWindow, GetUserSettings, saveReduxState };

export class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    User: PropTypes.object,
    setWindow: PropTypes.func.isRequired,
    GetUserSettings: PropTypes.func.isRequired,
    saveReduxState: PropTypes.func
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { User, GetUserSettings } = this.props;
    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateWindowDimensions();

    if (User.token) GetUserSettings(User.token, User.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { saveReduxState } = props;
    saveReduxState();
    this.setState({});
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const { setWindow } = this.props;
    const { innerHeight, innerWidth } = window;
    const isMobile = innerWidth < 768;
    setWindow({ height: innerHeight, width: innerWidth, isMobile });
    this.setState({ height: innerHeight, width: innerWidth, isMobile });
  };

  render() {
    const { history } = this.props;
    const { pathname } = history.location;
    const { isMobile } = this.state;
    const routeOverlayPosition = isMobile
      ? "var(--navBarHeightMobile)"
      : "var(--navBarHeight)";
    return pathname === "/" ? (
      <Redirect to="/home" />
    ) : (
      <div className="App">
        <NavBar />
        <div className="routeOverlay" style={{ bottom: routeOverlayPosition }}>
          <ReactRouter />
        </div>
      </div>
    );
  }
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(App)
);
