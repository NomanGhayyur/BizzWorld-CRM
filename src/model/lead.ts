import { IBrand } from "./brand";

export interface ILeadListItem {
    "lead_id": number | string | any;
    "lead_name": string;
    "lead_email":string;
    "lead_altemail": string;
    "lead_phone": number;
    "city_id": number;
    "city_name": string;
    "state_id": number;
    "state_name": string;
    "country_id": number;
    "country_name": string;
    "lead_zip": number;
    "lead_address": number;
    "lead_bussinessname": string;
    "lead_bussinessemail": string;
    "lead_bussinesswebsite": string;
    "lead_bussinessphone": number;
    "lead_otherdetails": number | string;
    "brand_id": IBrand['brand_id']
    "brand_name": string;
    "freshlead_name": string;
    "freshlead_email": string;
    "freshlead_id": number;
}

export interface ILead extends ILeadListItem {
    created_at: string;
    created_by: ILead['lead_id'] | null;
    deleted_at: string | null;
    deleted_by: ILead['lead_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: ILead['lead_id'] | null;

}