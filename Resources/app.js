/**
 * app.js
 */

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
} else if (Ti.Platform.osname === 'mobileweb') {
	alert('Mobile web is not yet supported by this template');
} else bootstrap();

function bootstrap() {
	var config = require('config/settings');
	// Global object
	var g = {
		loadConfig: config.load,
		gCal: {},
		disp: {
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.Platform.displayCaps.platformHeight
		},
		orientationModes: [
			Ti.UI.PORTRAIT,
			Ti.UI.UPSIDE_PORTRAIT/*,
			Ti.UI.LANDSCAPE_LEFT,
			Ti.UI.LANDSCAPE_RIGHT*/
		],
		toast: function (message) {
			Ti.UI.createNotification({
				message: message,
				duration: Ti.UI.NOTIFICATION_DURATION_SHORT
			}).show();
		},
		getDate: function (date) {
			var	tmp = [
					'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
					'17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
				],
				dateobj = {
					year: date.getFullYear(),
					month: date.getMonth(),
					date: date.getDate(),
					firstDay: 0,
					nextMonth: 0,
					nextMonthYear: 0,
					lastMonth: 0,
					lastMonthYear: 0,
					lastMonthLastDate: 0,
					currentMonthLastDate: 0,
					zeroPadding: function (num) {
						return ('0' + num).slice(-2);
					},
					days: [],
					ymd: [],
					nextMonthPaddingDays: 0
				};
			// 今月の１日
			date.setDate(1);
			dateobj.firstDay = date.getDay();
			// 来月
			date.setMonth(date.getMonth() + 1);
			dateobj.nextMonth = date.getMonth();
			dateobj.nextMonthYear = date.getFullYear();
			// 来月の１日から１日引く(今月の最後の日)
			date.setDate(0);
			dateobj.currentMonthLastDate = date.getDate();
			//　先月の最後の日
			date.setDate(0);
			dateobj.lastMonth = date.getMonth();
			dateobj.lastMonthYear = date.getFullYear();
			dateobj.lastMonthLastDate = date.getDate();
			
			var	days = [],
				ymd = [];
			days.push(tmp.slice(dateobj.lastMonthLastDate - dateobj.firstDay, dateobj.lastMonthLastDate));
			days.push(tmp.slice(0, dateobj.currentMonthLastDate));
			var nextMonthPaddingDays = 42 - [].concat.apply([], days).length;
			days.push(tmp.slice(0, nextMonthPaddingDays));
			ymd.push(days[0].map(function (day) {
				return dateobj.lastMonthYear + '-' + dateobj.zeroPadding(dateobj.lastMonth + 1) + '-' + dateobj.zeroPadding(day);
			}));
			ymd.push(days[1].map(function (day) {
				return dateobj.year + '-' + dateobj.zeroPadding(dateobj.month + 1) + '-' + dateobj.zeroPadding(day);
			}));
			ymd.push(days[2].map(function (day) {
				return dateobj.nextMonthYear + '-' + dateobj.zeroPadding(dateobj.nextMonth + 1) + '-' + dateobj.zeroPadding(day);
			}));
			days = [].concat.apply([], days);
			ymd = [].concat.apply([], ymd);
			dateobj.days = days;
			dateobj.ymd = ymd;
			dateobj.nextMonthPaddingDays = nextMonthPaddingDays;
			
			return dateobj;
		},
		dip: function (size) {return size + "dip"},
		currentWindow: null,
		createWindow: require('ui/CreateWindow'),
		createMenu: require("ui/CreateMenu")
	};
	
	// initialize CreateWindow
	g.createWindow = g.createWindow();
	// open main view
	g.createWindow.Application().open();
	
	Ti.Gesture.addEventListener('orientationchange', function (e) {
		Ti.API.info("orientation: " + e.orientation);
		// Ti.UI.setOrientation(e.orientation);
	});
}