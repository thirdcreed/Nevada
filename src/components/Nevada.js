// import React, { useRef, useEffect } from 'react'
// import nevadaJson from './smolnv';
// import * as d3 from 'd3';

// export default function Nevada(props) {
    
//     let nevadaD3Container = useRef(null);

//     useEffect(
//         () => {
//             if (props.data && nevadaD3Container.current) {

//                 const svg = d3.select(nevadaD3Container.current);      
               
//                 var margin = { top: -5, right: -5, bottom: -5, left: -5 },
//                 width = 920 - margin.left - margin.right,
//                 height = 600 - margin.top - margin.bottom;

//                 var projection = d3.geoAlbers()
//                 .scale( 6000 ) 
//                 .rotate( [116.057,0] ) //latitude
//                 .center( [0, 38.313] ) //longitude
//                 .translate( [width/2,height/2] ); 
//                 var data = d3.map();
//                 var colorScale = d3.scaleThreshold()
//                   .domain(Array.from(Array(100).keys()))
//                   .range(d3.schemeBlues[7]);

//                 svg.call(d3.zoom().on("zoom", function () {
//                     svg
//                         .selectAll('path') 
//                         .attr('transform', d3.event.transform);
//                     }))
//                     .append("g")
//                     .selectAll("path")
//                     .data(nevadaJson.features)
//                     .enter()
//                     .append("path")
//                     .attr("d", d3.geoPath()
//                     .projection(projection))
//                     .attr("fill", function (d) {
//                         d.total = ((Math.random() * 10 ) + 0)|| 0;
//                         return colorScale(d.total);
//                     });
//             }
//         },
//         [props.data, nevadaD3Container.current])

//     return (
//         <svg
//             className="d3-component"
//             width={600}
//             height={600}
//             ref={nevadaD3Container}
//         />
//     );
     
//   }
