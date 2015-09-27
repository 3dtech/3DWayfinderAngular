# 3DWayfinderAngular
Angular Service for 3D Wayfinder

## Getting started 
Please include the following JavaScript files into Your HTML file and inject wfangular into Your Angular app:

```javascript
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/frak-stable.min.js"></script>
<script type="text/javascript" src="http://static.3dwayfinder.com/projects/shared/js/minified/Wayfinder3D.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
<script type="text/javascript" src="index.js"></script>

<script>
    var app = angular.module('basictest', ['wfangular']);
    app.run(['wfangular3d', function(wayfinder) {
      WayfinderAPI.LOCATION = "http://api.3dwayfinder.com/";
      wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
      wayfinder.open();
    }]);
</script>
```
