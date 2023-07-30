import React from "react";
import NavBar from "../Navigation/NavBar";
import movieCollage from "./img/movie_collage_landing.jpeg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Landing = () => {
  const landingStyles = {
    backgroundImage: `url(${movieCollage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh",
    position: "relative",
  };

  const textStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "36px",
    textShadow: "2px 2px 4px #000",
    padding: "10px",
    backgroundColor: "#000",
    borderRadius: "8px",
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={landingStyles}>
        <NavBar />
        <Typography variant="h3" style={textStyles}>
          Welcome to IMDBJ, Your One Stop Website for All Your Needs!
        </Typography>
      </div>
    </ThemeProvider>
  );
};

export default Landing;
