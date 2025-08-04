import React, { useState } from 'react';
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
  Container
} from '@mui/material';
import { Formik, Form } from 'formik';
import { loginValidationSchema } from '../shared/validation/employeeValidation';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, loading, error, clearError } = useUser();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (values) => {
    clearError();
    const result = await login(values);
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
      <Container maxWidth="sm">
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
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to manage your skills and team
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                        'Sign In'
                      )}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
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
};

export default Login;