import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { AppProps } from "next/app";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createReduxStore } from "../redux/store";
import { AppThunkDispatch, RootState } from "../redux/types";
import { useRouter } from "next/router";
import { setAuthUser } from "../redux/actions/auth";
import MainLayout from "../layout/main";
import { authRoutes } from "../constant/app";
import Head from "next/head";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import "../../public/css/bootstrap.min.css";
import "../styles/globals.css";
import { StyleSheet } from "elements";
import {
  getCountryList,
  getRoles,
  getRoutes,
  getRouteGroups,
} from "../api/app";
import { ToastContainer } from "react-toastify";
import toast from "../components/shared/Notify";
import "react-toastify/dist/ReactToastify.css";
import { Chart, registerables } from "chart.js";
import Notify from "../components/shared/Notify";

if (typeof window !== "undefined") {
  StyleSheet.rehydrate((window as any).__REHYDRATE_IDS);
  Chart.register(...registerables);
}

const App = React.memo((props: PropsWithChildren<{}>) => {
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const dispatch = useDispatch<AppThunkDispatch>();

  const authenticate = useCallback(() => {
    const auth_user = localStorage.getItem("auth_user");
    if (auth_user) {
      try {
        return dispatch(setAuthUser(JSON.parse(auth_user)));
      } catch (e) {
        console.log(e);
      }
    } else if (!authRoutes.some((v) => router.asPath.includes(v))) {
      router.replace("/login");
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (!user?.user_id) {
      authenticate();
    } else if (authRoutes.some((v) => router.asPath.includes(v))) {
      Notify({ type: "success", message: "Login Successful" });
      router.replace("/");
      // alert('login successful');
    }
  }, [authenticate, router, user]);

  useEffect(() => {
    if (user?.user_id) {
      dispatch(getRoles());
      dispatch(getCountryList());
      dispatch(getRoutes());
      dispatch(getRouteGroups());
    }
  }, [user, dispatch]);

  // useInitAPI();

  if (!user?.user_id) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return <MainLayout>{props.children}</MainLayout>;
});

export default React.memo(({ Component, pageProps }: AppProps) => {
  const store = useMemo(() => createReduxStore(), []);
  const queryClient = useRef(new QueryClient()).current;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <Head>
            <link rel="icon" href="/favicon.svg" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            {/* <link
              href={`https://fonts.googleapis.com/css2?family=Readex+Pro:wght@500&display=swap`}
              rel="stylesheet"
            /> */}
            <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
          </Head>
          <App>
            <Component {...pageProps} />
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              draggable={false}
              theme="light"
            />
          </App>
        </Hydrate>
      </QueryClientProvider>
    </Provider>
  );
});
