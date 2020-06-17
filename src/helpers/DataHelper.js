import {Actions} from 'react-native-router-flux';

class DataHelper {
  store = undefined;

  setStore(store) {
    this.store = store;
  }

  getStore() {
    return this.store;
  }

  getAccessToken = () => {
    const user =
      this.store && this.store.getState()
        ? this.store.getState().user
        : undefined;

    if (user && user.data && user.data.accessToken) {
      return user.data.accessToken;
    }

    return undefined;
  };

  isUserAuthenticated = () => {
    return this.getAccessToken() !== undefined;
  };
}

export default new DataHelper();
