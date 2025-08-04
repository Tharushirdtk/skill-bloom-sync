import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material';
import {
  People,
  Build,
  TrendingUp,
  School
} from '@mui/icons-material';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import SkillDistributionChart from '../components/SkillDistributionChart';
import useFetch from '../hooks/UseFetch';
import { employeeAPI, skillsAPI } from '../apis/userApi';

const Dashboard = () => {
  const { data: employees, loading: employeesLoading } = useFetch(employeeAPI.getAll);
  const { data: skills, loading: skillsLoading } = useFetch(skillsAPI.getAll);

  // Mock data for demonstration - replace with real API data
  const mockSkillDistribution = [
    { name: 'Beginner', value: 15 },
    { name: 'Intermediate', value: 25 },
    { name: 'Advanced', value: 30 },
    { name: 'Expert', value: 10 }
  ];

  const mockDepartmentSkills = [
    { name: 'Engineering', value: 45 },
    { name: 'Marketing', value: 20 },
    { name: 'Sales', value: 15 },
    { name: 'Design', value: 12 },
    { name: 'HR', value: 8 }
  ];

  const mockRecentActivities = [
    { id: 1, employee: 'John Doe', action: 'Added React skill', level: 'Advanced', time: '2 hours ago' },
    { id: 2, employee: 'Jane Smith', action: 'Updated Python certification', level: 'Expert', time: '4 hours ago' },
    { id: 3, employee: 'Mike Johnson', action: 'Added SQL skill', level: 'Intermediate', time: '1 day ago' },
    { id: 4, employee: 'Sarah Wilson', action: 'Updated AWS certification', level: 'Advanced', time: '2 days ago' }
  ];

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return { backgroundColor: 'hsl(40 100% 65%)', color: 'white' };
      case 'intermediate':
        return { backgroundColor: 'hsl(45 93% 58%)', color: 'white' };
      case 'advanced':
        return { backgroundColor: 'hsl(120 61% 50%)', color: 'white' };
      case 'expert':
        return { backgroundColor: 'hsl(262 47% 45%)', color: 'white' };
      default:
        return { backgroundColor: 'hsl(262 47% 45%)', color: 'white' };
    }
  };

  return (
    <Layout>
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1
          }}
        >
          Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Overview of your organization's skill landscape
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Employees"
              value={employees?.length || 150}
              icon={<People />}
              color="primary"
              trend={{ value: 12, positive: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Skills"
              value={skills?.length || 85}
              icon={<Build />}
              color="secondary"
              trend={{ value: 8, positive: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Skill Growth"
              value="23%"
              icon={<TrendingUp />}
              color="success"
              trend={{ value: 5, positive: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Certifications"
              value="142"
              icon={<School />}
              color="info"
              trend={{ value: 15, positive: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <SkillDistributionChart
              data={mockSkillDistribution}
              title="Skill Proficiency Distribution"
              type="pie"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SkillDistributionChart
              data={mockDepartmentSkills}
              title="Skills by Department"
              type="bar"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card 
              sx={{ 
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
                    mb: 3
                  }}
                >
                  Recent Skill Activities
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Employee
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Action
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Level
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Time
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockRecentActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {activity.employee}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {activity.action}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={activity.level}
                              size="small"
                              sx={getLevelColor(activity.level)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
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
                    mb: 3
                  }}
                >
                  Top Skills in Demand
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { skill: 'React', count: 45, growth: '+12%' },
                    { skill: 'Python', count: 38, growth: '+8%' },
                    { skill: 'AWS', count: 32, growth: '+15%' },
                    { skill: 'TypeScript', count: 28, growth: '+20%' },
                    { skill: 'Docker', count: 25, growth: '+10%' }
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: 'hsl(262 15% 98%)',
                        borderRadius: 2,
                        border: '1px solid hsl(262 20% 91%)'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {item.skill}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.count} employees
                        </Typography>
                      </Box>
                      <Chip
                        label={item.growth}
                        size="small"
                        sx={{
                          backgroundColor: 'success.light',
                          color: 'success.dark'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;