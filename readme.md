Github repository
https://github.com/lanmower/illustrious-brother

<center>
![](https://www.vectorlogo.zone/logos/glitch/glitch-card.png)
![](https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-plus-round-128.png)
![](https://cdn.steemitimages.com/DQmZEoqmzkSJrqUUkuajsx1T7M8ecMdkHt5FaSEMLgczTCT/image.png)
</center>
#### Repository
https://glitch.com/edit/#!/illustrious-brother <-- SSO Master project
https://glitch.com/edit/#!/trail-broccoli <-- project to remix
https://illustrious-brother.glitch.me/?state=trail-broccoli <-- example project running


### illustruous-brother
- What is the project about?
illustrious-brother is an open source single sign on for steem on glitch.io projects

It encapsulates your projects glitch environment to provide safer and easier login and approval processes for glitch projects. Instantly fork out simple glitch.io projects that can access steem, share a single signon with all the other apps.

When a user's account details are requested, the user is asked once per project.
When a vote or a comment is requested, the user is asked every time.

in your project, you can use the following steem calls:
    vote: (author, permlink, weight)
    comment: (parentAuthor, parentPermlink, permlink, title, body, jsonMetadata)
    me: ()

these calls return javascript promises, their result can be read in the promise callback

https://glitch.com/edit/#!/trail-broccoli

includes an example of how this is accomplished and the result used

To run your very own project, remix trail-broccoli, simply use the follwing:
https://illustrious-brother.glitch.me/?state=YOUR_GLITCH_APP_NAME

If a user is already logged in, they wont have to log in again for your app.

- Technology Stack
glitch.io is the host, app ecosystem and ide
steemconnect is the authentication platform
penpal is used for rpc communication between iframes
javascript promises for async behavior

- Roadmap
jit.si support is being tested
more extensive example gui projects are in the making

- How to contribute?
you can find the developer, @lanmower, at http://www.steempunks.live (link to steemPunks discord)

#### GitHub Account
http://github.com/lanmower