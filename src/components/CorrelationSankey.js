import React, { useRef } from "react";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import Biden from "../assets/Biden.gif";
import Warren from "../assets/Warren.gif";
import Gabbard from "../assets/Gabbard.gif";
import Klobuchar from "../assets/Klobuchar.gif";
import BootEdgeEdge from "../assets/BootEdgeEdge.gif";

export default function CorellationSankey(_props) {
  let sankeyContainer = useRef(null);
  let candidatees = {
    BootEdgeEdge,
    Klobuchar,
    Gabbard,
    Warren,
    Biden
  };

  let width = 600,
    height = 200;

  let sankey = d3Sankey()
    .nodeWidth(50)
    .nodePadding(75)
    .size([width, height]);

  let graph = sankey({
    nodes: [
      { node: 0, name: "Warren" },
      { node: 1, name: "BootEdgeEdge" },
      { node: 2, name: "Gabbard" },
      { node: 3, name: "Biden" },
      { node: 4, name: "Klobuchar" }
    ],
    links: [
      { source: 0, target: 2, value: 2 },
      { source: 1, target: 2, value: 2, suss: true },
      { source: 1, target: 3, value: 2 },
      { source: 0, target: 3, value: 2 },
      { source: 2, target: 4, value: 2 },
      { source: 2, target: 4, value: 2 },
      { source: 3, target: 4, value: 4 }
    ]
  });

  let links = graph.links;
  let nodes = graph.nodes;
  let svgLinks = links.map(link => {
    return (
      <g fill="none" stroke={link.suss ? "#f11" : "#000"} strokeOpacity="0.2">
        <path d={sankeyLinkHorizontal()(link)} strokeWidth={link.width}></path>
      </g>
    );
  });
  let svgNodes = nodes.map(node => (
    <g>
      <image
        href={candidatees[node.name]}
        x={node.x0}
        y={node.y0}
        height={node.y1 - node.y0}
        className="node"
      >
        {" "}
      </image>
    </g>
  ));

  return (
    <svg
      className="d3-component"
      width={620}
      height={200}
      ref={sankeyContainer}
    >
      {svgLinks}
      {svgNodes}
    </svg>
  );
}
