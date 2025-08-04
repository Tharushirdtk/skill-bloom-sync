import React, { useState } from 'react';
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  TrendingUp,
  People,
  Category
} from '@mui/icons-material';
import Layout from '../components/Layout';
import SkillCard from '../components/SkillCard';
import { Formik, Form } from 'formik';
import { skillValidationSchema } from '../shared/validation/employeeValidation';
import useFetch from '../hooks/UseFetch';
import { skillsAPI } from '../apis/userApi';

const SkillManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const { data: skills, loading: skillsLoading, refetch: refetchSkills } = useFetch(skillsAPI.getAll);

  // Mock data for demonstration
  const mockSkills = [
    {
      id: 1,
      name: 'React',
      category: 'Frontend',
      description: 'A JavaScript library for building user interfaces',
      employeeCount: 25,
      avgProficiency: 'Advanced',
      trending: true
    },
    {
      id: 2,
      name: 'Node.js',
      category: 'Backend',
      description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
      employeeCount: 18,
      avgProficiency: 'Intermediate',
      trending: true
    },
    {
      id: 3,
      name: 'Python',
      category: 'Programming',
      description: 'High-level programming language for web development, data analysis, and AI',
      employeeCount: 22,
      avgProficiency: 'Advanced',
      trending: false
    },
    {
      id: 4,
      name: 'AWS',
      category: 'Cloud',
      description: 'Amazon Web Services cloud computing platform',
      employeeCount: 15,
      avgProficiency: 'Intermediate',
      trending: true
    },
    {
      id: 5,
      name: 'Docker',
      category: 'DevOps',
      description: 'Platform for developing, shipping, and running applications in containers',
      employeeCount: 12,
      avgProficiency: 'Intermediate',
      trending: true
    },
    {
      id: 6,
      name: 'Figma',
      category: 'Design',
      description: 'Collaborative interface design tool',
      employeeCount: 8,
      avgProficiency: 'Advanced',
      trending: false
    }
  ];

  const categories = ['All', 'Frontend', 'Backend', 'Programming', 'Cloud', 'DevOps', 'Design', 'Database'];

  const filteredSkills = mockSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === 'All' || skill.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setIsFormOpen(true);
  };

  const handleEditSkill = (skill) => {
    setSelectedSkill(skill);
    setIsFormOpen(true);
  };

  const handleDeleteSkill = (skillId) => {
    // TODO: Implement delete functionality
    console.log('Delete skill:', skillId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedSkill) {
        await skillsAPI.update(selectedSkill.id, values);
      } else {
        await skillsAPI.create(values);
      }
      setIsFormOpen(false);
      refetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const SkillForm = () => (
    <Dialog 
      open={isFormOpen} 
      onClose={() => setIsFormOpen(false)} 
      maxWidth="sm" 
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
        {selectedSkill ? 'Edit Skill' : 'Add New Skill'}
      </DialogTitle>
      
      <Formik
        initialValues={{
          name: selectedSkill?.name || '',
          category: selectedSkill?.category || '',
          description: selectedSkill?.description || ''
        }}
        validationSchema={skillValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Skill Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.category && Boolean(errors.category)}
                      label="Category"
                    >
                      {categories.filter(cat => cat !== 'All').map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    label="Description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setIsFormOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))'
                }}
              >
                {selectedSkill ? 'Update' : 'Create'} Skill
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );

  const getProficiencyColor = (level) => {
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Skill Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={viewMode === 'cards' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('cards')}
              size="small"
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              size="small"
            >
              Table
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddSkill}
              sx={{
                background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))'
              }}
            >
              Add Skill
            </Button>
          </Box>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Manage organizational skills and track adoption
        </Typography>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Skills Display */}
        {viewMode === 'cards' ? (
          <Grid container spacing={3}>
            {filteredSkills.map((skill) => (
              <Grid item xs={12} md={6} lg={4} key={skill.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
                    border: '1px solid hsl(262 20% 91%)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main',
                          flexGrow: 1
                        }}
                      >
                        {skill.name}
                        {skill.trending && (
                          <Chip
                            icon={<TrendingUp />}
                            label="Trending"
                            size="small"
                            sx={{
                              ml: 1,
                              backgroundColor: 'success.light',
                              color: 'success.dark'
                            }}
                          />
                        )}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditSkill(skill)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteSkill(skill.id)} sx={{ color: 'error.main' }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    <Chip 
                      label={skill.category}
                      size="small"
                      sx={{ mb: 2, backgroundColor: 'primary.light', color: 'primary.main' }}
                    />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {skill.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {skill.employeeCount} employees
                        </Typography>
                      </Box>
                      <Chip
                        label={`Avg: ${skill.avgProficiency}`}
                        size="small"
                        sx={getProficiencyColor(skill.avgProficiency)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
              border: '1px solid hsl(262 20% 91%)',
              borderRadius: 3
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Skill Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Employees</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Avg Proficiency</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {skill.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={skill.category}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: 'primary.light', color: 'primary.main' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {skill.employeeCount}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={skill.avgProficiency}
                          size="small"
                          sx={getProficiencyColor(skill.avgProficiency)}
                        />
                      </TableCell>
                      <TableCell>
                        {skill.trending && (
                          <Chip
                            icon={<TrendingUp />}
                            label="Trending"
                            size="small"
                            sx={{
                              backgroundColor: 'success.light',
                              color: 'success.dark'
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEditSkill(skill)}>
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteSkill(skill.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {filteredSkills.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              color: 'text.secondary'
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No skills found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search filters or add a new skill
            </Typography>
          </Box>
        )}

        <SkillForm />
      </Box>
    </Layout>
  );
};

export default SkillManagement;