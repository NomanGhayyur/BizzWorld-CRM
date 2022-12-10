import { Avatar, Button, Tab, ITabItem, Badge, Icon } from 'elements';
import moment from 'moment';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteBrandDetail,
  getBrandDetail,
  getBrandType,
} from '../../api/brand';
import BrandUserList from '../../components/Brand/BrandUserList';
import OverviewGenerator from '../../components/shared/OverviewGenerator';
import { headingType } from '../../components/shared/OverviewGenerator/OverviewGenerator';
import { DATE_FORMAT, Roles } from '../../constant/app';
import { IBrand } from '../../model/brand';
import { AppThunkDispatch, RootState } from '../../redux/types';
import styles from '../../styles/brand/BrandDetail.module.css';
import LeadList from '../../components/Lead/LeadList';
import Loader from '../../components/shared/Loader';
import Image from 'next/image';
import Delete from '../../../public/icons/delete.svg';
import Update from '../../../public/icons/update.svg';

const overviewHeadings: headingType = {
  Name: 'brand_name',
  Email: 'brand_email',
  Website: {
    key: 'brand_website',
    transform: (website: IBrand['brand_website']) => {
      return (
        <Badge style={{ fontSize: '1rem' }} type="success">
          <a href={website} target="__blank">
            {website}
          </a>
        </Badge>
      );
    },
  },
  'Brand Type': 'brandtype_name',
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
  Description: {
    key: 'brand_description',
    transform: (description: IBrand['brand_description']) => {
      return (
        <div className="container">
          <p
            style={{
              position: 'absolute',
            }}
          >
            {description}
          </p>
        </div>
      );
    },
  },
};

const BrandDetail: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppThunkDispatch>();
  const { id } = router.query;
  const { brandtype_name } = router.query;
  const [logoPathPrefix, setLogoPathPrefix] = useState<string>('');
  const [coverPathPrefix, setCoverPathPrefix] = useState<string>('');
  const user = useSelector((store: RootState) => store.auth.user);
  const [brands, setBrands] = useState<Array<string>>([]);
  const {
    data: brand,
    isLoading,
    refetch: reloadUsers,
  } = useQuery<IBrand>(
    `Brand_${id}`,
    async () => {
      const response = await dispatch(
        getBrandDetail({ data: { brand_id: id } })
      );
      const type = await dispatch(
        getBrandType({ data: { brandtype_name: brandtype_name } })
      );
      setLogoPathPrefix(response.logopath);
      setCoverPathPrefix(response.coverpath);
      setBrands(response.brands);
      return response.data;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );

  const onDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            brand_id: brand?.brand_id,
          },
        };
        await dispatch(deleteBrandDetail(params));
        router.replace('/brand');
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, router, brand]
  );

  const onEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      router.push(`/brand/update/${brand?.brand_id}`);
    },
    [brand, router]
  );

  const tabs: ITabItem = useMemo(() => {
    return {
      Overview: (
        <OverviewGenerator
          headings={overviewHeadings}
          data={brand}
          brands={brands}
        />
      ),
      Users: <BrandUserList />,
      Leads: <LeadList />,
    };
  }, [brand, brands]);

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
    <>
      <div className="container-fluid" style={{ background: 'white' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div className="col-lg-6 d-flex" style={{ marginTop: '24px' }}>
            <div className="imagebox">
              {user?.user_picture ? (
                <Avatar
                  className={styles.brandDetail__avatar}
                  src={`${logoPathPrefix}${brand?.brand_logo}`}
                  name={`${user?.user_name}`.trim()}
                />
              ) : null}
            </div>
            <div
              className="text-box"
              style={{ transform: 'translateY(-18px)' }}
            >
              <h5 style={{ height: '1px', paddingTop: '5px' }}>
                {' '}
                {`${brand?.brand_name}`}
              </h5>
              <p>{`${user?.user_name}`}</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className="text-center"
              style={{
                position: 'absolute',
                right: '10px',
                top: '7%',
              }}
            >
              <div className="d-flex">
                {user &&
                ![Roles.PRODUCTION_HEAD, Roles.MARKETING_HEAD].includes(
                  user?.role_id
                ) ? (
                  <div className="button" style={{ marginRight: '16px' }}>
                    <Button
                      iconName="plus"
                      onClick={() =>
                        router.push({
                          pathname: '/lead/create',
                          query: { brand_id: brand?.brand_id },
                        })
                      }
                    >
                      Create Lead
                    </Button>
                  </div>
                ) : null}
                {user &&
                ![
                  Roles.SALES_AGENT,
                  Roles.PRODUCTION_HEAD,
                  Roles.MARKETING_HEAD,
                ].includes(user?.role_id) ? (
                  <div style={{}}>
                    <span
                      style={{
                        marginLeft: '3px',
                        cursor: 'pointer',
                        marginRight: '3px',
                      }}
                      title="Delete"
                      onClick={onDelete}
                    >
                      <Image src={Delete} alt="Alt" width={'40px'} />
                    </span>

                    <span
                      style={{
                        marginLeft: '3px',
                        cursor: 'pointer',
                        marginRight: '3px',
                      }}
                      title="Edit"
                      onClick={onEdit}
                    >
                      <Image src={Update} alt="Alt" width={'40px'} />
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <Tab data={tabs} style={{}} />
        </div>
      </div>
    </>
  );
};

export default BrandDetail;
