/** @jsx jsx */
import React from "react";
import { jsx, Flex, Box, Styled } from "theme-ui";
import Nevada from "./Nevada";
import { Alerts } from "./Alerts";
// import Sankey from "./CorrelationSankey";
// import CorrelationMatrix from "./CorrelationMatrix";
import { PrecinctTable } from "./PrecinctTable";
import { UserContext } from "./Context";

const showMap =
  process.env.REACT_APP_SHOW_MAP === "true" ||
  window.location.search.match("showmap");

const Loading = () => {
  return (
    <Box
      sx={{
        width: "500px",
        bg: "background",
        py: "4",
        mx: "auto",
        my: "auto",
        textAlign: "center"
      }}
    >
      <Styled.code sx={{ color: "text", fontSize: 2 }}>Loading ...</Styled.code>
    </Box>
  );
};

export const Main = () => {
  const { data } = React.useContext(UserContext);
  return data ? (
    <Flex
      sx={{
        flexDirection: ["column", "row"],
        justifyContent: "flex-start",
        alignItems: "stretch",
        m: "0 auto",
        width: "100%"
      }}
    >
      {/* Left panel */}
      <Box sx={{ width: "350px", p: [2, 3], flex: "0 0 auto" }}>
        <Alerts data={data} />
      </Box>
      {/* Center panel */}
      {showMap && (
        <Box
          sx={{
            borderLeft: "2px solid",
            borderColor: "gray.1",

            flex: "1 0 auto",
            py: [2, 3]
          }}
        >
          <Nevada data={data}></Nevada>
        </Box>
      )}
      {/* Right panel */}
      <Flex
        sx={{
          borderLeft: "2px solid",
          borderColor: "black",
          flexDirection: "column",
          mt: [2, 0],
          flex: "1 0 auto",
          minWidth: "300px",
          p: [2, 3],
          justifyContent: "space-between"
        }}
      >
        <PrecinctTable />
        {/* <CorrelationMatrix></CorrelationMatrix>
        <Sankey /> */}
      </Flex>
    </Flex>
  ) : (
    <Loading />
  );
};
