import { jwtDecode, JwtPayload } from 'jwt-decode';

interface DecodedUser {
  data: {
    _id: string;
    name: string;
    email: string;
  };
  exp?: number;
}

class AuthService {
  // Get decoded profile from token
  getProfile(): DecodedUser | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedUser>(token);
    } catch {
      return null;
    }
  }

  // Is user logged in (token exists and not expired)?
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check token expiration
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return false;
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  // Retrieve token from localStorage
  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  // Save token and redirect to home
  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Remove token and redirect to home
  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
