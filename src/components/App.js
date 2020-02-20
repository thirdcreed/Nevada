import React from "react";
import { Box } from "theme-ui";
import { massageResult } from "../lib/precinctData";
import { Layout } from "./Layout";
import { Main } from "./Main";
import { AppContext } from "./AppContext";

const App = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [_loadError, setLoadError] = React.useState(false);

  const [selectedPrecinct, setSelectedPrecinct] = React.useState(null);

  const fetchData = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "https://nevada-cranks.herokuapp.com/results", true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = massageResult(this.response);
        console.log({ data });
        setData(data);
        setLoading(false);
      } else {
        setLoadError(true);
        setLoading(false);
        console.warn("server error");
      }
    };
    request.onerror = function() {
      console.warn("didn't get it");
    };
    request.send();
  };

  React.useEffect(fetchData, []);

  return (
    <AppContext.Provider
      value={{ data, selectedPrecinct, setSelectedPrecinct }}
    >
      <Layout>
        {loading ? (
          <Box>Loading...</Box>
        ) : data ? (
          <Main data={data} />
        ) : (
          <Box>An unexpected error occurred</Box>
        )}
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
