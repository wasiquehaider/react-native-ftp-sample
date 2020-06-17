import {combineReducers} from 'redux';

import navigator from './navigator';

import networkInfo from './networkInfo';

export default combineReducers({
  route: navigator,
  networkInfo,
});
