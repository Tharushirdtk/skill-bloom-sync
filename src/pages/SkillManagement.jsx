import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete as DeleteIcon,
  TrendingUp,
  People,
  ViewModule,
  TableRows,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { Formik, Form } from "formik";
import { skillValidationSchema } from "../shared/validation/employeeValidation";
import useFetch from "../hooks/UseFetch";
import { skillsAPI } from "../apis/userApi";
import { useUser } from "../context/UserContext";

const SkillManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useUser();
  const companyId = user?.companyId ?? null;

  const {
    data: skills,
    loading: skillsLoading,
    error: skillsError,
    refetch: refetchSkills,
  } = useFetch(() => skillsAPI.getAll(companyId), [companyId]);

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Programming",
    "Cloud",
    "DevOps",
    "Design",
    "Database",
  ];

  const filteredSkills = useMemo(() => {
    if (skillsLoading || !Array.isArray(skills)) return [];
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (skill.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "All" ||
        skill.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchTerm, categoryFilter, skillsLoading]);

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setIsFormOpen(true);
  };

  const handleEditSkill = (skill) => {
    setSelectedSkill(skill);
    setIsFormOpen(true);
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await skillsAPI.delete(id);
      refetchSkills();
    }
  };

  const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
    setFormLoading(true);
    try {
      if (selectedSkill) {
        await skillsAPI.update(selectedSkill.id, values);
        setSnackbar({
          open: true,
          message: "Skill updated!",
          severity: "success",
        });
      } else {
        await skillsAPI.create(values);
        setSnackbar({
          open: true,
          message: "Skill created!",
          severity: "success",
        });
      }
      refetchSkills();
      setIsFormOpen(false);
      setSelectedSkill(null);
      resetForm();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Something went wrong.",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const SkillForm = () => (
    <Dialog
      open={isFormOpen}
      onClose={() => {
        setIsFormOpen(false);
        setSelectedSkill(null);
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {selectedSkill ? "Edit Skill" : "Add New Skill"}
      </DialogTitle>
      <Formik
        key={selectedSkill ? selectedSkill.id : "new"}
        enableReinitialize
        initialValues={{
          name: selectedSkill?.name || "",
          category: selectedSkill?.category || "",
          description: selectedSkill?.description || "",
        }}
        validationSchema={skillValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Skill Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    style={{ width: "200px" }}
                    error={touched.category && Boolean(errors.category)}
                  >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Category"
                    >
                      {categories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                    </Select>
                    {touched.category && errors.category && (
                      <Typography variant="caption" color="error">
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedSkill(null);
                }}
                color="inherit"
                disabled={formLoading || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formLoading || isSubmitting}
              >
                {selectedSkill ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );

  if (skillsLoading)
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );

  if (skillsError)
    return (
      <Layout>
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography color="error">Error: {skillsError}</Typography>
        </Box>
      </Layout>
    );

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4">Skill Management</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
            >
              <ToggleButton value="table">
                <TableRows />
              </ToggleButton>
              <ToggleButton value="cards">
                <ViewModule />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={handleAddSkill}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Add Skill
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl style={{ width: "200px" }}>
              <InputLabel id="filter-label">Filter by Category</InputLabel>
              <Select
                labelId="filter-label"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* View modes */}
        {viewMode === "cards" ? (
          <Grid container spacing={3}>
            {filteredSkills.map((skill) => (
              <Grid item xs={12} md={6} lg={4} key={skill.id}>
                <Card
                  sx={{
                    "&:hover": { boxShadow: 3 },
                    display: "flex",
                    flexDirection: "column",
                    height: 220,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">{skill.name}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          {skill.category}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    </Box>
                    {skill.trending && (
                      <Chip
                        icon={<TrendingUp />}
                        label="Trending"
                        sx={{ mb: 1 }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {skill.description}
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <People fontSize="small" />
                        <Typography ml={0.5}>{skill.employeeCount}</Typography>
                      </Box>
                      {skill.avgProficiency && (
                        <Chip label={skill.avgProficiency} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Name",
                    "Category",
                    "Description",
                    "Employees",
                    "Actions",
                  ].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: "bold" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>{skill.category}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {skill.description}
                    </TableCell>
                    <TableCell>{skill.employeeCount}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSkill(skill)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredSkills.length === 0 && (
          <Typography align="center" sx={{ mt: 4 }}>
            No skills found
          </Typography>
        )}

        <SkillForm />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default SkillManagement;
