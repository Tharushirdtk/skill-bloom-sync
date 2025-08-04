import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatsCard = ({ title, value, icon, color = 'primary', trend = null }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.03), hsl(262 47% 55% / 0.08))',
        border: '1px solid hsl(262 20% 91%)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.2)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                mb: 1 
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: trend ? 1 : 0
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: trend.positive ? 'success.main' : 'error.main',
                  fontWeight: 500
                }}
              >
                {trend.positive ? '+' : ''}{trend.value}% from last month
              </Typography>
            )}
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              width: 56,
              height: 56
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