const siteUrl = 'https://erp-grows-it.firebaseio.com';
const authLoginUtl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
const authSigninUtl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';

export const environment = {
  production: true,
  siteUrl,
  authLoginUtl,
  authSigninUtl,
  firebase: {
    apiKey: 'AIzaSyC-7g5A_6HW0LwMhve7jKajZGq93GTXRZE',
    authDomain: 'erp-grows-it.firebaseapp.com',
    databaseURL: 'https://erp-grows-it.firebaseio.com',
    projectId: 'erp-grows-it',
    storageBucket: 'erp-grows-it.appspot.com',
    messagingSenderId: '188830264097',
    appId: '1:188830264097:web:f5788c7a6a6806ebf96c60',
    measurementId: 'G-XT3FBH5M13'
  }
};
