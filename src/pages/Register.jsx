import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Divider,
} from "@mui/material";
import { Formik, Form } from "formik";
import { registerValidationSchema } from "../shared/validation/employeeValidation";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, loading, error, clearError } = useUser();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    clearError();
    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

    const payload = {
      name: fullName,
      email: values.email,
      password: values.password,
      companyName: values.companyName,
      companyAddress: values.companyAddress,
      companyIndustry: values.companyIndustry,
      // explicitly set role for backend (admin page)
      role: "admin",
    };

    try {
      const result = await register(payload);
      if (result && result.success) {
        setSuccessMessage(
          "Registration successful — please sign in with your new account."
        );
        navigate("/login");
      } else {
        setSubmitting(false);
      }
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f3f4f6 60%, #ede9fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 2, md: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: "0 8px 32px 0 rgba(60, 60, 120, 0.15)",
            border: "none",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 5 } }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                SkillSmart
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
              >
                Create Account (Admin only)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up your organization's skill management system
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                companyName: "",
                companyAddress: "",
                companyIndustry: "",
              }}
              validationSchema={registerValidationSchema}
              onSubmit={handleSubmit}
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
                  <Grid container spacing={2}>
                    {/* --- USER DETAILS SECTION --- */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          User Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="firstName"
                              label="First Name"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.firstName && Boolean(errors.firstName)
                              }
                              helperText={touched.firstName && errors.firstName}
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="lastName"
                              label="Last Name"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.lastName && Boolean(errors.lastName)}
                              helperText={touched.lastName && errors.lastName}
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="password"
                              label="Password"
                              type="password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.password && Boolean(errors.password)}
                              helperText={touched.password && errors.password}
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="confirmPassword"
                              label="Confirm Password"
                              type="password"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.confirmPassword &&
                                Boolean(errors.confirmPassword)
                              }
                              helperText={
                                touched.confirmPassword && errors.confirmPassword
                              }
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="email"
                              label="Email Address"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                              size="medium"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    {/* --- COMPANY DETAILS SECTION --- */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          Company Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="companyName"
                              label="Company Name"
                              value={values.companyName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.companyName && Boolean(errors.companyName)
                              }
                              helperText={touched.companyName && errors.companyName}
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="companyAddress"
                              label="Company Address"
                              value={values.companyAddress}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.companyAddress &&
                                Boolean(errors.companyAddress)
                              }
                              helperText={
                                touched.companyAddress && errors.companyAddress
                              }
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="companyIndustry"
                              label="Company Industry"
                              value={values.companyIndustry}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.companyIndustry &&
                                Boolean(errors.companyIndustry)
                              }
                              helperText={
                                touched.companyIndustry && errors.companyIndustry
                              }
                              size="medium"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting || loading}
                        sx={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #a78bfa)",
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          borderRadius: 3,
                          boxShadow: "0 2px 8px 0 rgba(124, 58, 237, 0.12)",
                          transition: "background 0.2s",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #6d28d9, #8b5cf6)",
                          },
                        }}
                      >
                        {isSubmitting || loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
