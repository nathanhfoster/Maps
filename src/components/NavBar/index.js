import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { RouteMap } from "../../ReactRouter/routes";
import PropTypes from "prop-types";
import "./styles.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media
} from "reactstrap";
import { RouterLinkPush } from "../../helpers/routing";
import { Logout } from "../../actions/User";
import Login from "../Login";
import Hamburger from "../Hamburger/Hamburger";
import Logo from "../../images/Logo.png";
const mapStateToProps = ({ User, Window }) => ({ User, Window });

const mapDispatchToProps = { Logout };

class NavBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };
  }

  static propTypes = {
    User: PropTypes.object,
    Logout: PropTypes.func.isRequired
  };

  static defaultProps = {
    UserLoggedInDropDownItems: [
      {
        title: "Profile",
        route: RouteMap.USER_PROFILE_UPDATE,
        hasDivider: false
      },
      { title: "Settings", route: RouteMap.SETTINGS, hasDivider: false }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  toggleHamburgerMenu = () =>
    this.setState({ collapsed: !this.state.collapsed });

  closeHamburgerMenu = () => this.setState({ collapsed: true });

  renderNavlink = (route, title, key) => {
    const { history } = this.props;
    return (
      <NavItem key={key}>
        <NavLink
          className="Navlink"
          tag={Link}
          to={RouterLinkPush(history, route)}
          onClick={() => this.closeHamburgerMenu()}
        >
          {title}
        </NavLink>
      </NavItem>
    );
  };

  renderDropdownItems = dropDownItems =>
    dropDownItems.map((item, i) => {
      const { history } = this.props;
      const { hasDivider, route, title } = item;
      return (
        <DropdownItem
          key={i}
          divider={hasDivider}
          tag={Link}
          to={RouterLinkPush(history, route)}
          onClick={() => this.closeHamburgerMenu()}
        >
          {title}
        </DropdownItem>
      );
    });

  renderBrandOrExlporeAndUniversities = isMobile =>
    isMobile ? this.renderRadiusBrand : this.renderExlporeAndUniversities;

  render() {
    const { collapsed } = this.state;
    const {
      User,
      Window,
      history,
      UserLoggedInDropDownItems,
      Logout
    } = this.props;
    const { isMobile } = Window;
    const UserName =
      User.token && (User.first_name || User.username).toUpperCase();
    const UserPicture = User.uploaded_picture || User.picture;
    return (
      <Navbar className="NavBar" color="light" light fixed="top" expand="md">
        <NavbarBrand
          className="Logo py-0 mx-auto"
          tag={Link}
          to={RouterLinkPush(history, RouteMap.HOME)}
          onClick={() => this.closeHamburgerMenu()}
        >
          <Media left className="NavBarImage" src={Logo} />
        </NavbarBrand>
        {isMobile && (
          <NavbarToggler
            tag={Hamburger}
            onClick={() => this.toggleHamburgerMenu()}
            className="Hamburger"
            collapsed={collapsed}
          />
        )}
        <Collapse
          isOpen={!collapsed}
          navbar
          style={{ height: "var(--navBarHeight)" }}
        >
          <Nav className="ml-auto" navbar>
            {!User.token ? (
              <Login />
            ) : (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {UserPicture && (
                    <Media left className="NavBarImage" src={UserPicture} />
                  )}
                  {UserName}
                </DropdownToggle>
                <DropdownMenu right>
                  {this.renderDropdownItems(UserLoggedInDropDownItems)}
                  <DropdownItem
                    onClick={() => this.closeHamburgerMenu(Logout())}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
);
