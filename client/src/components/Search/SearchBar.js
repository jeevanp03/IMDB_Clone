import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";

const SearchBar = ({ onRemove, index, setSearchTerms, setCapturedSettings, isValid }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchSetting, setSearchSetting] = React.useState("");

  const onChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const onChangeSearchSetting = (event) => {
    setSearchSetting(event.target.value);
    setSearchTerm("");
  };

  React.useEffect(() => {
    console.log("searchSetting:", searchSetting);
    setCapturedSettings((prevCaptured) => {
      const updatedCaptured = [...prevCaptured]
      updatedCaptured[index] = searchSetting
      console.log("updated settings: " + updatedCaptured)
      return updatedCaptured
    })
  }, [searchSetting]);
  
  React.useEffect(() => {
    console.log("searchTerm:", searchTerm);
    console.log("searchSetting:", searchSetting)
    
      setSearchTerms((prevSettings) => {
        const updatedTerms = [...prevSettings]
        updatedTerms[index] = searchTerm
        console.log("updated terms: " + updatedTerms)
        return updatedTerms
      })
    
    
  }, [searchTerm]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel htmlFor={`search-settings-${index}`}>Search Settings</InputLabel>
          <Select
            value={searchSetting}
            onChange={onChangeSearchSetting}
            label="Search Settings"
            inputProps={{
              id: `search-settings-${index}`,
            }}
          >
            <MenuItem value="Movie Title">Movie Title</MenuItem>
            <MenuItem value="Actor Name">Actor Name</MenuItem>
            <MenuItem value="Director Name">Director Name</MenuItem>
          </Select>
          {isValid === false && (
            <Typography variant="caption" color="error">
              Select Valid Option From DropDown
            </Typography>
          )}
          {/*{isValid === true && isValidSB === true && (
            <Typography variant="caption" color="success">
              DropDown Selection is Valid
            </Typography>
          )}*/}
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            id={`search-${index}`}
            label="Search for a movie: "
            value={searchTerm}
            onChange={onChangeSearchTerm}
            variant="standard"
            autoComplete="off"
            color="secondary"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onRemove}>
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
