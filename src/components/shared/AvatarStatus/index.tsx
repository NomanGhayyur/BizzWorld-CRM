import React from "react";
import PropTypes from "prop-types";
import { Avatar, AvatarProps } from "antd";

const renderAvatar = (
  props: JSX.IntrinsicAttributes &
    AvatarProps &
    React.RefAttributes<HTMLSpanElement>
) => {
  return (
    //@ts-ignore
    <Avatar {...props} className={`ant-avatar-${props.type}`}>
      {
        //@ts-ignore
        props.text
      }
    </Avatar>
  );
};

export const AvatarStatus = (props: {
  name: string;
  suffix: string;
  subTitle: string;

  type: string;
  src: string;
  icon: string;
  size: string | number;
  shape: string;
  gap: number;
  text: string;
  onNameClick: any;
}) => {
  const {
    name,
    suffix,
    subTitle,
    type,
    src,
    icon,
    size,
    shape,
    gap,
    text,
    onNameClick,
  } = props;
  return (
    <div className="avatar-status d-flex align-items-center">
      {
        //@ts-ignore
        renderAvatar({ icon, src, type, size, shape, gap, text })
      }
      <div className="ml-2">
        <div>
          {/* {onNameClick ? (
            <div
              onClick={() => onNameClick({ name, subTitle, src, id })}
              className="avatar-status-name clickable"
            >
              {name}
            </div>
          ) : ( */}
          <div
            className="avatar-status-name"
            style={{ marginLeft: "0.5rem", fontWeight: 500 }}
          >
            {name}
          </div>
          {/* )} */}
          <span>{suffix}</span>
        </div>
        <div
          className="text-muted avatar-status-subtitle"
          style={{ marginLeft: "0.5rem" }}
        >
          {subTitle}
        </div>
      </div>
    </div>
  );
};

AvatarStatus.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.string,
  onNameClick: PropTypes.func,
};

export default AvatarStatus;
