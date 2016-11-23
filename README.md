# 3DWayfinderAngular
Angular Service for 3D Wayfinder (now supports 2D maps also)

## Getting started

### Install
bower install --save 3dwayfinder-angular

Please include the following JavaScript files into Your HTML file and inject wfangular into Your Angular app:

```javascript
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/frak-stable.min.js"></script>
<!-- FOR 3D Map add the line below -->
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/Wayfinder3D.min.js"></script>
<!-- FOR 2D Map add the line below -->
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/Wayfinder2D.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
<script type="text/javascript" src="index.js"></script>

<script>
    var app = angular.module('basictest', ['wfangular']);
    // ------ For 2D engine use the line below instead -------
    // app.run(['wfangualr2d', function(wayfinder) {
    app.run(['wfangular3d', function(wayfinder) {
      WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
      wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
      wayfinder.open();
    }]);
</script>
```
## Broadcasted events
* wf.data.loaded - broadcasted when all data is loaded
* wf.poi.click - broadcasted when user clicks on map. Arguments: POI
* wf.language.change - broadcasted when language is changed. Arguments: language code {string} (eg en, de etc)
* wf.floor.change - broadcasted when floor is changed. Arguments: Floor
* wf.zoom.change - broadcasted when zoom is changed. Arguments: zoom {float}
* wf.path.floor.change - broadcasted when path animation changes floor: Arguments: Object {current: Floor, next: Floor, destination: Floor}

Added wfangular3dEx module also