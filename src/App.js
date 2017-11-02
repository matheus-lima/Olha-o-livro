/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import Routes from './Routes'

export default class App extends Component {
  render() {
    return (
      <Routes/>
    );
  }
}

const styles = StyleSheet.create({

});