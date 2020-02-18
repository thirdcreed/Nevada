import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import { Box } from "theme-ui";


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
            setNevada({geojson});
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
             console.log({loading, nevada:!!nevada, nevadaD3Container:nevadaD3Container.current})
            if (!!nevada && !!nevadaD3Container.current) {
                console.log('here?')
                console.log({nevada});

                let nevadaJson = JSON.parse(nevada.geojson);
                console.log({nevadaJson})

                const svg = d3.select(nevadaD3Container.current);      
               
                var margin = { top: -5, right: -5, bottom: -5, left: -5 },
                width = 920 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

                var projection = d3.geoAlbers()
                .scale( 6000 ) 
                .rotate( [116.057,0] ) //latitude
                .center( [0, 38.313] ) //longitude
                .translate( [width/2,height/2] ); 
                var data = d3.map();
                var colorScale = d3.scaleThreshold()
                  .domain(Array.from(Array(100).keys()))
                  .range(d3.schemeBlues[7]);

                svg.call(d3.zoom().on("zoom", function () {
                    svg
                        .selectAll('path') 
                        .attr('transform', d3.event.transform);
                    }))
                    .append("g")
                    .selectAll("path")
                    .data(nevadaJson.features)
                    .enter()
                    .append("path")
                    .attr("d", d3.geoPath()
                    .projection(projection))
                    .attr('stroke',"black")
                    .attr('stroke-width','.2')
                    .attr("fill", "white")
            }
        },
        [loading,nevada,nevadaD3Container.current])

    return (
    <div>
    {loading ? (
       <Box>Loading...</Box>
     ) : nevada ? (
        <svg
        className="d3-component"
        width={600}
        height={600}
        ref={nevadaD3Container}
    />
     ) : (
      <Box>An unexpected error occurred</Box>
     )}
    </div>
    );
     
  }
