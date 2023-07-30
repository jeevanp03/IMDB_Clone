import * as React from "react";
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";


const ReviewBody = ({
  handleEnteredReview,
  enteredReview,
  validReview,
  noErrors,
}) => {
  //states declarations
  //constants and functions declarations

  const CHARACTER_LIMIT = 200;

  return (
    <>
      <FormControl sx={{ width: "100%"}}>
        <TextField
          fullWidth
          id="outlined-multiline-static"
          label="Enter Review: "
          multiline
          rows={5}
          onChange={handleEnteredReview}
          value={enteredReview}
          inputProps={{
            maxLength: CHARACTER_LIMIT,
          }}
        />
        {validReview === false && (
          <Typography variant="caption" color="error">
            Enter your review
          </Typography>
        )}
        {validReview === true && noErrors === true && (
          <Typography variant="caption" color="success">
            Your review has been received
          </Typography>
        )}
      </FormControl>
    </>
  );
};

export default ReviewBody;

