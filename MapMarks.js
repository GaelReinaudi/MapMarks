Pages = new Meteor.Collection('pages');

if (Meteor.isClient) {	
	
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
		$("#theRect").click(function(e) {
			if(typeof console !== 'undefined')
				console.log("Handler for .click() called,(" + e.pageX + "," + e.pageY + ")");
			});


	});
	
	var orX = 0;
	var orY = 0;
	var trX = 0;
	var trY = 0;
	var zoomLevel = 1.0;
	window.onmousewheel = (function(e) {
		e.preventDefault();
		var $space = document.getElementById("theSpace");
		
		var currentPageX = e.pageX;
		
		var scrolled = e.wheelDelta / 120.0;
		zoomLevel *= 1.0 + scrolled / 10;
		
		//document.body.style.zoom = zoomLevel;
		var mouseOffsetX = e.x * zoomLevel;
		var mouseOffsetY = e.pageY * zoomLevel;
		if( 1 && zoomLevel <= 2.0) {
			var origin = trX +'px '+ trY +'px';
			var transform = '';
			//transform += ' translate('+ -trX +'px,'+ -trY +'px)';
			transform += ' scale('+ zoomLevel +')';
			transform += ' translate('+ -trX +'px,'+ -trY +'px)';

//			$space.style.transformOrigin = origin;
//			$space.style.OTransformOrigin = origin;
//			$space.style.msTransformOrigin = origin;
//			$space.style.MozTransformOrigin = origin;
			$space.style.WebkitTransformOrigin = origin;
//			$space.style.transform = transform;
//			$space.style.OTransform = transform;
//			$space.style.msTransform = transform;
//			$space.style.MozTransform = transform;
			$space.style.WebkitTransform = transform;
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


