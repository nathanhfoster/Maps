import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UserLogin } from "../../actions/User";
import { Link } from "react-router-dom";
import { RouteMap } from "../../ReactRouter/routes";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  Button
} from "reactstrap";
import { RouterLinkPush } from "../../helpers/routing";
import "./styles.css";

class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      rememberMe: false
    };
  }

  static propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    rememberMe: PropTypes.bool,
    UserLogin: PropTypes.func.isRequired
  };

  static defaultProps = {
    Inputs: [
      {
        type: "text",
        name: "username",
        placeholder: "Username"
      },
      {
        type: "password",
        name: "password",
        placeholder: "Password"
      }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  onChange = e => {
    const { type, name, value, checked } = e.target;
    switch (type) {
      case "checkbox":
        this.setState({ [name]: checked });
        break;
      default:
        this.setState({ [name]: value });
    }
  };

  userLogin = e => {
    const { UserLogin } = this.props;
    e.preventDefault();
    const { username, password, rememberMe } = this.state;
    const payload = { username, password };
    UserLogin(payload, rememberMe);
  };

  render() {
    const { Inputs } = this.props;
    const { username, password } = this.state;
    return (
      <Container className="Login Container">
        <Form onSubmit={this.userLogin} method="post">
          <Row form>
            <Col xs={5}>
              <FormGroup>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col xs={5}>
              <FormGroup>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col>
              <ButtonGroup>
                <Button
                  disabled={!(username && password)}
                  color="primary"
                  type="submit"
                >
                  <i className="fas fa-sign-in-alt"></i>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
export default Login;
