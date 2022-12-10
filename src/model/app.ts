import { IconNames } from "elements";
import { Roles } from "../constant/app";

type MetaLink = {
    active: boolean,
    label: string,
    url: string | null
}

export type SideNavItem = {
    heading: string;
    iconName?: IconNames;
    roles?: Array<Roles> | Array<IRole['role_id']>;
    children?: {[link in string]: SideNavItem};
    link?:string
}

export interface IRequestMeta {
    current_page: number
    first_page_url: string | null;
    from: number
    last_page: number
    last_page_url: string | null;
    links: Array<MetaLink>;
    next_page_url: string | null;
    path: string | null;
    per_page: number;
    prev_page_url: null
    to: number;
    total: number;
}

export interface IRole {
    role_id: number;
    role_name: string;
}
export interface IRouteGroup {
    id: string;
    iconName: IconNames;
    routes: Array<IRouteInstance>;
    title: string;
    roles: Array<IRole['role_id'] | string>;
    menu: boolean;
    parent: IRouteGroup;
    children: Array<IRouteGroup>;
}

export interface IRouteInstance {
    link: string;
    title: string;
    iconName: IconNames;
    roles: Array<IRole['role_id'] | string>;
    group: IRouteGroup;
    menu: boolean;
    groupId: IRouteGroup['id'];
}

export interface ICountry {
    country_id: number;
    country_name: string;
    status_id: number;
}