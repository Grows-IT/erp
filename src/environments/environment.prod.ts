const siteUrl = 'https://erp-grows-it.firebaseio.com';
const authLoginUtl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
const authSignUpUtl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
const deleteAccount = 'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=';
const erpUrl = 'http://localhost:3333';
// const erpUrl = 'http://ec2-13-250-42-93.ap-southeast-1.compute.amazonaws.com:3333';

export const environment = {
  production: true,
  siteUrl,
  authLoginUtl,
  authSignUpUtl,
  deleteAccount,
  firebase: {
    apiKey: 'AIzaSyC-7g5A_6HW0LwMhve7jKajZGq93GTXRZE',
    authDomain: 'erp-grows-it.firebaseapp.com',
    databaseURL: 'https://erp-grows-it.firebaseio.com',
    projectId: 'erp-grows-it',
    storageBucket: 'erp-grows-it.appspot.com',
    messagingSenderId: '188830264097',
    appId: '1:188830264097:web:f5788c7a6a6806ebf96c60',
    measurementId: 'G-XT3FBH5M13'
  },
  erpUrl
};
