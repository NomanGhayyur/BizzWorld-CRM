import { IUser } from "./user";

export interface IOrderListItem {
   
    "order_name": string;
    "order_id": number;
    "order_title": string;
    "order_email": string;
    "order_logo": string;
    "order_cover": string;
    "order_website": string;
    "order_for": string;
    "order_description": string;
    "order_deadlinedate": number;
    "orderrefrence_id": number;
    "orderrefrence_title": string;
    "orderrefrence_link": any;
    "orderpayment_amount": number;
    "orderpayment_title": string;
    "order_token": string,
    "orderpayment_id": string | number;
    "orderqa_answer": any;
    "orderqa_id": any;
    "orderquestion_name": any;
    "basicdetail": any;
    "refrencedetail": any;
    "paymentdetail": any;
    "qadetail": any;
    "attachmentdetail": any;
    "ordertype_id": any;
    "totalamount" : any;
    "brand_name" : string;
    "ordertype_name" : string;
    "lead_name" : string;
    "creator" : string;
    "taskworkpath" : string
    "orderstatus_name" : string;
    "order_type": string;
    "lead_email": string;
    "orderpaymentstatus_name" : string;
    
    "created_at": string;
    "created_by": IUser['user_id'] | null;
    "deleted_at": string | null;
    "deleted_by": IUser['user_id'] | null;
    "status_id": number
    "updated_at": string;
    "updated_by": IUser['user_id'] | null;
    filter(arg0: (v: { 
        orderpayment_amount: number; 
        orderpayment_id: any; 
        orderpayment_title: any; 
        orderattachment_name: any; 
        orderattachment_id: any;  
        orderrefrence_link: any;
        orderrefrence_id: any;
        orderrefrence_title: any;
        orderquestion_id: any;
        orderquestion_name: any;
        orderqa_answer: any;
        orderqa_id: any;
    }) => any): any;

}

export interface IOrder extends IOrderListItem {
    created_at: string;
    created_by: IUser['user_id'] | null;
    deleted_at: string | null;
    deleted_by: IUser['user_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: IUser['user_id'] | null;
    workattachmentdetail: {
        taskattachment_id: number;
        taskattachment_name: string;
        task_id: number;
        task_token: string;
        status_id: number;
        created_by: number;
        created_at: string;
        updated_by: string;
        updated_at: string;
        deleted_by: string;
        deleted_at: string;
        taskworkpath: string;
        user_name:  string;
    }[];
}

export interface totalAmount {
    "totalamount" : number;
}
export interface AttachmentType {
created_at: string
created_by: number
deleted_at: null | string
deleted_by: null | string
order_id: number
order_token: string
orderattachment_id: number
orderattachment_name:string
status_id: 1
updated_at: null | string
updated_by: null | string
}

