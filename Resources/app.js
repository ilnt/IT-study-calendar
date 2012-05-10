/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}
else if (Ti.Platform.osname === 'mobileweb') {
	alert('Mobile web is not yet supported by this template');
}
else {
	// Global object
	var g = {
		disp: {
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.Platform.displayCaps.platformHeight - 27
		},
		android: Ti.Platform.osname === 'android',
		toast: function (message) {
			Ti.UI.createNotification({
				message: message,
				duration: Ti.UI.NOTIFICATION_DURATION_SHORT
			}).show();
		},
		search_closed: true
	};
	
	var win = Ti.UI.createWindow({
		url: 'ui/ApplicationWindow.js',
		backgroundColor: '#fff',
		navBarHidden: true,
		exitOnClose: true,
		orientationModes: [
			Ti.UI.PORTRAIT/*,
			Ti.UI.UPSIDE_PORTRAIT,
			Ti.UI.LANDSCAPE_LEFT,
			Ti.UI.LANDSCAPE_RIGHT*/
		]
	});
	Ti.Gesture.addEventListener('orientationchange', function (e) {
		Ti.API.info(e.orientation);
		// Ti.UI.setOrientation(e.orientation);
	});
	win.g = g;
	win.open();
}