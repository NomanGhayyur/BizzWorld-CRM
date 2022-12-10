import Button from "elements/lib/components/Button";
import Modal from "elements/lib/components/Modal";
import { useState } from "react";
import React from "react";
import Input from "elements/lib/components/Input";
import Icon from "elements/lib/components/Icon";

function usermodal() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Button onClick={handleShow}>Launch Form modal</Button>
      </div>
      <Modal style={{ background: "#ededed", width: "30%" }} show={show}>
        <div className="container">
          <div className="row mt-5">
            <div className="col-lg-5">
              <div className="text-left">
                <Icon name={"arrow-left"} style={{ color: "#000" }} />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="text-right">
                <p>Done</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div style={{ marginTop: "30px" }}>
                <Input placeholder="Search people" style={{ height: "50px" }} />
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-5">
              <div className="text-center">1</div>
            </div>
            <div className="col-lg-5">
              <div className="text-right">2</div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-5">
              <div className="text-center">1</div>
            </div>
            <div className="col-lg-5">
              <div className="text-right">2</div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-5">
              <div className="text-center">1</div>
            </div>
            <div className="col-lg-5">
              <div className="text-right">2</div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-5">
              <div className="text-center">1</div>
            </div>
            <div className="col-lg-5">
              <div className="text-right">2</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default usermodal;
