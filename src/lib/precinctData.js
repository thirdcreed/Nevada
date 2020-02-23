import parseCsv from "csv-parse/lib/sync";
import _ from "lodash";

export const precinctId = candidatePrecinct => {
  const { county, precinct } = candidatePrecinct;
  return `${county}-${precinct}`;
  // return GEOID10;
};

export const candidateDisplayName = key => candidateNames[key] || key;

export const precinctDisplayName = candidatePrecinct => {
  const { county, precinct } = candidatePrecinct;
  return `${county} ${precinct}`;
};
export const massageResult = csv => {
  const jsResults = parseCsv(csv, {
    columns: true,
    skip_empty_lines: true
  });
  let countyLevelGroup = _.groupBy(jsResults, "county");
  let electionData = _.reduce(
    countyLevelGroup,
    function(result, county, countyKey) {
      let precinctGroup = _.groupBy(county, "precinct");
      precinctGroup = _.reduce(
        precinctGroup,
        function(precinctResult, precinct, key) {
          let candidate = _.groupBy(precinct, "candidate");
          precinctResult[key] = _.reduce(
            candidate,
            function(candidateResult, c, candidateKey) {
              candidateResult[candidateKey] = c[0]; // In the future we can reduce this to a sparser model here.
              return candidateResult;
            },
            {}
          );
          return precinctResult;
        },
        {}
      );
      result[countyKey] = precinctGroup;
      return result;
    },
    {}
  );

  const flattened = flattenPrecincts({ electionData });

  const refined = Object.keys(flattened).reduce((acc, pkey) => {
    const candidatesByPrecinct = flattened[pkey];
    const refined = refinePrecinct(candidatesByPrecinct);
    acc[pkey] = refined;
    return acc;
  }, {});

  return { electionData, refined, rows: jsResults };
};

const candidateNames = {
  delaneyj: "John Delaney",
  bennetm: "Michael Bennet",
  bidenj: "Joe Biden",
  bloombergm: "Mike Bloombefg",
  buttigiegp: "Pete Buttigieg",
  gabbardt: "Tulsi Gabbard",
  klobuchara: "Amy Klobuchar",
  other: "Other",
  patrickd: "Deval Patrick",
  sandersb: "Bernie Sanders",
  steyert: "Tom Steyer",
  uncommitted: "Uncommitted",
  warrene: "Elizabeth Warren",
  yanga: "Andrew Yang"
};

const precinctKeys = [
  "viability_threshold",
  "has_alpha_shift",
  "more_final_votes",
  "fewer_final_votes",
  "game_of_chance",
  "extra_del_given"
];
const metaKeys = [
  "row_id",
  "county",
  "precinct",
  "precinct_full",
  "precinct_delegates",
  "county_fips",
  "state_fips",
  "GEOID10"
];
const candidateKeys = [
  "candidate",
  "align1",
  "alignfinal",
  "total_align1",
  "total_alignfinal",
  "viable1",
  "viablefinal",
  "viable_loss",
  "nonviable_no_realign",
  "alpha_shift",
  "caucus_formula_result",
  "after_rounding",
  "total_del_after_rounding",
  "final_del",
  "total_final_del",
  "distance_next",
  "farthest_rank",
  "closest_rank",
  "min_far_rank",
  "is_farthest",
  "min_close_rank",
  "is_closest",
  "how_many_farthest",
  "how_many_closest",
  "comments",
  "tie_winner",
  "tie_loser",
  "reported_del_given"
];

const flattenPrecincts = data => {
  const { electionData } = data;
  const countyKeys = Object.keys(electionData);
  const precincts = countyKeys.flatMap(c =>
    Object.keys(electionData[c]).map(p => electionData[c][p])
  );
  return precincts.reduce((acc, p) => {
    const firstResult = p[Object.keys(p)[0]];
    const id = precinctId(firstResult);
    if (acc[id]) {
      console.error(id + " already exists");
    }
    acc[id] = p;
    return acc;
  }, {});
};

const falsey = str => !str || str === "FALSE" || str === "NA";

const refinePrecinct = candidatesByPrecinct => {
  const candidateLevel = Object.keys(candidatesByPrecinct).reduce(
    (acc, key) => {
      const thisResult = candidatesByPrecinct[key];

      const candidateData = candidateKeys.reduce((acc, k) => {
        const value = thisResult[k];
        acc[k] = value;
        return acc;
      }, {});
      // return {...acc, [key]: candidateData}
      acc[key] = candidateData;
      return acc;
    },
    {}
  );

  const precinctLevel = Object.keys(candidatesByPrecinct).reduce((acc, key) => {
    const thisResult = candidatesByPrecinct[key];
    const precinctData = precinctKeys.reduce((acc, k) => {
      const value = thisResult[k];
      acc[k] = value;
      return acc;
    }, {});
    if (acc && JSON.stringify(acc) !== JSON.stringify(precinctData)) {
      console.error("precinct data does not match across candidates", {
        acc,
        precinctData
      });
    }
    return precinctData;
  }, null);

  const meta = _.pick(
    candidatesByPrecinct[Object.keys(candidatesByPrecinct)[0]],
    metaKeys
  );

  const precinctIssues = issuesForObject(precinctLevel);

  const candidateIssues = Object.keys(candidateLevel).flatMap(candidateKey => {
    const candidatePrecinct = candidateLevel[candidateKey];
    return issuesForObject(candidatePrecinct);
  });

  const issues = _.compact([...precinctIssues, ...candidateIssues]);

  return {
    meta,
    candidates: candidateLevel,
    precinct: precinctLevel,
    issues
  };
};

const issueMap = {
  // 12 viable_loss          logical: if a candidate was viable in 1st round and lost votes going to final round
  viable_loss: {
    type: "error",
    summary: "Viable Loss",
    message: ({ candidate }) =>
      `${candidateDisplayName(
        candidate
      )} was viable in round 1, lost votes in round 2`
  },
  // 13 nonviable_no_realign logical: if a nonviable candidate from 1st round did not realign in final round
  nonviable_no_realign: {
    type: "error",
    message: ({ candidate }) =>
      `${candidateDisplayName(
        candidate
      )} was nonviable in 1st-round but did not realign`,
    summary: "Nonviable no realign"
  },
  // 14 alpha_shift          string: name of candidate that had alphabetical shift
  alpha_shift: {
    type: "error",
    message: ({ candidate, alpha_shift }) =>
      `Alphabetical shift in voting detected from ${candidateDisplayName(
        candidate
      )} to ${candidateDisplayName(alpha_shift)}`,
    summary: "Alphabetic shift"
  },
  // 16 more_final_votes     logical: more votes in final alignment than 1st alignment
  more_final_votes: {
    type: "error",
    message: `Precinct has more votes in final alignment than 1st alignment`,
    summary: "Vote total increased"
  },
  // 17 fewer_final_votes    logical: fewer votes in final alignment than 1st. warning, not error
  fewer_final_votes: {
    type: "warning",
    summary: "Vote total decreased",
    message: `Precinct has fewer votes in final alignment than 1st alignment`
  },
  // 18 del_counts_diff      logical: our delegate counts differ from those reported
  del_counts_diff: {
    type: "error",
    summary: "Our delegate count differs",
    message: "Our delegate counts differ from those reported"
  },
  // 19 extra_del_given      logical: too many delegates given out but all candidates had 1 delegate, so an extra delegate was given. warning, not error
  extra_del_given: {
    type: "error",
    summary: "Total delegates too high",
    message:
      "All viable candidates had 1 delegate and could not have it taken away, so more delegates than originally intended were given for this precinct"
  }
};

const issuesForObject = objectWithIssueKeys => {
  return Object.keys(objectWithIssueKeys)
    .filter(
      key =>
        !falsey(objectWithIssueKeys[key]) &&
        objectWithIssueKeys.candidate !== "uncommitted"
    )
    .reduce((acc, k) => {
      const issue = issueMap[k];
      if (!issue || objectWithIssueKeys.candidate === "Uncommitted") {
        return acc;
      } else {
        const { message, type, summary } = issue;
        return [
          ...acc,
          {
            code: k,
            message:
              typeof message === "function"
                ? message(objectWithIssueKeys)
                : message,
            type,
            summary
          }
        ];
      }
    }, []);
};

/*
# A tibble: 19 x 2
   colnames             description                                                                                                                
   <chr>                <chr>                                                                                                                      
 1 county               ""                                                                                                                         
 2 precinct             ""                                                                                                                         
 3 candidate            ""                                                                                                                         
 4 precinct_delegates   # of delegates to be given by precinct                                                                                     
 5 align1               # of votes for candidate in 1st alignment                                                                                  
 6 alignfinal           # of votes for candidate in final alignment   
 7 final_del            our calculated # of delegates earned                                                                                       
 8 reported_del         the reported # of delegates earned
 9 game_of_chance       string: type of game of chance required                                                                                    
10 tie_winner           string: winner of an extra delegate in a tie                                                                               
11 tie_loser            string: loser of an extra delegate in a tie                                                                                
12 viable_loss          logical: if a candidate was viable in 1st round and lost votes going to final round                                        
13 nonviable_no_realign logical: if a nonviable candidate from 1st round did not realign in final round                                            
14 alpha_shift          string: name of candidate that had alphabetical shift                                                                      
15 has_alpha_shift      logical: alphabetical shift in vote reporting detected. warning, not error                                                 
16 more_final_votes     logical: more votes in final alignment than 1st alignment                                                                  
17 fewer_final_votes    logical: fewer votes in final alignment than 1st. warning, not error                                                       
18 del_counts_diff      logical: our delegate counts differ from those reported                                                                    
19 extra_del_given      logical: too many delegates given out but all candidates had 1 delegate, so an extra delegate was given. warning, not error
*/
