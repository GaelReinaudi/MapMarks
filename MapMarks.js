Pages = new Meteor.Collection('pages');

if (Meteor.isClient) {	
	var zoomLevel = 1.0;
	
	Template.hello.greeting = function () {
		return "Welcome to MapMarks.";
	};

	Template.hello.events({
		'click input' : function () {
			// template data, if any, is available in 'this'
			if (typeof console !== 'undefined')
				console.log("You pressed the button");
		}
	});

	Template.pages.visibles = function() {
		return Pages.find({x: {$lt: 400}}, {sort: {score: -1}});
	};
	
	Meteor.startup(function () {
		$("#theRect").click(function() {
			if(typeof console !== 'undefined')
				console.log("Handler for .click() called.");
			});


	});
	
	
	window.onmousewheel = (function(e) {
		var scrolled = e.wheelDelta / 120.0;
		e.preventDefault();
		zoomLevel *= 1.0 + scrolled / 10;
		
		//document.body.style.zoom = zoomLevel;
		var mouseOffsetX = e.x * zoomLevel;
		var mouseOffsetY = e.pageY * zoomLevel;
		if( 1 && zoomLevel <= 2.0) {
			var origin = mouseOffsetX +'px '+ mouseOffsetY +'px';
			var transform = 'scale('+ zoomLevel +') translate('+ -mouseOffsetX +'px,'+ -mouseOffsetY +'px)';

			document.body.style.transformOrigin = origin;
			document.body.style.OTransformOrigin = origin;
			document.body.style.msTransformOrigin = origin;
			document.body.style.MozTransformOrigin = origin;
			document.body.style.WebkitTransformOrigin = origin;

			document.body.style.transform = transform;
			document.body.style.OTransform = transform;
			document.body.style.msTransform = transform;
			document.body.style.MozTransform = transform;
			document.body.style.WebkitTransform = transform;
		}
		if(typeof console !== 'undefined') {
			//console.log("Handler for .wheel() called." + scrolled);
			console.log("e.xy:                " + e.x + " : " + e.y);
			console.log("e.pageX:          " + e.pageX + " : " + e.pageY);
			console.log("window.pageXYOffset: " + window.pageXOffset + " : " + window.pageYOffset);
			console.log("zoomLevel: " + zoomLevel);
		}
	});

}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


