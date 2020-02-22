/** @jsx jsx */
import React from "react";
import { jsx, Flex, Box } from "theme-ui";
import Nevada from "./Nevada";
import { Alerts } from "./Alerts";
import Sankey from "./CorrelationSankey";
import CorrelationMatrix from "./CorrelationMatrix";
import { PrecinctTable } from "./PrecinctTable";
import { UserContext } from "./Context";

export const Main = ({data}) => {
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
      <Box sx={{ minWidth: "324px", p: [2, 3] }}>
        <Alerts data={data} />
      </Box>
      {/* Center panel */}
      <Box
        sx={{
          borderLeft: "2px solid",
          borderColor: "black",
        }}
      >
         <Nevada data={data}></Nevada> 
      </Box>
      {/* Right panel */}
      <Flex
        sx={{
          borderLeft: "2px solid",
          borderColor: "black",
          flexDirection: "column",
          mt: [2, 0],
          flex: "1",
          minWidth: "300px",
          p: [2, 3],
          justifyContent: "space-between"
        }}
      ><PrecinctTable/>
        {/* <CorrelationMatrix></CorrelationMatrix>
        <Sankey /> */}
      </Flex>
    </Flex>
  );
};
