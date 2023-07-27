import React, { useState } from "react";
import NavBar from "../Navigation/NavBar";
import SelectTrailer from "./SelectTrailer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

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
      <Grid container spacing={2} justify="center" alignItems="center">
        <NavBar />
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <SelectTrailer selectedMovie={selectedMovie} changeMovie={changeMovie} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ padding: 2, marginLeft: "10px", border: "2px solid #333", borderRadius: "8px", boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)" }}>
            {selectedTrailer && (
              <iframe
                src={selectedTrailer}
                title="Selected Trailer"
                width="100%"
                height="400"
                allowFullScreen
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MyPage;

