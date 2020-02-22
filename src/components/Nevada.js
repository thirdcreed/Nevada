import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Box } from "theme-ui";
import { UserContext } from "./Context";
import _ from "lodash";
export default function Nevada(props) {
  const { selectedPrecinct, setSelectedPrecinct } = React.useContext(
    UserContext
  );

  const [nevada, setNevada] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [_loadError, setLoadError] = React.useState(false);

  const fetchGeoJson = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "https://nevada-cranks.herokuapp.com/nevada", true);

    request.onload = function() {
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

    request.onerror = function() {
      console.warn("Nevada JSON not loading");
    };
    request.send();
  };

  React.useEffect(fetchGeoJson, []);

  let nevadaD3Container = useRef(null);

  useEffect(() => {
    // console.log("outer")
    if (!!props.data && !loading && nevadaD3Container.current && !!nevada) {
      // console.log('inner',props.selectedPrecinct, selectedPrecinct)
      let bob = selectedPrecinct;

      let nevadaJson = JSON.parse(nevada.geojson);
      let svg = d3.select(nevadaD3Container.current);
      let width = 600;
      let height = 600;

      let alerts = _.filter(props.data.alerts, v => v.length).map(alertType =>
        alertType.map(alert => alert.GEOID10)
      );
      // console.log(alerts);
      let selectedComponent = false;

      var projection = d3
        .geoAlbers()
        .scale(4500)
        .rotate([116.4194, 0]) //latitude
        .center([0, 38.8026]) //longitude
        .translate([width / 2, height / 2]);

      function reset() {
        nevadaPath
          .transition()
          .duration(750)
          .attr(
            "transform",
            "translate(" +
              width / 2 +
              "," +
              height / 2 +
              ")scale(" +
              1 +
              ")translate(" +
              -300 +
              "," +
              -300 +
              ")"
          )
          .style("stroke-width", 0.2 + "px");
      }

      d3.select("button").on("click", reset);

      function clicked(d) {
        setSelectedPrecinct(d.properties.GEOID10);
        //  console.log(d.properties);
        var path = d3.geoPath().projection(projection);
        var centroid = path.centroid(d);
        let x = centroid[0];
        let y = centroid[1];
        let largestDimension = Math.max(
          Math.abs(path.bounds(d)[1][1] - path.bounds(d)[0][1]),
          Math.abs(path.bounds(d)[1][0] - path.bounds(d)[0][0])
        );
        var scale = d3.scaleLinear([0, largestDimension], [0.0, 4.0]);
        let k = scale(50);
        // console.log({selectedPrecinct});
        // console.log({props})

        selectedComponent &&
          selectedComponent.attr("fill", d => {
            console.log(alerts);
            return d.properties.GEOID10 === bob
              ? "url(#diagonal-stripe-2)"
              : alerts.includes(d.properties.GEOID10)
              ? "#ef3a42"
              : "white";
          });

        selectedComponent = d3
          .select(this)
          .attr("fill", "url(#diagonal-stripe-2)");

        nevadaPath
          .transition()
          .duration(750)
          .style("stroke-width", 1.5 / k + "px")
          .attr(
            "transform",
            "translate(" +
              width / 2 +
              "," +
              height / 2 +
              ")scale(" +
              k +
              ")translate(" +
              -x +
              "," +
              -y +
              ")"
          );
      }

      function handleMouseOver() {
        d3.select(this).attr("fill", "lightgray");
      }

      // console.log('wtf', bob);
      let test = function(d) {
        // console.log('bob',bob);
        return d.properties.GEOID10 === bob
          ? "url(#diagonal-stripe-2)"
          : alerts.includes(d.properties.GEOID10)
          ? "#ef3a42"
          : "white";
      };

      function handleMouseOut() {
        // console.log('on this level what is bob', bob)
        d3.select(this).attr("fill", test);
      }

      let nevadaPath = svg
        .append("g")
        .selectAll("path")
        .data(nevadaJson.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("stroke", "black")
        .attr("stroke-width", ".5px")
        .attr("fill", d => {
          return d.properties.GEOID10 === bob
            ? "url(#diagonal-stripe-2)"
            : alerts.includes(d.properties.GEOID10)
            ? "#ef3a42"
            : "white";
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", clicked);

      return function() {
        // nevadaPath.remove()
        //  nevadaD3Container.current = null;
      };
    }
  }, [nevada && nevada, nevadaD3Container, loading, props.data]);

  return (
    <div>
      <button style={{ position: "relative", top: 50, left: 500 }}>
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
          </svg>
        ) : (
          <Box>An unexpected error occurred</Box>
        )}
      </div>
    </div>
  );
}
