import React from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Formik, Form } from 'formik';
import { registerValidationSchema } from '../shared/validation/employeeValidation';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, loading, error, clearError } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    clearError();
    const result = await register(values);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.05), hsl(262 47% 55% / 0.1))',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Card 
          sx={{ 
            borderRadius: 4,
            boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.2)',
            border: '1px solid hsl(262 20% 91%)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                SkillSync
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                Create Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Set up your organization's skill management system
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                companyName: '',
                role: 'admin'
              }}
              validationSchema={registerValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="firstName"
                        label="First Name"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="companyName"
                        label="Company Name"
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.companyName && Boolean(errors.companyName)}
                        helperText={touched.companyName && errors.companyName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
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
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={values.role}
                          label="Role"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.role && Boolean(errors.role)}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="employee">Employee</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting || loading}
                        sx={{
                          background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))',
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(135deg, hsl(262 47% 40%), hsl(262 47% 50%))'
                          },
                          '&:disabled': {
                            background: 'hsl(262 20% 80%)'
                          }
                        }}
                      >
                        {isSubmitting || loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
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