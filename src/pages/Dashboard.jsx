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
  // Use company-assigned skills for dashboard card and chart
  const { data: companySkills } = useFetch(
    () => skillsAPI.getCompanyAssigned(companyId),
    [companyId]
  );

  // Certificates count for dashboard card
  const { data: certificateCount } = useFetch(
    () => employeeAPI.getCertificateCount(companyId),
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

  // Prepare chart data: group by category, sum employeeCount per category
  const categoryChartData = React.useMemo(() => {
    if (!companySkills || !Array.isArray(companySkills)) return [];
    const categoryMap = {};
    companySkills.forEach((skill) => {
      if (!skill.category) return;
      if (!categoryMap[skill.category]) {
        categoryMap[skill.category] = 0;
      }
      categoryMap[skill.category] += skill.employeeCount || 0;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [companySkills]);

  // Prepare horizontal bar chart data: skill name vs employeeCount
  const skillNameChartData = React.useMemo(() => {
    if (!companySkills || !Array.isArray(companySkills)) return [];
    return companySkills.map((skill) => ({
      name: skill.name,
      value: skill.employeeCount || 0,
    }));
  }, [companySkills]);

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
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
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
            alignItems="stretch"
          >
            <StatsCard
              title="Total Employees"
              value={employees?.length || 0}
              icon={<People />}
              color="primary"
              trend={null}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
            alignItems="stretch"
          >
            <StatsCard
              title="Total Skills"
              value={companySkills?.length || 0}
              icon={<Build />}
              color="secondary"
              trend={null}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
            alignItems="stretch"
          >
            <StatsCard
              title="Total Certificates"
              value={certificateCount?.count || 0}
              icon={<School />}
              color="info"
              trend={null}
            />
          </Grid>
        </Grid>

        {/* Charts side by side with more space between */}
        <Grid
          container
          spacing={8}
          sx={{ mb: 4 }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={6}>
            <SkillDistributionChart
              data={categoryChartData}
              type="pie"
              title="Employee Count by Skill Category"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SkillDistributionChart
              data={skillNameChartData}
              type="horizontalBar"
              title="Employee Count by Skill Name"
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
