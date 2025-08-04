import * as yup from 'yup';

export const employeeValidationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  
  department: yup
    .string()
    .required('Department is required'),
  
  position: yup
    .string()
    .required('Position is required'),
  
  skills: yup
    .array()
    .of(
      yup.object({
        skillId: yup.string().required('Skill is required'),
        proficiencyLevel: yup
          .string()
          .oneOf(['Beginner', 'Intermediate', 'Advanced', 'Expert'], 'Invalid proficiency level')
          .required('Proficiency level is required'),
        yearsOfExperience: yup
          .number()
          .min(0, 'Years of experience must be 0 or greater')
          .max(50, 'Years of experience must not exceed 50'),
        certifications: yup.array().of(yup.string())
      })
    )
    .min(1, 'At least one skill is required')
});

export const skillValidationSchema = yup.object({
  name: yup
    .string()
    .required('Skill name is required')
    .min(2, 'Skill name must be at least 2 characters')
    .max(100, 'Skill name must not exceed 100 characters'),
  
  category: yup
    .string()
    .required('Category is required'),
  
  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters')
});

export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const registerValidationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  
  role: yup
    .string()
    .oneOf(['admin', 'employee'], 'Invalid role')
    .required('Role is required')
});