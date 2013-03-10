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
	
	Template.page.events({
		'mousemove' : function (e) {
			var Speed = 50;
			var randX = (Math.random() - 0.48) * Speed * 2;
			var randY = (Math.random() - 0.48) * Speed * 2;
			
			//Panels.update({_id: this._id}, {$inc: {x: randX}});
			//Panels.update({_id: this._id}, {$inc: {y: randY}});
			if (typeof console !== 'undefined')
				console.log("You moved on the page: " + "(" + e.pageX + "," + e.pageY + ")");
			},
		'click' : function (e) {
			if (typeof console !== 'undefined')
				console.log("You clicked the page: " + this._id + " (" + e.pageX + "," + e.pageY + ")");
			//Panels.remove({_id: this._id});
			console.log(zoom);
			//zoom.to({ element: $(this._id) });
			zoom.to({ element: e.target });
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
		//! zoom out at the default level on startup
		space = document.getElementById("theSpace");
		window.onmousewheel();
	});
	
	var orX = 0;
	var orY = 0;
	var trX = 0;
	var trY = 0;
	var space;
	var zoomLevel = 0.2;
	window.onmousewheel = (function(e) {
		if(e) {
			e.preventDefault();
			var scrolled = e.wheelDelta / 120.0;
			zoomLevel *= 1.0 + scrolled / 10;
		}
		if( 1 && zoomLevel <= 2.0 && zoomLevel >= 0.1) {
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
		if(typeof console !== 'undefined') {
			console.log("e.xy:                " + e.x + " : " + e.y);
			console.log("e.pageX:             " + e.pageX + " : " + e.pageY);
			console.log("window.pageXYOffset: " + window.pageXOffset + " : " + window.pageYOffset);
			console.log("zoomLevel:           " + zoomLevel);
		}
	});

	
	var zoom = (function(){
		// The current zoom level (scale)
		var level = 1;

		// The current mouse position, used for panning
		var mouseX = 0,
			mouseY = 0;

		// Timeout before pan is activated
		var panEngageTimeout = -1,
			panUpdateInterval = -1;

		// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARRRRRRRRRGGGGGGGGGGGGGGGGGGGGG
		if( 1 ) {
			// The easing that will be applied when we zoom in/out
			//space.style.transition = 'transform 0.8s ease';
			//space.style.OTransition = '-o-transform 0.8s ease';
			//space.style.msTransition = '-ms-transform 0.8s ease';
			//space.style.MozTransition = '-moz-transform 0.8s ease';
			//space.style.WebkitTransition = '-webkit-transform 0.8s ease';
		}

		// Zoom out if the user hits escape
		document.addEventListener( 'keyup', function( event ) {
			if( level !== 1 && event.keyCode === 27 ) {
				zoom.out();
			}
		} );

		// Monitor mouse movement for panning
		document.addEventListener( 'mousemove', function( event ) {
			if( level !== 1 ) {
				mouseX = event.clientX;
				mouseY = event.clientY;
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

			if( true ) {
				var origin = pageOffsetX +'px '+ pageOffsetY +'px',
					transform = 'translate('+ -elementOffsetX +'px,'+ -elementOffsetY +'px) scale('+ scale +')';

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
			else {
				// Reset all values
				if( scale === 1 ) {
					document.body.style.position = '';
					document.body.style.left = '';
					document.body.style.top = '';
					document.body.style.width = '';
					document.body.style.height = '';
					document.body.style.zoom = '';
				}
				// Apply scale
				else {
					document.body.style.position = 'relative';
					document.body.style.left = ( - ( pageOffsetX + elementOffsetX ) / scale ) + 'px';
					document.body.style.top = ( - ( pageOffsetY + elementOffsetY ) / scale ) + 'px';
					document.body.style.width = ( scale * 100 ) + '%';
					document.body.style.height = ( scale * 100 ) + '%';
					document.body.style.zoom = scale;
				}
			}

			level = scale;
		}

		/**
		 * Pan the document when the mosue cursor approaches the edges 
		 * of the window.
		 */
		function pan() {
			var range = 0.12,
				rangeX = window.innerWidth * range,
				rangeY = window.innerHeight * range,
				scrollOffset = getScrollOffset();

			// Up
			if( mouseY < rangeY ) {
				window.scroll( scrollOffset.x, scrollOffset.y - ( 1 - ( mouseY / rangeY ) ) * ( 14 / level ) );
			}
			// Down
			else if( mouseY > window.innerHeight - rangeY ) {
				window.scroll( scrollOffset.x, scrollOffset.y + ( 1 - ( window.innerHeight - mouseY ) / rangeY ) * ( 14 / level ) );
			}

			// Left
			if( mouseX < rangeX ) {
				window.scroll( scrollOffset.x - ( 1 - ( mouseX / rangeX ) ) * ( 14 / level ), scrollOffset.y );
			}
			// Right
			else if( mouseX > window.innerWidth - rangeX ) {
				window.scroll( scrollOffset.x + ( 1 - ( window.innerWidth - mouseX ) / rangeX ) * ( 14 / level ), scrollOffset.y );
			}
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
				if( level !== 1 ) {
					zoom.out();
				}
				else {
					options.x = options.x || 0;
					options.y = options.y || 0;

					// If an element is set, that takes precedence
					if( !!options.element ) {
						// Space around the zoomed in element to leave on screen
						var padding = 20;

						options.width = options.element.getBoundingClientRect().width + ( padding * 2 );
						options.height = options.element.getBoundingClientRect().height + ( padding * 2 );
						options.x = options.element.getBoundingClientRect().left - padding;
						options.y = options.element.getBoundingClientRect().top - padding;
					}

					// If width/height values are set, calculate scale from those values
					if( options.width !== undefined && options.height !== undefined ) {
						options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
					}

					if( options.scale > 1 ) {
						options.x *= options.scale;
						options.y *= options.scale;

						var scrollOffset = getScrollOffset();

						magnify( scrollOffset.x, scrollOffset.y, options.x, options.y, options.scale );

						if( options.pan !== false ) {

							// Wait with engaging panning as it may conflict with the
							// zoom transition
							panEngageTimeout = setTimeout( function() {
								panUpdateInterval = setInterval( pan, 1000 / 60 );
							}, 800 );

						}
					}
				}
			},

			/**
			 * Resets the document zoom state to its default.
			 */
			out: function() {
				clearTimeout( panEngageTimeout );
				clearInterval( panUpdateInterval );

				var scrollOffset = getScrollOffset();

				magnify( scrollOffset.x, scrollOffset.y, 0, 0, 1 );

				level = 1;
			},

			// Alias
			magnify: function( options ) { this.to( options ); },
			reset: function() { this.out(); },

			zoomLevel: function() {
				return level;
			}
		};

	})();
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


