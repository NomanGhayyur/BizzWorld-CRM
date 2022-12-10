//@ts-nocheck
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Input, Icon, IModalRef } from "elements";
import CreateUser from "../../components/user/CreateUser/CreateUser";
import FilterUserList from "../../components/user/FilterUserList/FilterUserList";
import { RootState } from "../../redux/types";
// import styles from '../../../styles/user/Users.module.css';
import Card from "../../components/shared/Card";
import UsersList from "../../components/user/UserList";
import UserDetail from "../../components/user/userdetails/userdetail";

const Users: NextPage = () => {
  const [filterText, setFilterText] = useState<string>("");
  const [appliedFilters, setFilters] =
    useState<{ [key in string]: string | number }>();
  const [borderView, setBorderView] = useState<boolean>(false);
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
      // window.clearTimeout(inputDebounce.current)
      // inputDebounce.current = window.setTimeout(() => {
      //     setFilters(f => ({
      //         ...f,
      //         last_name: Contains(e.target.value),
      //         email: Contains(e.target.value),
      //         first_name: Contains(e.target.value),
      //         contact_number: Contains(e.target.value),
      //     }))
      // }, 1000)
    }, []);

  const onApplyFilters = useCallback(
    (filters: { [key in string]: string | number }) => {
      setFilters({
        // contact_number: filters.contact_number,
        // email: filters.email,
        // first_name: filters.first_name,
        // membership_status: filters.membership_status,
        // role: filters.role,
        // status: filters.status,
      });
    },
    []
  );

  const onRemoveFilter = useCallback((key: string) => {
    setFilters((filters) => {
      const f = Object.assign({}, filters);
      if (f) delete f[key];
      return f;
    });
  }, []);

  return (
    // <Card className={styles.userList__container}>
    <Card>
      <UserDetail userId={0} />
    </Card>
  );
};

export default Users;
