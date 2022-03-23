import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const App = () => {
  return (
    <div className="App">
      <Navbar/>
      <Title>Coinslot</Title>
    </div>
  );
}

export default App;
