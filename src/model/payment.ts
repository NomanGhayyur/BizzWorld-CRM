import { IUser } from "./user";

export interface IPaymentListItem {
   
    "order_title": string;
    "orderpayment_amount": number; 
    "orderpayment_id": string | number; 
    "orderpayment_title": string;
    "orderpaymentstatus_id": number; 
    "lead_email": string;
    "lead_name": string;
    "lead_id": number;
    "order_id": number;
    "mergedeal_token":  number;
    
    "created_at": string;
    "created_by": IUser['user_id'] | null;
    "deleted_at": string | null;
    "deleted_by": IUser['user_id'] | null;
    "status_id": number
    "updated_at": string;
    "updated_by": IUser['user_id'] | null;
    filter(arg0: (v: {
        lead_email: string; 
        orderpayment_amount: number; 
        orderpayment_id: number; 
        orderpayment_title: string; 
        order_id: number;
    }) => string | number | undefined): any;

}

export interface IPayment extends IPaymentListItem {
    order_id: number;
    created_at: string;
    created_by: IUser['user_id'] | null;
    deleted_at: string | null;
    deleted_by: IUser['user_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: IUser['user_id'] | null;

}

export interface totalAmount {
    "totalamount" : number;
}


