import { NextPage } from 'next';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppThunkDispatch, RootState } from '../redux/types';
import styles from '../styles/Routes.module.css';
import { useQuery } from 'react-query';
import {
  Card,
  Table,
  IDropdownItem,
  AutoComplete,
  Icon,
  Accordion,
  Modal,
  Badge,
  Input,
  Dropdown,
  IconSets,
  Button,
  IconNames,
  unmarshalFormData,
} from 'elements';
import { IRole, IRouteGroup, IRouteInstance } from '../model/app';
import { getRouteGroups, getRoutes, updateRoute } from '../api/app';
import { useProtectedRoute } from '../hooks/useRouteProtections';
import { Roles } from '../constant/app';

const RoutesAssignment: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const roles = useSelector((store: RootState) => store.app.roles);
  const [active, setActive] = useState<IRouteInstance | null>(null);

  useProtectedRoute([Roles.SUPER_ADMIN]);

  const { data: routes, refetch: refetchRoutes } = useQuery<
    Array<IRouteInstance>
  >(`RoutesAssignment`, async () => await dispatch(getRoutes()));
  const { data: groups, refetch: refetchGroups } = useQuery<Array<IRouteGroup>>(
    `RoutesGroup`,
    async () => await dispatch(getRouteGroups())
  );

  const groupOptions = useMemo(() => {
    if (!groups) return {};
    return groups.reduce((result, group) => {
      result[`${group.id}`] = {
        label: group.title,
        icon: group.iconName,
      };
      return result;
    }, {} as { [key in string]: IDropdownItem });
  }, [groups]);

  const iconOptions = useMemo(() => {
    return IconSets.reduce((result, icon) => {
      result[`${icon}`] = {
        label: icon,
        icon,
      };
      return result;
    }, {} as { [key in IconNames]: IDropdownItem });
  }, []);

  const roleOptions = useMemo(() => {
    return roles.reduce((result, role) => {
      result[`${role.role_id}`] = {
        label: role.role_name,
      };
      return result;
    }, {} as { [key in string]: IDropdownItem });
  }, [roles]);

  const onEdit = useCallback(
    (link: IRouteInstance['link']) => {
      setActive(routes?.find((instance) => instance.link == link) || null);
    },
    [routes]
  );

  const columns = useMemo(() => {
    return [
      {
        label: 'Sr No',
        keyIndex: '',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: 'Title',
        keyIndex: 'title',
      },
      {
        label: 'Route',
        keyIndex: 'link',
        sortable: true,
        render: (v: any) => v || '/',
      },
      {
        label: 'Icon',
        keyIndex: 'iconName',
        render: (v: any) => (
          <Icon name={v || 'dot'} height="1.5rem" width="1.5rem" />
        ),
      },
      {
        label: 'Menu',
        keyIndex: 'menu',
        render: (v: any) => {
          return (
            <div className="form-check form-switch">
              <input
                disabled
                checked={v}
                className="form-check-input"
                type="checkbox"
              />
            </div>
          );
        },
      },
      {
        label: 'Roles',
        keyIndex: 'roles',
        render: (v: any) => {
          if (!v || !v?.length) return 'No Roles Assigned';
          return v?.map((role: IRole['role_id']) => {
            const roleInfo = roles.find((r) => r.role_id == role);
            return (
              <Badge className={styles.autocomplete_roles} key={role}>
                {roleInfo?.role_name || role}
              </Badge>
            );
          });
        },
      },
      {
        label: 'Actions',
        keyIndex: 'link',
        render: (v: any) => (
          <>
            <Icon
              width="1.2rem"
              height="1.2rem"
              name="pencil-square"
              fill="var(--bs-info)"
              onClick={onEdit.bind(this, v)}
            />
          </>
        ),
      },
    ];
  }, [onEdit, roles]);

  const onEditRoute = async (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (formRef.current) {
      const params = {
        data: unmarshalFormData(new FormData(formRef.current)),
      };
      params.data.menu =
        typeof params.data.menu == 'string' && params.data.menu == 'on';
      params.data.iconName = `${params.data.iconName || 'dot'}`;
      await dispatch(updateRoute(params));
      refetchGroups();
      refetchRoutes();
    }
  };

  const accordions = useMemo(() => {
    if (!groups) return {};
    const renderTables = (groupedRoutes: IRouteInstance[]) => (
      <Table
        autoSort={false}
        data={groupedRoutes || []}
        pageSize={1000}
        columnHeadings={columns}
      />
    );
    return groups.reduce((result, group) => {
      result[group.title] = renderTables(group.routes);
      return result;
    }, {} as any);
  }, [groups, columns]);

  return (
    <>
      <Card
        header={<h4>Route Management</h4>}
        className={`text-center ${styles.container}`}
      >
        <Modal show={!!active} onBackdrop={setActive.bind(this, null)}>
          <Card className={`${styles.container}`} header={<h4>Edit Route</h4>}>
            <form ref={formRef} onSubmit={onEditRoute}>
              <input type="hidden" name="link" value={active?.link} />
              <Input
                type="floating"
                value={active?.link}
                label="Link"
                disabled
              />
              <Input
                name="title"
                type="floating"
                label="Title"
                defaultValue={active?.title}
              />
              <div className="d-flex flex-row justify-content-between align-items-center">
                <AutoComplete
                  name="roles"
                  style={{ flex: 1 }}
                  label="Roles"
                  values={(active?.roles as string[]) || []}
                  options={roleOptions}
                />
                <div className="form-check form-switch mx-2">
                  <label className="form-check-label">Show in Menu</label>
                  <input
                    defaultChecked={!!active?.menu}
                    name="menu"
                    className="form-check-input"
                    type="checkbox"
                  />
                </div>
              </div>
              <div className="row">
                <Dropdown
                  name="groupId"
                  outline
                  className="col-md-6"
                  label="Group"
                  options={groupOptions}
                  defaultKey={active?.groupId}
                />
                <AutoComplete
                  multiple={false}
                  name="iconName"
                  className={`col-md-6 ${styles.iconDropdown}`}
                  label="Icon"
                  options={iconOptions}
                  values={[active?.iconName || 'dot']}
                />
              </div>
              <div className="d-flex flex-row justify-content-end my-4">
                <Button
                  className="mx-3"
                  style={{ width: '8rem' }}
                  type="secondary"
                  htmlType="button"
                  onClick={setActive.bind(this, null)}
                >
                  Cancel
                </Button>
                <Button
                  style={{ width: '8rem' }}
                  type="success"
                  htmlType="submit"
                >
                  Edit
                </Button>
              </div>
            </form>
          </Card>
        </Modal>
        <Accordion accordions={accordions} />
      </Card>
    </>
  );
};

export default RoutesAssignment;
