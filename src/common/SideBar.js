import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar({ listItems }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        open={open}
        sx={{ position: "relative", backgroundColor: "white", width: "64px" }}
      >
        <Toolbar
          sx={{
            backgroundColor: "white",
            width: "64px",
            ...(open && { display: "none" }),
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon
              sx={{
                "& path": {
                  fill: "rgb(59, 72, 158)",
                },
              }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            backgroundColor: open ? "#F4DDD6" : "white",
            WebkitJustifyContent: "flex-start",
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <MenuIcon
                sx={{
                  "& path": {
                    fill: "rgb(59, 72, 158)",
                  },
                }}
              />
            ) : (
              <MenuIcon
                sx={{
                  "& path": {
                    fill: "rgb(59, 72, 158)",
                  },
                }}
              />
            )}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ marginLeft: "1.3rem", fontFamily: "Times New Roman" }}
            onClick={handleDrawerClose}
          >
            MENU
          </Typography>
        </DrawerHeader>
        <List sx={{ paddingTop: "0px" }}>
          <Divider />
          {listItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "block",
              }}
            >
              <ListItemButton
                // component={Link}
                sx={{
                  minHeight: 48,
                  // justifyContent: "initial",
                  px: 2.5,
                  "&:focus": {
                    background: open
                      ? "linear-gradient(to right, #F05A28 0%, #F05A28 30%, #F4DDD6 30%, #F4DDD6 100%)"
                      : "#F05A28",
                  },
                }}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                    "& path": {
                      fill: "rgb(59, 72, 158)",
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <div>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: 1,
                      width: "131px",
                      color: "black",
                      fontFamily: "Open Sans",
                      whiteSpace: "normal",
                      textOverflow: "ellipsis"
                    }}
                  />
                  <div>
                    {focusedIndex === index &&
                      item.child &&
                      open &&
                      item.child.map((c, childIndex) => (
                        <div style={{ display: "flex" }}>
                          <ArrowRightIcon sx={{ color: "#F05A28" }} />
                          <a
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            style={{ color: "black", fontFamily: "Open Sans" }}
                          >
                            {c.title}
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              </ListItemButton>
              <Divider />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
