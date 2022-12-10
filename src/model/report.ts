import { IBrand } from "./brand";

export interface IReportListItem {
    user_id : number;
    usertarget_id : number;
    usertarget_target : number;
}

export interface IReport extends IReportListItem {
    created_at: string;
    created_by: IReport['user_id'] | null;
    deleted_at: string | null;
    deleted_by: IReport['user_id'] | null;
    status_id: number
    updated_at: string;
    updated_by: IReport['user_id'] | null;

}