import { IRole } from "./app";
import { IBrand } from "./brand";

export interface IUser {
    "user_id": number,
    "user_name": string,
    "user_email": string,
    "user_username": string,
    "user_target": string | number,
    "user_password": string,
    "user_picture": string | null,
    "user_coverpicture": string | null,
    "user_loginstatus": string,
    "user_token": string,
    "role_id": IRole['role_id'],
    "status_id": number,
    "created_by": IUser['user_id'],
    "created_at": string,
    "updated_by": IUser['user_id'] | null,
    "updated_at": string | null,
    "deleted_by": IUser['user_id'] | null,
    "deleted_at": string | null,
    "role_name": IRole['role_name'],
    "brand_id": IBrand['brand_id'],
    "brands": {id: number, name: string}[]
    "brand1":number,
    "brand2":number,
    "brand3":number,
    "brand4":number,
    "profilepath" : string;
    "coverpath": string;
    "path": string;
    
}