Pages = new Meteor.Collection('pages');
//! the zoom object inspired by ZoomJS
var zoom;
var zoomLevel = 0.2;
var space;
var anchorSpace;
var engagedPage;// will be 0 if disengaged or the element it is engaged on

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
	
	Template.page.events({
		'mousemove' : function (e) {
			if (typeof console !== 'undefined')
				console.log("You moved on the page: " + "(" + e.pageX + "," + e.pageY + ")");
			},
		'click' : function (e) {
			if (typeof console !== 'undefined')
				console.log("You clicked the page: " + this._id + " (" + e.pageX + "," + e.pageY + ")");
			if(!engagedPage)
				zoom.to({ element: e.target });
			},
		'cccccclick' : function (e) {
			if(!engagedPage)
				Pages.remove({_id: this._id});
			}	
	});
	Template.pages.events({
		'click' : function (e) {
			if (typeof console !== 'undefined')
				console.log("You clicked the page: " + this._id + " (" + e.pageX + "," + e.pageY + ")");
			if(!engagedPage) {
				if($(e.target).width() > 1500)
					zoom.to({ element: e.target });
				}
			}
	});
		
	Template.pages.visibles = function() {
		return Pages.find({x: {$lt: 400}}, {sort: {score: -1}});
	};	
	Template.pages.NewsTagged = function() {
		return Pages.find({"tags" : ["News"]});
	};		
	Template.pages.ScienceTagged = function() {
		return Pages.find({"tags" : ["Science"]});
	};			
	Template.pages.CookingTagged = function() {
		return Pages.find({"tags" : ["Cooking"]});
	};
	Template.pages.ArchitectureTagged = function() {
        return Pages.find({"tags" : ["Architecture"]});
    };
	
	Meteor.startup(function () {
		$("#theRect").click(function(e) {
			if(typeof console !== 'undefined')
				console.log("Handler for .click() called,(" + e.pageX + "," + e.pageY + ")");
			});
		$(".addPage").click(function(e) {
			if(typeof console !== 'undefined')
				console.log("Adding a page,(" + e.pageX + "," + e.pageY + ")");
			var tag = ["News"];
			Pages.insert({
//				url: "http://www.nytimes.com",
				url: "http://localhost/~lycaon/nytimes.html",
				timestamp: (new Date()).getTime(),
				tags: tag ? [tag] : []
				});
			});
		$(".addPageS").click(function(e) {
			if(typeof console !== 'undefined')
				console.log("Adding a page,(" + e.pageX + "," + e.pageY + ")");
			var tag = ["Science"];
			Pages.insert({
//				url: "http://www.nature.com",
				url: "http://localhost/~lycaon/nature.html",
				timestamp: (new Date()).getTime(),
				tags: tag ? [tag] : []
				});
			});
		$(".addPageC").click(function(e) {
			if(typeof console !== 'undefined')
				console.log("Adding a page,(" + e.pageX + "," + e.pageY + ")");
			var tag = ["Cooking"];
			Pages.insert({
//				url: "http://www.foodnetwork.com",
				url: "http://localhost/~lycaon/foodnetwork.html",
				timestamp: (new Date()).getTime(),
				tags: tag ? [tag] : []
				});
			});
		$(".addPageA").click(function(e) {
            if(typeof console !== 'undefined')
                console.log("Adding a page,(" + e.pageX + "," + e.pageY + ")");
            var tag = ["Architecture"];
            Pages.insert({
//                url: "http://www.architecturaldigest.com",
              url: "http://localhost/~lycaon/digest.html",
                timestamp: (new Date()).getTime(),
                tags: tag ? [tag] : []
            	});
        });		
		//! zoom out at the default level on startup
		space = document.getElementById("theSpace");
		anchorSpace = document.getElementById("anchorSpace");
		window.onmousewheel();
		
		
//////////////////////////// ZOOM 		
		zoom = (function(){
			// Check for transform support so that we can fallback otherwise
			var supportsTransforms = 	'WebkitTransform' in space.style ||
										'MozTransform' in space.style ||
										'msTransform' in space.style ||
										'OTransform' in space.style ||
										'transform' in space.style;
			if( supportsTransforms ) {
				// The easing that will be applied when we zoom in/out
				space.style.transition = 'transform 0.2s ease';
				space.style.OTransition = '-o-transform 0.2s ease';
				space.style.msTransition = '-ms-transform 0.2s ease';
				space.style.MozTransition = '-moz-transform 0.2s ease';
				space.style.WebkitTransition = '-webkit-transform 0.2s ease';
			}
			// Zoom out if the user hits escape
			document.addEventListener( 'keyup', function( event ) {
				if( event.keyCode === 27 ) {
					if(engagedPage) {
						zoom.out();
					}
					else {
						zoomLevel /= 1.50;
						window.onmousewheel();
					}
				}
			} );
			/**
			 * Applies the CSS required to zoom in, prioritizes use of CSS3 
			 * transforms but falls back on zoom for IE.
			 * 
			 * @param {Number} pageOffsetX 
			 * @param {Number} pageOffsetY 
			 * @param {Number} elementOffsetX 
			 * @param {Number} elementOffsetY 
			 * @param {Number} scale 
			 */
			function magnify( pageOffsetX, pageOffsetY, elementOffsetX, elementOffsetY, scale ) {
				if( supportsTransforms ) {
					var origin = "";
					origin += pageOffsetX +'px '+ pageOffsetY +'px';
					origin += transform = 'translate('+ -elementOffsetX +'px,'+ -elementOffsetY +'px) scale('+ scale +')';

					space.style.transformOrigin = origin;
					space.style.OTransformOrigin = origin;
					space.style.msTransformOrigin = origin;
					space.style.MozTransformOrigin = origin;
					space.style.WebkitTransformOrigin = origin;
					space.style.transform = transform;
					space.style.OTransform = transform;
					space.style.msTransform = transform;
					space.style.MozTransform = transform;
					space.style.WebkitTransform = transform;
				}
//				else {
//					// Reset all values
//					if( scale === 1 ) {
//						space.style.position = '';
//						space.style.left = '';
//						space.style.top = '';
//						space.style.width = '';
//						space.style.height = '';
//						space.style.zoom = '';
//					}
//					// Apply scale
//					else {
//						space.style.position = 'relative';
//						space.style.left = ( - ( pageOffsetX + elementOffsetX ) / scale ) + 'px';
//						space.style.top = ( - ( pageOffsetY + elementOffsetY ) / scale ) + 'px';
//						space.style.width = ( scale * 100 ) + '%';
//						space.style.height = ( scale * 100 ) + '%';
//						space.style.zoom = scale;
//					}
//				}
			}

			function getScrollOffset() {
				return {
					x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
					y: window.scrollY !== undefined ? window.scrollY : window.pageXYffset
				};
			}

			return {
				/**
				 * Zooms in on either a rectangle or HTML element.
				 * 
				 * @param {Object} options
				 *   - element: HTML element to zoom in on
				 *   OR
				 *   - x/y: coordinates in non-transformed space to zoom in on
				 *   - width/height: the portion of the screen to zoom in on
				 *   - scale: can be used instead of width/height to explicitly set scale
				 */
				to: function( options ) {
					// Due to an implementation limitation we can't zoom in
					// to another element without zooming out first
					if( engagedPage ) {
					//	zoom.out();
					}
					else {
						options.x = options.x || 0;
						options.y = options.y || 0;

						// If an element is set, that takes precedence
						if( !!options.element ) {
							// Space around the zoomed in element to leave on screen
							var padding = 0;
//							options.width = options.element.getBoundingClientRect().width + ( padding * 2 );
//							options.height = options.element.getBoundingClientRect().height + ( padding * 2 );
							options.x = options.element.getBoundingClientRect().left - padding;
							options.y = options.element.getBoundingClientRect().top - padding;
							options.x -= anchorSpace.getBoundingClientRect().left;
							options.y -= anchorSpace.getBoundingClientRect().top;
						}
console.log("options " + "x "+options.x + " y "+options.y + " w "+options.width + " h "+options.height);

						var scrollOffset = getScrollOffset();
						scrollOffset.x /= zoomLevel;
						scrollOffset.y /= zoomLevel;
						options.x /= zoomLevel;
						options.y /= zoomLevel;

						var scale = 1;
						scale = window.innerWidth / ($(options.element).width() + 100);
						options.x *= scale;
						options.y *= scale;
						options.x += anchorSpace.getBoundingClientRect().left;
						options.y += anchorSpace.getBoundingClientRect().top;

						magnify( scrollOffset.x, scrollOffset.y, options.x, options.y, scale );
						engagedPage = options.element;
						$(engagedPage).hide();
						console.log("Engaging");
					}
				},

				/**
				 * Resets the document zoom state to its default.
				 */
				out: function() {
					magnify( 0, 0, 0, 0, zoomLevel );
					$(engagedPage).show();
					engagedPage = 0;
					console.log("Disengaging");
				},
			};

		})();
	});
	
	var orX = 0;
	var orY = 0;
	var trX = 0;
	var trY = 0;
	window.onmousewheel = (function(e) {
		if(engagedPage) {
			e.preventDefault();
			return;
		}
		if(e) {
			e.preventDefault();
			var scrolled = e.wheelDelta / 120.0;
			zoomLevel *= 1.0 + scrolled / 10;
		}
		//$("#zoomingRect").left = 20px;
		//return;
		if(zoomLevel <= 2.0) {
			var origin = trX +'px '+ trY +'px';
			var transform = '';
			//transform += ' translate('+ -trX +'px,'+ -trY +'px)';
			transform += ' scale('+ zoomLevel +')';
			transform += ' translate('+ -trX +'px,'+ -trY +'px)';

//			space.style.transformOrigin = origin;
//			space.style.OTransformOrigin = origin;
//			space.style.msTransformOrigin = origin;
//			space.style.MozTransformOrigin = origin;
			space.style.WebkitTransformOrigin = origin;
//			space.style.transform = transform;
//			space.style.OTransform = transform;
//			space.style.msTransform = transform;
//			space.style.MozTransform = transform;
			space.style.WebkitTransform = transform;
		}
		if(e && typeof console !== 'undefined') {
			console.log("e.xy:                " + e.x + " : " + e.y);
			console.log("e.pageX:             " + e.pageX + " : " + e.pageY);
			console.log("window.pageXYOffset: " + window.pageXOffset + " : " + window.pageYOffset);
			console.log("zoomLevel:           " + zoomLevel);
		}
	});

	

}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


