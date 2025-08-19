import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Container,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, error, clearError, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Redirect based on role
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === "admin") navigate("/dashboard");
      if (role === "employee") navigate("/profile");
    }
  }, [isAuthenticated, role, navigate]);

  const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(4, "Min 4 chars").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = await login(values);
    setSubmitting(false); // re-enable button immediately after response
    if (result.success && result.user) {
      setRole(result.user.role);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(138,43,226,0.05), rgba(138,43,226,0.1))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ pt: 5, px: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              SkillSmart
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={schema}
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
                <Form noValidate>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={(e) => {
                      handleBlur(e);
                      clearError();
                    }}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={(e) => {
                      handleBlur(e);
                      clearError();
                    }}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <Box sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isSubmitting} // only disable during submit
                      sx={{ py: 1.5, fontWeight: "bold" }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2">
                Don’t have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/register")}
                  sx={{ fontWeight: "bold" }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
