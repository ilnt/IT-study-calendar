var win = Ti.UI.currentWindow;

// Global object
g = win.g;

// load Loading View
var LoadingView = require('LoadingView')(g);
win.add(LoadingView);
g.LoadingView = LoadingView;

// load Google Calendar lib
Ti.include('/lib/google_cal.js');
var gCal = new cal(g);
g.gCal = gCal;

// load Scrollable View
var ScrollableView = require('ScrollableView')(g);
win.add(ScrollableView);

// Android Only(Menu)
if (g.android) {
	win.activity.onCreateOptionsMenu = function (e) {
		var menu = e.menu;
		var reload = menu.add({title: '更新'});
//		var favorite = menu.add({title: 'お気に入り'});
		var search = menu.add({title: '検索'});
		var settings = menu.add({title: '設定'});
		reload.addEventListener('click', function () {
			ScrollableView.fireEvent('reload');
		});
/*		favorite.addEventListener('click', function () {
			alert('お気に入り機能');
		});
*/		search.addEventListener('click', function () {
		//	SearchView.fireEvent('openBar');
			var win = Ti.UI.createWindow({
				backgroundColor: '#fff',
				navBarHidden: true
			});
			var SearchView = require('SearchView')(g);
			win.add(SearchView);
			win.g = g;
			win.open();
		});
		settings.addEventListener('click', function () {
			var win = Ti.UI.createWindow({
				url: 'SettingsWindow.js',
				backgroundColor: '#000',
				navBarHidden: false,
				title: '設定'
			});
			win.g = g;
			win.open();
		});
	};
} else {
	// iOS用のUI
}