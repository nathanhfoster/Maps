const K_CIRCLE_SIZE = 34;
const K_STICK_SIZE = 10;
const K_STICK_WIDTH = 3;

const infoBoxStyle = {
  display: "block",
  margin: "auto",
  padding: "6px",
  alignContent: "center",
  justifyContent: "center",
  textAlign: "center",
  height: "150%",
  width: "500%",
  bottom: K_CIRCLE_SIZE,
  transform: "scale(1.5)",
  position: "absolute",
  willChange: "transform",
  backgroundRepeat: "no-repeat",
  transition: "-webkit-transform .425s cubic-bezier(0.485, 1.65, 0.545, 0.835)",
  zIndex: 6500,
  backgroundColor: "white",
  boxShadow:
    "0px 1px 5px 0px var(--primaryBoxShadow), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
};

const greatPlaceStyle = {
  position: "absolute",
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE + K_STICK_SIZE,
  left: -K_CIRCLE_SIZE / 2,
  top: -(K_CIRCLE_SIZE + K_STICK_SIZE)
};

const greatPlaceCircleStyle = {
  position: "absolute",
  left: 0,
  top: 0,
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE,
  border: "2px solid var(--primaryColor)",
  borderRadius: K_CIRCLE_SIZE,
  color: "var(--primaryColor)",
  backgroundColor: "white",
  textAlign: "center",
  boxShadow:
    "0px 1px 5px 0px var(--primaryBoxShadow), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontSize: 12,
  fontWeight: "bold",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const greatPlaceCircleStyleHover = {
  ...greatPlaceCircleStyle,
  border: "2px solid var(--quinaryColor)",
  color: "var(--quinaryColor)",
  transform: "scale(1.1)",
  transition: "-webkit-transform 0.25s cubic-bezier(0.485, 1.65, 0.545, 0.835)",
  transformOrigin: "15px 60px 0px",
  zIndex: 6000
};

const greatPlaceStickStyleShadow = {
  position: "absolute",
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2,
  top: K_CIRCLE_SIZE,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: "var(--quinaryColor)",
  boxShadow: "0 0 0 1px white"
};

const greatPlaceStickStyle = {
  position: "absolute",
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2,
  top: K_CIRCLE_SIZE,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: "var(--primaryColor)"
};

const greatPlaceStickStyleHover = {
  ...greatPlaceStickStyle,
  backgroundColor: "var(--secondaryColor)",
  display: "none",
  position: "absolute",
  willChange: "transform",
  transition: "-webkit-transform 1s cubic-bezier(0.485, 1.65, 0.545, 0.835)"
};

export {
  infoBoxStyle,
  greatPlaceStyle,
  greatPlaceCircleStyle,
  greatPlaceCircleStyleHover,
  greatPlaceStickStyle,
  greatPlaceStickStyleHover,
  greatPlaceStickStyleShadow,
  K_CIRCLE_SIZE,
  K_STICK_SIZE
};
