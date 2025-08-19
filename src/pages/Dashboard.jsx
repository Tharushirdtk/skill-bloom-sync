import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { People, Build, TrendingUp, School } from "@mui/icons-material";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import SkillDistributionChart from "../components/SkillDistributionChart";
import useFetch from "../hooks/UseFetch";
import { employeeAPI, skillsAPI, dashboardAPI } from "../apis/userApi";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const { user } = useUser();
  const companyId = user?.companyId ?? null;

  const { data: employees } = useFetch(
    () => employeeAPI.getAll(companyId),
    [companyId]
  );
  // Use company-assigned skills for dashboard card
  const { data: companySkills } = useFetch(
    () => skillsAPI.getCompanyAssigned(companyId),
    [companyId]
  );

  const { data: skillDistribution } = useFetch(
    dashboardAPI.getSkillDistribution
  );
  const { data: departmentSkills } = useFetch(
    dashboardAPI.getSkillsByDepartment
  );
  const { data: recentActivities } = useFetch(dashboardAPI.getRecentActivities);
  const { data: topSkills } = useFetch(dashboardAPI.getTopSkills);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return { backgroundColor: "hsl(40 100% 65%)", color: "white" };
      case "intermediate":
        return { backgroundColor: "hsl(45 93% 58%)", color: "white" };
      case "advanced":
        return { backgroundColor: "hsl(120 61% 50%)", color: "white" };
      case "expert":
        return { backgroundColor: "hsl(262 47% 45%)", color: "white" };
      default:
        return { backgroundColor: "hsl(262 47% 45%)", color: "white" };
    }
  };

  // Transform skillDistribution into { name, value } format for charts
  const skillDistributionData = skillDistribution
    ? Array.isArray(skillDistribution)
      ? skillDistribution.map((d) => ({
          name: d.level || d.name,
          value: d.count || d.value,
        }))
      : Object.entries(skillDistribution).map(([key, val]) => ({
          name: key,
          value: val,
        }))
    : [];

  // Transform departmentSkills into { name, value } format
  const departmentSkillsData = departmentSkills
    ? Array.isArray(departmentSkills)
      ? departmentSkills.map((d) => ({
          name: d.department || d.name,
          value: d.count || d.value,
        }))
      : Object.entries(departmentSkills).map(([key, val]) => ({
          name: key,
          value: val,
        }))
    : [];

  return (
    <Layout>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Overview of your organization's skill landscape
        </Typography>
        {/* Stats Cards */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: 4 }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Employees"
              value={employees?.length || 0}
              icon={<People />}
              color="primary"
              trend={{ value: 12, positive: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Skills"
              value={companySkills?.length || 0}
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
        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%" }}>
              <SkillDistributionChart
                data={skillDistributionData}
                title="Skill Proficiency Distribution"
                type="pie"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%" }}>
              <SkillDistributionChart
                data={departmentSkillsData}
                title="Skills by Department"
                type="bar"
              />
            </Box>
          </Grid>
        </Grid>
        Recent Activities
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))",
                border: "1px solid hsl(262 20% 91%)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
                >
                  Recent Skill Activities
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          Employee
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          Action
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          Level
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          Time
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActivities?.map((activity, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{activity.employee}</TableCell>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>
                            <Chip
                              label={activity.level}
                              size="small"
                              sx={getLevelColor(activity.level)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(activity.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Skills */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))",
                border: "1px solid hsl(262 20% 91%)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
                >
                  Top Skills in Demand
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {topSkills?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        backgroundColor: "hsl(262 15% 98%)",
                        borderRadius: 2,
                        border: "1px solid hsl(262 20% 91%)",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.employees} employees
                        </Typography>
                      </Box>
                      <Chip
                        label={`+${item.growth || 0}%`}
                        size="small"
                        sx={{
                          backgroundColor: "success.light",
                          color: "success.dark",
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
