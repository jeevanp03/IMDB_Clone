import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const navItems = [
    {
      id: "1",
      page: "Landing",
      path: "/",
    },
    {
      id: "2",
      page: "Review",
      path: "/Review",
    },
    {
      id: "3",
      page: "Search",
      path: "/Search",
    },
    {
      id: "4",
      page: "Reccomendations",
      path: "/Reccomendation",
    },
  ];
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar
          sx={{
            position: "relative",
            boxShadow: "none",
            backgroundColor:
              "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Toolbar sx={{ maxHeight: 25 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              IMDBJ
            </Typography>
            {navItems.map((nav) => (
              <Button
                key={nav.id}
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  borderRadius: 15,
                }}
                onClick={() => navigate(nav.path)}
              >
                {nav.page}
              </Button>
            ))}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  );
}

export default Navbar;
