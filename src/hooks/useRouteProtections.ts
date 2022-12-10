import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Roles } from '../constant/app';
import { RootState } from '../redux/types';

export const useProtectedRoute = (roles: Array<Roles> = []) => {
    console.log('protected routes')
    const router = useRouter();
    const routes = useSelector((store: RootState) => store.app.routes)
    const user = useSelector((store: RootState) => store.auth.user);

    useEffect(() => {
        if(user && 'role_id' in user) {
            const current = routes.find(v => v.link == router.pathname);
            const isAPIPermitted = current && current.roles && current.roles.length > 0 ? current.roles?.includes(`${user?.role_id}`): true;
            const isCustomPermitted = roles && roles.length > 0 ? roles?.includes(user.role_id) : true;

            if (!(isAPIPermitted && isCustomPermitted)) {
                router.replace("/");
            } 
        }
    }, [user, roles, router, routes])
}
