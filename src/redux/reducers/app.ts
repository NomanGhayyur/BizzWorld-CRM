import { ICountry, IRole, IRouteGroup, IRouteInstance } from "../../model/app";

export interface IAppReducer {
  overlaySpinner: boolean;
  drawer: boolean;
  activeRoute: IRouteInstance | null;
  roles: Array<IRole>;
  routes: Array<IRouteInstance>;
  groupedRoutes: Array<IRouteGroup>;
  countries: Array<ICountry>;
}

const initialState: IAppReducer = {
  overlaySpinner: false,
  drawer: false,
  activeRoute: null,
  roles: [],
  groupedRoutes: [],
  countries: [],
  routes: [],
};

const app = (state: IAppReducer = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_OVERLAY_SPINNER':
      return (state = {
        ...state,
        overlaySpinner: action.overlaySpinner,
      });
    case 'SET_DRAWER_STATE':
      return (state = {
        ...state,
        drawer: action.drawer,
      });
    case 'SET_ROUTES':
      return (state = {
        ...state,
        routes: action.routes,
      });
    case 'SET_GROUPED_ROUTES':
      return (state = {
        ...state,
        groupedRoutes: action.groupedRoutes,
      });
    case "SET_ROLES":
      return (state = {
        ...state,
        roles: action.roles,
      })
    case "SET_COUNTRY_LIST":
      return (state = {
        ...state,
        countries: action.countries,
      })
    default:
      return state;
  }
};

export default app;