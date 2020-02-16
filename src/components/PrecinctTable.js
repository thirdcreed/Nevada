/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import { precinctData, candidateDisplayName } from "../lib/precinctData";
import { Styled, Box } from "theme-ui";

const mockData = precinctData();

const boolToString = b => (b ? "Yes" : "No");

export const PrecinctTable = ({ data = mockData }) => {
  const { name, result } = data;

  return (
    <Box sx={{ width: "100%" }}>
      <Styled.h3>{name}</Styled.h3>
      <Styled.table sx={{ width: "100%" }}>
        <VotesSection result={result} />
        <MetaSection result={result} />
        <IssuesSection result={result} />
      </Styled.table>
    </Box>
  );
};

const SectionHeader = ({ title, children }) => {
  return (
    <Styled.tr>
      <Styled.th colSpan={children ? "1" : "5"}>
        <Styled.h3>{title}</Styled.h3>
      </Styled.th>
      {children && children}
    </Styled.tr>
  );
};

const VotesSection = ({ result }) => {
  const allCandidateKeys = Object.keys(result.firstRoundVotes);
  console.log(result);
  return (
    <>
      <thead>
        <SectionHeader title="Votes"></SectionHeader>
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
        {allCandidateKeys.map(k => (
          <Styled.tr key={k}>
            <Styled.td>
              <Styled.p>{candidateDisplayName(k) || k}</Styled.p>
            </Styled.td>
            <Styled.td>
              <Styled.p key={k}>{result.firstRoundVotes[k]}</Styled.p>
            </Styled.td>
            <Styled.td>
              <Styled.p key={k}>{result.secondRoundVotes[k]}</Styled.p>
            </Styled.td>
            <Styled.td>
              <Styled.p key={k}>
                {result.expectedOutcome.awardedSDEs[k]}
              </Styled.p>
            </Styled.td>
            <Styled.td>
              <Styled.p key={k}>{result.actualOutcome.awardedSDEs[k]}</Styled.p>
            </Styled.td>
          </Styled.tr>
        ))}
      </tbody>
    </>
  );
};

const MetaSection = ({ result }) => {
  return (
    <>
      <thead>
        <SectionHeader title="Weird Rules"></SectionHeader>
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
            <Styled.p>{boolToString(result.expectedOutcome.coinToss)}</Styled.p>
          </Styled.td>
          <Styled.td colSpan="2">
            <Styled.p>{boolToString(result.actualOutcome.coinToss)}</Styled.p>
          </Styled.td>
        </Styled.tr>
        <Styled.tr>
          <Styled.td colSpan="1">
            <Styled.p>Duel</Styled.p>
          </Styled.td>
          <Styled.td colSpan="2">
            <Styled.p>{boolToString(result.expectedOutcome.coinToss)}</Styled.p>
          </Styled.td>
          <Styled.td colSpan="2">
            <Styled.p>{boolToString(result.actualOutcome.coinToss)}</Styled.p>
          </Styled.td>
        </Styled.tr>
      </tbody>
    </>
  );
};

const IssuesSection = ({ result }) => {
  return (
    <>
      <thead>
        <SectionHeader title="Possible Issues"></SectionHeader>
      </thead>
      <tbody>
        <tr>
          <Styled.td colSpan="5">
            {result.issues.map(iss => (
              <Styled.p key={iss}>- {iss}</Styled.p>
            ))}
          </Styled.td>
        </tr>
      </tbody>
    </>
  );
};
