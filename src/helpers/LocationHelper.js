import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {Alert, Linking, Platform} from 'react-native';

import Geocoder from 'react-native-geocoder-reborn';
import AppConfig from '../config/AppConfig';

import Util from '../util';

let location = {
  latitude: 21.5,
  longitude: 39.17,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

class LocationHelper {
  getLocation() {
    return location;
  }

  getLocationAndDelta() {
    return {
      ...location,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  getProvidedLocationWithDelta = (providedLocation) => {
    return {
      ...providedLocation,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  setLocation = (locationCoords) => {
    location = {
      ...locationCoords,
    };
  };

  updateLocation(doAskPermission, callback, errorCallBack) {
    if (Util.isPlatformAndroid()) {
      if (doAskPermission) {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
          message:
            "<h2>Use Location ?</h2>CARHUB wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
          ok: 'YES',
          cancel: 'NO',
          enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
          showDialog: true, // false => Opens the Location access page directly
          openLocationServices: true, // false => Directly catch method is called if location services are turned off
          preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
          preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
          providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        })
          .then(
            function (success) {
              this.getLocationGeneral(callback, errorCallBack);
            }.bind(this),
          )
          .catch((error) => {
            consoleLog(error.message);
          });
      } else {
        this.getLocationGeneral(callback, errorCallBack);
      }
    } else {
      this.getLocationGeneral(callback, errorCallBack);
    }
  }

  getLocationGeneral = (callback, errorCallBack) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        this.setLocation(location);

        if (callback) {
          callback(location);
        }

        navigator.geolocation.stopObserving();
      },
      (error) => {
        if (errorCallBack) {
          errorCallBack();
        } else {
          this.onLocationFailure();
        }
      },
      {
        enableHighAccuracy: Platform.OS != 'android',
        timeout: 2000,
      },
    );
  };

  onLocationFailure = () => {
    Util.showSettingsPopup(
      strings('alertMessages.alert'),
      strings('alertMessages.appLocPermis'),
    );
  };

  stopListener() {
    if (Util.isPlatformAndroid()) {
      LocationServicesDialogBox.stopListener();
    }
  }

  calculateDistance(lat2, lon2) {
    const {latitude: lat1, longitude: lon1} = location;

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return '-';
    }

    const R = 6371;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = Math.round(R * c);

    return `${d} ${strings('shopDetail.km')}`;
  }

  openGoogleMapsApplication = (lat, lng, label = '') => {
    if (Util.isPlatformAndroid()) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${lat},${lng}`;

      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
    } else {
      Linking.openURL(
        'https://www.google.com/maps/@' + lat + ',' + lng + ',6z',
      );
    }
  };

  openDirectionsApplication = (lat, lng) => {
    Platform.select({
      ios: () => {
        // Linking.openURL("http://maps.apple.com/maps?daddr=" + lat + "," + lng);
        Linking.openURL('http://maps.google.com/maps?daddr=' + lat + ',' + lng);
      },
      android: () => {
        Linking.openURL('http://maps.google.com/maps?daddr=' + lat + ',' + lng);
      },
    })();
  };

  fetchGeocodeResult = (providedLocation, callback) => {
    Geocoder.fallbackToGoogle(AppConfig.gMapAPIKey);

    Geocoder.geocodePosition({
      lat: providedLocation.latitude,
      lng: providedLocation.longitude,
    })
      .then((res) => {
        let result = res && res.length > 0 ? res[0] : undefined;

        if (result && result.formattedAddress) {
          result = result.formattedAddress;

          if (callback) {
            callback(result);
          }
        } else {
          if (callback) {
            callback('Unknown address');
          }
        }
      })
      .catch((err) => {
        if (callback) {
          callback('Unknown address');
        }
      });
  };

  isSignificantlyNear = (location1, location2) => {
    const distanceMeters =
      Util.getDistanceFromLatLonInKm(
        location1.lat,
        location2.long,
        location2.lat,
        location2.long,
      ) * 1000;

    return distanceMeters < 100;
  };
}

export default new LocationHelper();
