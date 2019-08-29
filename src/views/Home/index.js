import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import RadiusMap from "../../components/RadiusMap";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = {};

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    User: PropTypes.object
  };

  static defaultProps = {};

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

  render() {
    return (
      <Container className="Home Container">
        <Row>
          <Col xs={12}>
            <RadiusMap />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home);
