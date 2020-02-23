/** @jsx jsx */
import React from "react";
import { jsx, Flex, Styled } from "theme-ui";
import { UserContext } from "./Context";
import NounCard from "./noun_card.js";
import { precinctDisplayName } from "../lib/precinctData";

// const alertColorTheme = {
//   warning: { background: "warning", color: "black" },
//   error: { background: "error", color: "white" },
//   comment: { background: "muted", color: "black" }
// };
// const defaultColors = alertColorTheme.comment;

export const Issue = ({ precinct, issue, onClick, selected }) => {
  const { type, message } = issue;
  // const { background, color } = alertColorTheme[type] || defaultColors;
  return (
    <div className={`card ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="container">
        <div
          className={`top error ${type}`}
          sx={{ backgroundColor: "primary" }}
        >
          <div className="title">{precinctDisplayName(precinct)}</div>
        </div>
        <div className="bottom">
          <div className="content-left">
            <div className="error-type">
              {type === "error" ? "Actually wrong" : "Suspicious"}
            </div>
            <div className="description">{message}</div>
          </div>
          <NounCard style={{ height: "65px", width: "65px;" }}></NounCard>
        </div>
      </div>
    </div>
  );
};

export const Alerts = () => {
  const {
    selectedPrecinct,
    setSelectedPrecinct,
    data: { refined: refinedPrecincts }
  } = React.useContext(UserContext);

  const allIssues = Object.keys(refinedPrecincts).flatMap(
    p => refinedPrecincts[p].issues
  );

  const issueCount = allIssues.length;

  return (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "500px"
      }}
    >
      <Styled.h2>Precincts of Note</Styled.h2>
      {issueCount === 0 ? (
        <Styled.p>Having a normal one</Styled.p>
      ) : (
        <>
          <Styled.h3>
            {issueCount} issue{issueCount === 1 ? "" : "s"} found
          </Styled.h3>
          {Object.keys(refinedPrecincts).flatMap(precinctId => {
            const { meta, issues } = refinedPrecincts[precinctId];
            return issues.map((issue, ii) => {
              return (
                <Issue
                  selected={precinctId === selectedPrecinct}
                  key={
                    /* Should maybe be the GEOID10 as unique id */
                    precinctId + ii
                  }
                  precinct={meta}
                  issue={issue}
                  onClick={() => {
                    setSelectedPrecinct(precinctId);
                  }}
                />
              );
            });
          })}
        </>
      )}
    </Flex>
  );
};
