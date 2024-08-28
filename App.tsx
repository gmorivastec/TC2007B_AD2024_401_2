// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  UserCredential,
  getReactNativePersistence
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from "react";


// REASON TO USE ENVIRONMENT VARIABLES
// 1. I don't want to upload my apikey into a public repo
// 2. you most likely will have data that can change depending on context
// -- api keys
// -- server URLs
// -- any sort of user credentials / validation

// ENVIRONMENTS
// in a professional environment you most likely will have different
// stages in production / deployment

// normally at least 2 
// development, production
// (testing, staging, etc)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
/*
const auth = initializeAuth(
  app, 
  {persistence: getReactNativePersistence(ReactNativeAsyncStorage)}
);
*/
export default function App() {

  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  onAuthStateChanged(
    auth, 
    user => {
      if(user){
        console.log("THE USER IS VALIDATED: " + user.email);
      } else {
        console.log("LOGGED OUT");
      }
    });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TextInput 
        placeholder="email"
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput 
        placeholder="password"
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <Button 
        title="sign up"
        onPress={() => {

          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential : UserCredential) => {
            // this logic will run when the promise is solved
            console.log("USER: " + userCredential.user);
          })
          .catch((error : any) => {

            if(error.code == "auth/missing-password"){
              alert("YOUR PASSWORD IS CRAPPY");
            }

            console.log("ERROR: " + error.message + " " + error.code);
          });

          // DON'T add code here if you intend it to run after the asynchronous
          // logic
        }}
      />
      <Button 
        title="sign in"
        onPress={() => {
          signInWithEmailAndPassword(auth, email, password)
          .then((userCredential : UserCredential) => {
            console.log("USER LOGGED IN CORRECTLY: " + userCredential.user.email);
          })
          .catch((error: any) => {
            console.log("ERROR: " + error);
          });

        }}
      />
      <Button 
        title="log out"
        onPress={() => {
          auth.signOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
