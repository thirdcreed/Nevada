/** @jsx jsx */
import React from "react";
import { jsx, Flex, Box, Styled } from "theme-ui";

/**
 * interface Alert {
 *  type: 'warning' | 'error' | 'comment'
 *  message: string // human readable error
 *  code: string // the csv column code
 *  precinctId: the precinct GEOID10
 * }
 */
const fakeAlertData = () => [
  {
    type: "warning",
    message: "alphabetical shift in vote reporting detected",
    code: "has_alpha_shift",
    precinctId: "101"
  },
  {
    type: "comment",
    message:
      "this is really more of a comment than an alert, i noticed that in paragraph 7 you specify a game of chance without acknowledging (all caucusgoers exit room)...",
    code: "has_alpha_shift",
    precinctId: "101"
  },
  {
    type: "error",
    message: "our delegate counts differ from those reported",
    code: "del_counts_diff",
    precinctId: "105"
  }
];

const alertColorTheme = {
  warning: { background: "warning", color: "black" },
  error: { background: "error", color: "white" },
  comment: { background: "muted", color: "black" }
};
const defaultColors = alertColorTheme.comment;

export const Alert = ({ alert }) => {
  const { background, color } = alertColorTheme[alert.type] || defaultColors;
  return (
    <Box
      onClick={() => {
        console.log("focusing on precinct with the error");
      }}
      sx={{
        mt: 2,
        border: "2px solid",
        borderColor: "black",
        color,
        px: 2,
        pt: 1,
        bg: background,
        lineHeight: "1"
      }}
    >
      <Styled.h4 sx={{ color, my: 0 }}>Precinct {alert.precinctId}</Styled.h4>
      <Styled.p sx={{ color, mb: 0 }}>{alert.message}</Styled.p>
    </Box>
  );
};

export const Alerts = () => {
  const alerts = fakeAlertData();

  console.warn("RENDERING ALERTS");
  return (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "500px"
      }}
    >
      <Styled.h2>Notable Votables</Styled.h2>
      {alerts.length === 0 ? (
        <Styled.p>Having a normal one</Styled.p>
      ) : (
        alerts.map((a, i) => {
          return <Alert key={i} alert={a} />;
        })
      )}
    </Flex>
  );
};
