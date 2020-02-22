/** @jsx jsx */
import React from "react";
import { Box, Styled, jsx } from "theme-ui";
import { massageResult } from "../lib/precinctData";
import { loadDevTools } from "../lib/devTools";
import { Layout } from "./Layout";
import { Main } from "./Main";
import { About } from "./About";
import { UserContext } from "./Context";

const NotFound = () => (
  <Styled.h3 sx={{ textAlign: "center" }}>
    404. Go back to <a href="/nevada">Nevada</a>
  </Styled.h3>
);

const App = () => {
  let Component = NotFound;
  let doFetchData = false;
  switch (window.location.pathname) {
    case "/":
    case "/nevada":
      Component = Main;
      doFetchData = true;
      break;
    case "/about":
      Component = About;
      break;
    default:
      Component = NotFound;
  }
  const [data, setData] = React.useState(null);
  const [loadError, setLoadError] = React.useState(false);

  const [selectedPrecinct, setSelectedPrecinct] = React.useState(null);

  if (doFetchData) {
    const fetchData = () => {
      console.log("fetching");
      var request = new XMLHttpRequest();
      request.open("GET", "https://nevada-cranks.herokuapp.com/results", true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          console.log("got data");
          var data = massageResult(this.response);
          console.log({ data });
          setData(data);
          loadDevTools({ data, csv: this.response });
        } else {
          setLoadError(true);
          console.warn("server error");
        }
      };
      request.onerror = function() {
        console.warn("didn't get it");
      };
      request.send();
    };

    React.useEffect(fetchData, []);
  }

  return (
    <UserContext.Provider
      value={{ data, selectedPrecinct, setSelectedPrecinct }}
    >
      <Layout>
        {loadError ? <Box>An unexpected error occurred</Box> : <Component />}
      </Layout>
    </UserContext.Provider>
  );
};

export default App;
