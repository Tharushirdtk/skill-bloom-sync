import { supabase } from '../lib/supabase';

// Auth API endpoints using Supabase
export const authAPI = {
  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      throw { response: { data: { message: error.message } } };
    }
    
    return {
      data: {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata.firstName || '',
          lastName: data.user.user_metadata.lastName || '',
          role: data.user.user_metadata.role || 'employee'
        }
      }
    };
  },
  
  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          companyName: userData.companyName,
          role: userData.role
        }
      }
    });
    
    if (error) {
      throw { response: { data: { message: error.message } } };
    }
    
    return {
      data: {
        token: data.session?.access_token || '',
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        }
      }
    };
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Company API endpoints using Supabase
export const companyAPI = {
  getAll: () => supabase.from('companies').select('*'),
  update: (id, data) => supabase.from('companies').update(data).eq('id', id),
  delete: (id) => supabase.from('companies').delete().eq('id', id)
};

// Employee API endpoints using Supabase
export const employeeAPI = {
  getAll: () => supabase.from('employees').select('*'),
  getById: (id) => supabase.from('employees').select('*').eq('id', id).single(),
  create: (data) => supabase.from('employees').insert(data),
  update: (id, data) => supabase.from('employees').update(data).eq('id', id),
  delete: (id) => supabase.from('employees').delete().eq('id', id)
};

// Skills API endpoints using Supabase
export const skillsAPI = {
  getAll: () => supabase.from('skills').select('*'),
  create: (data) => supabase.from('skills').insert(data),
  update: (id, data) => supabase.from('skills').update(data).eq('id', id),
  delete: (id) => supabase.from('skills').delete().eq('id', id)
};