import { IRole } from "./app";

export interface IAdmin {
    
    length: number;
    expense_title: string;
    expense_amount: number;
    van_id: string | number;
    car_rent: number;
    assignto: string;
    car_name: string;
    car_id: string | number;
    tasktype_id: number;
    taskstatus_name: string;
    task_email: string;
    task_name: string;
    brand_id: number;
    brand_paidamount: number;
    brand_totalamount: number;
    brand_name: string;
    user_id: string | number;
    userpicturepath: string;
    user_picture:string;
    user_name: string;
    user_achieved: number;
    incomeindollar: number;
    incomeinrs: number;
    lossprofit: number;
    ppcexpenseindollar: number;
    ppcexpenseinrs: number;
    totalsalary: number;
    profilepath: string;
    path: string;
    remainingppcindollar: number;
    paidincomeindollar: number;
    ppcassignindollar: number;
    ppcspendindollar: number;
    remaininngincomeindollar: number;
    totalincomeindollar: number;
    user_target: number;
    achieve: number;
    paid: number;
    cancel: number;
    totaltarget: number;
    totalachieve: number;


    topagent: any;
    topbrand: any;
    carexpense: any;
    vanexpense: any;
    stats: any;
    daywisepaidincome: any;
    topdata: any;
    graphdata: any;
    calenderdata: any;
    otherexpense: any;
    agenttarget: any;
    sumallexpense: any;
    pendingtask: any;

    branddetails:{
        brand_id: number;
        brand_name: number;
        brand_cover: string;
        brand_date: string | number;
        brand_description: string;
        brand_email: string;
        brand_logo: string;
        brand_website: string;
        brandtype_id: number;
        brandlogopath: string;
    }

    saleagent: {
        user_id: number;
        user_name: string;
        user_picture: string;
        user_target: number;
        achieve: number;
        paid: number;
        cancel: number;
    }
    filter(arg0: (v: { 
        task_email: string; 
        taskstatus_name
        : string; 
        task_name: string; 
        tasktype_id: number;
    }) => any): any;
}