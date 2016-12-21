#Soda Platform API Wrapper (Alpha)
Exposes a single class which manages all communication against the ContentManger.

It simply wraps all the APIs described [here](https://startapp.atlassian.net/wiki/display/SDKSOC/S2S+Services)

![Structure](infrastructure.png)

##Usage

1) Start by adding this repo to package.json, using a direct link to github:

```javsacript
"sodaplatform-wrapper": "https://github.com/startappdev/SodaPlatform-wrapper.git"
```
Note that this requires you to be logged in with github or else you'll get a "repository not found" error.

Follow [this guide](https://help.github.com/articles/caching-your-github-password-in-git/) to fix that.

2) Then use it from any file like so:

```javascript
let ContentManager = require('sodaplatform-wrapper').ContentManager;

let contentManager = new ContentManager('https://content.startappnetwork.com/content-manager/', 'YourBubbleId');

//Now call any class method, e.g. contentManager.subscribe(...)
```