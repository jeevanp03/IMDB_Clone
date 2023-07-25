import * as React from "react";
import ReviewTitle from "./ReviewTitle";
import ReviewBody from "./ReviewBody";
import ReviewRating from "./ReviewRating";
import MovieSelection from "./MovieSelection";
import NavBar from "../Navigation/NavBar";
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Review = () => {
  //states declarations
  const [movies, setMovies] = React.useState([]);
  const [selectedMovie, setSelectedMovie] = React.useState("");
  const [enteredTitle, setEnteredTitle] = React.useState("");
  const [enteredReview, setEnteredReview] = React.useState("");
  const [selectedRating, setSelectedRating] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState({});
  const [displayUserEntries, setDisplayUserEntries] = React.useState({});
  const [userID, setUserID] = React.useState(1);

  const serverURL = "";

  const getMovies = () => {
    callApiLoadMovies().then((res) => {
      console.log("callApiFindMovie returned: ", res);
      var parsed = JSON.parse(res.express);
      console.log("callApiFindMovie parsed: ", parsed);
      setMovies(parsed);
    });
  };

  const callApiLoadMovies = async () => {
    const url = serverURL + "/api/getMovies";
    console.log(url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("User settings: ", body);
    return body;
  };

  React.useEffect(() => {
    getMovies();
  }, []);

  const addReview = () => {
    callApiSendReview().then((res) => {
      //var parsed = JSON.parse(res.express)
    });
  };

  const callApiSendReview = async () => {
    const url = serverURL + "/api/sendReview";
    console.log(url);

    const movieID = getMovieId(selectedMovie);

    const requestBody = {
      // Include the properties and values of the request body here
      reviewTitle: enteredTitle,
      reviewContent: enteredReview,
      reviewScore: selectedRating,
      userID: userID,
      movieID: movieID,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseBody = await response.json();

      if (response.status !== 200) {
        throw new Error(responseBody.message);
      }

      console.log("Review sent: ", responseBody);
      return responseBody;
    } catch (error) {
      console.error(error);
    }
  };

  const getMovieId = (selectedMovie) => {
    for (let movie in movies) {
      if (movies[movie].name === selectedMovie) {
        return movies[movie].id;
      }
    }
  };

  const handleSelectedMovie = (event) => {
    setSelectedMovie(event.target.value);
    setEnteredTitle("");
    setEnteredReview("");
    setSelectedRating("");
    setValidationErrors({});
    setDisplayUserEntries({});
  };
  const handleEnteredTitle = (event) => {
    setEnteredTitle(event.target.value);
  };
  const handleEnteredReview = (event) => {
    setEnteredReview(event.target.value);
  };
  const handleSelectedRating = (event) => {
    setSelectedRating(event.target.value);
  };

  const validSelectedMovie = (movie) => {
    return movie.trim().length > 0;
  };

  const validEnteredTitle = (title) => {
    return title.trim().length > 0;
  };

  const validEnteredReview = (review) => {
    return review.trim().length > 0;
  };

  const validSelectedRating = (rating) => {
    return rating.trim().length > 0;
  };

  const checkForErrors = (movie, title, review, rating) => {
    const validation = {
      validMovie: validSelectedMovie(movie),
      validTitle: validEnteredTitle(title),
      validReview: validEnteredReview(review),
      validRating: validSelectedRating(rating),
    };

    const display = {
      displayMovie: movie,
      displayTitle: title,
      displayReview: review,
      displayRating: rating,
    };

    validation.noErrors = Object.values(validation).every(
      (value) => value === true
    );
    if (validation.noErrors === true) {
      setDisplayUserEntries(display);
      addReview();
    }
    setValidationErrors(validation);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container spacing={2} justify="center" alignItems="center">
        <NavBar />
        <Grid item xs={12}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: "rgba(128, 128, 128, 0.8)",
              textShadow: "0px 0px 8px rgba(128, 128, 128, 0.5)",
              paddingLeft: 2.5,
            }}
          >
            Review a Movie
          </Typography>
          <Typography
            variant="subtitle2"
            component="subtitle3"
            gutterBottom
            sx={{
              color: "rgba(128, 128, 128, 0.8)",
              textShadow: "0px 0px 8px rgba(128, 128, 128, 0.5)",
              paddingLeft: 2.5,
            }}
          >
            Use this page to review any movie from the list!
          </Typography>
        </Grid>
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Paper elevation={1} sx={{ padding: 2 }}>
            <MovieSelection
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
              selectedMovie={selectedMovie}
              validMovie={validationErrors.validMovie}
              noErrors={validationErrors.noErrors}
            />
          </Paper>
        </Grid>
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Paper elevation={1} sx={{ padding: 2 }}>
            <ReviewTitle
              handleEnteredTitle={handleEnteredTitle}
              enteredTitle={enteredTitle}
              validTitle={validationErrors.validTitle}
              noErrors={validationErrors.noErrors}
            />
          </Paper>
        </Grid>
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Paper elevation={1} sx={{ padding: 2 }}>
            <ReviewRating
              handleSelectedRating={handleSelectedRating}
              selectedRating={selectedRating}
              validRating={validationErrors.validRating}
              noErrors={validationErrors.noErrors}
            />
          </Paper>
        </Grid>
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Paper elevation={1} sx={{ padding: 2 }}>
            <ReviewBody
              handleEnteredReview={handleEnteredReview}
              enteredReview={enteredReview}
              validReview={validationErrors.validReview}
              noErrors={validationErrors.noErrors}
            />
          </Paper>
        </Grid>
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Button
            onClick={() =>
              checkForErrors(
                selectedMovie,
                enteredTitle,
                enteredReview,
                selectedRating
              )
            }
            variant="contained"
            sx={{
              backgroundColor: "#555",
              "&:hover": {
                backgroundColor: "#777",
              },
              color: "white",
              boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .5)", 
              border: "1px solid #444",
            }}
          >
            Submit
          </Button>
        </Grid>
        {validationErrors.noErrors === true && (
          <Grid
            container
            spacing={1}
            direction="column"
            justifyContent="center" 
            sx={{
              width: "100%",
              marginLeft: "16px",
              marginRight: "16px",
              marginTop: "16px",
            }}
          >
            <Paper elevation={3} sx={{ padding: 2, border: "1px solid #444" }}>
              <Box
                sx={{
                  boxShadow: "inset 0 0 10px #000000",
                  padding: 2,
                  backgroundColor: "#333",
                }}
              >
                <Grid item xs={12}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {displayUserEntries.displayTitle}
                  </Typography>
                </Grid>
                <Grid item xs={10} sx={{ marginTop: "2px" }}>
                  <Typography
                    variant="subtitle2"
                    component="subtitle1"
                    gutterBottom
                  >
                    A review for the movie: {displayUserEntries.displayMovie}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    component="subtitle2"
                    gutterBottom
                  >
                    User movie rating: {displayUserEntries.displayRating}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" component="body1" gutterBottom>
                    {displayUserEntries.displayReview}
                  </Typography>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default Review;
