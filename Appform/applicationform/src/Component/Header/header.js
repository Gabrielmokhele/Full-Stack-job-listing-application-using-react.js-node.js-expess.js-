
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from '@mui/icons-material/Person';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LanguageIcon from "@mui/icons-material/Language";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CreateIcon from "@mui/icons-material/Create";
import Divider from "@mui/material/Divider";
import { useHeaderContext } from "./headerContext";
import { useNavigate } from "react-router-dom";
import withAuth from "../../hooks/useAuth";
import { useContext } from "react";
import { multiStepContext } from "../../StepContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


const drawerWidth = 240;

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
  justifyContent: "flex-end",
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

function Header() {
  const theme = useTheme();
  const { open, handleDrawerOpen, handleDrawerClose } = useHeaderContext();
  const navigate = useNavigate();
  const { userId, loginEmail, registerEmail } = useContext(multiStepContext);

  const fetchUserData = async (userId) => {
    const response = await axios.get(`http://localhost:5001/users/${userId}`);
    return response?.data;
  };

  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId),
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });

  const user_Type = data?.data?.user?.userType
  console.log(user_Type)

  const file_Data = data?.data?.files

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open} sx={{
        background: "linear-gradient(135deg, #6a82fb, #fc5c7d)",
      }}
      >
        <Toolbar>
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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Candidate Profile
          </Typography>

          <Typography variant="h6" noWrap component="div" sx={{ mr: 2 }}>
            Logged in as {loginEmail || registerEmail}
          </Typography>

          <IconButton
            onClick={() => navigate(`/`)}
            color="inherit"
            aria-label="logout"

          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          <ListItemButton disabled={!(Array.isArray(file_Data) && file_Data.length > 0)
          
          }>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary="Corporate Website" />
          </ListItemButton>

          <ListItemButton
            disabled={!(Array.isArray(file_Data) && file_Data.length > 0)}
            onClick={() => navigate(`/Candidate/${userId}`)}
          >
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Candidate Home" />
          </ListItemButton>

          <ListItemButton
            disabled={!(Array.isArray(file_Data) && file_Data.length > 0)}
            onClick={() => navigate(`/jobSearch/${userId}`)}
          >
            <ListItemIcon>
              <ManageSearchIcon />
            </ListItemIcon>
            <ListItemText primary="Job Search" />
          </ListItemButton>

          <ListItemButton
            disabled={!(Array.isArray(file_Data) && file_Data.length > 0)}
            onClick={() => navigate(`/profile/${userId}`)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigate(`/`)}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="LogOut" />
          </ListItemButton>
          <Divider sx={{ my: 2 }} />

          <ListItemButton >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>

          <ListItemButton 
          onClick={() => navigate(`/createjob/${userId}`)}
          >
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="Create" />
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
}

export default withAuth(Header);
