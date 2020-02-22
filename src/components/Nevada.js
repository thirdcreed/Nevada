import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Box } from "theme-ui";
import { UserContext } from "./Context";
import _ from 'lodash';
import { Transition } from 'react-transition-group';

export default function Nevada(props) {
  const { selectedPrecinct, setSelectedPrecinct } = React.useContext(
    UserContext
  );

  const [nevada, setNevada] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [_loadError, setLoadError] = React.useState(false);
  const [strokeWidth, setStrokeWidth] = React.useState(".5px");
  const [zoom, setZoom] = React.useState("translate(1,1)");
  const [currentZoom, setCurrentZoom] = React.useState(null);



  const fetchGeoJson = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "https://nevada-cranks.herokuapp.com/nevada", true);

    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var geojson = this.response;
        // console.log();
        setNevada({
          geojson
        });
        setLoading(false);
      } else {
        setLoadError(true);
        setLoading(false);
        console.warn("server error");
      }
    };

    request.onerror = function () {
      console.warn("Nevada JSON not loading");
    };
    request.send();
  };

  React.useEffect(fetchGeoJson, []);
  let nevadaD3Container = useRef(null);


  if (!nevada) {
    return <div></div>
  }


  let width = 600, height = 600;
  var projection = d3.geoAlbers()
    .scale(4500)
    .rotate([116.4194, 0]) //latitude
    .center([0, 38.8026]) //longitude
    .translate([width / 2, height / 2]);

  let pathGenerator = d3.geoPath()
    .projection(projection)

  let features = JSON.parse(nevada.geojson).features;

  function reset() {
    setZoom("translate(" + width / 2 + "," + height / 2 + ")scale(" + 1 + ")translate(" + -300 + "," + -300 + ")")
    setStrokeWidth(.5 + "px");
    setCurrentZoom(null);
  }

  function toPaths(feature) {

    let alerts = _.filter(props.data.alerts, v => v.length).map(alertType => alertType.map(alert => alert.GEOID10));



    function clicked() {
      setSelectedPrecinct(feature.properties.GEOID10);
      setCurrentZoom(feature.properties.GEOID10);
      var path = d3.geoPath()
        .projection(projection);
      var centroid = path.centroid(feature);
      let x = centroid[0];
      let y = centroid[1];
      let largestDimension = Math.max(
        Math.abs(path.bounds(feature)[1][1] - path.bounds(feature)[0][1]),
        Math.abs(path.bounds(feature)[1][0] - path.bounds(feature)[0][0])
      );
      var scale = d3.scaleLinear([0, largestDimension], [0.0, 4.0]);
      let k = scale(50);
      console.log({ selectedPrecinct });
      console.log({ props })

      setStrokeWidth(1.5 / k + "px");
      setZoom("translate(" + width / 2 + "," + height / 2 + ") scale(" + k + ") translate(" + -x + "," + -y + ")");

    }
    let fill = feature.properties.GEOID10 === selectedPrecinct ? "url(#diagonal-stripe-2)" :
      alerts.includes(feature.properties.GEOID10) ? "#ef3a42" : "white";

    // if (currentZoom !== selectedPrecinct && currentZoom !== null) {
    //   clicked();
    // }

    return (<path d={pathGenerator(feature)}
      key={feature.GEOID10}
      stroke="black"
      strokeWidth={strokeWidth}
      fill={fill}
      onClick={clicked}
      className="test"

    >
    </path >)
  }
  let clickablePrecincts = features.map(toPaths);

  return (
    <div>
      <button onClick={reset} style={{ position: "relative", top: 50, left: 500 }}>
        ZOOM OUT
      </button>
      <div>
        {loading ? (
          <Box>Loading...</Box>
        ) : nevada ? (
          <svg
            className="d3-component"
            width={600}
            height={600}
            ref={nevadaD3Container}
          >
            <defs>
              <pattern
                id="diagonal-stripe-2"
                patternUnits="userSpaceOnUse"
                width="2"
                height="2"
              >
                <image
                  xlinkHref="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+"
                  x="0"
                  y="0"
                  width="2"
                  height="2"
                />
              </pattern>

            </defs>
            <g transform={zoom}
              style={{ transition: "transform 200ms " }}>

              {clickablePrecincts}
            </g>
          </svg>
        ) : (
              <Box>An unexpected error occurred</Box>
            )}
      </div>
    </div>
  );
}
