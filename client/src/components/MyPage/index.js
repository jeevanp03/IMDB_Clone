import React, { useState } from "react";
import NavBar from "../Navigation/NavBar";
import SelectTrailer from "./SelectTrailer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography"; 

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const MyPage = () => {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const serverURL = "";

  const changeMovie = (event) => {
    setSelectedMovie(event.target.value);
  };

  const handleFindTrailer = () => {
    callApiFindTrailer().then((res) => {
      console.log("callApiFindTrailer returned: ", res);
      var parsed = JSON.parse(res.express);
      console.log("callApiFindTrailer parsed: ", parsed[0]);
      if (parsed[0].movieTrailer.length === 0) {
        console.log("no trailer");
        setSelectedTrailer("");
      } else {
        console.log("found trailer");
        setSelectedTrailer(parsed[0].movieTrailer);
      }
    });
  };

  const callApiFindTrailer = async () => {
    const url = serverURL + "/api/findTrailer";
    console.log(url);
    console.log("Search Settings:", selectedMovie);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedMovie: selectedMovie,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Found Trailer ", body);
    return body;
  };

  React.useEffect(() => {
    if (selectedMovie.trim().length === 0) {
      console.log("no movie selected");
    } else {
      handleFindTrailer();
    }
  }, [selectedMovie]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <NavBar />
      <Typography variant="h4" align="center" gutterBottom>
        Your Reccomdations
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        This page is dedicated to help you find new movies! Select a movie from the dropdown below to watch a trailer for a movie we think you will love!
      </Typography>
      <Grid container spacing={2} justify="center" alignItems="flex-start">
        <Grid item xs={12} md={6} sx={{ order: 2 }}>
          {selectedTrailer && (
            <Paper elevation={1} sx={{ padding: 2, marginLeft: "10px", border: "2px solid #333", borderRadius: "8px", boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)" }}>
              <iframe width="560" height="315" src={selectedTrailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={6} sx={{ position: "relative", zIndex: 1, order: 1 }}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <SelectTrailer selectedMovie={selectedMovie} changeMovie={changeMovie} />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MyPage;
