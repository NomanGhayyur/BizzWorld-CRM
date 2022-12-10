export const authRoutes = ['login', 'forgot', 'reset', 'register'];
export const noImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/no_image.png`;
export const DATE_FORMAT = "ddd, MMM Do YYYY";

export enum Roles {
    SUPER_ADMIN = 1,
    Billing = 2,
    UNIT_HEAD = 3,
    MARKETING_HEAD = 4,
    MARKETING_AGENT = 5,
    SALES_Manager = 6,
    SALES_AGENT = 7,
    Up_Sales_Agent = 8,
    Lead_Generator = 9,
    PRODUCTION_HEAD = 10,
    PRODUCTION_Manager = 11,
    Content_Writer = 12,
    Animation = 13,
    Block_Chain = 14,
    DESIGNER = 15,
    DIGITIZER = 16,
    CMS_Developer = 17,
    FRONT_DEVELOPER = 18,
    SEO = 19,
}

export const attachmentType = {
    image:["jpg","png","jpeg","psd","ai","raw","webp","svg"]
}

export const TODO = 1;
export const DOING = 2;
export const DONE = 3;
export const SENT_TO_CLIENT = 4;
export const APPROVED = 5;
export const CANCEL = 6
export const HALT = 7
export const Complete = 8;
export const Save_By_Sales = 9;
export const Forwarded_To_Production = 10;
export const Pick_By_Production = 11;
export const Assigned = 12;
export const Pending = 13;
export const Invoice_Sent = 14;
export const Paid = 15;
export const Cancel = 16;
export const Client = 17;
export const Forwarded_To_Sales = 18;
export const Pick_By_Sales = 19;
export const Full = 20;


