/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import {
  candidateDisplayName,
  precinctDisplayName,
  flattenPrecincts,
  _rowFixture,
  refinePrecinct
} from "../lib/precinctData";
import { Styled, Box, Button } from "theme-ui";
import { UserContext } from "./Context";

const boolToString = b => (b ? "Yes" : "No");

export const PrecinctTable = () => {
  const [showVotes, setShowVotes] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);
  const [showIssues, setShowIssues] = React.useState(true);
  const [tableData, setTableData] = React.useState(null);
  const { selectedPrecinct, setSelectedPrecinct, data } = React.useContext(
    UserContext
  );

  const reset = () => {
    setSelectedPrecinct(null);
    setShowIssues(true);
    setShowVotes(false);
  };

  React.useEffect(() => {
    if (selectedPrecinct) {
      const precincts = flattenPrecincts(data);
      const candidatesByPrecinct =
        selectedPrecinct && precincts[selectedPrecinct];

      if (candidatesByPrecinct) {
        setTableData(refinePrecinct(candidatesByPrecinct));
      }
    } else {
      setTableData(null);
    }
  }, [selectedPrecinct]);

  // TODO: consider making these toggles in each section and passing in the raw setter
  // This way we could use useEffect() to set the initial show state based on local logic
  // or we could just do that up here with our actual initial values
  const toggleShowVotes = () => {
    setShowVotes(!showVotes);
  };
  const toggleShowRules = () => {
    setShowRules(!showRules);
  };
  const toggleShowIssues = () => {
    setShowIssues(!showIssues);
  };

  return tableData ? (
    <Box sx={{ width: "100%" }}>
      <Button variant="blue" onClick={reset}>
        Reset
      </Button>
      <Styled.h3 sx={{ display: "inline-block" }}>
        Precinct {precinctDisplayName(tableData.meta)}
      </Styled.h3>
      <Styled.table sx={{ width: "100%" }}>
        <VotesSection
          show={showVotes}
          toggleShow={toggleShowVotes}
          data={tableData}
        />
        {null && (
          <RulesSection
            show={showRules}
            toggleShow={toggleShowRules}
            data={tableData}
          />
        )}
        <IssuesSection
          show={showIssues}
          toggleShow={toggleShowIssues}
          data={tableData}
        />
      </Styled.table>
    </Box>
  ) : (
    <SelectAPrecinct />
  );
};

const SelectAPrecinct = () => (
  <Box sx={{ width: "100%" }}>
    <Styled.h3>Select a precinct</Styled.h3>
  </Box>
);

const SectionHeader = ({ title, subtitle = "", toggleShow, show }) => {
  return (
    <thead>
      <Styled.tr>
        <Styled.th colSpan="1">
          <Styled.h3>{title}</Styled.h3>
        </Styled.th>
        <Styled.th sx={{ textAlign: "right" }} colSpan="3">
          <Styled.h4>{subtitle}</Styled.h4>
        </Styled.th>
        <Styled.th colSpan="3" sx={{ textAlign: "right" }}>
          <Button variant={show ? "outline" : "primary"} onClick={toggleShow}>
            {show ? "Hide" : "Show"}
          </Button>
        </Styled.th>
      </Styled.tr>
    </thead>
  );
};

const VotesSection = ({ data, show, toggleShow }) => {
  console.log(data);
  const { candidates, precinct } = data;
  const { viability_threshold: viabilityThreshold } = precinct;
  const allCandidateKeys = Object.keys(candidates);

  return (
    <>
      <SectionHeader
        title="Votes"
        show={show}
        toggleShow={toggleShow}
        subtitle={
          viabilityThreshold ? `Viability threshold: ${viabilityThreshold}` : ""
        }
      />
      {show && (
        <>
          <thead>
            <Styled.tr>
              <Styled.th>
                <Styled.h5>Name</Styled.h5>
              </Styled.th>
              <Styled.th>
                <Styled.h5>Round 1</Styled.h5>
              </Styled.th>
              <Styled.th>
                <Styled.h5>Round 2</Styled.h5>
              </Styled.th>
              <Styled.th>
                <Styled.h5>Expected CDs</Styled.h5>
              </Styled.th>
              <Styled.th>
                <Styled.h5>Actual CDs</Styled.h5>
              </Styled.th>
            </Styled.tr>
          </thead>
          <tbody>
            {allCandidateKeys.map(k => {
              const candidate = candidates[k];
              return (
                <Styled.tr key={k}>
                  <Styled.td>
                    <Styled.p>{candidateDisplayName(k) || k}</Styled.p>
                  </Styled.td>
                  <Styled.td>
                    <Styled.p>{candidate["align1"]}</Styled.p>
                  </Styled.td>
                  <Styled.td>
                    <Styled.p>{candidate["alignfinal"]}</Styled.p>
                  </Styled.td>
                  <Styled.td>
                    <Styled.p>{candidate["caucus_formula_result"]}</Styled.p>
                  </Styled.td>
                  <Styled.td>
                    <Styled.p>{candidate["final_del"]}</Styled.p>
                  </Styled.td>
                </Styled.tr>
              );
            })}
          </tbody>
        </>
      )}
    </>
  );
};

const IssuesSection = ({ data, show, toggleShow }) => {
  const { issues } = data;

  return (
    <>
      <SectionHeader
        title="Possible Issues"
        subtitle={`${issues.length} issue${issues.length === 1 ? "" : "s"}`}
        show={show}
        toggleShow={toggleShow}
      ></SectionHeader>
      {show && (
        <tbody>
          <tr>
            <Styled.td colSpan="5">
              {issues.map((iss, i) => (
                <Styled.p key={i}>
                  - {iss.message} ({iss.type})
                </Styled.p>
              ))}
            </Styled.td>
          </tr>
        </tbody>
      )}
    </>
  );
};

const RulesSection = ({ result, show, toggleShow }) => {
  return (
    null || (
      <>
        <SectionHeader
          title="Caucus Rules"
          show={show}
          toggleShow={toggleShow}
        ></SectionHeader>
        {show && (
          <>
            <thead>
              <Styled.tr>
                <Styled.th colSpan="1" />
                <Styled.th colSpan="2">
                  <Styled.h5>Expected</Styled.h5>
                </Styled.th>
                <Styled.th colSpan="2">
                  <Styled.h5>Actual</Styled.h5>
                </Styled.th>
              </Styled.tr>
            </thead>
            <tbody>
              <Styled.tr>
                <Styled.td colSpan="1">
                  <Styled.p>Coin Toss</Styled.p>
                </Styled.td>
                <Styled.td colSpan="2">
                  <Styled.p>
                    {boolToString(result.expectedOutcome.coinToss)}
                  </Styled.p>
                </Styled.td>
                <Styled.td colSpan="2">
                  <Styled.p>
                    {boolToString(result.actualOutcome.coinToss)}
                  </Styled.p>
                </Styled.td>
              </Styled.tr>
              <Styled.tr>
                <Styled.td colSpan="1">
                  <Styled.p>Duel</Styled.p>
                </Styled.td>
                <Styled.td colSpan="2">
                  <Styled.p>
                    {boolToString(result.expectedOutcome.coinToss)}
                  </Styled.p>
                </Styled.td>
                <Styled.td colSpan="2">
                  <Styled.p>
                    {boolToString(result.actualOutcome.coinToss)}
                  </Styled.p>
                </Styled.td>
              </Styled.tr>
            </tbody>
          </>
        )}
      </>
    )
  );
};
