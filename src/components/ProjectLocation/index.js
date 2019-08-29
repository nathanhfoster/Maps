import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import {
  infoBoxStyle,
  greatPlaceStyle,
  greatPlaceCircleStyle,
  greatPlaceCircleStyleHover,
  greatPlaceStickStyle,
  greatPlaceStickStyleHover,
  greatPlaceStickStyleShadow
} from "./styles.js";

class ProjectLocation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    $hover: PropTypes.bool,
    text: PropTypes.string,
    zIndex: PropTypes.number
  };

  static defaultProps = {};

  render() {
    const { text, zIndex, address, phone_number, title } = this.props;
    //console.log(this.props);
    const style = {
      ...greatPlaceStyle,
      zIndex: this.props.$hover ? 1000 : zIndex
    };

    const circleStyle = this.props.$hover
      ? greatPlaceCircleStyleHover
      : greatPlaceCircleStyle;
    const stickStyle = this.props.$hover
      ? greatPlaceStickStyleHover
      : greatPlaceStickStyle;

    return (
      <div style={style} className="center">
        {!this.props.$hover
          ? [
              <div style={greatPlaceStickStyleShadow} />,
              <div style={circleStyle}>{text}</div>,
              <div style={stickStyle} />
            ]
          : text !== "Me"
          ? [
              <div style={infoBoxStyle}>
                {`${title ? title : ""} \n`}
                <div>{`${address ? address : ""}`}</div>
                <div>{`${phone_number ? phone_number : ""}`}</div>
              </div>,
              <div style={greatPlaceStickStyleShadow} />,
              <div style={circleStyle}>{text}</div>,
              <div style={stickStyle} />
            ]
          : [
              <div style={greatPlaceStickStyleShadow} />,
              <div style={circleStyle}>{text}</div>,
              <div style={stickStyle} />
            ]}
      </div>
    );
  }
}
export default ProjectLocation;
