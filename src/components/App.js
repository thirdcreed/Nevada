import React, { Component } from "react";
import { Box } from "theme-ui";
import styled from "@emotion/styled";
import { Layout } from "./Layout";
import { Main } from "./Main";

const App = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    var request = new XMLHttpRequest();
    request.open("GET", "https://nevada-cranks.herokuapp.com/results", true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = this.response;
        setData(resp);
        setLoading(false);
        // console.log(resp);
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
  });

  return (
    <Layout>
      {loading ? (
        <Box>Loading...</Box>
      ) : loadError ? (
        <div>An unexpected error occurred</div>
      ) : (
        <Main data={data} />
      )}
    </Layout>
  );
};

export default App;
