/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import CheckIn from './src/screens/CheckIn';
import {PaperProvider} from 'react-native-paper';

function App(): JSX.Element {
  return (
    <PaperProvider>
      <CheckIn />
    </PaperProvider>
  );
}

export default App;
