
import { getTotalAmount }  from "../api/order";
import { useState }  from "react";
import { useDispatch }  from "react-redux";
import { totalAmount } from "../model/order";
import { AppThunkDispatch } from "../redux/types";

type tokenType = {[key in string | number]:string | number}
const useTotalAmount = () => {
  const [totalAmount, setTokenAmount] = useState<tokenType>({order_Id:''});
  const dispatch = useDispatch<AppThunkDispatch>();
  const onGetTotalAmount = async (order_Id: number | string) => {
    const params = {
      data: {
        order_Id,
      },
    };
    const response: totalAmount = await dispatch(getTotalAmount(params));
    setTokenAmount(
        {[order_Id as number | string]: response.totalamount});
  };

  return [totalAmount, onGetTotalAmount];
};

export default useTotalAmount;