import { SideNavItem } from "../../../model/app";

const routes: Array<SideNavItem> = [
    {
        heading: "Dashboard",
        iconName: "bar-chart-fill",
        link: "/",
    },
    {
        heading: "Brands",
        iconName: "collection",
        link: "/brand"
    },
    {
        heading: "Orders",
        iconName: "list-ol",
        link: "/order"
    },
    {
        heading: "Sales",
        iconName: "receipt",
        link: "/sales"
    },
    {
        heading: "Projects",
        iconName: "briefcase",
        link: "/projects",
        children: {
            "/tasks":{
                heading: "Tasks",
                link: "/tasks",
            },
            "/timesheet":{
                heading: "Timesheet",
                link: "/timesheet"
            },
            "leaders":{
                heading: "Leaders",
                link: "/leaders"
            },
        }
    },
    {
        heading: "Users",
        iconName: "person",
        link: "/user"
    },
    {
        heading: "Clients",
        iconName: "people",
        link: "/clients"
    },
    {
        heading: "Members",
        iconName: "people-fill",
        link: "/members"
    },
]

export default routes;