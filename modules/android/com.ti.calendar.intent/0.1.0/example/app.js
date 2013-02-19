// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
win.add(label);
win.open();

var calendar = require('com.ti.calendar.intent');

var time = new Date().getTime();

calendar.addEvent({
  title: "Event Title",
  location: "Event Location",
  description: "Event Description",
  beginTime: time,
  endTime: time + 3600 * 1000,
  allDay: false,
  email: "guest@example.com,guest@example.net",
  rrule: "FREQ=WEEKLY;COUNT=10;WKST=SU",
  accessLevel: calendar.ACCESS_DEFAULT,
  availability: calendar.AVAILABILITY_TENTATIVE
});
