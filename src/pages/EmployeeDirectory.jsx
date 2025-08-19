import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
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
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Search, Add, Email, TableRows, ViewModule } from "@mui/icons-material";
import Layout from "../components/Layout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useFetch from "../hooks/UseFetch";
import { employeeAPI } from "../apis/userApi";
import { useUser } from "../context/UserContext";

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useUser();
  const companyId = user?.companyId ?? null;

  const {
    data: employees,
    loading: empLoading,
    error: empError,
    refetch: refetchEmps,
  } = useFetch(() => employeeAPI.getAll(companyId), [companyId]);

  const roles = ["All", "admin", "employee"];

  const filtered = useMemo(() => {
    if (empLoading || !Array.isArray(employees)) return [];
    return employees.filter((e) => {
      const name = (e.name || "").toLowerCase();
      const email = (e.email || "").toLowerCase();
      const matchText =
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());
      const matchRole =
        !roleFilter || roleFilter === "All" || e.role === roleFilter;
      return matchText && matchRole;
    });
  }, [employees, empLoading, searchTerm, roleFilter]);

  const openAdd = () => {
    setSelectedEmp(null);
    setDialogOpen(true);
  };
  const openEdit = (e) => {
    setSelectedEmp(e);
    setDialogOpen(true);
  };
  const closeDiag = () => {
    setSelectedEmp(null);
    setDialogOpen(false);
  };

  // helper: format date for <input type="date"> (YYYY-MM-DD) and display
  const toInputDate = (d) => {
    if (!d) return "";
    // if it's already YYYY-MM-DD, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const displayDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  };

  const schema = (isEdit) => {
    const base = {
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      joinDate: Yup.date().required("Join date is required"),
      role: Yup.string()
        .oneOf(["admin", "employee"], "Role must be admin or employee")
        .required("Role is required"),
      position: Yup.string().notRequired(),
    };
    if (isEdit) {
      return Yup.object().shape({
        ...base,
        password: Yup.string()
          .min(8, "At least 8 chars")
          .matches(/[A-Z]/, "One uppercase")
          .matches(/[0-9]/, "One number")
          .notRequired(),
      });
    } else {
      return Yup.object().shape({
        ...base,
        password: Yup.string()
          .required("Password is required")
          .min(8, "At least 8 chars")
          .matches(/[A-Z]/, "One uppercase")
          .matches(/[0-9]/, "One number"),
      });
    }
  };

  const onSubmit = async (vals, { setSubmitting, resetForm }) => {
    const { password, ...rest } = vals;
    const payload = { ...rest };
    if (password) payload.password = password;

    // inject companyId
    if (!companyId) {
      setSnackbar({
        open: true,
        message: "Your account is missing a companyId — cannot create employee",
        severity: "error",
      });
      setSubmitting(false);
      return;
    }
    payload.companyId = companyId;

    try {
      if (selectedEmp) {
        // include companyId for update as well (keeps ownership)
        await employeeAPI.update(selectedEmp.id, payload);
        setSnackbar({ open: true, message: "Updated!", severity: "success" });
      } else {
        await employeeAPI.create(payload);
        setSnackbar({ open: true, message: "Created!", severity: "success" });
      }
      refetchEmps();
      resetForm();
      closeDiag();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Save error occurred";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (empLoading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      </Layout>
    );
  }
  if (empError) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography color="error">Error loading employees</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Employee Directory</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
            >
              <ToggleButton value="table">
                <TableRows />
              </ToggleButton>
              <ToggleButton value="card">
                <ViewModule />
              </ToggleButton>
            </ToggleButtonGroup>
            <Fab
              color="primary"
              variant="extended"
              onClick={openAdd}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              <Add sx={{ mr: 1 }} /> Add
            </Fab>
          </Box>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Table or Card View */}
        {viewMode === "table" ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell>{e.role}</TableCell>
                    <TableCell>{e.position || "-"}</TableCell>
                    <TableCell>{displayDate(e.joinDate)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openEdit(e)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="primary">
                        No employees found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((e) => (
              <Grid item xs={12} md={6} key={e.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    border: "1px solid hsl(262, 35%, 92%)",
                    height: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "hsl(262, 35%, 96%)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                  onClick={() => openEdit(e)}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: "primary.light",
                          color: "primary.dark",
                          fontWeight: "bold",
                        }}
                      >
                        {e.name ? e.name.charAt(0).toUpperCase() : "U"}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: "primary.main" }}>
                          {e.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {e.position ? e.position + " • " : ""}
                          {e.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Email sx={{ mr: 1, color: "primary.main" }} />
                      <Typography>{e.email}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filtered.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
                <Typography color="primary">No employees found</Typography>
              </Box>
            )}
          </Grid>
        )}

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={closeDiag} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
            {selectedEmp ? "Edit" : "Add"} Employee
          </DialogTitle>
          <Formik
            initialValues={{
              name: selectedEmp?.name || "",
              email: selectedEmp?.email || "",
              role: selectedEmp?.role || "employee",
              position: selectedEmp?.position || "",
              joinDate: selectedEmp ? toInputDate(selectedEmp?.joinDate) : "",
              password: "",
            }}
            validationSchema={schema(!!selectedEmp)}
            onSubmit={onSubmit}
            enableReinitialize
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
                <DialogContent>
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    {/* Name */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    {/* Email */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    {/* Join Date */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Join Date"
                        name="joinDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={values.joinDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.joinDate && !!errors.joinDate}
                        helperText={touched.joinDate && errors.joinDate}
                      />
                    </Grid>
                    {/* Position */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Position (optional)"
                        name="position"
                        value={values.position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.position && !!errors.position}
                        helperText={touched.position && errors.position}
                      />
                    </Grid>
                    {/* Role */}
                    <Grid item xs={12}>
                      <FormControl
                        style={{ width: "100px" }}
                        error={!!touched.role && !!errors.role}
                      >
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={values.role}
                          label="Role"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {["admin", "employee"].map((r) => (
                            <MenuItem key={r} value={r}>
                              {r}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.role && errors.role && (
                          <Typography variant="caption" color="error">
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    {/* Password */}
                    {selectedEmp == null && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                        />
                      </Grid>
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDiag}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {selectedEmp ? "Update" : "Create"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default EmployeeDirectory;
