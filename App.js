import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import SmsAndroid from 'react-native-sms-android';

type Props = {};

let currentPosition = 0;

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loop: 1,
      number: null,
      message: null,
      isLoading: false,
    }

    this.handleText = this.handleText.bind(this);
  }

  async requestSMSPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'Flood Texter App SMS Permission',
          message:
            'Flood Texter App needs access to your messaging app ' +
            'so you can start flooding messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ isLoading: true }, this.handleSms);
      } else {
        alert('Send SMS permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  handleSms = () => {
    const { number, message: body, loop } = this.state;
    SmsAndroid.sms(
      number,
      body,
      'sendDirect',
      (err, message) => {
        if (err) {
          alert(err);
        }
      }
    );
    currentPosition+=1;
    if (loop > currentPosition) setTimeout(this.handleSms, 5000);
    if (loop === currentPosition) {
      currentPosition = 0;
      this.setState({ isLoading: false, message: null, number: null, loop: 1 });
    }
  }

  handleText() {
    const { loop, number, message } = this.state;
    try {
      if (loop && number.length === 11 && message) {
        this.requestSMSPermission();
      } else {
        Alert.alert(
          'Something went wrong',
          'Check the loop, mobile number and message if valid.',
          [
            {text: 'Got it!', onPress: () => this.setState({ isLoading: false })},
          ],
          {cancelable: true},
        );
      }
    } catch (err) {
      Alert.alert(
        'Something went wrong',
        JSON.stringify(err),
        [
          {text: 'Got it!', onPress: () => this.setState({ isLoading: false })},
        ],
        {cancelable: true},
      );
    }
  }

  render() {
    const { loop, number, message, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          FLOOD TEXTER
        </Text>
        {
          isLoading
            ? (
              <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color="#00ab66" />
              </View>
            )
            : (
              <View style={styles.textInputNumberContainer}>
                <TextInput
                  ref='loop'
                  style={styles.textInputNumber}
                  keyboardType="number-pad"
                  value={loop}
                  selectTextOnFocus
                  keyboardAppearance='dark'
                  placeholderTextColor='#eaeaea'
                  onChangeText={(loop) => {
                    this.setState({ loop: parseInt(loop, 10) });
                  }}
                  placeholder='Maximum of 999'
                />
                <TextInput
                  ref='number'
                  style={styles.textInputNumber}
                  keyboardType="number-pad"
                  value={number}
                  selectTextOnFocus
                  keyboardAppearance='dark'
                  placeholderTextColor='#eaeaea'
                  onChangeText={(number) => {
                    this.setState({ number });
                  }}
                  placeholder='09XXXXXXXXX'
                />
                <TextInput
                  ref='message'
                  style={styles.textInputMessage}
                  keyboardType='default'
                  value={message}
                  multiline
                  textAlignVertical='top'
                  selectTextOnFocus
                  onChangeText={(message) => {
                    this.setState({ message });
                  }}
                  keyboardAppearance='dark'
                  placeholderTextColor='#eaeaea'
                  placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate lectus sed commodo malesuada. In varius molestie velit, gravida tincidunt lectus accumsan non. Fusce in nisl vestibulum sapien tincidunt tincidunt et eget sem.'
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleText}
                >
                  <Text style={{ color: '#00ab66', fontWeight: '800', }}>SEND</Text>
                </TouchableOpacity>
              </View>
            )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: 'black', 
  },
  title: {
    color: '#7a7a7a',
    fontWeight: '800',
    fontSize: 30,
    textAlign: 'center',
  },
  textInputNumberContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputNumber: {
    borderColor: 'white',
    color: '#00ab66',
    margin: 5,
    padding: 3,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 12,
    width: Dimensions.get('window').width * 0.3,
  },
  textInputMessage: {
    borderColor: 'white',
    color: '#00ab66',
    margin: 5,
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 12,
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.3,
  },
  button: {
    borderColor: 'white',
    margin: 5,
    padding: 3,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.05, 
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
