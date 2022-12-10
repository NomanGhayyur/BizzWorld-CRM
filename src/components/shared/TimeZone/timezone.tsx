import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
// import { Col, Row, Typography } from "antd";
import MapImage from "../../../assets/maps/us-time-zone-map.svg";
import { Col, Row } from "react-bootstrap";
//@ts-ignore
const { Title } = Typography;

const Centrals = [
  "Alabama",
  "Arkansas",
  "Illinois",
  "Iowa",
  "Louisiana",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Oklahoma",
  "Wisconsin",
  "Kansas: all except for Sherman, Wallace, Greeley, and Hamilton counties",
  "Nebraska: eastern two thirds",
  "North Dakota: all except for southwest regions, south part of McKenzie County, and the majority of Dunn County and far western Sioux County",
  "South Dakota: eastern half",
  "Texas: all except for El Paso and Hudspeth counties",
  "Florida: Florida Panhandle west of the Apalachicola River",
  "Indiana: northwest and southwest regions",
  "Kentucky: western half",
  "Michigan: Gogebic, Iron, Dickinson, and Menominee counties",
  "Tennessee: West Tennessee and Middle Tennessee",
];

const Pacific = [
  "California",
  "Washington",
  "Idaho – Idaho Panhandle",
  "Nevada – all, except for West Wendover and, unofficially, several towns along the Idaho border",
  "Oregon – all, except for the majority of Malheur County",
  "Alaska – Hyder",
];

const Mountain = [
  "Colorado",
  "Montana",
  "New Mexico",
  "Utah",
  "Wyoming",
  "Arizona",
  "Idaho: Southern Idaho",
  "Oregon: the majority of Malheur County",
  "Nevada: West Wendover; other small towns in Elko County observe it unofficially.",
  "Oklahoma: Kenton",
  "Kansas: Sherman, Wallace, Greeley and Hamilton counties",
  "Nebraska: western third",
  "North Dakota: the SW corner counties (Adams, Billings, Bowman, Golden Valley, Grant, Hettinger, Slope, Stark) observe MST. The counties of McKenzie, Dunn, and Sioux are split.",
  "South Dakota: western half",
  "Texas: El Paso and Hudspeth counties",
];

const Eastern = [
  "Connecticut",
  "Delaware",
  "Georgia",
  "Maine",
  "Maryland",
  "Massachusetts",
  "New Hampshire",
  "New Jersey",
  "New York",
  "North Carolina",
  "Ohio",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "Vermont",
  "Virginia",
  "West Virginia",
  "Florida – peninsula and Big Bend regions east of the Apalachicola River along with portions of Gulf County south of the Intracoastal Waterway.",
  "Indiana – all except for northwest (Gary) and southwest (Evansville) regions",
  "Kentucky – eastern 60%, including the state's three largest metropolitan areas: Louisville, Lexington, Northern Kentucky",
  "Michigan – all, except for the four Upper Peninsula counties that border Wisconsin: Gogebic, Iron, Dickinson, and Menominee",
  "Tennessee – East Tennessee",
];

const GMTMap = React.memo((props) => {
  const [, updateState] = useState();
  //@ts-ignore
  const forceUpdate = useCallback(() => updateState({}), []);
  const dayLight =
    moment().month() >= 2 && moment().month() <= 10 ? true : false;

  useEffect(() => {
    const i = setInterval(() => {
      forceUpdate();
    }, 1000);
    return () => {
      clearInterval(i);
    };
  }, [forceUpdate]);

  return (
    <>
      <div
        //@ts-ignore
        style={props.style}
      >
        <svg viewBox="0, 0, 600, 450">
          <image height="100%" width="100%" href={MapImage}></image>
          <g transform="matrix(1, 0, 0, 1, 380, 360)">
            <a href="/time-zone/usa/time-alaska/">
              <rect
                fill="white"
                width="100"
                rx="10"
                x="-50"
                fillOpacity="75%"
                height="50"
              ></rect>
              <text y="20" className="map-label">
                {" "}
                Alaska{" "}
              </text>
              <text className="map-label" y="40">
                {moment()
                  .utcOffset((dayLight ? 60 : 0) + -540)
                  .format("hh:mm a")}
              </text>
            </a>
          </g>
          <g transform="matrix(1, 0, 0, 1, 136, 319)">
            <a href="/time-zone/usa/hawaii-time/">
              <rect
                fill="white"
                width="100"
                rx="10"
                x="-50"
                fillOpacity="75%"
                height="50"
              ></rect>
              <text y="20" className="map-label">
                {" "}
                Hawaii{" "}
              </text>
              <text className="map-label" y="40">
                {moment()
                  .utcOffset((dayLight ? 60 : 0) + -600)
                  .format("hh:mm a")}
              </text>
            </a>
          </g>
          <g transform="matrix(1, 0, 0, 1, 60, 139)">
            <a href="/time-zone/usa/pacific-time/">
              <rect
                fill="white"
                width="100"
                rx="10"
                x="-50"
                fillOpacity="75%"
                height="50"
              ></rect>
              <text y="20" className="map-label">
                {" "}
                Pacific{" "}
              </text>
              <text className="map-label" y="40">
                {moment()
                  .utcOffset((dayLight ? 60 : 0) + -480)
                  .format("hh:mm a")}
              </text>
            </a>
          </g>
          <g transform="matrix(1, 0, 0, 1, 176, 165)">
            <a href="/time-zone/usa/mountain-time/">
              <rect
                fill="white"
                width="100"
                rx="10"
                x="-50"
                fillOpacity="75%"
                height="50"
              ></rect>
              <text y="20" className="map-label">
                {" "}
                Mountain{" "}
              </text>
              <text className="map-label" y="40">
                {moment()
                  .utcOffset((dayLight ? 60 : 0) + -420)
                  .format("hh:mm a")}
              </text>
            </a>
          </g>
          <g transform="matrix(1, 0, 0, 1, 325, 177)">
            <a href="/time-zone/usa/central-time/">
              <rect
                fill="white"
                width="100"
                rx="10"
                x="-50"
                fillOpacity="75%"
                height="50"
              ></rect>
              <text y="20" className="map-label">
                {" "}
                Central{" "}
              </text>
              <text className="map-label" y="40">
                {moment()
                  .utcOffset((dayLight ? 60 : 0) + -360)
                  .format("hh:mm a")}
              </text>
            </a>
          </g>
          <g transform="matrix(1, 0, 0, 1, 479, 200)">
            <a href="/time-zone/usa/eastern-time/">
              <rect
                fill="white"
                width="100"
                rx="10"
                x="-50"
                fillOpacity="75%"
                height="50"
              ></rect>
              <text y="20" className="map-label">
                {" "}
                Eastern{" "}
              </text>
              <text className="map-label" y="40">
                {moment()
                  .utcOffset((dayLight ? 60 : 0) + -300)
                  .format("hh:mm a")}
              </text>
            </a>
          </g>
        </svg>
      </div>
      {
        //@ts-ignore
        props.showLegends ? (
          <Row>
            <Col span={6}>
              <Title level={3}> Pacific </Title>
              <ul style={{ listStyle: "none", padding: 0 }} className="pacific">
                {Pacific.map((state) => (
                  <li key={state} style={{ margin: 0 }}>
                    {state}
                  </li>
                ))}
              </ul>
            </Col>
            <Col span={6}>
              <Title level={3}> Mountain </Title>
              <ul
                style={{ listStyle: "none", padding: 0 }}
                className="mountain"
              >
                {Mountain.map((state) => (
                  <li key={state} style={{ margin: 0 }}>
                    {state}
                  </li>
                ))}
              </ul>
            </Col>
            <Col span={6}>
              <Title level={3}> Central </Title>
              <ul style={{ listStyle: "none", padding: 0 }} className="central">
                {Centrals.map((state) => (
                  <li key={state} style={{ margin: 0 }}>
                    {state}
                  </li>
                ))}
              </ul>
            </Col>
            <Col span={6}>
              <Title level={3}> Eastern </Title>
              <ul style={{ listStyle: "none", padding: 0 }} className="eastern">
                {Eastern.map((state) => (
                  <li key={state} style={{ margin: 0 }}>
                    {state}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        ) : null
      }
    </>
  );
});
//@ts-ignore
GMTMap.defaultProps = {
  showLegends: true,
};

export default GMTMap;
