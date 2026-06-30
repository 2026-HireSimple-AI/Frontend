import { Navigate, useLocation  } from 'react-router-dom';
import { getToken } from '@/src/api/authApi';

interface Props {
    children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
    const token = getToken();
    const location = useLocation();

    if (!token) {
        sessionStorage.setItem("pending_redirect_path", location.pathname);
        return <Navigate to="/login" replace/>
    }

    return <>{children}</>
}