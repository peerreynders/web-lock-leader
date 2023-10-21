# web-lock-leader

Nano demo of using the Web Locks API for leader election

Open multiple copies of the index page in the browser but only one can be the “leader”. 

```shell
web-lock-leader$ npm i

added 180 packages, and audited 181 packages in 13s

41 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

web-lock-leader$ npm run client:build
 
> web-lock-leader@0.0.0 client:build
> ./node_modules/.bin/rollup -c ./rollup.config.mjs


./src/entry.js → ./public/main.js...
created ./public/main.js in 207ms

web-lock-leader$ npm run serve

> web-lock-leader@0.0.0 serve
> node ./index.mjs

Running at http://localhost:3000
```

## Motivation

SPA's can “Just Create One” ([JCO](http://butunclebob.com/ArticleS.UncleBob.SingletonVsJustCreateOne)) of anything because client side routing never reloads the page. 

MPA's, especially those where users may open multiple pages at once have a much more difficult time handling a shared resource (like an [event source](https://html.spec.whatwg.org/multipage/server-sent-events.html#authoring-notes)) in a JCO manner. 

Given that [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) isn't fully [supported](https://caniuse.com/mdn-api_sharedworker) and exhibits some [undesirable characteristics](https://stackoverflow.com/questions/76237093/how-to-keep-sharedworker-alive-durning-reload-navigation), [Leader Election](https://en.wikipedia.org/wiki/Leader_election) could present an opportunity for an alternative architecture.

Imagine a (well [supported](https://caniuse.com/webworkers)) dedicated Web [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) that reconstitutes its internal state with something like [idb-keyval](https://github.com/jakearchibald/idb-keyval) at startup.

The “leader” page launches the Worker (avoiding being blocked by the work being performed) while all the “follower” pages communicate with that worker via the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) ([support](https://caniuse.com/broadcastchannel)). 

The Worker backs up its state consistently so that when invariably the “leader” page becomes inactive another page from the domain can become the “leader” and start it's own dedicated worker to serve the remaining pages.    
## References
- [Leader election in browser tabs, the easy way](https://greenvitriol.com/posts/browser-leader)
- [BroadcastChannel—Using the Leader Election](https://github.com/pubkey/broadcast-channel#using-the-leaderelection)
- [MDN: Web Locks API—Advanced use](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API#advanced_use)
- [MDN: `visibilitychange` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)
- [Can I Use: Lock API](https://caniuse.com/mdn-api_lock)


