var urlParams = new URLSearchParams(location.search);
var accessToken = urlParams.get('access_token');
var expires = urlParams.get('expires_in');
var username = urlParams.get('username');
var address = urlParams.get('state');
var confirmations = JSON.parse(localStorage.getItem('confirmations'))||{};
if(!accessToken && localStorage.getItem("accessToken") && localStorage.getItem("expires") && localStorage.getItem("username")) {
  accessToken = localStorage.getItem("accessToken");
  username = localStorage.getItem("username");
  expires = localStorage.getItem("expires");
}

const api = window.api = window.sc2.Initialize({
  app: 'glitch-apps',
  callbackURL: 'https://illustrious-brother.glitch.me/',
  accessToken,
  scope: ['vote', 'comment', 'custom_json']
});
window.connection = window.Penpal.connectToChild({
  url: "https://"+address+".glitch.me/?address="+address,
  appendTo: document.getElementById('frame'),
  methods: {
    vote: (author, permlink, weight) => {
      return new Promise(resolve => {
        if(confirm("Are you sure you want to vote"+" for "+author+" on post "+permlink+"?")) {
          api.vote(username, author, permlink, weight, function (err, res) {
            resolve({err,res});
          });
        }
      });
    },
    comment: (parentAuthor, parentPermlink, permlink, title, body, jsonMetadata) => {
      return new Promise(resolve => {
        if(confirm("Are you sure you want to comment/post?")) {
          api.comment(parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, res) {
            resolve({err,res});
          });
        }
      });
    },
    custom_json: (id, json) => {
      const params = {
          required_auths: [],
          required_posting_auths: [username],
          id,
          json:JSON.stringify(json)
      };
      
      return new Promise(resolve => {
        if(confirm("This program wants to store some information for future use, confirm?")) {
          console.log(params)
          api.broadcast([['custom_json', params]]).then((data)=>{resolve(data)});
        }
      });
    },
    me: () => {
      return new Promise(resolve => {
        console.log(confirmations[address]);
        if(confirmations[address]) {
          api.me(function (err, res) {
            resolve({err,res});
          });
        } else {
          if(confirm("App is requesting your steemit identity, confirm?")) {
            confirmations[address] = true;
            localStorage.setItem("confirmations",JSON.stringify(confirmations));
            api.me(function (err, res) {
              resolve({err,res});
            });
          }
        }
      });
    }
  }
});

if(accessToken && expires) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("username", username);
  localStorage.setItem("expires", new Date().getTime()+expires);
}

if((!accessToken ||new Date().getTime() > localStorage.getItem("expires")) && address!=null) {
  window.location = api.getLoginURL(address);
}
console.log('done');