import parseCsv from "csv-parse/lib/sync";
import camelize from "camelize";

export const parseData = csv => {
  const jsResults = camelize(
    parseCsv(csv, {
      columns: true,
      skip_empty_lines: true
    })
  );

  /*
    { precinctData: { [precinctId]: dataForPrecinct }}
  */
  const precinctResults = jsResults.reduce((acc, current) => {
    const precinctData = rowToData(current);
    return { ...acc, [precinctData.key]: precinctData };
  }, {});

  return {
    precinctResults
  };
};

// Replace later if needed- looking for a standard way to
const precinctIdentifier = rowObject => {
  const { precinctFull } = rowObject;
  return `${precinctFull}`;
};

const rowToData = rowObject => {
  const key = precinctIdentifier(rowObject);
  const {
    // Issues - keep up to date w/ csv model
    viableLoss,
    nonviableNoRealign,
    alphaShift,
    hasAlphaShift,
    moreFinalVotes,
    fewerFinalVotes,
    delCountsDiff,
    extraDelGiven,
    // End Issues

    ...cleanData
  } = rowObject;

  const issues = parseIssues({
    viableLoss,
    nonviableNoRealign,
    alphaShift,
    hasAlphaShift,
    moreFinalVotes,
    fewerFinalVotes,
    delCountsDiff,
    extraDelGiven
  });

  return {
    key,
    issues,
    ...cleanData
  };
};

const parseIssues = ({
  viableLoss,
  nonviableNoRealign,
  alphaShift,
  hasAlphaShift,
  moreFinalVotes,
  fewerFinalVotes,
  delCountsDiff,
  extraDelGiven
}) => {
  const issues = {
    alphaShift: hasAlphaShift && {
      candidate: alphaShift
    },
    viableLoss: coerceBool(viableLoss),
    nonviableNoRealign: coerceBool(nonviableNoRealign),
    moreFinalVotes: coerceBool(moreFinalVotes),
    fewerFinalVotes: coerceBool(fewerFinalVotes),
    delCountsDiff: delCountsDiff || 0,
    extraDelGiven: coerceBool(extraDelGiven)
  };
  // console.log(issues);
  return issues;
};

const coerceBool = val => !!val && val.toUpperCase() === "TRUE";

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
