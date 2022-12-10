//@ts-nocheck
import type { NextPage } from "next";
import React, { useRef } from "react";
import { Modal, IModalRef } from "elements";
import CreateUser from "../../components/user/CreateUser/CreateUser";

import styles from "../../styles/user/Users.module.css";
import Card from "../../components/shared/Card";
import UsersList from "../../components/user/UserList";

const Users: NextPage = () => {
  const modalRef = useRef<IModalRef>(null);
  return (
    <Card
      className={styles.userList__container}
      style={{
        border: "none",
        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
      }}
    >
      <UsersList />
      <Modal ref={modalRef}>
        <CreateUser onSuccess={() => modalRef.current?.showModal(false)} />
      </Modal>
    </Card>
  );
};

export default Users;
