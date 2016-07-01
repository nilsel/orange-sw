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
  supportsSW: false,
  backendHost: 'https://hc2016-admin-backend.herokuapp.com',
  api: {
    update: '/api/update'
  },
  pnsId: '',
  email: 'apost@post.no',
  msgKey: '',
  auth: ''
};



// Service worker yay!
if ('serviceWorker' in navigator) {
  // console.log('Service Worker is supported');
  evilGlob.supportsSW = true;

  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    // console.log(':^)', reg);

  navigator.serviceWorker.ready.then(function(){

    console.log('serviceWorker is ready!');

      reg.pushManager.subscribe({
        userVisibleOnly: true
      }).then(function(sub) {

        // console.log('endpoint:', sub.endpoint);
        evilGlob.pnsId = sub.endpoint.split('/').pop();
        $('pre#info').text(evilGlob.pnsId);

        evilGlob.msgKey = sub.getKey('p256dh');
        evilGlob.auth = sub.getKey('auth');
        console.log(evilGlob.msgKey, evilGlob.auth);
        console.log('subscription: ' + JSON.stringify(sub));

        evilGlob.email = getUrlParam('email');
        swMessage({ 'email': evilGlob.email });
      });

    }).catch(function(error) {
       console.log(':^(', error);
    });

  });

}


// DOM-binded stuff
$('document').ready(function(){
  console.log('doc ready');

  if(getUrlParam('email') == undefined){
    // no email param? go register
    window.location = 'http://automatic-octo-adventure.herokuapp.com';
  }
  else {
    evilGlob.email = getUrlParam('email');
  }

  setTimeout(function(){
    // does the browser support SW?
    if(evilGlob.supportsSW === false){
      $('#unsupportedBrowser').show();
    }
    else {
      updateBackend();
      // swMessage({ 'email': evilGlob.email });
    }
  }, 500);


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


  $('#postNotification').click(function(){
    $.ajax({
      type: 'POST',
      url: 'https://android.googleapis.com/gcm/send',
      contentType: 'application/json',
      beforeSend: function(req){
        req.setRequestHeader('Authorization', 'key=AIzaSyD9ro7BaGsWAJnLlqTHo2siiWCF7oqSHis');
      },
      data: {
        registration_ids: [evilGlob.pnsId]
      }
    });
  });

});


// utility stuff

// send a message to our serviceworker
function swMessage(message) {
  return new Promise(function(resolve, reject) {
     var messageChannel = new MessageChannel();
     messageChannel.port1.onmessage = function(event) {
       if (event.data.error) {
         reject(event.data.error);
       } else {
         resolve(event.data);
       }
     };
     // setTimeout(function(){
       navigator.serviceWorker.controller.postMessage(message);
     // }, 1500);
  });
}

// update backend with email and PNS-id
function updateBackend(){
  if(evilGlob.pnsId != '' && evilGlob.email != ''){
    $.ajax({
      type: 'PUT',
      url: evilGlob.backendHost + evilGlob.api.update,
      contentType: 'application/json',
      data: {
        id: evilGlob.pnsId,
        email: evilGlob.email
      },
      success: function(){
        console.log('updated backend OK');
      }
    });
  }
  else {
    console.log('missing params to updateBackend()');
  }
}

function getUrlParam(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam){
      return sParameterName[1];
    }
  }
}

function showApiError(){
  alert('This is a pretty error message. Enjoy.');
}