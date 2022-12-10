import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import Loader from '../../../components/shared/Loader';
import { AppThunkDispatch } from '../../../redux/types';
import styles from './budgetdetail.module.css';
import Delete from '../../../../public/icons/delete.svg';
import Update from '../../../../public/icons/update.svg';
import { IPPC } from '../../../model/ppc';
import { deletePPCBudget, getPPCBudgetDetail } from '../../../api/budget';

type propType = {
  assignppcId: number;
};
const BudgetDetail = ({ assignppcId }: propType) => {
  const router = useRouter();
  const dispatch = useDispatch<AppThunkDispatch>();

  const {
    data: ppcbudget,
    isLoading,
    refetch,
  } = useQuery<IPPC>(
    `PPCBudget_${assignppcId}`,
    async () => {
      const response = await dispatch(
        getPPCBudgetDetail({ params: { assignppc_id: assignppcId } })
      );
      return response.data;
    },
    {
      enabled: !!assignppcId,
    }
  );

  const onDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            assignppc_id: ppcbudget?.assignppc_id,
          },
        };
        await dispatch(deletePPCBudget(params));
      } catch (e) {
        console.error(e);
      }
      router.push(`/assignBudget/`);
    },
    [dispatch, ppcbudget?.assignppc_id, router]
  );

  const onEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      router.push(`/assignBudget/update/${ppcbudget?.assignppc_id}`);
    },
    [ppcbudget?.assignppc_id, router]
  );

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
              // style={{ marginBottom: '40px' }}
              style={{
                minHeight: '280px',
              }}
            >
              <div
                className="card-header"
                style={{ background: 'rgba(0,0,0,.03)' }}
              >
                <div className="row" style={{ alignItems: 'baseline' }}>
                  <div className="col-lg-6">
                    <h4
                      className={styles.ppctitleheading}
                      style={{
                        paddingLeft: '10px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {`${ppcbudget?.assignuser_name}`}
                    </h4>
                  </div>
                  <div className="col-lg-4"></div>
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
                </div>
              </div>
              <div className="card-body">
                <div
                  className="row"
                  style={{ marginLeft: 'calc(-0. * var(--bs-gutter-x))' }}
                >
                  <div className="col-lg-3">
                    <h5 style={{ height: '1px' }}>Amount</h5>
                    <p> {ppcbudget?.assignppc_amount}</p>
                  </div>
                  <div className="col-lg-3">
                    <h5 style={{ height: '1px' }}>Month</h5>
                    <p> {ppcbudget?.assignppc_month}</p>
                  </div>
                  <div className="col-lg-3">
                    <h5 style={{ height: '1px' }}>Created By</h5>
                    <p> {ppcbudget?.creator}</p>
                  </div>
                </div>
                <div
                  className="row mb-4"
                  style={{ marginLeft: 'calc(-0. * var(--bs-gutter-x))' }}
                >
                  <div className="col-lg-12">
                    <h5 style={{ height: '1px' }}>Description</h5>
                    <p> {ppcbudget?.assignppc_description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
