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
		$("#theRect").click(function() {
			if(typeof console !== 'undefined')
				console.log("Handler for .click() called.");
			});

		  $(function() {
			    var $start_counter = $( "#event-start" ),
			      $drag_counter = $( "#event-drag" ),
			      $stop_counter = $( "#event-stop" ),
			      counts = [ 0, 0, 0 ];
			 
			    $( ".aaa" ).draggable({
			      start: function() {
			        counts[ 0 ]++;
			        updateCounterStatus( $start_counter, counts[ 0 ] );
			      },
			      drag: function() {
			        counts[ 1 ]++;
			        updateCounterStatus( $drag_counter, counts[ 1 ] );
			      },
			      stop: function() {
			        counts[ 2 ]++;
			        updateCounterStatus( $stop_counter, counts[ 2 ] );
			      }
			    });
			 
			    function updateCounterStatus( $event_counter, new_count ) {
			      // first update the status visually...
			      if ( !$event_counter.hasClass( "ui-state-hover" ) ) {
			        $event_counter.addClass( "ui-state-hover" )
			          .siblings().removeClass( "ui-state-hover" );
			      }
			      // ...then update the numbers
			      $( "span.count", $event_counter ).text( new_count );
			    }
			  });
	});
	
	
	window.onmousewheel = (function(e) {
		if(typeof console !== 'undefined')
			console.log("Handler for .wheel() called." + e.wheelDelta + " " + e.x + " " + e.y);
		e.preventDefault();
	});

}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
