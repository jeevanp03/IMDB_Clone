import * as React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import { FormControl } from "@mui/material";

const MovieSelection = ({
  movies,
  selectedMovie,
  handleSelectedMovie,
  validMovie,
  noErrors,
}) => {
  return (
    <>
      <FormControl sx={{ width: "100%"}} >
        <InputLabel id="demo-customized-select-label">
          Select a Movie:
        </InputLabel>
        <Select
          label="Select a Movie: "
          onChange={handleSelectedMovie}
          value={selectedMovie}
        >
          {movies.map((movie) => (
            <MenuItem key={movie.id} value={movie.name}>
              {movie.name}
            </MenuItem>
          ))}
        </Select>
        {validMovie === false && (
          <Typography variant="caption" color="error">
            Select your movie
          </Typography>
        )}
        {validMovie === true && noErrors === true && (
          <Typography variant="caption" color="success">
            Your review has been received
          </Typography>
        )}
      </FormControl>
    </>
  );
};

export default MovieSelection;


