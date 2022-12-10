import { Table, Button, Highlighter, Icon, Input, IModalRef } from "elements";
import { NextPage } from "next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../../styles/brand/Brand.module.css";
import Card from "../../components/shared/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import { brandType, deleteBrandDetail, getBrandList } from "../../api/brand";
import { IBrand, IBrandListItem } from "../../model/brand";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roles } from "../../constant/app";
import { getUserBrandList } from "../../api/user";
import Loader from "../../components/shared/Loader";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";

type propTypes = {
  brand?: Array<IBrand>;
  className?: string;
  style?: React.CSSProperties;
};

const Brands: NextPage = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");

  const [logoPathPrefix, setLogoPathPrefix] = useState<string>("");
  const [borderView, setBorderView] = useState<boolean>(false);
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();

  const {
    data: brand,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IBrandListItem>>(
    `BrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      setLogoPathPrefix(response.logopath);
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = useCallback(
    (brand: IBrand) => {
      router.push(`/brand/${brand.brand_id}`);
    },
    [router]
  );

  const onDelete = useCallback(
    async (
      brandId: IBrand["brand_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            brand_id: brandId,
          },
        };
        await dispatch(deleteBrandDetail(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onEdit = useCallback(
    (
      brandId: IBrand["brand_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/brand/update/${brandId}`);
      // event.stopPropagation();
      // router.replace(`/brand/update/${brandId}`)
    },
    [router]
  );

  const onRestore = useCallback(
    async (
      brandId: IBrand["brand_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );
  const columns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "brand_id",
        render: (v: any, _: any, index: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Brand Name",
        keyIndex: "brand_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortIndex: "brand_name",
        sortable: true,
      },

      {
        label: "Email",
        keyIndex: "brand_email",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Website",
        keyIndex: "brand_website",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
    ];

    if (
      user &&
      ![
        Roles.SALES_AGENT,
        Roles.MARKETING_HEAD,
        Roles.PRODUCTION_HEAD,
      ].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "brand_id,deleted_at",
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.brand_id)}
              >
                <Image src={Delete} alt="Alt" width={"25px"} />
              </span>
            ) : (
              <span className="arrowclock">
                <Icon
                  className="m-1"
                  name="arrow-counterclockwise"
                  onClick={onRestore.bind(this, v.brand_id)}
                />
              </span>
            )}
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.brand_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onDelete, onRestore, onEdit, user]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const onSuccessCreate = useCallback(() => {
    onBackdrop();
  }, [onBackdrop]);

  const filtered: Array<IBrandListItem> = useMemo(() => {
    if (filterText) {
      return (
        brand?.filter((v: IBrandListItem) => {
          return (
            v.brand_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.brand_email?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            `${v.brandtype_id}`
              .toLowerCase()
              ?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return brand || [];
  }, [brand, filterText]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-cntent-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Loader fullPage />
      </div>
    );
  }
  return (
    <Card
      className={styles.brandList__container}
      style={{
        border: "none",
        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
      }}
    >
      <div className="row">
        <div className="col-lg-2 mt-1">
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Brands</h4>
        </div>
        <div className="col-lg-3">
          {" "}
          <Icon
            name={"arrow-left"}
            onClick={() => router.back()}
            style={{ marginTop: "13px" }}
          />
        </div>
        <div className="col-lg-7 d-flex justify-content-right mt-3">
          <div className="ml-6 col-6" style={{ marginRight: "10px" }}>
            <Input placeholder="Search Brand" onChange={onSearchByText} />
          </div>
          <div className={styles.createbrandheading}>
            {user?.role_id === Roles.SUPER_ADMIN && (
              <Button
                iconName="plus"
                onClick={() => router.push("/brand/create")}
              >
                Create Brands
              </Button>
            )}
          </div>
          <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
            {!borderView ? (
              <Icon name="table" onClick={setBorderView.bind(this, true)} />
            ) : (
              <Icon name="list" onClick={setBorderView.bind(this, false)} />
            )}
          </div>
        </div>
      </div>

      <div className={`row `}>
        {borderView ? (
          <React.Fragment>
            {filtered.map((brand) => (
              <div className="col-lg-3" key={brand.brand_id}>
                <div
                  className="card"
                  key={brand.brand_id}
                  style={{
                    width: "17rem",
                    marginTop: "20px",
                    height: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/brand/${brand.brand_id}`)}
                >
                  <div
                    className="abc"
                    style={{
                      borderRadius: "5px",
                      marginTop: "20px",
                      marginLeft: "14px",
                      marginRight: "12px",
                    }}
                  >
                    <div>
                      {logoPathPrefix && brand.brand_logo ? (
                        <Image
                          className="card-img-top"
                          src={`${logoPathPrefix}${brand.brand_logo}`}
                          width={"230"}
                          height={"90"}
                          alt=""
                        />
                      ) : null}
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        <h5
                          className="p-0 m-0"
                          style={{ paddingLeft: "0px", height: "1px" }}
                        >
                          {brand.brand_name}
                        </h5>
                        <h5 style={{ paddingLeft: "0px", fontSize: "13px" }}>
                          {brand.brand_email}
                        </h5>
                      </div>
                      <div
                        className="d-flex mb-1"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="dateicon">
                          <span
                            style={{
                              marginLeft: "3px",
                              marginRight: "3px",
                            }}
                            title="Delete"
                            onClick={onDelete.bind(this, brand.brand_id)}
                          >
                            <Image src={Delete} alt="Alt" width={"25px"} />
                          </span>
                          <span
                            style={{
                              marginLeft: "3px",
                              marginRight: "3px",
                            }}
                            title="Edit"
                            onClick={onEdit.bind(this, brand.brand_id)}
                          >
                            <Image src={Update} alt="Alt" width={"25px"} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ) : (
          <Table
            onSortData={(sortKey, direction) =>
              setSortKeys({ [sortKey as keyof IBrandListItem]: direction })
            }
            autoSort={false}
            loading={isLoading}
            onRowItemClick={onRowItemClick}
            onPageChange={(p) => console.log(p)}
            data={filtered}
            columnHeadings={columns}
          />
        )}
      </div>
    </Card>
  );
});
export default Brands;
