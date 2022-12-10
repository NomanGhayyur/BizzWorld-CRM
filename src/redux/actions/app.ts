import { ICountry, IRole, IRouteGroup, IRouteInstance } from "../../model/app";

export const setOverlaySpinner = (overlaySpinner: boolean) => {
  return {
    type: 'SHOW_OVERLAY_SPINNER',
    overlaySpinner,
  };
};

export const setDrawerState = (drawer: boolean) => {
  return {
    type: 'SET_DRAWER_STATE',
    drawer,
  };
};

export const setPhoneNumber = (phId: string) => {
  return {
    type: 'SET_PHONE_NUMBER',
    phId,
  };
};

export const setRoutes = (routes: IRouteInstance[]) => {
  return {
    type: "SET_ROUTES",
    routes,
  }
}

export const setGroupRoutes = (groupedRoutes: IRouteGroup[]) => {
  return {
    type: "SET_GROUPED_ROUTES",
    groupedRoutes,
  }
}

export const setRoles = (roles: Array<IRole>) => {
  return {
    type: "SET_ROLES",
    roles
  }
}

export const setCountries = (countries: Array<ICountry>) => {
  return {
    type: "SET_COUNTRY_LIST",
    countries
  }
}
