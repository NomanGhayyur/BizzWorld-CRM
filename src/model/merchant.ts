import { IUser } from "./user";

export interface IMerchantList {

    "billingmerchant_id" : number,
    "billingmerchant_title" : string,
    "billingmerchant_email" : string,
    "billingmerchant_website" : string,
    "billingmerchant_openingbalance" : number,
    "billingmerchant_closingbalance" : number,
    "billingmerchant_fee" : number,
    "billingmerchant_otherinfo" : string,
    "billingmerchant_logo" : string | number,
    "logopath" : string,
    "data" : any,


}

export interface IMerchant extends IMerchantList {
    created_at: string;
    created_by: IUser['user_id'] | null;
    deleted_at: string | null;
    deleted_by: IUser['user_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: IUser['user_id'] | null;

    merhcnats: Array<IMerchant['billingmerchant_id'] | string>;

}