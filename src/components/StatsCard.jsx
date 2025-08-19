import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

const StatsCard = ({ title, value, icon, color = "primary", trend = null }) => {
  return (
    <Card
      sx={{
        height: 140,
        minWidth: { xs: 180, sm: 220, md: 260 },
        maxWidth: { xs: 220, sm: 260, md: 320 },
        background:
          "linear-gradient(135deg, hsl(262 47% 35% / 0.08), hsl(262 47% 45% / 0.15))",
        borderRadius: 3,
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 32px -10px hsl(262 47% 35% / 0.3)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                mb: trend ? 1 : 0,
              }}
            >
              {value}
            </Typography>
            {/* Percentage trend removed as requested */}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
