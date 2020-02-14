import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import '../styles/App.css'
import Nevada from './Nevada';
import Sankey from './CorrelationSankey';
import CorrelationMatrix from './CorrelationMatrix';
import styled from 'styled-components';

const AppBody = styled.div`
display:flex;
flex-direction:row;
`;

const Title = styled.div`
font-size: 35px;
display:flex;
justify-content:center;
margin:10px;
`;
const SubTitle = styled.div`
font-size: 14px;
display:flex;
justify-content:center;
`;

class App extends Component {
  render() {
    return (
      <div className="AppBody">
          <Query query={HELLO_QUERY}>
            {props => {
              const { data, loading, error, refetch } = props
              if (loading) {
                return <div>Loading</div>
              }

              if (error) {
                return <div>An unexpected error occurred</div>
              }

              return (
                <AppBody>
                  <div>
                    <Title>Nevada Files</Title>
                    <SubTitle>PPP Cranks Investigate</SubTitle>
                  </div>
                  <Nevada data={[1,2,3]}></Nevada>
                  <div>
                    <CorrelationMatrix></CorrelationMatrix>
                    <Sankey></Sankey>
                  </div>
                 
                </AppBody>
              )
            }}
          </Query> 
      </div>
    )
  }
}

const HELLO_QUERY = gql`
  query HelloQuery($name: String) {
    hello(name: $name)
  }
`

export default App
