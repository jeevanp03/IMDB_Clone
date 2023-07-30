import * as React from "react";
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";

const ReviewRating = ({
  handleSelectedRating,
  selectedRating,
  validRating,
  noErrors,
}) => {
  return (
    <>
      <FormControl component="fieldset" sx={{ width: "100%"}}>
        <FormLabel>Select a Movie Rating:</FormLabel>
        <RadioGroup
          row
          name="rating"
          value={selectedRating}
          onChange={handleSelectedRating}
        >
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="3" control={<Radio />} label="3" />
          <FormControlLabel value="4" control={<Radio />} label="4" />
          <FormControlLabel value="5" control={<Radio />} label="5" />
        </RadioGroup>
        {validRating === false && (
          <Typography variant="caption" color="error">
            Select the rating
          </Typography>
        )}
        {validRating === true && noErrors === true && (
          <Typography variant="caption" color="success">
            Your review has been received
          </Typography>
        )}
      </FormControl>
    </>
  );
};

export default ReviewRating;


