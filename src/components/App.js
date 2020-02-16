import React, { Component } from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
// import "../styles/App.css";
import { Box } from "theme-ui";
import { Layout } from "./Layout";
import Nevada from "./Nevada";
import Sankey from "./CorrelationSankey";
import CorrelationMatrix from "./CorrelationMatrix";
import styled from "@emotion/styled";

const Title = styled.h1`
  font-size: 35px;
  display: flex;
  justify-content: center;
  margin: 10px;
`;
const SubTitle = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: center;
`;

class App extends Component {
  render() {
    return (
      <Layout>
        <Query query={HELLO_QUERY}>
          {props => {
            const { data, loading, error, refetch } = props;
            if (loading) {
              return <div>Loading</div>;
            }

            if (error) {
              return <div>An unexpected error occurred</div>;
            }

            return (
              <>
                <Box sx={{ p: 1, border: "1px solid", borderColor: "primary" }}>
                  <Nevada data={[1, 2, 3]}></Nevada>
                </Box>
                <Box sx={{ mt: 2, mx: "auto" }}>
                  <CorrelationMatrix></CorrelationMatrix>
                </Box>
                <Box sx={{ mt: 2, mx: "auto" }}>
                  <Sankey></Sankey>
                </Box>
              </>
            );
          }}
        </Query>
      </Layout>
    );
  }
}

const HELLO_QUERY = gql`
  query HelloQuery($name: String) {
    hello(name: $name)
  }
`;

export default App;
