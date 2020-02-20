/** @jsx jsx */
import React from "react";
import { jsx, Flex, Box } from "theme-ui";
import Nevada from "./Nevada";
import { Alerts } from "./Alerts";
import Sankey from "./CorrelationSankey";
import CorrelationMatrix from "./CorrelationMatrix";
import { PrecinctTable } from "./PrecinctTable";

export const Main = ({ data }) => {
  console.log("DATA:", data);
  return (
    <Flex
      sx={{
        flexDirection: ["column", "row"],
        justifyContent: "space-between",
        alignItems: "stretch",
        m: "0 auto",
        width: "100%"
      }}
    >
      {/* Left panel */}
      <Box sx={{ minWidth: "400px", p: [2, 3] }}>
        <Alerts data={data} />
      </Box>
      {/* Center panel */}
      <Box
        sx={{
          minWidth: "400px",
          borderLeft: "1px solid",
          borderColor: "gray.1",
          mt: [2, 0],
          p: [2, 3]
        }}
      >
        <Nevada data={[1, 2, 3]}></Nevada>
        <PrecinctTable />
      </Box>
      {/* Right panel */}
      <Flex
        sx={{
          borderLeft: "1px solid",
          borderColor: "gray.1",
          flexDirection: "column",
          mt: [2, 0],
          flex: "1",
          minWidth: "300px",
          p: [2, 3],
          justifyContent: "space-between"
        }}
      >
        <CorrelationMatrix></CorrelationMatrix>
        <Sankey />
      </Flex>
    </Flex>
  );
};
