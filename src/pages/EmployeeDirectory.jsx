import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab
} from '@mui/material';
import {
  Search,
  Add,
  Email,
  Work,
  Business
} from '@mui/icons-material';
import Layout from '../components/Layout';
import EmployeeForm from '../components/EmployeeForm';
import useFetch from '../hooks/UseFetch';
import { employeeAPI, skillsAPI } from '../apis/userApi';

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data: employees, loading: employeesLoading, refetch: refetchEmployees } = useFetch(employeeAPI.getAll);
  const { data: skills, loading: skillsLoading } = useFetch(skillsAPI.getAll);

  // Mock data for demonstration
  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      skills: [
        { name: 'React', proficiencyLevel: 'Expert' },
        { name: 'Node.js', proficiencyLevel: 'Advanced' },
        { name: 'Python', proficiencyLevel: 'Intermediate' }
      ]
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      department: 'Design',
      position: 'UX Designer',
      skills: [
        { name: 'Figma', proficiencyLevel: 'Expert' },
        { name: 'Adobe Creative Suite', proficiencyLevel: 'Advanced' },
        { name: 'User Research', proficiencyLevel: 'Advanced' }
      ]
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@company.com',
      department: 'Marketing',
      position: 'Digital Marketing Manager',
      skills: [
        { name: 'Google Analytics', proficiencyLevel: 'Expert' },
        { name: 'SEO', proficiencyLevel: 'Advanced' },
        { name: 'Content Strategy', proficiencyLevel: 'Advanced' }
      ]
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      department: 'Engineering',
      position: 'DevOps Engineer',
      skills: [
        { name: 'AWS', proficiencyLevel: 'Expert' },
        { name: 'Docker', proficiencyLevel: 'Advanced' },
        { name: 'Kubernetes', proficiencyLevel: 'Intermediate' }
      ]
    }
  ];

  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
  const allSkills = mockEmployees.flatMap(emp => emp.skills.map(s => s.name));
  const uniqueSkills = ['All', ...new Set(allSkills)];

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || departmentFilter === 'All' || employee.department === departmentFilter;
    
    const matchesSkill = !skillFilter || skillFilter === 'All' || 
      employee.skills.some(skill => skill.name === skillFilter);
    
    return matchesSearch && matchesDepartment && matchesSkill;
  });

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

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedEmployee) {
        await employeeAPI.update(selectedEmployee.id, values);
      } else {
        await employeeAPI.create(values);
      }
      setIsFormOpen(false);
      refetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
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
            Employee Directory
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddEmployee}
            sx={{
              background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(262 47% 40%), hsl(262 47% 50%))'
              }
            }}
          >
            Add Employee
          </Button>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Find and manage employee skill profiles
        </Typography>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Skill</InputLabel>
              <Select
                value={skillFilter}
                label="Skill"
                onChange={(e) => setSkillFilter(e.target.value)}
              >
                {uniqueSkills.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Employee Cards */}
        <Grid container spacing={3}>
          {filteredEmployees.map((employee) => (
            <Grid item xs={12} md={6} lg={4} key={employee.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
                  border: '1px solid hsl(262 20% 91%)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.2)'
                  }
                }}
                onClick={() => handleEditEmployee(employee)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        width: 60,
                        height: 60,
                        mr: 2,
                        fontSize: '1.5rem'
                      }}
                    >
                      {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {employee.firstName} {employee.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.position}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {employee.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Business sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {employee.department}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                    Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {employee.skills.slice(0, 3).map((skill, index) => (
                      <Chip
                        key={index}
                        label={`${skill.name} (${skill.proficiencyLevel})`}
                        size="small"
                        sx={getProficiencyColor(skill.proficiencyLevel)}
                      />
                    ))}
                    {employee.skills.length > 3 && (
                      <Chip
                        label={`+${employee.skills.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'primary.light', color: 'primary.main' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredEmployees.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              color: 'text.secondary'
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No employees found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search filters
            </Typography>
          </Box>
        )}

        <EmployeeForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          employee={selectedEmployee}
          availableSkills={skills || []}
        />
      </Box>
    </Layout>
  );
};

export default EmployeeDirectory;