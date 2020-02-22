import parseCsv from "csv-parse/lib/sync";
import _ from 'lodash';

export const massageResult = csv => {
  const jsResults = parseCsv(csv, {
    columns: true,
    skip_empty_lines: true
  }).slice(0,100);
  console.log({jsResults})
  let countyLevelGroup = _.groupBy(jsResults, 'county');
  let electionData = _.reduce(countyLevelGroup, function(result, county, countyKey) {
    let precinctGroup = _.groupBy(county, 'precinct');
      precinctGroup = _.reduce(precinctGroup, function(precinctResult, precinct, key) {
        let candidate = _.groupBy(precinct, 'candidate');
          precinctResult[key] = _.reduce(candidate, function (candidateResult, c, candidateKey){
            candidateResult[candidateKey] = c[0]; // In the future we can reduce this to a sparser model here.
            return candidateResult;
          }, {})  
        return precinctResult;
      }, {});
    result[countyKey] = precinctGroup;
    return result;
  }, {});

  function toAlerts(row){
    return row;  //adapt model however we like.
  }

  function toWarnings(row){
    return row;  //adapt model however we like.
  }

  function isFalse(row,prop){
    if(!row[prop]){
      return true;
    }
    return row[prop] === "FALSE" || row[prop] === "NA";
  }

  let viableLoss = _.filter(jsResults, row => !isFalse(row,'viable_loss')).map(toAlerts);
  let moreFinalVotes = _.filter(jsResults, row => !isFalse(row,'more_final_votes')).map(toAlerts);;
  let nonviableNoRealign = _.filter(jsResults, row => !isFalse(row,'nonviable_no_realign')).map(toAlerts);;

  let delCountsDiff = _.filter(jsResults, row => !isFalse(row,'del_counts_diff')).map(toWarnings);
  let hasAlphaShift = _.filter(jsResults, row => !isFalse(row,'has_alpha_shift')).map(toWarnings);
  let fewerFinalVotes = _.filter(jsResults, row => !isFalse(row,'fewer_final_votes')).map(toWarnings);
  let extraDelGiven = _.filter(jsResults, row => !isFalse(row,'extra_del_given')).map(toWarnings);

  let alerts = {viableLoss, moreFinalVotes, nonviableNoRealign}
  let warnings = {delCountsDiff, hasAlphaShift, fewerFinalVotes, extraDelGiven};
  return {electionData, alerts, warnings};
};

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
