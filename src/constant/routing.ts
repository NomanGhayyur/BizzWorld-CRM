import { SideNavItem } from "../model/app";
import { Roles } from "./app";

const routes: { [link in string]: SideNavItem } = {
    "/": {
        heading: "Dashboard",
        iconName: "bar-chart-fill",
    },
    // "/routes": {
    //     heading: "Routes Management",
    //     iconName: "list-ol",
    //     roles: [Roles.SUPER_ADMIN]
    // },
    "/b": {
        heading: "Brands",
        iconName: "collection",
        children: {
            "/brand": {
                heading: "Brands List",
                iconName: "view-list",
            },
            "/brand/create": {
                heading: "Create Brand",
                iconName: "plus",
                roles: [Roles.SUPER_ADMIN, Roles.UNIT_HEAD]
            },
        },
        roles: [Roles.MARKETING_HEAD, Roles.MARKETING_AGENT, Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager,Roles.UNIT_HEAD]
        
    },

    "/l": {
        heading: "Leads",
        iconName: "collection",
        children: {
            "/lead": {
                heading: "Leads List",
                iconName: "list-check",
                roles: [Roles.SALES_AGENT, Roles.SUPER_ADMIN, Roles.SALES_Manager]

            },
            "/lead/cancelledlead": {
                heading: "Cancelled Leads",
                iconName: "journal-x",
                roles: [Roles.SALES_AGENT, Roles.SUPER_ADMIN, Roles.SALES_Manager]

            },

            "/lead/autolead": {
                heading: "Auto Leads",
                iconName: "list-nested",
                roles: [Roles.MARKETING_HEAD, Roles.MARKETING_AGENT, Roles.SUPER_ADMIN]

            },
            "/lead/manuallead": {
                heading: "Manual Leads",
                iconName: "list-task",
                roles: [Roles.MARKETING_HEAD, Roles.MARKETING_AGENT, Roles.SUPER_ADMIN]
            },
            "/lead/create": {
                heading: "Create Lead",
                iconName: "plus",
                roles: [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager]
            },
        },
        roles: [Roles.MARKETING_HEAD, Roles.MARKETING_AGENT, Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager,Roles.UNIT_HEAD]
    },

    "/cli": {
        heading: "Clients",
        iconName: "list-ol",
        children:{
    "/clientsList": {
        heading: "Clients List",
        iconName: "person-lines-fill",
    },
},
roles: [Roles.MARKETING_HEAD, Roles.SUPER_ADMIN, Roles.UNIT_HEAD, Roles.Billing]
    },
    "/o": {
        heading: "Orders",
        iconName: "list-ol",
        children:{
    "/order/savedorder": {
        heading: "Saved Orders",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN,]
        },
   
    "/order": {
        heading: "Orders",
        iconName: "list-columns",
        roles: [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD,]
    },
    "/order/assignedorder": {
        heading: "Assigned Orders",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD, Roles.SALES_AGENT, Roles.SALES_Manager]
    },
    "/order/completeorder": {
        heading: "Complete Orders",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD, Roles.SALES_AGENT, Roles.SALES_Manager]
    },
    "/order/cancelledorder": {
        heading: "Cancelled Orders",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager]
    },
    "/order/haultorder": {
        heading: "Hault Orders",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager]
    },
    "/order/sendtoclient": {
        heading: "Sent To Client",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager]
    },
    "/order/editbyclient": {
        heading: "Edit By Client",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD, Roles.SALES_AGENT, Roles.SALES_Manager]
    },
    "/order/editfix": {
        heading: "Edit Fixed",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager, Roles.PRODUCTION_HEAD ]
    },

    "/order/approved": {
        heading: "Approved",
        iconName: "journal-x",
        roles: [Roles.SUPER_ADMIN,  Roles.SALES_AGENT,Roles.SALES_Manager ]
    },
    "/order/allorderlist": {
        heading: "All Orders List",
        iconName: "list-columns",
        roles: [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD,]
    },

    // "/order/create": {
    //     heading: "Create Order",
    //     iconName: "plus",
    // },
},
    roles: [Roles.SUPER_ADMIN,  Roles.SALES_AGENT, Roles.SALES_Manager, Roles.PRODUCTION_HEAD,Roles.UNIT_HEAD ]
    },



    "/t": {
        heading: "Tasks",
        iconName: "list-ol",
        // roles: [Roles.SALES_AGENT, Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD],

        children: {
            "/tasks": {
                heading: "Tasks",
                iconName: "list-check",
            },
            "/tasks/taskList": {
                heading: "Tasks List",
                iconName: "list-columns-reverse",
                roles: [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD,]
            },

            // "/tasks/create": {
            //     heading: "Create Task",
            //     iconName: "plus",
            // },
        },
    roles: [Roles.SUPER_ADMIN,  Roles.SALES_AGENT,Roles.SALES_Manager, Roles.PRODUCTION_HEAD, Roles.UNIT_HEAD, Roles.DIGITIZER, Roles.DESIGNER, Roles.CMS_Developer, Roles.Animation, Roles.SEO, Roles.Content_Writer, Roles.FRONT_DEVELOPER, ]

    },
    "/pp": {
        heading: "PPC",
        iconName: "wallet2",
        children: {
            "/ppc": {
                heading: "PPC List",
                iconName: "view-list",
            },
            "/ppc/create": {
                heading: "Create PPC",
                iconName: "plus",
            },
            "/assignBudget": {
                heading: "Budget List",
                iconName: "currency-exchange",
            },
            "/assignBudget/create": {
                heading: "Assign Budget",
                iconName: "plus",
            },
        },
        roles: [Roles.SUPER_ADMIN,Roles.MARKETING_HEAD, Roles.MARKETING_AGENT, Roles.UNIT_HEAD]
    },
    "/py": {
        heading: "Payments",
        iconName: "cash-coin",
        children: {
            "/payments/duePayments": {
                heading: "Due Payments",
                iconName: "calendar-event",
            },
            "/payments/forwardedtobilling": {
                heading: "Forwarded To Billing",
                iconName: "receipt",
            },
            // "/payments/paidpayments": {
            //     heading: "Paid",
            //     iconName: "currency-dollar",
            // },
            // "/payments/cancelpayments": {
            //     heading: "Cancel",
            //     iconName: "x-square",
            // },
        },
        roles: [Roles.SUPER_ADMIN,Roles.UNIT_HEAD, Roles.SALES_AGENT,Roles.SALES_Manager, Roles.UNIT_HEAD, ]
    },

    "/user": {
        heading: "Users",
        iconName: "person-lines-fill",
        roles: [Roles.MARKETING_HEAD, Roles.SUPER_ADMIN, Roles.UNIT_HEAD, Roles.PRODUCTION_HEAD]
    },
    "/billing": {
        heading: "Deals Bucket",
        iconName: "stickies-fill",
        children: {
            "/billingOrders/paymentsBucket": {
                heading: "Payments Bucket",
                iconName: "calendar-event",
            },
            "/paidDeals": {
                heading: "Paid Deals",
                iconName: "calendar-event",
            },
            "/recoveryDeals": {
                heading: "Recovery Deals",
                iconName: "calendar-event",
            },
            "/unpaidDeals": {
                heading: "Cancel Deals",
                iconName: "calendar-event",
            },
           
           
        },
        roles: [Roles.Billing, Roles.SUPER_ADMIN],
    },
    "/freshLead": {
        heading: "Fresh Leads",
        iconName: "person-lines-fill",
roles: [Roles.MARKETING_HEAD, Roles.SUPER_ADMIN, Roles.UNIT_HEAD, Roles.PRODUCTION_HEAD, Roles.Billing]

      
    },
    "/billingMerchant": {
        heading: "Billing Merchant",
        iconName: "person-lines-fill",
        roles: [Roles.SUPER_ADMIN,  Roles.Billing, ]
    },

    "/reporting": {
        heading: "Reports",
        iconName: "stickies-fill",
        children: {
            "/reports/employeeTarget": {
                heading: "Employee Target",
                iconName: "calendar-event",
            },
            "/reports/campaign": {
                heading: "Campaign Target",
                iconName: "calendar-event",
            },
           
        },
        roles: [Roles.Billing, Roles.SUPER_ADMIN, Roles.UNIT_HEAD],
    },

}

export default routes;