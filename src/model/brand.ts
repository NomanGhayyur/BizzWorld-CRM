import { IUser } from "./user";

export interface IBrandListItem {
    data:{
        "brand_id": number;
        "brand_name": string;
        "brand_email": string;
        "brand_logo": string |number;
        "brand_cover": string | number;
        "brand_website": string;
        "brand_description": string;
        "brandtype_id": number;
        "brandtype_name": string;
        "created_at": string;
        "created_by": IUser['user_id'] | null;
        "deleted_at": string | null;
        "deleted_by": IUser['user_id'] | null;
        "status_id": number
        "updated_at": string;
        "updated_by": IUser['user_id'] | null;
       "logopath": string;
       "coverpath": string;
    }
    "brand_id": number | string;
    "brand_name": string;
    "brand_email": string;
    "brand_logo": string |number;
    "brand_cover": string | number;
    "brand_website": string;
    "brand_description": string;
    "brandtype_id": number;
    "brandtype_name": string;
    "created_at": string;
    "created_by": IUser['user_id'] | null;
    "deleted_at": string | null;
    "deleted_by": IUser['user_id'] | null;
    "status_id": number
    "updated_at": string;
    "updated_by": IUser['user_id'] | null;
   "logopath": string;
   "coverpath": string;
}

export interface IBrand extends IBrandListItem {
    created_at: string;
    created_by: IUser['user_id'] | null;
    deleted_at: string | null;
    deleted_by: IUser['user_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: IUser['user_id'] | null;

    brands: Array<IBrand['brand_id'] | string>;

}