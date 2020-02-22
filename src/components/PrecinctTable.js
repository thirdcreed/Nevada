/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import {
  precinctId,
  candidateDisplayName,
  flattenPrecincts,
  _rowFixture,
  refinePrecinct
} from "../lib/precinctData";
import { Styled, Box, Button } from "theme-ui";
import { UserContext } from "./Context";

const boolToString = b => (b ? "Yes" : "No");

export const PrecinctTable = () => {
  const [showVotes, setShowVotes] = React.useState(true);
  const [showRules, setShowRules] = React.useState(false);
  const [showIssues, setShowIssues] = React.useState(false);
  const [tableData, setTableData] = React.useState(null);
  const { selectedPrecinct, data } = React.useContext(UserContext);

  React.useEffect(() => {
    const precincts = flattenPrecincts(data);
    const precinct = selectedPrecinct && precincts[selectedPrecinct];

    if (precinct) {
      setTableData(refinePrecinct(precinct));
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
      <Styled.h3>{selectedPrecinct}</Styled.h3>
      <Styled.table sx={{ width: "100%" }}>
        <VotesSection
          show={showVotes}
          toggleShow={toggleShowVotes}
          data={tableData}
        />
        <RulesSection
          show={showRules}
          toggleShow={toggleShowRules}
          data={tableData}
        />
        <IssuesSection
          show={showIssues}
          toggleShow={toggleShowIssues}
          data={tableData}
        />
      </Styled.table>
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <Styled.h3>Select a precinct</Styled.h3>
    </Box>
  );
};

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
  const { candidates } = data;
  const allCandidateKeys = Object.keys(candidates);

  return (
    <>
      <SectionHeader title="Votes" show={show} toggleShow={toggleShow} />
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
                <Styled.h5>Expected SDEs</Styled.h5>
              </Styled.th>
              <Styled.th>
                <Styled.h5>Actual SDEs</Styled.h5>
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

const IssuesSection = ({ data, show, toggleShow }) => {
  // const issueCount = result.issues.length;
  // const subtitle = `${issueCount} issue${
  //   issueCount === 1 ? "" : "s"
  // } identified`;
  console.log(data);
  return (
    null || (
      <>
        <SectionHeader
          title="Possible Issues"
          subtitle={"subtitle"}
          show={show}
          toggleShow={toggleShow}
        ></SectionHeader>
        {show && (
          <tbody>
            <tr>
              <Styled.td colSpan="5">
                {data.issues.map(iss => (
                  <Styled.p key={iss}>- {iss}</Styled.p>
                ))}
              </Styled.td>
            </tr>
          </tbody>
        )}
      </>
    )
  );
};
