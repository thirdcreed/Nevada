import React, {
    useRef,
    useEffect
} from 'react'
import * as d3 from 'd3';
import {
    Box
} from "theme-ui";


export default function Nevada() {

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
                console.log()
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

    useEffect(
        () => {
       
            if (!!nevada && !!nevadaD3Container.current) {
          
                let nevadaJson = JSON.parse(nevada.geojson);
                const svg = d3.select(nevadaD3Container.current);
                let width = 600;
                let height = 600;

                let alerts = ["320113", "3202304","320219","320276","320136","320138","320271","320317423"];
                let selectedComponent = false;
                let selected = '';

                var projection = d3.geoAlbers()
                    .scale(4500)
                    .rotate([116.4194, 0]) //latitude
                    .center([0, 38.8026]) //longitude
                    .translate([width / 2, height / 2]);

                function reset() {
                    nevadaPath.transition()
                        .duration(750)
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + 1 + ")translate(" + -300 + "," + -300 + ")")
                        .style("stroke-width", .2 + "px")
                }

                d3.select("button")
                    .on("click", reset);

                function clicked(d, t, e) {
                    var path = d3.geoPath()
                        .projection(projection);
                    var centroid = path.centroid(d);
                    let x = centroid[0];
                    let y = centroid[1];
                    let largestDimension = Math.max(
                        Math.abs(path.bounds(d)[1][1] - path.bounds(d)[0][1]), 
                        Math.abs(path.bounds(d)[1][0] - path.bounds(d)[0][0])
                    );
                    var scale = d3.scaleLinear([0, largestDimension], [0.0, 4.0]);
                    let k = scale(50);

                
                    selectedComponent && selectedComponent
                    .attr("fill", d => {console.log(alerts); return alerts.includes(d.properties.GEOID10) ? "red" : "white"})
                        
                    selected = d.properties.GEOID10;

                    selectedComponent = d3.select(this).attr('fill','blue');
                    
                    nevadaPath
                        .transition()
                        .duration(750)
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                        .style("stroke-width", 1.5 / k + "px");
                }

                function handleMouseOver(d, t, e) {
                    var path = d3.geoPath()
                        .projection(projection);
                    var centroid = path.centroid(d);
                    let x = centroid[0];
                    let y = centroid[1];
                    let k = 4;
                    console.log(d.properties.GEOID10);

                    d3.select(this).attr('fill', "url(#diagonal-stripe-2)");
                }

                function handleMouseOut(d, t, e) {
                    d3.select(this)
                    .attr("fill", d => {console.log(alerts); return d.properties.GEOID10 === selected ? "blue" : alerts.includes(d.properties.GEOID10) ? "red" : "white"})
                }

                let nevadaPath = svg
                    .append("g")
                    .selectAll("path")
                    .data(nevadaJson.features)
                    .enter()
                    .append("path")
                    .attr("d", d3.geoPath()
                        .projection(projection));

                nevadaPath.attr('stroke', "black")
                    .attr('stroke-width', '.5px')
                    .attr("fill", d => {console.log(alerts); return d.properties.GEOID10 === selected ? "blue" : alerts.includes(d.properties.GEOID10) ? "red" : "white"})
                    .on('mouseover', handleMouseOver) 
                    .on("mouseout", handleMouseOut)
                    .on("click", clicked)
            }
        },
        [loading, nevada, nevadaD3Container.current])

    return (
    <React.Fragment>
        <button style={{ position:'relative', top:50, left:500}}>ZOOM OUT</button>
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
    <defs> <pattern id="diagonal-stripe-2" patternUnits="userSpaceOnUse" width="10" height="10">
     <image xlinkHref="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+" x="0" y="0" width="10" height="10"/>  
      </pattern> 
    </defs>
    </svg>
     ) : (
      <Box>An unexpected error occurred</Box>
     )}
    </div>
    </React.Fragment>
    );
     
  }
