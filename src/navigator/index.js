// @flow
import React from 'react';
import {connect} from 'react-redux';
import {
  Stack,
  Scene,
  Drawer,
  Router,
  Actions,
  ActionConst,
} from 'react-native-router-flux';
import {View} from 'react-native';
import {Colors} from '../theme';
import {Empty, Dashboard, Home} from '../containers';

import styles from './styles';

const navigator = Actions.create(
  <Stack
    key="root"
    titleStyle={styles.title}
    headerStyle={styles.header}
    headerTintColor={Colors.navbar.text}
    backTitle=" ">
    <Scene title="Empty" key="empty" component={Empty} />
    <Scene title="Dashboard" key="dashboard" component={Dashboard} hideNavBar />
    <Scene title="Home" key="home" component={Home} initial hideNavBar />
  </Stack>,
);

export default () => <AppNavigator navigator={navigator} />;

const AppNavigator = connect()(Router);
