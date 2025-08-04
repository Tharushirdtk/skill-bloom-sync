import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import Layout from '../components/Layout';
import SkillCard from '../components/SkillCard';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@company.com',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    bio: 'Passionate software engineer with 5+ years of experience in full-stack development.'
  });

  // Mock user skills data
  const userSkills = [
    {
      id: 1,
      name: 'React',
      category: 'Frontend',
      proficiencyLevel: 'Expert',
      yearsOfExperience: 4,
      certifications: ['React Developer Certification'],
      description: 'Building modern web applications with React ecosystem'
    },
    {
      id: 2,
      name: 'Node.js',
      category: 'Backend',
      proficiencyLevel: 'Advanced',
      yearsOfExperience: 3,
      certifications: ['Node.js Certified Developer'],
      description: 'Server-side JavaScript development and API creation'
    },
    {
      id: 3,
      name: 'Python',
      category: 'Programming',
      proficiencyLevel: 'Intermediate',
      yearsOfExperience: 2,
      certifications: [],
      description: 'Data analysis and automation scripting'
    },
    {
      id: 4,
      name: 'AWS',
      category: 'Cloud',
      proficiencyLevel: 'Advanced',
      yearsOfExperience: 3,
      certifications: ['AWS Certified Developer'],
      description: 'Cloud infrastructure and serverless applications'
    }
  ];

  const skillCategories = ['All', 'Frontend', 'Backend', 'Programming', 'Cloud', 'Database'];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Save profile changes via API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setEditedProfile({
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Doe',
      email: user?.email || 'john.doe@company.com',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      bio: 'Passionate software engineer with 5+ years of experience in full-stack development.'
    });
  };

  const getSkillLevelStats = () => {
    const levels = userSkills.reduce((acc, skill) => {
      acc[skill.proficiencyLevel] = (acc[skill.proficiencyLevel] || 0) + 1;
      return acc;
    }, {});
    
    return [
      { level: 'Expert', count: levels.Expert || 0, color: 'hsl(262 47% 45%)' },
      { level: 'Advanced', count: levels.Advanced || 0, color: 'hsl(120 61% 50%)' },
      { level: 'Intermediate', count: levels.Intermediate || 0, color: 'hsl(45 93% 58%)' },
      { level: 'Beginner', count: levels.Beginner || 0, color: 'hsl(40 100% 65%)' }
    ];
  };

  return (
    <Layout>
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1
          }}
        >
          My Profile
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Manage your personal information and skills
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
                border: '1px solid hsl(262 20% 91%)',
                borderRadius: 3,
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Profile Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      sx={{ color: 'primary.main' }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Save />}
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))'
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        color="inherit"
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem'
                    }}
                  >
                    {editedProfile.firstName.charAt(0)}{editedProfile.lastName.charAt(0)}
                  </Avatar>
                  
                  {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        size="small"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                        placeholder="First Name"
                      />
                      <TextField
                        size="small"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                        placeholder="Last Name"
                      />
                    </Box>
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {editedProfile.firstName} {editedProfile.lastName}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isEditing ? (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Position"
                        value={editedProfile.position}
                        onChange={(e) => setEditedProfile({...editedProfile, position: e.target.value})}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Department"
                        value={editedProfile.department}
                        onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        label="Bio"
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      />
                    </>
                  ) : (
                    <>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{editedProfile.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Position</Typography>
                        <Typography variant="body1">{editedProfile.position}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Department</Typography>
                        <Typography variant="body1">{editedProfile.department}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Bio</Typography>
                        <Typography variant="body1">{editedProfile.bio}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Skill Level Overview */}
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
                border: '1px solid hsl(262 20% 91%)',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Skill Level Distribution
                </Typography>
                
                {getSkillLevelStats().map((stat) => (
                  <Box key={stat.level} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {stat.level}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.count} skill{stat.count !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stat.count / userSkills.length) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'hsl(262 20% 91%)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  My Skills ({userSkills.length})
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, hsl(262 47% 45%), hsl(262 47% 55%))'
                  }}
                >
                  Add New Skill
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {skillCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    variant={category === 'All' ? 'filled' : 'outlined'}
                    sx={{
                      backgroundColor: category === 'All' ? 'primary.main' : 'transparent',
                      color: category === 'All' ? 'white' : 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: category === 'All' ? 'primary.dark' : 'primary.light'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={3}>
              {userSkills.map((skill) => (
                <Grid item xs={12} md={6} key={skill.id}>
                  <SkillCard
                    skill={skill}
                    onEdit={(skill) => console.log('Edit skill:', skill)}
                    onDelete={(skillId) => console.log('Delete skill:', skillId)}
                    showActions={true}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Profile;