import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import styles from './styles';
import FTP from 'react-native-ftp';

export default class Home extends Component {
  componentDidMount() {
    // TODO: What to do with the module?
    FTP.setup(
      'ftp://FTPOnly@waws-prod-dm1-119.ftp.azurewebsites.windows.net/site/',
      21,
    ); //Setup host
    FTP.login(
      'FTPOnly',
      '2vNhlXsoDmBKkyGkfzegtzB3FhvcDrD0K1cu7Ts5bg20YFCbllwZijQ79Xkl',
    ).then(
      result => {
        FTP.list('.').then(result => {
          console.log(result);
        });
      },
      error => {
        alert(error);
      },
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Text> Home Component </Text>
      </View>
    );
  }
}
