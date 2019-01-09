import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import {Alert,AppRegistry,Button,}from 'react-native';

import firebase from 'react-native-firebase';

const switchRef = firebase.database().ref('Switch/switchIO/');
const tempRef = firebase.database().ref('Data/Temp/');
const humRef = firebase.database().ref('Data/Humi/');

var PushNotification = require('react-native-push-notification');
PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
      console.log( 'TOKEN:', token );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: "YOUR GCM (OR FCM) SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
      alert: true,
      badge: true,
      sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
});

const Header = () =>{
  const {viewStyle,textStyle}=headerStyle;
  return(
    <View style={headerStyle.viewStyle}>
          <Text style={headerStyle.textStyle}>Smart Mirror Remote</Text>
    </View>
  );
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      switchIO : 0,
      temp : 0,
      hum : 0,
      switchStats : "on",
      buttonColor : "#841584",
    };
  }
  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());
    tempRef.on('value',(snapshot)=>{
      this.setState({
        temp : snapshot.val()
      })
      if(snapshot.val() >= 40){
        PushNotification.localNotification({
          title: "แจ้งเตือนอุณหภูมิฉุกเฉิน!", // (optional)
          message: "ตอนนี้อุณหภูมิห้อง "+snapshot.val()+" องศา! ร้อนเกินไปแล้ว!", // (required)
          repeatType: 'minute',
        })
      }
      else if(snapshot.val() < 18){
        PushNotification.localNotification({
          title: "แจ้งเตือนอุณหภูมิฉุกเฉิน!", // (optional)
          message: "ตอนนี้อุณหภูมิห้อง "+snapshot.val()+" องศา! หนาวเกินไปแล้ว!", // (required)
          repeatType: 'minute',
        })
      }
    });

    humRef.on('value',(snapshot)=>{
      this.setState({
        hum : snapshot.val()
      })
      if(snapshot.val() >= 80){
        PushNotification.localNotification({
          title: "แจ้งเตือนความชื้นฉุกเฉิน!", // (optional)
          message: "ตอนนี้ความชื้นในห้อง "+snapshot.val()+" % อากาศชื้นสูงไป!", // (required)
          repeatType: 'minute',
        })
      }
      else if(snapshot.val() < 20){
        PushNotification.localNotification({
          title: "แจ้งเตือนอุณหภูมิฉุกเฉิน!", // (optional)
          message: "ตอนนี้ตอนนี้ความชื้นในห้อง "+snapshot.val()+" % อากาศแห้งเกินไป!", // (required)
          repeatType: 'minute',
        })
      }
    });
    switchRef.on('value',(snapshot)=>{
      this.setState({
        switchIO : snapshot.val()
      })
      if(this.state.switchIO === 0){
        this.setState({
          switchStats : "on",
          buttonColor : "#841584"
        })
      }
      else{
        this.setState({
          switchStats : "off",
          buttonColor : "#158484"
        })
      }
    });// await firebase.analytics().logEvent('foo', { bar: '123'});
  }
  _onPressButton = () =>{
    if(this.state.switchIO === 0){
      this.setState({
        switchStats : "off",
        switchIO : 1,
        buttonColor : "#158484"
      }) 
      switchRef.set(1);
    }
    else{
      this.setState({
        switchStats : "on",
        switchIO : 0,
        buttonColor : "#841584"
      })
      switchRef.set(0);
    }// Alert.alert("Smart Mirror "+ this.state.switchStats+"!");
  }
  render() {
    return (
      <ScrollView>
        <Header/>
        <View style={styles.container}>
          <Image source={require('./assets/ITE.jpg')} style={[styles.logo]}/>
          <View style={styles.boxContainer}>
          <Text style={styles.welcome}>  Smart Mirror on / off </Text>
          <View style={styles.buttonContainer}>
          <Button 
            onPress={this._onPressButton}
            title={this.state.switchStats}
            color={this.state.buttonColor} //กดแล้วเปลี่ยนสี
            />
            </View>
           {/* <Text>{instructions}</Text> */}
          </View>
          <View style={styles.tempContainer}>
          <Text style={styles.temp}>  {this.state.temp} °C  </Text>
          <Text style={styles.welcome}>Temperature</Text>

          </View>
          <View style={styles.humContainer}>
          <Text style={styles.hum}>  {this.state.hum} %  </Text>
          <Text style={styles.welcome}>Humidity</Text>

          </View>

          
          

          {/* <View style={styles.modules}>
            <Text style={styles.modulesHeader}>The following Firebase modules are pre-installed:</Text>
            {firebase.admob.nativeModuleExists && <Text style={styles.module}>admob()</Text>}
            {firebase.analytics.nativeModuleExists && <Text style={styles.module}>analytics()</Text>}
            {firebase.auth.nativeModuleExists && <Text style={styles.module}>auth()</Text>}
            {firebase.config.nativeModuleExists && <Text style={styles.module}>config()</Text>}
            {firebase.crashlytics.nativeModuleExists && <Text style={styles.module}>crashlytics()</Text>}
            {firebase.database.nativeModuleExists && <Text style={styles.module}>database()</Text>}
            {firebase.firestore.nativeModuleExists && <Text style={styles.module}>firestore()</Text>}
            {firebase.functions.nativeModuleExists && <Text style={styles.module}>functions()</Text>}
            {firebase.iid.nativeModuleExists && <Text style={styles.module}>iid()</Text>}
            {firebase.invites.nativeModuleExists && <Text style={styles.module}>invites()</Text>}
            {firebase.links.nativeModuleExists && <Text style={styles.module}>links()</Text>}
            {firebase.messaging.nativeModuleExists && <Text style={styles.module}>messaging()</Text>}
            {firebase.notifications.nativeModuleExists && <Text style={styles.module}>notifications()</Text>}
            {firebase.perf.nativeModuleExists && <Text style={styles.module}>perf()</Text>}
            {firebase.storage.nativeModuleExists && <Text style={styles.module}>storage()</Text>}
          </View> */}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    width: 300,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    marginBottom: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,

  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  boxContainer:{
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#DDDDDD',
    margin: 6,
    padding: 10,
    width: 390,
    //height: 150,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  tempContainer:
  {borderWidth: 1,
    borderRadius: 2,
    borderColor: '#DDDDDD',
    margin: 6,
    padding: 10,
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },temp: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 4,
  },
  humContainer:{
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#DDDDDD',
    margin: 6,
    padding: 10,
    width: 170,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },hum: {
    marginTop: 4,
    fontSize: 40,
    textAlign: 'center',
  },

});
const headerStyle={
  viewStyle:{
    backgroundColor: "orange",
    alignItems: 'center',
    height:60,
    paddingTop: 15 ,
    justifyContent: 'center',
    shadowColor: '#00000',
    shadowOffset: {width:0 ,height:2},
    shadowOpacity: 0.5,
    position:'relative',
    

  },
  textStyle :{
    fontSize: 20,
     color: "white",
     fontStyle: 'normal',
     fontWeight:'bold',
  }
}