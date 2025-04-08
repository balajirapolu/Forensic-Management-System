const AUTH_KEY = 'forensic_auth';

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const signIn = async (email, password) => {
  try {
    const user = {
      id: 'test-user',
      email,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
};

export const signUp = async (email, password) => {
  try {
    const user = {
      id: 'test-user',
      email,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: error.message };
  }
};
