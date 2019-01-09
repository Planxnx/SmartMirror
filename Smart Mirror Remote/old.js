/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Alert,AppRegistry,Button,}from 'react-native';
// import firebase from '@firebase/app';
// import '@firebase/auth';


// const firebaseConfig = {
//   apiKey: "AIzaSyCfUxVqAaobZHxwCeOFHJiAOKTFX4T-H6o",
//   databaseURL: "https://smartmirorite.firebaseio.com",
//   projectId: "smartmirorite",
// };
// if(!firebase.apps.length){
//   firebase.initializeApp(firebaseConfig);
// }


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu brrutton for dev menu',
});

const Header = () =>{
  const {viewStyle,textStyle}=headerStyle;
  return(
    <View style={headerStyle.viewStyle}>
          <Text style={headerStyle.textStyle}>Smart Mirror Remote</Text>
    </View>
  );
};

var switchIO = 1;
var switchStats = "on";
var temp = 0;
// var switchRef = firebase.database().ref('Switch/');
// var switchIOref = firebase.database().ref('test');


type Props = {};
export default class App extends Component<Props> {
  // state = {
  //   switchStats: 1,
  //   temp: 0,
  // }
  
   setData(switchIO){
    firebase.database().ref('Switch/').set({
      switchIO
    })
  }
  
  _onPressButton(){
    
    if(switchIO!=0){
      switchIO=0;
      switchStats = "off"
    }
    else {
      switchIO=1;
      switchStats = "on"
    }
  //  this.setData(switchIO);
    Alert.alert("มิ้งหม่อนหีบาน "+switchStats);
  }

  render() {
    return (
      <View>
        <Header/>

        <View style={styles.boxContainer}>
          <Text>  Smart Mirror on / off {switchStats}</Text>
          <View style={styles.buttonContainer}>
          <Button 
            onPress={this._onPressButton}
            title="กดกู"
            color="#841584"
            />
            </View>
           {/* <Text>{instructions}</Text> */}
          </View>
          <View style={styles.boxContainer}>

          </View>

      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    margin : 20
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  boxContainer:{
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#DDDDDD',
    margin: 6,
    padding: 10,

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