import React from "react";
import NavBar from "../Navigation/NavBar";
import SearchBar from "./SearchBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Search = () => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [numSearchBars, setNumSearchBars] = React.useState(1);
  const [searchSettings, setSearchSettings] = React.useState([
    { byMovieName: false, byActorName: false, byDirectorName: false, searchTerm: "" },
  ]);

  // const [isValidDropDown, setValidDropDown] = React.useState([]);
  // const [isValidSearchBar, setValidSearchBar] = React.useState(false);

  const [searchTerms, setSearchTerms] = React.useState([])
  const [capturedSettings, setCapturedSettings] = React.useState([])

  const handleInputSearchSettings = (searchTerm, searchSetting, index) => {
    setSearchSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = {
        byMovieName: searchSetting === "Movie Title",
        byActorName: searchSetting === "Actor Name",
        byDirectorName: searchSetting === "Director Name",
        searchTerm: searchTerm,
      };
      return updatedSettings;
    });
  };

  React.useEffect(()=>{

  }, [searchTerms, capturedSettings])

  const addSearchSetting = () => {
    setSearchSettings((prevSettings) => [
      ...prevSettings,
      { byMovieName: false, byActorName: false, byDirectorName: false, searchTerm: "" },
    ]);
  };

  React.useEffect(() => {
    console.log("searchSettings:", searchSettings);
  }, [searchSettings]);

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleAddSearchBar = () => {
    if (numSearchBars < 3) {
      setNumSearchBars((prevNum) => prevNum + 1);
      addSearchSetting();
    }
  };

  const removeSearchSetting = (index) => {
    setSearchSettings((prevSettings) => {
      const updatedSettings = prevSettings.filter((_, i) => i !== index);
      return updatedSettings.map((setting, i) => ({
        ...setting,
      }));
    });
  };

  const handleRemoveSearchBar = (index) => {
    if (numSearchBars > 1) {
      setNumSearchBars((prevNum) => prevNum - 1);
      removeSearchSetting(index);
    }
  };

  const handleSearch = () => {
    
  };

  const searchBars = searchSettings.map((setting, index) => (
    <SearchBar
      key={index}
      index={index}
      setSearchTerms = {setSearchTerms}
      setCapturedSettings = {setCapturedSettings}
      searchSettings={searchSettings}
      /*handleChange={(searchTerm, searchSetting) => handleInputSearchSettings(searchTerm, searchSetting, index)}*/
      onRemove={() => handleRemoveSearchBar(index)}
    />
  ));

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container spacing={2} justify="center" alignItems="center">
        <NavBar />
        <Grid item xs={20} md={12} sx={{ marginLeft: "6px", marginRight: "6px" }}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            {showSearch && (
              <>
                {searchBars}
                {numSearchBars < 3 && (
                  <Button
                    variant="contained"
                    onClick={handleAddSearchBar}
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
                    Add Search Criteria +
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleSearch}
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
                  Search All
                </Button>
              </>
            )}
          </Paper>
          <Paper elevation={1} sx={{ padding: 2 }}>
            {showSearch ? (
              <Button
                variant="contained"
                onClick={handleToggleSearch}
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
                Hide Settings
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleToggleSearch}
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
                Show Settings
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Search;
