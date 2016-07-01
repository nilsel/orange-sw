/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

// Version 0.1

'use strict';

console.log('Started', self);

self.config = {
  email: ''
}

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {

  console.log('Push message received', event);
  console.log('SW got push data:', event.data);

  var messages = [
    'Du har fått tilbake en milliard på skatten.',
    'Husk selvangivelsen!',
    'Momsregnskap for mai-juni må leveres om to dager.',
    'Nye skatteregler for 2017, klikk for å lese.',
    'Happy Hour på Oslo Børs i dag!',
    'Din revisor har levert inn årsregnskap.',
    'Nye ansatte? Husk å melde inn i pensjonsordning.',
    'Your fired! Husk å melde ut av pensjonsordning',
    'Make Javascript Great Again'
  ];

  var tags = [
  'default',
  'info',
  'alert']

  

  var title = 'Melding fra Storebrand';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: messages[Math.floor(Math.random() * messages.length)],
      icon: 'images/orange64.png',
      tag: tags[Math.floor(Math.random() * tags.length)]
    }));

});


// handle click on Notifications
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag ', event.notification.tag);
  event.notification.close();
  var url = 'https://hc2016-pusher.herokuapp.com/index.html?email=' + self.config.email;
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// handle messages from main.js
self.addEventListener('message', function(event) {
  // event.ports[0].postMessage({'test': 'This is my response.'});
  console.log('serviceworkers got a message', event);

  if(event.data.email){
    self.config.email = event.data.email;
    console.log('email set in SW', self.config.email);
  }
});