import { Id } from "react-toastify"

export interface IStatus {
    [key: string]: {
        current_page: number
        data: ITask[]
        first_page_url: number
        from: number
        last_page: number
        last_page_url: string
        next_page_url: string
        path: string
        per_page: number
        prev_page_url: string | null
        to: number
        total: number
    }
}
export interface ITaskDetails {
    attachmentdetail: {
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
        
    }[];
    forwardedattachmentdetail: {
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
        
    }[];
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
    basicdetail: {
        task_id: 1;
        task_title: string;
        task_description: string;
        task_token: string | number;
        taskstatus_id: string;
        order_id: number;
        order_token: string;
        status_id: number;
        created_by: number;
        created_at: string;
        updated_by: number;
        updated_at: string | null;
        deleted_by: string | null;
        deleted_at: string | null;
        order_title: string;
        ordertype_name: string;
        brand_name: string;
        lead_name: string;
        creator: string;
        order_deadlinedate: string;
        order_description: string;
        task_manager: string | number;
        task_deadlinedate:  string | number;
    };
    memberpath: string,
    message: string,
    taskpath: string
    taskworkpath: string,
    forwardedtaskpath: string,
}
export interface ITask {
    tasktype_id: any
    task_email: string
    task_name: string
    task_description: string
    task_id: 1
    task_title: string
    task_token: string
    taskstatus_id: string
    taskstatus_name: string
    task_deadlinedate: string | number
}

export interface ITaskMembers {
    memberdetail: IMember[],
    membersid: number[],
    memberpath: string,
}

export interface IMember {
    user_email: string
    user_id: number
    user_name: string
    role_name: string,
    ismanager: string,
    user_picture: string,
    taskmember_id: number,
    user_username:string
}

export interface ITaskUser {
    data: {
        user_coverpicture: string
        user_email: string
        user_id: number
        user_loginstatus: string
        user_name: string
        user_picture: string
        user_target: string
        taskmember_id: string | number
    }[]
    coverpath: string
    profilepath: string
}

export interface IUserList {
    memberdetail: {
        user_email: string,
        user_id: Id,
        user_name: string,
        user_picture: string,
    }[],
    memberpath: string,
    membersid: number[]
    message: string
}

export interface ITaskComment {
    created_at: string
    created_by: number
    deleted_at: null | string
    deleted_by: null | string
    status_id: number
    task_id: number
    task_token: string
    taskcomment_comment: string
    taskcomment_date: string
    taskcomment_id: string
    updated_at: null | string
    updated_by: null | string
    user_name: string,
    role_name: string,
    ismanager: string,
    user_picture: string,
}

export interface ITaskReply {
    created_at: string
    created_by: number
    status_id: number
    taskcomment_id: string
    taskreply_date: string
    taskreply_id: number
    taskreply_reply: string
    user_name: string
    role_name: string
    ismanager: string
    user_picture: string
}