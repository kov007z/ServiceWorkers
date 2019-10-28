//retrieve variables
const myVersion = new URL(location).searchParams.get('myVersion');
const myVideo = new URL(location).searchParams.get('myVideo');

//define assets to be cached
var cacheName = myVersion;
var assetsToCache = [
  'images/background.jpg',
  //'js/globals.js', if globals are cached content can not be updated, but if you do cache globals the dynamic content will persist offline
  'swVideo.html',
  myVideo
];

self.addEventListener('install', function(event) {
  // waitUntil() ensures that the Service Worker will not
  // install until the code inside has successfully occurred
  event.waitUntil(
    // Create cache with the name supplied above and
    // return a promise for it
    caches.open(cacheName).then(function(cache) {
      // Add assets supplied above
      cache.addAll(assetsToCache);

    })
  );
});


/////////////////////////////////////// Cache Falling Back to Network Response /////////////////////////////////////////////////////
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


//preceeding and following functions can be swapped if content needs to always come from network and only use cache if off line

/////////////////////////////////////// Network First /////////////////////////////////////////////////////
// self.addEventListener('fetch', function(event) {
//   // Ignore non-get request like when accessing the admin panel
//   if (event.request.method !== 'GET') { return; }
//   // Don't try to handle non-secure assets because fetch will fail
//   if (/http:/.test(event.request.url)) { return; }
//   event.respondWith(
//     // Open the cache created when install
//     caches.open(cacheName).then(function(cache) {
//       // Go to the network to ask for that resource
//       return fetch(event.request).then(function(networkResponse) {
//         // Add a copy of the response to the cache (updating the old version)
//         cache.put(event.request, networkResponse.clone());
//         // Respond with it
//         return networkResponse;
//       }).catch(function() {
//         // If there is no internet connection, try to match the request
//         // to some of our cached resources
//         return cache.match(event.request);
//       })
//     })
//   );
// });
