import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const SkillDistributionChart = ({ data, type = 'pie', title }) => {
  const COLORS = [
    'hsl(40 100% 65%)',   // Beginner - Yellow
    'hsl(45 93% 58%)',    // Intermediate - Orange  
    'hsl(120 61% 50%)',   // Advanced - Green
    'hsl(262 47% 45%)'    // Expert - Purple
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            p: 2,
            border: '1px solid hsl(262 20% 91%)',
            borderRadius: 2,
            boxShadow: '0 4px 20px -4px hsl(262 47% 45% / 0.15)'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {type === 'pie' ? payload[0].name : label}
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            Count: {payload[0].value}
          </Typography>
          {type === 'pie' && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
        border: '1px solid hsl(262 20% 91%)',
        borderRadius: 3
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 3,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'pie' ? (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(262 20% 91%)" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(262 47% 25%)"
                  fontSize={12}
                />
                <YAxis stroke="hsl(262 47% 25%)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="hsl(262 47% 45%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillDistributionChart;