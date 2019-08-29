import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { RouteMap } from "./routes";
import Settings from "../views/Settings";
import Home from "../views/Home";
import PrivacyPolicy from "../components/PrivacyPolicy";
import PageNotFound from "../views/PageNotFound";
import { RouterLinkPush } from "../helpers/routing";
import "./styles.css";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = {};

class ReactRouter extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  renderRedirectOrComponent = (shouldRedirect, route, Component) => {
    const { history } = this.props;
    return shouldRedirect
      ? () => <Redirect push to={RouterLinkPush(history, route)} />
      : Component;
  };

  routeItems = props => {
    const { User, history } = props;
    const { state } = history.location;
    return [
      {
        path: [RouteMap.SETTINGS],
        component: this.renderRedirectOrComponent(
          !User.token,
          RouteMap.HOME,
          Settings
        )
      },
      { path: [RouteMap.HOME], component: Home },
      { path: [RouteMap.PRIVACY_POLICY], component: PrivacyPolicy }
    ];
  };

  renderRouteItems = props =>
    this.routeItems(props).map((k, i) => {
      const { path, component } = k;
      return <Route exact key={i} path={path} component={component} />;
    });

  render() {
    return (
      <Switch>
        {this.renderRouteItems(this.props)}
        <Route component={PageNotFound} />
      </Switch>
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ReactRouter)
);
