import { NextPage } from 'next';
import { Roles } from '../../../constant/app';
import { useProtectedRoute } from '../../../hooks/useRouteProtections';
import OrderCreate from '../create';

const OrderUpdate: NextPage = () => {
  useProtectedRoute([Roles.UNIT_HEAD, Roles.SUPER_ADMIN]);
  return <OrderCreate />;
};

export default OrderUpdate;
