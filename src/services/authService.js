import api from './api';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.USER_KEY = 'admin_user';
  }

  /**
   * LOGIN - Authenticate user
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        
        console.log('Login successful, token stored');
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }

      return {
        success: false,
        error: response.data.error || 'Login failed'
      };

    } catch (error) {
      console.error('Login error:', error);
      
      return {
        success: false,
        error: error.message || 'Invalid credentials'
      };
    }
  }

  /**
   * VERIFY TOKEN - Check if token is still valid
   */
  async verifyToken() {
    try {
      const token = this.getToken();
      
      if (!token) {
        console.log('No token found');
        return false;
      }

      const response = await api.get('/auth/verify');

      if (response.data.success) {
        console.log('Token is valid');
        return true;
      }

      console.log('Token is invalid');
      this.logout();
      return false;

    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * LOGOUT - Clear authentication data
   */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    console.log('Logged out, tokens cleared');
  }

  /**
   * CHECK IF AUTHENTICATED
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * GET CURRENT USER
   */
  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  /**
   * GET TOKEN
   */
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * SET TOKEN
   */
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * SET USER DATA
   */
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * GET AUTH HEADER
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * CHECK IF USER IS ADMIN
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  /**
   * GET USERNAME
   */
  getUsername() {
    const user = this.getCurrentUser();
    return user ? user.username : null;
  }

  /**
   * GET USER - Alias for getCurrentUser
   */
  getUser() {
    return this.getCurrentUser();
  }
}

// Export as singleton instance
export default new AuthService();