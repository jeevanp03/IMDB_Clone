import React from "react";
import NavBar from "../Navigation/NavBar";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Search = () => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [numSearchBars, setNumSearchBars] = React.useState(1);
  const [searchSettings, setSearchSettings] = React.useState([
    {
      byMovieName: false,
      byActorName: false,
      byDirectorName: false,
      searchTerm: " ",
    },
  ]);

  const [isValidDropDown, setValidDropDown] = React.useState([]);

  const [searchTerms, setSearchTerms] = React.useState([]);
  const [capturedSettings, setCapturedSettings] = React.useState([]);

  const [searchedMovies, setSearchedMovies] = React.useState([]);

  const serverURL = "";
  const handleMovieSearch = () => {
    callApiSearchMovie()
      .then(res => {
        console.log("callApiSearchMovie returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiSearchMovie parsed: ", parsed[0])
        setSearchedMovies(parsed);
      });
  }

  const callApiSearchMovie = async () => {

    const url = serverURL + "/api/searchMovie";
    console.log(url);
    console.log("Search Settings:", searchSettings);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchSettings: searchSettings
      })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Found movies ", body);
    return body;
  }


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

  React.useEffect(() => {
    for (let i = 0; i < searchSettings.length; i++) {
      var searchTerm = searchTerms[i];
      var capturedSetting = capturedSettings[i];
      handleInputSearchSettings(searchTerm, capturedSetting, i);
    }
  }, [searchTerms, capturedSettings, searchSettings.length]);

  const addSearchSetting = () => {
    setSearchSettings((prevSettings) => [
      ...prevSettings,
      {
        byMovieName: false,
        byActorName: false,
        byDirectorName: false,
        searchTerm: "",
      },
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

  const removeValidation = (index) => {
    setValidDropDown((prevValids) => {
      const updatedValid = prevValids.filter((_, i) => i !== index);
      return updatedValid.map((setting, i) => ({
        ...setting,
      }));
    });
  };


  const handleRemoveSearchBar = (index) => {
    if (numSearchBars > 1) {
      setNumSearchBars((prevNum) => prevNum - 1);
      removeSearchSetting(index);
      removeValidation(index)
    }
  };

  const handleSearch = () => {
    if (searchSettings.length === 1) {
      console.log("length is 1");
      const { byMovieName, byActorName, byDirectorName, searchTerm } =
        searchSettings[0];
      const selection = [byMovieName, byActorName, byDirectorName];
      if (
        !byMovieName &&
        !byActorName &&
        !byDirectorName &&
        searchTerm.trim().length === 0
      ) {
        setValidDropDown((prevValid) => {
          const updatedValid = [...prevValid];
          updatedValid[0] = true;
          console.log("updated validation:", updatedValid);
          console.log("searching for all movies");
          return updatedValid;
        });
      } else if (selection.includes(true, 0) && searchTerm.trim().length > 0) {
        console.log("typed search", searchTerm);
        setValidDropDown((prevValid) => {
          const updatedValid = [...prevValid];
          updatedValid[0] = true;
          console.log("updated validation:", updatedValid);
          return updatedValid;
        });
      } else if (
        selection.includes(true, 0) &&
        searchTerm.trim().length === 0
      ) {
        setValidDropDown((prevValid) => {
          const updatedValid = [...prevValid];
          updatedValid[0] = true;
          console.log("updated validation:", updatedValid);
          console.log("searching for all movies");
          return updatedValid;
        });
      } else {
        console.log("not valid");
        setValidDropDown((prevValid) => {
          const updatedValid = [...prevValid];
          updatedValid[0] = false;
          console.log("updated validation:", updatedValid);
          return updatedValid;
        });
      }
    } else {
      searchSettings.map((obj, index) => {
        var selections = [obj.byMovieName, obj.byActorName, obj.byDirectorName];
        console.log("typed search", obj.searchTerm);

        setValidDropDown((prevValid) => {
          const updatedValid = [...prevValid];
          updatedValid[index] = selections.includes(true, 0);
          console.log("updated validation:", updatedValid);
          return updatedValid;
        });
      });
    }
  };

  React.useEffect(() => {
    if (isValidDropDown.includes(false, 0)) {
      console.log("invalid search");
    } else {
      console.log("searching for movies");
      handleMovieSearch()
    }
  }, [isValidDropDown]);

  const searchBars = searchSettings.map((setting, index) => (
    <SearchBar
      key={index}
      index={index}
      setSearchTerms={setSearchTerms}
      setCapturedSettings={setCapturedSettings}
      searchSettings={searchSettings}
      isValid={isValidDropDown[index]}
      onRemove={() => handleRemoveSearchBar(index)}
    />
  ));

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container spacing={2} justify="center" alignItems="center">
        <NavBar />
        <Grid item xs={12} md={12} sx={{ margin: "12px" }}>
          <Typography variant="body1" align="center" gutterBottom>
            This page is dedicated to help you find any movie in our IMDBJ database. You are able to filter by movie name, director name, actor name or a combination of the three!
          </Typography>
        </Grid>
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Paper elevation={1} sx={{ padding: 2 }}>
            {showSearch && (
              <>
                {searchBars}
                <Grid container justifyContent="space-between" alignItems="center">
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
                </Grid>
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
        <Grid
          item
          xs={20}
          md={12}
          sx={{ marginLeft: "6px", marginRight: "6px" }}
        >
          <Paper elevation={1} sx={{ padding: 2 }}>
            <DataTable searchedMovies={searchedMovies} />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Search;
