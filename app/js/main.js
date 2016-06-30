'use strict';

// magic
$.ajaxSetup({
  contentType : 'application/json',
  processData : false
});
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  if (options.data){
    options.data=JSON.stringify(options.data);
  }
});

// globals, yolo!
var evilGlob = {
  backendHost: 'https://hc2016-admin-backend.herokuapp.com',
  api: {
    update: '/api/update'
  },
  pnsId: '',
  email: 'apost@post.no'
};


// Service worker yay!
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');

  navigator.serviceWorker.register('sw.js').then(function(reg) {
    console.log(':^)', reg);
    reg.pushManager.subscribe({
      userVisibleOnly: true
    }).then(function(sub) {
      console.log('endpoint:', sub.endpoint);
      evilGlob.pnsId = sub.endpoint.split('/').pop();
      $('pre#info').text(evilGlob.pnsId);
    });
  }).catch(function(error) {
       console.log(':^(', error);
  });
}


// DOM-binded stuff
$('document').ready(function(){

  $('#putUpdate').click(function(){
    $.ajax({
      type: 'PUT',
      url: evilGlob.backendHost + evilGlob.api.update,
      contentType: 'application/json',
      data: {
        id: evilGlob.pnsId,
        email: evilGlob.email
      }
    });
  });

});