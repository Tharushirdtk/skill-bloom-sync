import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Person, Logout, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleMenuClose();
  };


  return (
    
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background:
            "linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))",
          boxShadow: "0 4px 20px -4px hsl(262 47% 45% / 0.15)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {!isMobile && "SkillSmart"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content centered */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          backgroundColor: "hsl(262 15% 99%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 10px 30px -10px hsl(262 47% 45% / 0.2)",
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EmployeeLayout;
