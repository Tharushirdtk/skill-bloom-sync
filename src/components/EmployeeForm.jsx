import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  IconButton,
  Autocomplete
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Formik, Form, FieldArray } from 'formik';
import { employeeValidationSchema } from '../shared/validation/employeeValidation';

const EmployeeForm = ({ open, onClose, onSubmit, employee = null, availableSkills = [] }) => {
  const initialValues = {
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    department: employee?.department || '',
    position: employee?.position || '',
    skills: employee?.skills || [
      {
        skillId: '',
        proficiencyLevel: 'Beginner',
        yearsOfExperience: 0,
        certifications: []
      }
    ]
  };

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Design',
    'Product Management'
  ];

  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.2)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: 'primary.light',
          color: 'primary.main',
          fontWeight: 'bold'
        }}
      >
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>
      
      <Formik
        initialValues={initialValues}
        validationSchema={employeeValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ p: 3 }}>
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
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
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
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={values.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.department && Boolean(errors.department)}
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="position"
                    label="Position"
                    value={values.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.position && Boolean(errors.position)}
                    helperText={touched.position && errors.position}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Skills
                  </Typography>
                  
                  <FieldArray name="skills">
                    {({ push, remove }) => (
                      <Box>
                        {values.skills.map((skill, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              mb: 2,
                              border: '1px solid hsl(262 20% 91%)',
                              borderRadius: 2,
                              backgroundColor: 'hsl(262 15% 98%)'
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={4}>
                                <Autocomplete
                                  options={availableSkills}
                                  getOptionLabel={(option) => option.name || ''}
                                  value={availableSkills.find(s => s.id === skill.skillId) || null}
                                  onChange={(event, value) => {
                                    setFieldValue(`skills.${index}.skillId`, value?.id || '');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Skill"
                                      error={touched.skills?.[index]?.skillId && Boolean(errors.skills?.[index]?.skillId)}
                                      helperText={touched.skills?.[index]?.skillId && errors.skills?.[index]?.skillId}
                                    />
                                  )}
                                />
                              </Grid>
                              
                              <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                  <InputLabel>Proficiency</InputLabel>
                                  <Select
                                    value={skill.proficiencyLevel}
                                    onChange={(e) => setFieldValue(`skills.${index}.proficiencyLevel`, e.target.value)}
                                    label="Proficiency"
                                  >
                                    {proficiencyLevels.map((level) => (
                                      <MenuItem key={level} value={level}>
                                        {level}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              
                              <Grid item xs={12} sm={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Years of Experience"
                                  value={skill.yearsOfExperience}
                                  onChange={(e) => setFieldValue(`skills.${index}.yearsOfExperience`, parseInt(e.target.value) || 0)}
                                  InputProps={{ inputProps: { min: 0, max: 50 } }}
                                />
                              </Grid>
                              
                              <Grid item xs={12} sm={2}>
                                <IconButton
                                  onClick={() => remove(index)}
                                  disabled={values.skills.length === 1}
                                  sx={{ color: 'error.main' }}
                                >
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                        
                        <Button
                          startIcon={<Add />}
                          onClick={() => push({
                            skillId: '',
                            proficiencyLevel: 'Beginner',
                            yearsOfExperience: 0,
                            certifications: []
                          })}
                          sx={{ mt: 1 }}
                        >
                          Add Skill
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, hsl(262 47% 40%), hsl(262 47% 50%))'
                  }
                }}
              >
                {employee ? 'Update' : 'Create'} Employee
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EmployeeForm;