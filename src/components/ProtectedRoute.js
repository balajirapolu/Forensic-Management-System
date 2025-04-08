import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const auth = isAuthenticated();
  return auth ? children : <Navigate to="/login" />;
}
