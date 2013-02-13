/*
 * Basic UI setup
 */
var win = Ti.UI.createWindow({
	backgroundColor:"white",
    layout:"vertical"
});

var label = Ti.UI.createLabel({
    text:"press the button to add an event",
    textAlign:"center",
    left:10,
    right:10,
    top:20,
    height:"auto"
});

win.add(label);

var btnAddEvent = Ti.UI.createButton({
    title:"Add Event to Calendar",
    top:20,
    left:10,
    right:10,
    height:44
});
win.add(btnAddEvent);

/*
 * Module usage example
 */

// require the calendar module
var calendar = require('com.gs.calendar');

btnAddEvent.addEventListener("click", function() {
	var startDate = new Date();					// event should start now
	var endDate = new Date();
	endDate.setHours(startDate.getHours() + 2);	// and end two hours from now
	
    // create and show the event dialog
    var eventDialog = calendar.createEventDialog({
        eventTitle:"My new event",	// optional
        eventStartDate:startDate,	// optional
        eventEndDate:endDate,		// optional
        eventLocation:"My office",	// optional
        eventNotes:"A test event from Titanium",	// optional
        
        //eventAllDay:true,			// optional - can set to true for all day events
        
        animated:true,				// optional - default is true
		barColor:"#000"				// optional - sets the navbar color
    });
    
    // attach a listener for the "complete" event
	eventDialog.addEventListener("complete", function(e) {
		if (e.success) {
			// event was added!
			label.text = "Event was successfully added";
			
			/*
			 * e.eventIdentifier is a unique string used to identify the event inside the event store
			 * You can save this to your DB for example, for future syncing
			 */
			Titanium.API.info("eventIdentifier of the added event: " + e.eventIdentifier);
			
		} else {
			// event was NOT added
			
			switch (e.action) {
				case eventDialog.CANCELED: 
					label.text = "User has canceled the dialog";
					break;
				case eventDialog.NOT_SUPPORTED:
					label.text = "EventKit is only supported on iOS 4 and newer";
					break;
				case eventDialog.SAVED:
					// user tried to save the event, but something went wrong
					label.text = "Error while trying to save the event";
					break;
			}
		}
	});

	// show the event dialog
	eventDialog.open();
});


// open the main window
win.open();



