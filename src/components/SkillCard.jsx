import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';

const SkillCard = ({ skill, onEdit, onDelete, showActions = true }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const getProficiencyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'hsl(40 100% 65%)';
      case 'intermediate':
        return 'hsl(45 93% 58%)';
      case 'advanced':
        return 'hsl(120 61% 50%)';
      case 'expert':
        return 'hsl(262 47% 45%)';
      default:
        return 'hsl(262 47% 45%)';
    }
  };

  const getProficiencyValue = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 25;
      case 'intermediate':
        return 50;
      case 'advanced':
        return 75;
      case 'expert':
        return 100;
      default:
        return 0;
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(skill);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(skill.id);
    handleMenuClose();
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))',
        border: '1px solid hsl(262 20% 91%)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.15)'
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
          </Typography>
          {showActions && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Category: {skill.category}
          </Typography>
          {skill.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {skill.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              Proficiency Level
            </Typography>
            <Chip 
              label={skill.proficiencyLevel}
              size="small"
              sx={{
                backgroundColor: getProficiencyColor(skill.proficiencyLevel),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProficiencyValue(skill.proficiencyLevel)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'hsl(262 20% 91%)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProficiencyColor(skill.proficiencyLevel),
                borderRadius: 4
              }
            }}
          />
        </Box>

        {skill.yearsOfExperience !== undefined && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Experience: {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''}
          </Typography>
        )}

        {skill.certifications && skill.certifications.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Certifications:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skill.certifications.map((cert, index) => (
                <Chip
                  key={index}
                  label={cert}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: 'primary.light',
                    color: 'primary.main'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {showActions && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: '0 10px 30px -10px hsl(262 47% 45% / 0.2)'
              }
            }}
          >
            <MenuItem onClick={handleEdit}>
              <Edit sx={{ mr: 1 }} fontSize="small" />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} fontSize="small" />
              Delete
            </MenuItem>
          </Menu>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillCard;