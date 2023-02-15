import firebase from '@firebase/app';
import '@firebase/storage';
import '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD5NIvb5a4ZsEwnSYAII5803RgSSHdVn14',
  authDomain: 'psycteamv1.firebaseapp.com',
  projectId: 'psycteamv1',
  storageBucket: 'psycteamv1.appspot.com',
  messagingSenderId: '524936340335',
  appId: '1:524936340335:web:dc95123cde91a234c8be9a',
  measurementId: 'G-9TY0GSD3PJ',
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
