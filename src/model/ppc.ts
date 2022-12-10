import { IUser } from "./user";

export interface IPPCListItem {
    data:{
        "ppc_id": number;
        "ppc_name": string;
    "ppc_date": string | number;
    "user_name": string;
        "ppc_amount": string | number;
        "ppc_description": string;
        "created_at": string;
        "created_by": IUser['user_id'] | null;
        "deleted_at": string | null;
        "deleted_by": IUser['user_id'] | null;
        "status_id": number
        "updated_at": string;
        "updated_by": IUser['user_id'] | null;

        "brand_id": string |number;

        "assignppc_id": number;
        "assignppc_amount": string | number;
        "assignppc_month": string | number;
        "creator": string;
        "assignppc_description": string;
        "assignuser_name": string;
        "assignuser_id": number;
      
    }
    "ppc_id": number;
    "user_name": string;
    "brand_name": string;
    "ppc_date": string | number;
    "ppc_name": string;
    "ppc_amount": string | number;
    "ppc_description": string;
    "created_at": string;
    "created_by": IUser['user_id'] | null;
    "deleted_at": string | null;
    "deleted_by": IUser['user_id'] | null;
    "status_id": number
    "updated_at": string;
    "updated_by": IUser['user_id'] | null;

    "assignppc_id": number;
    "assignppc_amount": string | number;
    "assignppc_month": string | number;
    "creator": string;
    "assignppc_description": string;
    "assignuser_name": string;
    "assignuser_id": number;
}

export interface IPPC extends IPPCListItem {
    created_at: string;
    created_by: IUser['user_id'] | null;
    deleted_at: string | null;
    deleted_by: IUser['user_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: IUser['user_id'] | null;

    ppcs: Array<IPPC['ppc_id'] | string>;

}