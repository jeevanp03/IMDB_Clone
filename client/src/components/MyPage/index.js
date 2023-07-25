import * as React from "react";
import NavBar from "../Navigation/NavBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const MyPage = () => {
    return (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Grid container spacing={2} justify="center" alignItems="center">
            <NavBar />
          </Grid>
        </ThemeProvider>
      );
}

export default MyPage;