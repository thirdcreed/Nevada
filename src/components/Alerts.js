/** @jsx jsx */
import React from "react";
import { jsx, Flex, Box, Styled } from "theme-ui";
import { UserContext } from "./Context";

// 12 viable_loss          logical: if a candidate was viable in 1st round and lost votes going to final round
// 13 nonviable_no_realign logical: if a nonviable candidate from 1st round did not realign in final round
// 14 alpha_shift          string: name of candidate that had alphabetical shift
// 15 has_alpha_shift      logical: alphabetical shift in vote reporting detected. warning, not error
// 16 more_final_votes     logical: more votes in final alignment than 1st alignment
// 17 fewer_final_votes    logical: fewer votes in final alignment than 1st. warning, not error
// 18 del_counts_diff      logical: our delegate counts differ from those reported
// 19 extra_del_given      logical: too many delegates given out but all candidates had 1 delegate, so an extra delegate was given. warning, not error

// for a given message type, a string or precinct => string function
const messageMap = {
  countySucks: precinct => `${precinct.county} sucks`,
  viableLoss: "1st-round viable candidate lost votes in round 2",
  nonviableNoRealign:
    "1st-round nonviable candidate did not realign in round 2",
  alphaShift: precinct =>
    `Alphabetical shift in voting detected for ${precinct["has_alpha_shift"]}`,
  moreFinalVotes: `More votes in final alignment than 1st alignment`,
  fewerFinalVotes: `Fewer votes in final alignment than 1st alignment`,
  delCountsDiff: "Our delegate counts differ from those reported",
  extraDelGiven:
    "Too many delegates given out but all candidates had 1 delegate, so an extra delegate was given"
};

const messageForIssueType = (key, precinct) => {
  const message = messageMap[key] || key;
  return typeof message === "function" ? message(precinct) : message;
};

// create an issue with key common data and precinct nested inside
const groupedIssues = (issues, issueType) =>
  Object.keys(issues).flatMap(key =>
    issues[key].map(precinct => {
      return {
        precinct,
        message: messageForIssueType(key, precinct),
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
    <Box
      onClick={onClick}
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
      <Styled.h4 sx={{ color, my: 0 }}>
        {selected ? "*" : ""}Precinct {precinct["precinct_full"]}
      </Styled.h4>
      <Styled.p sx={{ color, mb: 0 }}>{alert.message}</Styled.p>
    </Box>
  );
};

export const Alerts = ({ data }) => {
  const { selectedPrecinct, setSelectedPrecinct } = React.useContext(
    UserContext
  );
  const { alerts, warnings } = data;

  const allAlerts = groupedIssues(alerts, "error");
  const allWarnings = groupedIssues(warnings, "warning");
  const allIssues = allAlerts.concat(allWarnings);
  console.log(allIssues);
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
          const precinctIdentifier = issue.precinct["precinct_full"];
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
