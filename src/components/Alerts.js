/** @jsx jsx */
import React from "react";
import { jsx, Flex, Styled } from "theme-ui";
import { UserContext } from "./Context";
import NounCard from "./noun_card.js";
import { readableMessage, precinctId } from "../lib/precinctData";

// create an issue with key common data and precinct nested inside
const groupedIssues = (issues, issueType) =>
  Object.keys(issues).flatMap(key =>
    issues[key].map(precinct => {
      return {
        precinct,
        message: readableMessage(key, precinct),
        type: issueType,
        key
      };
    })
  );

const alertColorTheme = {
  warning: { background: "warning", color: "black" },
  error: { background: "error", color: "white" },
  comment: { background: "muted", color: "black" }
};
const defaultColors = alertColorTheme.comment;

export const Alert = ({ type, alert, onClick, selected }) => {
  const { precinct } = alert;
  const { background, color } = alertColorTheme[type] || defaultColors;
  return (
    // <Box
    //   onClick={onClick}
    //   sx={{
    //     mt: 2,
    //     border: "2px solid",
    //     borderColor: "black",
    //     color,
    //     px: 2,
    //     pt: 1,
    //     bg: background,
    //     lineHeight: "1"
    //   }}
    // >
    //   <Styled.h4 sx={{ color, my: 0 }}>
    //     {selected ? "*" : ""}Precinct {precinct["precinct_full"]}
    //   </Styled.h4>
    //   <Styled.p sx={{ color, mb: 0 }}>{alert.message}</Styled.p>
    // </Box>
    <div className={`card ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="container">
        <div className="top error">
          <div className="title">Precinct {precinct["precinct_full"]}</div>
        </div>
        <div className="bottom">
          <div className="content-left">
            <div className="error-type">Actually wrong</div>
            <div className="description">{alert.message}</div>
          </div>
          <NounCard style={{ height: "65px", width: "65px;" }}></NounCard>
        </div>
      </div>
    </div>
  );
};

export const Alerts = ({ data }) => {
  const { selectedPrecinct, setSelectedPrecinct } = React.useContext(
    UserContext
  );
  const { alerts, warnings } = data;

  const allAlerts = groupedIssues(alerts, "error");
  const allWarnings = groupedIssues(warnings, "warning");
  const allIssues = allAlerts.concat(allWarnings).slice(0, 500);
  console.log(allIssues);
  // debugger;
  return (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "500px"
      }}
    >
      <Styled.h2>Notable Votables</Styled.h2>
      {allIssues.length === 0 ? (
        <Styled.p>Having a normal one</Styled.p>
      ) : (
        allIssues.map((issue, i) => {
          const precinctIdentifier = precinctId(issue.precinct);
          return (
            <Alert
              selected={precinctIdentifier === selectedPrecinct}
              key={
                /* Should maybe be the GEOID10 as unique id */
                precinctIdentifier + issue.key + i
              }
              alert={issue}
              type={issue.type}
              onClick={() => {
                console.log(
                  "focusing on precinct with the error- " + precinctIdentifier
                );
                setSelectedPrecinct(precinctIdentifier);
              }}
            />
          );
        })
      )}
    </Flex>
  );
};

// {
//   "row_id": "13753",
//   "county": "CARSON CITY",
//   "precinct": "111",
//   "precinct_full": "111",
//   "precinct_delegates": "9",
//   "candidate": "buttigiegp",
//   "align1": "36",
//   "alignfinal": "34",
//   "FIPS Code": "510",
//   "GEOID10": "NVc(\"CARSON CITY\", \"CHURCHILL\", \"CLARK\", \"DOUGLAS\", \"ELKO\", \"ESMERALDA\", \"EUREKA\", \"HUMBOLDT\", \"LANDER\", \"LINCOLN\", \"LYON\", \"MINERAL\", \"NYE\", \"PERSHING\", \"STOREY\", \"WASHOE\", \"WHITE PINE\")111",
//   "total_align1": "79",
//   "total_alignfinal": "78",
//   "viability_threshold": "12",
//   "viable1": "TRUE",
//   "viablefinal": "TRUE",
//   "viable_loss": "TRUE",
//   "nonviable_no_realign": "FALSE",
//   "alpha_shift": "NA",
//   "has_alpha_shift": "NA",
//   "more_final_votes": "FALSE",
//   "fewer_final_votes": "TRUE",
//   "caucus_formula_result": "3.8734",
//   "after_rounding": "4",
//   "total_del_after_rounding": "4",
//   "final_del": "5",
//   "total_final_del": "13",
//   "distance_next": "NA",
//   "farthest_rank": "1",
//   "closest_rank": "1",
//   "min_far_rank": "1",
//   "is_farthest": "TRUE",
//   "min_close_rank": "1",
//   "is_closest": "TRUE",
//   "how_many_farthest": "1",
//   "how_many_closest": "1",
//   "game_of_chance": "no_tie",
//   "extra_del_given": "FALSE",
//   "comments": "NA",
//   "tie_winner": "NA",
//   "tie_loser": "NA"
// }
