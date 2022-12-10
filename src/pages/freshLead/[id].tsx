import {
    Avatar,
    Button,
    RandomImage,
    Tab,
    ITabItem,
    Badge,
    Icon,
  } from 'elements';
  import moment from 'moment';
  import { NextPage } from 'next';
  import Image from 'next/image';
  import { useRouter } from 'next/router';
  import { useCallback, useMemo, useState } from 'react';
  import { useQuery } from 'react-query';
  import { useDispatch, useSelector } from 'react-redux';
  import { getLeadDetail } from '../../api/lead';
  import { deleteLead } from '../../api/lead';
  import Card from '../../components/shared/Card';
  import Loader from '../../components/shared/Loader';
  import OverviewGenerator from '../../components/shared/OverviewGenerator';
  import { headingType } from '../../components/shared/OverviewGenerator/OverviewGenerator';
  import { DATE_FORMAT } from '../../constant/app';
  import { ILead } from '../../model/lead';
  import { AppThunkDispatch, RootState } from '../../redux/types';
  import styles from './leaddetail.module.css';
  import Delete from '../../../public/icons/delete.svg';
  import Update from '../../../public/icons/update.svg';
  
  const overviewHeadings: headingType = {
    Name: 'lead_name',
    Email: 'lead_email',
    BusinessName: 'lead_bussinessname',
    AltEmail: 'lead_altemail',
    Phone: 'lead_phone',
    CountryID: 'country_id',
    StateID: 'state_id',
    CityID: 'city_id',
    ZipCode: 'lead_zip',
    Address: 'lead_address',
    BusinessEmail: 'lead_bussinessemail',
    BusinessWebsite: 'lead_bussinesswebsite',
    BusinessPhone: 'lead_bussinessphone',
    OtherDetails: 'lead_otherdetails',
  
    'Active Since': {
      key: 'created_at',
      transform: (created_at) => (
        <p className="lead mb-0">{moment(created_at).format(DATE_FORMAT)}</p>
      ),
    },
    'Updated At': {
      key: 'updated_at',
      transform: (updated_at) => (
        <p className="lead mb-0">{moment(updated_at).format(DATE_FORMAT)}</p>
      ),
    },
  };
  type propType = {
    leadId: number;
  };
  const LeadDetail = ({ leadId }: propType) => {
    // const LeadDetail: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppThunkDispatch>();
    const { id } = router.query;
  
    const {
      data: lead,
      isLoading,
      refetch,
    } = useQuery<ILead>(
      `Lead_${leadId}`,
      async () => {
        const response = await dispatch(
          getLeadDetail({ params: { lead_id: leadId } })
        );
        return response.data;
      },
      {
        enabled: !!leadId,
      }
    );
  
    const onDelete = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        try {
          const params = {
            data: {
              lead_id: lead?.lead_id,
            },
          };
          // await dispatch(deleteUser({params: { edituser_id: id } }));
          await dispatch(deleteLead(params));
          // router.replace(`/brand/${lead?.brand_id}`);
        } catch (e) {
          console.error(e);
        }
        router.back();
      },
      [dispatch, lead?.lead_id, router]
    );
  
    const onEdit = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`/lead/update/${lead?.lead_id}`);
      },
      [lead, router]
    );
  
    const tabs: ITabItem = useMemo(() => {
      return {
        Overview: (
          <OverviewGenerator
            headings={overviewHeadings}
            data={lead}
            brands={[]}
          />
        ),
      };
    }, [lead]);
  
    if (isLoading) {
      return (
        <div
          className="d-flex justify-cntent-center align-items-center"
          style={{ height: '100vh' }}
        >
          <Loader fullPage />
        </div>
      );
    }
  
    return (
      <div>
        <div className="container-fluid">
          <div className="row align-items-center mt-5">
            <div
              className={`col-12 mx-auto ${styles.cardcontainermarginpadding}`}
            >
              <div
                className="card shadow border"
                style={{ marginBottom: '40px' }}
              >
                <div
                  className="card-header"
                  style={{ background: 'rgba(0,0,0,.03)' }}
                >
                  <div className="row" style={{ alignItems: 'baseline' }}>
                    <div className="col-lg-2">
                      <h4
                        className={styles.leadtitleheading}
                        style={{
                          paddingLeft: '10px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {`${lead?.lead_name}`}
                      </h4>
                    </div>
                    <div className="col-lg-8"></div>
  
                    <div className="col-lg-2">
                      <div
                        className="text-right"
                        style={{
                          marginRight: '8px',
                        }}
                      >
                        <span
                          style={{
                            marginLeft: '3px',
                            marginRight: '3px',
                            cursor: 'pointer',
                          }}
                          title="Delete"
                          onClick={onDelete}
                        >
                          <Image src={Delete} alt="Alt" width={'25px'} />
                        </span>
  
                        <span
                          style={{
                            marginLeft: '3px',
                            marginRight: '3px',
                            cursor: 'pointer',
                          }}
                          title="Edit"
                          onClick={onEdit}
                        >
                          <Image src={Update} alt="Alt" width={'25px'} />
                        </span>
                      </div>
                    </div>
  
                    {/* <div
                          className="text-right"
                        >
                          <div className="d-flex">
                            <div style={{  }}>
                              <Icon
                                name="trash"
                                className="trash m-3"
                                onClick={onDelete}
                              />
                              <Icon
                                name="pencil-square"
                                className="m-3 pencil"
                                onClick={onEdit}
                              />
                            </div>
                          </div>
                        </div> */}
                  </div>
                </div>
  
                <div className="card-body">
                  <div
                    className="row mb-4"
                    style={{ marginLeft: 'calc(-0. * var(--bs-gutter-x))' }}
                  >
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>Name</h5>
                      <p> {lead?.lead_name}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>Email</h5>
                      <p> {lead?.lead_email}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>BusinessName</h5>
                      <p> {lead?.lead_bussinessname}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>AltEmail</h5>
                      <p> {lead?.lead_altemail}</p>
                    </div>
  
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>Phone</h5>
                      <p>{lead?.lead_phone}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>Country</h5>
                      <p>{lead?.country_name}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>State</h5>
                      <p> {lead?.state_name}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>City</h5>
                      <p> {lead?.city_name}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>BusinessWebsite</h5>
                      <div
                        className="badge  bg-success"
                        style={{ fontSize: '17px' }}
                      >
                        {lead?.lead_bussinesswebsite}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>BusinessPhone</h5>
                      <p>{lead?.lead_bussinessphone}</p>
                    </div>
  
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>State</h5>
                      <p> {lead?.state_name}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>ZipCode</h5>
                      <p> {lead?.lead_zip}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>Address</h5>
                      <p> {lead?.lead_address}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: '1px' }}>BusinessEmail</h5>
                      <p> {lead?.lead_bussinessemail}</p>
                    </div>
                    <div className="col-lg-10">
                      <h5 style={{ height: '1px' }}>Description</h5>
                      <p> {lead?.lead_otherdetails}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      // <Card className={styles.brandDetail__container}>
      //   {/* <RandomImage className={styles.brandDetail__cover} /> */}
      //   {/* <Card className={styles.brandDetail__headerDetail}> */}
      //   <div className={styles.brandDetail__avatarContainer}>
      //     <div className={styles.brandDetail__innerAvatarContainer}>
      //       <div className={styles.brandDetail__leadNameContainer}>
      //         <h2>{`${lead?.lead_name}`}</h2>
      //         <p>{lead?.lead_email}</p>
      //       </div>
      //     </div>
      //     <div className={styles.brandDetail__leadActions}>
      //       <Button outline type="danger" iconName="trash" onClick={onDelete}>
      //         Delete
      //       </Button>
      //       <Button type="primary" iconName="pencil" onClick={onEdit}>
      //         Edit
      //       </Button>
      //     </div>
      //   </div>
      //   <Tab data={tabs} />
      //   {/* </Card> */}
      // </Card>
    );
  };
  
  export default LeadDetail;
  