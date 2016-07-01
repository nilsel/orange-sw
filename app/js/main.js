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

  navigator.serviceWorker.register('sw.js').then(function(reg) {
    // console.log(':^)', reg);

    reg.pushManager.subscribe({
      userVisibleOnly: true
    }).then(function(sub) {
      // console.log('endpoint:', sub.endpoint);
      evilGlob.pnsId = sub.endpoint.split('/').pop();
      $('pre#info').text(evilGlob.pnsId);


      evilGlob.msgKey = sub.getKey('p256dh');
      evilGlob.auth = sub.getKey('auth');
      console.log(evilGlob.msgKey);
      console.log(sub);
      console.log(JSON.stringify(sub));


    });
  }).catch(function(error) {
       console.log(':^(', error);
  });
}


// DOM-binded stuff
$('document').ready(function(){

  evilGlob.email = getUrlParam('email') ? getUrlParam('email') : 'apost@post.no';

  // does the browser support SW?
  setTimeout(function(){
    if(evilGlob.supportsSW === false){
      $('#unsupportedBrowser').show();
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