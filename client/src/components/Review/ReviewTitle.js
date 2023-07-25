import * as React from "react";
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

const ReviewTitle = ({
  handleEnteredTitle,
  enteredTitle,
  validTitle,
  noErrors,
}) => {
  //states declarations
  //constants and functions declarations
  const CHARACTER_LIMIT = 60;

  return (
    <>
      <FormControl sx={{ width: "100%"}}>
        <TextField
          id="outlined-basic"
          label="Enter Title: "
          variant="outlined"
          onChange={handleEnteredTitle}
          value={enteredTitle}
          inputProps={{
            maxLength: CHARACTER_LIMIT,
          }}
        />
        {validTitle === false && (
          <Typography variant="caption" color="error">
            Enter your review title
          </Typography>
        )}
        {validTitle === true && noErrors === true && (
          <Typography variant="caption" color="success">
            Your review has been received
          </Typography>
        )}
      </FormControl>
    </>
  );
};

export default ReviewTitle;
