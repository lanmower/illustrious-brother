/**
*  This library allows the page to act as a single sign on or SSO
*  parent for other apps, it requests user approval when neccesary.
*
*  RPC methods that are exposed via penpal are me, vote, comment and custom_json
*  vote: (author, permlink, weight)
*  comment: (parentAuthor, parentPermlink, permlink, title, body, jsonMetadata)
*  custom_json: (id, json)
*  me: ()
*
* their parameters represent the same parameters on steemConnect
*/

const start = function start() {
  //load steemconnect api and penpal rpc for iframe communication
  const {sc2, Penpal} = window;
  
  const urlParams = new URLSearchParams(location.search);
  
  //we always receive a parameter specifying the child app name
  const app = urlParams.get('state');
  
  // when steemconnect calls bac, we receive three extra parameters
  let accessToken = urlParams.get('access_token');
  let expires = urlParams.get('expires_in');
  let username = urlParams.get('username');
  //check if new user details exist
  const newUser = accessToken && expires && username;
  if(newUser) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("username", username);
    localStorage.setItem("expires", new Date().getTime()+expires);
  }
  
  //check if we have login details
  const localUser = localStorage.getItem("accessToken") && localStorage.getItem("expires") && localStorage.getItem("username");
  if(localUser) {
    accessToken = localStorage.getItem("accessToken");
    username = localStorage.getItem("username");
    expires = localStorage.getItem("expires");
  }
  const login = function login(message) {
    if(confirm(message)) {
      window.location = api.getLoginURL(app);
    }
  }
  
  //if not logged in or login expired
  if((!localUser || new Date().getTime() > localStorage.getItem("expires")) && app!=null) {
    login("You are not logged in. Do you want to log in via steemConnect?");
  }
  //initialize steemconnect api
  const api = sc2.Initialize({
    app: 'glitch-apps',
    callbackURL: 'https://illustrious-brother.glitch.me/',
    accessToken,
    scope: ['vote', 'comment', 'custom_json']
  });
  //load confirmations or make empty object
  const confirmations = localStorage.getItem('confirmations')?JSON.parse(localStorage.getItem('confirmations')):{};
  
  //each action is designed to resolve its methods promise on the steemconnect callback after human interaction
  const action = (action, message, call, resolve, reject) => {
      const me = action === 'load account name';
      //if loading account details, ask only once
      const confirmed = me && confirmations[action];
      if(confirmed || confirm("Do you want to "+action+" "+message)) {
        //save confirmations
        if(!confirmations[action] && me) {
          confirmations[action] = true;
          localStorage.setItem('confirmations', JSON.stringify(confirmations));
        }
        //run action passing a callback that resolves this action or rejects it
        call(
          function done(err, res) {
            if(err) {
              if(!login("Could not "+action+". Do you want to log in via steemConnect?")) reject(res);
            } else resolve(res);
          }
        );      
      }
    }
  
  
  //we connect to the child window with an RPC livrary called penpal
  const connection = Penpal.connectToChild({
    //child app url
    url: "https://"+app+".glitch.me/?app="+app,
    //display element to fill append iframe to
    appendTo: document.getElementById('frame'),
    //penpal uses promises, while steemconnect uses callbacks, we convert the callback to a promise in all the rpc methods using the action function
    methods: {
      vote: (author, permlink, weight) => {
        return new Promise((resolve,reject) => {
          action("vote", "for "+author+" on post "+permlink+"?", function call(done){
            api.vote(username, author, permlink, weight, done);
          }, resolve, reject);
        });
      },
      comment: (parentAuthor, parentPermlink, permlink, title, body, jsonMetadata) => {
        return new Promise((resolve, reject) => {
          action("comment", " or post", (done)=>{
            api.comment(parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, done);
          }, resolve, reject);
        });
      },
      custom_json: (id, json) => {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id,
          json:JSON.stringify(json)
        };
        return new Promise((resolve, reject) => {
          action("sotre custom json", "", (done)=>{
            api.broadcast([['custom_json', params]], done);
          }, resolve, reject);
        });
      },
      me: () => {
        return new Promise((resolve,reject) => {
          action("load account name", "for this application", (done)=>{
            api.me(done);
          }, resolve, reject);
        });
      }
    }
  });
}
start();