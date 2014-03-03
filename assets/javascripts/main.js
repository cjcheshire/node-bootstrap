requirejs.config({
  paths: {
    'jquery': 'vendor/jquery/jquery'
  },

  shim: {}
});

require(['jquery'], function ($) {

  document.documentElement.className = ((document.documentElement.className) ? document.documentElement.className + ' require-loaded' : 'require-loaded');

});
