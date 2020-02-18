const candidates = {
  liz: "Warren",
  pete: "BootEdgeEdge",
  tulsi: "Gabbard",
  joe: "Biden",
  amy: "Klobuchar",
  bernie: "Sanders",
  mike: "Bloomberg"
};

const candidateKeys = Object.keys(candidates);

/* TODO: unmock */
const candidateVotes = _csvRow =>
  candidateKeys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: Math.floor(Math.random() * 1000)
    };
  }, {});

const awardedSDEs = _csvRow =>
  candidateKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: Math.floor(Math.random() * 100)
    }),
    {}
  );

export const precinctData = () => ({
  name: "Precinct X",
  result: precinctResult()
});

export const candidateDisplayName = key => candidates[key];

const precinctResult = row => {
  const firstRoundVotes = candidateVotes(row);
  const secondRoundVotes = candidateVotes(row);
  return {
    /* Reported first-round votes */
    firstRoundVotes: candidateVotes(row),
    /* Reported second-round votes */
    secondRoundVotes: candidateVotes(row),
    expectedOutcome: {
      awardedSDEs: awardedSDEs(row),
      coinToss: true // ?
    },
    actualOutcome: {
      awardedSDEs: awardedSDEs(row),
      coinToss: true
    },
    issues: [
      "Bernie is not a real democrat",
      "Nonviable candidates combined after 1st round",
      "Amy Klobuchar is a cop"
    ]
  };
};
