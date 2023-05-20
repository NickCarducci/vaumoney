import { initializeApp } from "firebase/app";
import "firebase/firestore";
// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyCEiWNGlidcYoXLizAstyhxBpyhfBFu3JY",
  authDomain: "vaumoney.firebaseapp.com",
  databaseURL: "https://vaumoney.firebaseio.com",
  projectId: "vaumoney",
  storageBucket: "vaumoney.appspot.com",
  messagingSenderId: "580465804476",
  appId: "1:580465804476:web:5fe118607e434910683cb9"
};
//if (!firebase.apps.length) {
const firebase = initializeApp(firebaseConfig);
firebase && firebase.auth && firebase.auth().useDeviceLanguage();
//firebase.firestore().enablePersistence(false);
//}
//firebase.firestore().enablePersistence({ synchronizeTabs: true });
//firebase.auth();
//firebase.storage();
/*.settings({
  cacheSizeBytes: 1048576
});*/
//firebase.firestore().settings({ persistence: false });

export default firebase;
