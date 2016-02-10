var wfangular = angular.module('wfangular', []);
wfangular.factory('wfangular3d', ['$rootScope', function($rootScope) {
  var wf = new Wayfinder3D();
  wf.onDataLoaded = function(){
  	$rootScope.$broadcast('wf.data.loaded', []);
  }

  wf.cbOnPOIClick = function(poi){
    $rootScope.$broadcast('wf.poi.click', poi);
  }

  wf.cbOnLanguageChange = function(language){
    $rootScope.$broadcast('wf.language.change', language);
  }

  wf.cbOnFloorChange = function(floor){
    $rootScope.$broadcast('wf.floor.change', floor);
  }

  wf.cbOnZoomChange = function(zoom){
    $rootScope.$broadcast('wf.zoom.change', zoom);
  }

  wf.onBeforeFloorChange = function(currentFloor, nextFloor, destinationFloor){
    $rootScope.$broadcast('wf.path.floor.change', {current: currentFloor, next: nextFloor, destination: destinationFloor});
  }

  return wf;
}]);

wfangular.factory('wfangular2d', ['$rootScope', function($rootScope) {
  var wf = new Wayfinder2D();
  wf.onDataLoaded = function(){
  	$rootScope.$broadcast('wf.data.loaded', []);
  }

  wf.cbOnPOIClick = function(poi){
    $rootScope.$broadcast('wf.poi.click', poi);
  }

  wf.cbOnLanguageChange = function(language){
    $rootScope.$broadcast('wf.language.change', language);
  }

  wf.cbOnFloorChange = function(floor){
    $rootScope.$broadcast('wf.floor.change', floor);
  }

  wf.cbOnZoomChange = function(zoom){
    $rootScope.$broadcast('wf.zoom.change', zoom);
  }

  wf.onBeforeFloorChange = function(currentFloor, nextFloor, destinationFloor){
    $rootScope.$broadcast('wf.path.floor.change', {current: currentFloor, next: nextFloor, destination: destinationFloor});
  }

  return wf;
}])

wfangular.filter('wfCurrentLanguage', ['wfangular3d', function(wayfinder) {
  return function(input) {
  	if(input && typeof input === "object"){
  		if(input[wayfinder.getLanguage()])
    		return input[wayfinder.getLanguage()];
    	else if(input["translations"][wayfinder.getLanguage()])
    		return input["translations"][wayfinder.getLanguage()];
    	else
    		return input;
  	}
  	else {
  		return input;
  	}
  };
}]);

wfangular.filter('wfCurrentLanguage2d', ['wfangular2d', function(wayfinder) {
  return function(input) {
  	if(input && typeof input === "object"){
  		if(input[wayfinder.getLanguage()])
    		return input[wayfinder.getLanguage()];
    	else if(input["translations"][wayfinder.getLanguage()])
    		return input["translations"][wayfinder.getLanguage()];
    	else
    		return input;
  	}
  	else {
  		return input;
  	}
  };
}]);
