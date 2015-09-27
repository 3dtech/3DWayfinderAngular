var wfangular = angular.module('wfangular', []);
wfangular.factory('wfangular3d', function() {
  var wf = new Wayfinder3D();
  return wf;
});