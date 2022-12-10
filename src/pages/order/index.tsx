import type { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
// import OrderBucket from "../../components/order/orderBucket/orderBucket";
const OrderBucket = React.lazy(
  () => import("../../components/order/orderBucket/orderBucket")
);
const Orders: NextPage = () => {
  const user = useSelector((store: RootState) => store.auth.user);

  return (
    <div className="container-fluid">
      <OrderBucket />
    </div>
  );
};

export default Orders;
