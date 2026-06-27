import { Navigate } from 'react-router-dom';
import { getToken } from '@/src/api/authApi';

interface Props {
    children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
    const token = getToken();

    if(!token) {
        return <Navigate to  ="/login" replace/>
    }

    return <>{children}</>
}