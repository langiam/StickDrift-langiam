// client/src/utils/auth.ts
import { type JwtPayload, jwtDecode } from 'jwt-decode';

interface ExtendedJwt extends JwtPayload {
  data: {
    name: string;
    email: string;
    _id: string;
  };
}

class AuthService {
  getProfile() {
    return jwtDecode<ExtendedJwt>(this.getToken());
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded?.exp !== undefined && decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();