// @flow
import {StyleSheet} from 'react-native';
import {Colors, Metrics} from '../../theme';

export default StyleSheet.create({
  container: {
    width: Metrics.ratio(50),
    height: Metrics.ratio(50),
    borderRadius: Metrics.ratio(25),
    borderColor: Colors.white,
    borderWidth: Metrics.ratio(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
