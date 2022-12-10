import { Button, Modal, Table, Input, Highlighter, Icon, IModalRef, ColorSchemes } from 'elements';
// import TaskDetail from '../../pages/tasks/[id]';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from './card.module.css'


type propType = {
    className?: string;
    style?: React.CSSProperties;
    type?: ColorSchemes;
    header?: JSX.Element | null | string;
    title?: string;
}


const Card = React.memo<React.PropsWithChildren<propType>>(props => {

    const modalRef = useRef<IModalRef>(null);

    const router = useRouter();

    useEffect(() => {
        if (router.asPath.split("#")[1]) {
            modalRef.current?.showModal(true)
        } else {
            modalRef.current?.showModal(false)
        }
    }, [router])

    const onBackdrop = useCallback(() => {
        if (router.asPath.split("#")[1]) {
            router.replace({pathname: router.pathname, query: router.query});
        }
    }, [router])

    const onSuccessCreate = useCallback(() => {
        onBackdrop();
    }, [onBackdrop])

    return (
        <>
        <div className={` mt-3 col-lg-3 card bg-${props.type || ""} ${props.className || ""}`} style={props.style} onClick={() => modalRef.current?.showModal(true)}>
            {props.header ? (
                <div className="card-header">
                    {props.header} header
                </div>
            ) : null}
            <div className="card-body">
                {props.title ? (
                    <h4 className="card-title">{props.title} hello world</h4>

                ) : null}
                {props.children}
                <h6 className={`do  ${styles.do}`}><strong>DO</strong></h6>
                <br />
                {/* <Image src={'https://i.pinimg.com/736x/0d/cf/b5/0dcfb548989afdf22afff75e2a46a508.jpg'} width={100} height={100} alt="Logo"/> */}
            <hr />
            <h5>TITILE</h5>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi.</p>
            </div>
            <Modal ref={modalRef} onBackdrop={onBackdrop}>
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-lg-12">
                            <Image src="https://i.pinimg.com/736x/0d/cf/b5/0dcfb548989afdf22afff75e2a46a508.jpg" width={200} height={200} alt="" />
                            </div>
                        </div>
                        <hr />
                {/* <Image src={'https://i.pinimg.com/736x/0d/cf/b5/0dcfb548989afdf22afff75e2a46a508.jpg'} width={100} height={100} alt="Logo"/> */}
           <div className="row">
            <div className="col-lg-9">
            <h5>TITILE</h5>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi.</p>
            <span><strong>Refrences:</strong></span>
            <ol>
                <li>example.com</li>
                <li>example2.com</li>
                <li>example3.com</li>
            </ol>
            </div>
            <div className="col-lg-3">
                <span><strong>Members:</strong></span>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
           </div>

                    </div>
                {/* <TaskDetail taskId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} /> */}
            </Modal>
        </div>
        </>
    )
});


export default Card;