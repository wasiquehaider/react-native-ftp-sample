// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {View, ViewPropTypes} from 'react-native';
import {BarIndicator} from 'react-native-indicators';
import Voice from '@react-native-community/voice';

import {Text, ButtonView} from '../../components';
import styles from './styles';
import {Colors, Metrics} from '../../theme';

export default class RecordingControl extends React.Component {
  static propTypes = {
    isRecording: PropTypes.bool,
    onSpeechEnded: PropTypes.func,
    onSpeechResults: PropTypes.func,
    containerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    isRecording: false,
    onSpeechEnded: () => {},
    onSpeechResults: () => {},
    containerStyle: {},
  };

  constructor(props) {
    super(props);

    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(
      this,
    );
    Voice.onSpeechError = this.onSpeechResultsErrorHandler.bind(this);

    this.state = {isRecording: props.isRecording};
  }

  onSpeechStartHandler = (event) => {
    this.setState({isRecording: true});
  };

  onSpeechEndHandler = (event) => {
    this.setState({isRecording: false});
  };

  onSpeechResultsHandler = (event) => {
    const results = event.value.join(' ');

    const {onSpeechResults} = this.props;

    if (onSpeechResults) {
      onSpeechResults(results);
    }
  };

  onSpeechPartialResultsHandler = (event) => {};

  onSpeechResultsErrorHandler = (event) => {
    this.setState({isRecording: false});
  };

  render() {
    const {isRecording} = this.state;
    const {containerStyle} = this.props;

    if (!isRecording) {
      return (
        <ButtonView
          style={styles.container}
          onPress={() => {
            Voice.start('en-US');

            setTimeout(() => {
              Voice.stop();
            }, 5000);
          }}>
          <Text color="white">R</Text>
        </ButtonView>
      );
    }

    return <BarIndicator color="white" count={5} />;
  }
}
