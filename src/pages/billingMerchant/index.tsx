import {
  Table,
  Button,
  Highlighter,
  Icon,
  Input,
  IModalRef,
  Modal,
  IDropdownItem,
  Dropdown,
} from "elements";
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
import { IMerchant, IMerchantList } from "../../model/merchant";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roles } from "../../constant/app";
import { getUserBrandList } from "../../api/user";
import Loader from "../../components/shared/Loader";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";
import Paid from "../../../public/icons/paid.svg";
import {
  deleteMerchant,
  getMerchant,
  withdrawalAmount,
  withdrawalAmountList,
} from "../../api/merhchant";
import type { DatePickerProps } from "antd";
import "antd/dist/antd.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { MonthPicker, RangePicker } = DatePicker;

type propTypes = {
  merchants?: Array<IMerchant>;
  className?: string;
  style?: React.CSSProperties;
};

const Merchant: NextPage = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [logoPathPrefix, setLogoPathPrefix] = useState<string>("");
  const [Withdrawal, setWithdrawal] = useState(false);
  const [WithdrawalId, setWithdrawalId] = useState<number | string>();
  const [borderView, setBorderView] = useState<boolean>(true);
  const formRef = useRef<HTMLFormElement>(null);
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();

  const current = new Date();
  const date = `${current.getFullYear()}-${current.getMonth() + 1}`;
  const [month, setMonth] = useState(date);
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

  const onChange = (date: any, dateString: any) => {
    console.log(dateString);
    setMonth(dateString);
  };

  const {
    data: merchant,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IMerchantList>>(
    `MerchantList_${brandID}`,
    async () => {
      const params = {
        data: {
          brand_id: brandID,
        },
      };
      const response = await dispatch(getMerchant(params));
      setLogoPathPrefix(response.logopath);
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const { data: amount, refetch: refetchAmountList } = useQuery<
    Array<IMerchantList>
  >(
    `AmountList_${month}, ${WithdrawalId}`,
    async () => {
      const params = {
        data: {
          withdrawal_month: month,
          billingmerchant_id: WithdrawalId,
        },
      };
      const response = await dispatch(withdrawalAmountList(params));
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const onDelete = useCallback(
    async (
      merchantId: IMerchant["billingmerchant_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            billingmerchant_id: merchantId,
          },
        };
        await dispatch(deleteMerchant(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onEdit = useCallback(
    (
      merchantId: IMerchant["billingmerchant_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/billingMerchant/update/${merchantId}`);
      // event.stopPropagation();
      // router.replace(`/brand/update/${merchantId}`)
    },
    [router]
  );

  const onWithdrawal = useCallback(
    (
      merchantId: IMerchant["billingmerchant_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      setWithdrawal(true);
      setWithdrawalId(merchantId);
      refetchAmountList();
    },
    [refetchAmountList]
  );

  const { data: brands } = useQuery(
    `BrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );
  const userBrand = useMemo(() => {
    return brands?.reduce(
      (
        result: { [x: string]: { label: any } },
        brands: { brand_id: string | number; brand_name: any }
      ) => {
        result[brands.brand_id] = {
          label: brands.brand_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [brands]);

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (formRef.current) {
        const params = {
          data: new FormData(formRef.current),
        };

        await dispatch(withdrawalAmount(params));
        refetchAmountList();
      }
    },
    [dispatch, refetchAmountList]
  );
  const onRestore = useCallback(
    async (
      merchantId: IMerchant["billingmerchant_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );
  const columns = useMemo(() => {
    const temp = [
      {
        label: "Sr. No.",
        keyIndex: "billingmerchant_id",
        render: (v: any, _: any, index: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Merchant Tilte",
        keyIndex: "billingmerchant_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortIndex: "billingmerchant_title",
        sortable: true,
      },

      {
        label: "Merchant Email",
        keyIndex: "billingmerchant_title",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Merchant Website",
        keyIndex: "billingmerchant_website",
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
        keyIndex: "billingmerchant_id,deleted_at",
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.billingmerchant_id)}
              >
                <Image src={Delete} alt="Alt" width={"25px"} />
              </span>
            ) : (
              <span className="arrowclock">
                <Icon
                  className="m-1"
                  name="arrow-counterclockwise"
                  onClick={onRestore.bind(this, v.billingmerchant_id)}
                />
              </span>
            )}
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.billingmerchant_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onDelete, onRestore, onEdit, user]);

  const amountColumns = useMemo(() => {
    const temp = [
      {
        label: "Sr. No.",
        keyIndex: "withdrawal_id",
        render: (v: any, _: any, index: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Date",
        keyIndex: "withdrawal_date",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Withdrawal Amount",
        keyIndex: "withdrawal_amount",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortIndex: "withdrawal_amount",
        sortable: true,
      },
    ];

    return temp;
  }, [filterText]);

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

  const filtered: Array<IMerchantList> = useMemo(() => {
    if (filterText) {
      return (
        merchant?.filter((v: IMerchantList) => {
          return (
            v.billingmerchant_title
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase()) ||
            v.billingmerchant_email
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return merchant || [];
  }, [merchant, filterText]);

  const filteredAmount: Array<IMerchantList> = useMemo(() => {
    if (filterText) {
      return (
        amount?.filter((v: IMerchantList) => {
          return (
            v.billingmerchant_title
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase()) ||
            v.billingmerchant_email
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return amount || [];
  }, [amount, filterText]);

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
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Merchants</h4>
        </div>
        <div className="col-lg-3">
          <Icon
            name={"arrow-left"}
            onClick={() => router.back()}
            style={{ marginTop: "13px" }}
          />
        </div>
        <div className="col-lg-7 d-flex justify-content-right mt-3">
          <div className="col-lg-3">
            {userBrand ? (
              <Dropdown
                className={styles.abcdropdown}
                style={{
                  width: "100%",

                  border: "1px solid lightgrey",
                  margin: "0px",
                }}
                placeholder="Select Brand"
                defaultKey="brand_id"
                options={userBrand}
                name="brand_id"
                type="light"
                onItemClick={(brandID) => handlebrand(brandID)}
                value={brandID.toString()}
              />
            ) : null}
          </div>
          <div className="ml-6 col-6" style={{ marginRight: "10px" }}>
            <Input placeholder="Search Merchant" onChange={onSearchByText} />
          </div>
          {user?.role_id === Roles.SUPER_ADMIN || Roles.Billing ? (
            <div className="col-lg-3">
              <div className={styles.createbrandheading}>
                <Button
                  iconName="plus"
                  onClick={() => router.push(`/billingMerchant/create/`)}
                >
                  Add Merchant
                </Button>
              </div>
            </div>
          ) : null}

          <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
            {!borderView ? (
              <Icon name="table" onClick={setBorderView.bind(this, true)} />
            ) : (
              <Icon name="list" onClick={setBorderView.bind(this, false)} />
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {borderView ? (
          <React.Fragment>
            {filtered.map((data) => (
              <div
                key={data.billingmerchant_id}
                className="col-lg-2"
                style={{
                  boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                  height: "18rem",
                  borderRadius: "5px",
                  margin: "1rem",
                }}
              >
                <div style={{ margin: "1rem" }}>
                  <div style={{ textAlign: "center" }}>
                    {logoPathPrefix && data.billingmerchant_logo ? (
                      <Image
                        className="card-img-top"
                        src={`${logoPathPrefix}${data.billingmerchant_logo}`}
                        height={100}
                        width={100}
                        alt=""
                        style={{ marginTop: "1rem" }}
                      />
                    ) : null}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <h4
                      style={{
                        margin: "0px",
                        fontWeight: "500",
                      }}
                    >
                      <span style={{ color: "#3e98c7" }}>
                        {" "}
                        {data.billingmerchant_title}
                      </span>{" "}
                    </h4>{" "}
                    <p style={{ color: "gray", margin: "0px" }}>
                      {data.billingmerchant_email}
                    </p>
                    <br />
                    <div style={{ height: "9rem", overflowY: "scroll" }}>
                      <h5
                        style={{
                          margin: "0px",
                          float: "left",
                          fontSize: "12px",
                        }}
                      >
                        Opening Balance
                      </h5>
                      <p style={{ margin: "0px", float: "right" }}>
                        ${data.billingmerchant_openingbalance}
                      </p>
                      <br />
                      <h6
                        style={{
                          margin: "0px",
                          float: "left",
                          fontSize: "12px",
                        }}
                      >
                        Fee
                      </h6>
                      <p style={{ margin: "0px", float: "right" }}>
                        ${data.billingmerchant_fee}
                      </p>
                      <br />
                      <div
                        className="d-flex"
                        style={{
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="dateicon" style={{ margin: "auto" }}>
                          <span
                            style={{
                              marginLeft: "3px",
                              marginRight: "3px",
                            }}
                            title="Delete"
                            onClick={onDelete.bind(
                              this,
                              data.billingmerchant_id
                            )}
                          >
                            <Image src={Delete} alt="Alt" width={"25px"} />
                          </span>
                          <span
                            style={{
                              marginLeft: "3px",
                              marginRight: "3px",
                            }}
                            title="Edit"
                            onClick={onEdit.bind(this, data.billingmerchant_id)}
                          >
                            <Image src={Update} alt="Alt" width={"25px"} />
                          </span>
                          <span
                            style={{
                              marginLeft: "3px",
                              marginRight: "3px",
                            }}
                            title="Edit"
                            onClick={onWithdrawal.bind(
                              this,
                              data.billingmerchant_id
                            )}
                          >
                            <Image src={Paid} alt="Alt" width={"25px"} />
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
              setSortKeys({ [sortKey as keyof IMerchantList]: direction })
            }
            autoSort={false}
            loading={isLoading}
            // onRowItemClick={onRowItemClick}
            onPageChange={(p) => console.log(p)}
            data={filtered}
            columnHeadings={columns}
          />
        )}
      </div>
      <Modal
        onBackdrop={() => setWithdrawal(false)}
        show={Withdrawal}
        style={{
          maxHeight: "20rem",
          width: "40rem",
          overflowY: "scroll",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h5 style={{ marginTop: "1rem", marginBottom: "0px" }}>
                Withdrawal Amount
              </h5>
            </div>
          </div>

          <form onSubmit={onSubmit} ref={formRef}>
            <div className="row">
              <input
                type="hidden"
                value={WithdrawalId}
                name="billingmerchant_id"
              />

              <div className="col-lg-5">
                <Input
                  className={styles.inputfield}
                  name="withdrawal_amount"
                  type="floating"
                  htmlType="number"
                  label="Amount"
                  labelClass="inputlabel"
                  required
                />
              </div>
              <div className="col-lg-3">
                <div className="text-left mt-4 mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary "
                    style={{ borderRadius: "5px" }}
                  >
                    Withdrawal
                  </button>
                </div>
              </div>
              <div className="col-lg" style={{ textAlign: "end" }}>
                <DatePicker
                  //@ts-ignore
                  defaultValue={dayjs(month)}
                  onChange={onChange}
                  picker="month"
                  style={{ marginTop: "1.5rem" }}
                />
              </div>
            </div>
          </form>
          <Card>
            <Table
              onSortData={(sortKey, direction) =>
                setSortKeys({ [sortKey as keyof IMerchantList]: direction })
              }
              autoSort={false}
              loading={isLoading}
              data={filteredAmount}
              columnHeadings={amountColumns}
            />
          </Card>
        </div>
      </Modal>
    </Card>
  );
});
export default Merchant;
