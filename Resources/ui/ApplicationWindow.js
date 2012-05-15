var win = Ti.UI.currentWindow;

// load settings
var config = require('/config/settings');

// Global object
g = win.g;

// load Loading View
LoadingView = require('LoadingView')();
win.add(LoadingView);

// set gCal
g.gCal = require('lib/google_cal')(LoadingView);

var enableCal = config.load('enableCal');
if (enableCal) {
	// load Scrollable View
	var ScrollableView = require('ScrollableView')(g);
	win.add(ScrollableView);
} else {
	// load EventList View
	var EventListView = require('EventListView')(g);
	win.add(EventListView);
	var date = g.getDate(new Date());
	g.gCal.get({
		'start-min': date.lastMonthYear + '-' + date.zeroPadding(date.lastMonth + 1) + '-' + date.zeroPadding(date.days[0]) + 'T00:00:00+09:00',
		'start-max': date.nextMonthYear + '-' + date.zeroPadding(date.nextMonth + 1) + '-' + date.zeroPadding(date.days[date.days.length - 1]) + 'T23:59:59+09:00',
		'max-results': 1440
	}, function (res) {
		EventListView.fireEvent('openView', res.entry);
	});
	EventListView.addEventListener('reload', function (cache) {
		g.gCal.get('LAST_QUERY', function (res) {
			EventListView.fireEvent('openView', res.entry);
		}, cache);
	});
	var ScrollableView = EventListView;
	g.EventListView = EventListView;
}

// Android Only(Menu)
if (g.android) {
	win.activity.onCreateOptionsMenu = function (e) {
		var menu = e.menu;
		var list = menu.add({title: '一覧'});
		var search = menu.add({title: '検索'});
		var reload = menu.add({title: '更新'});
//		var favorite = menu.add({title: 'お気に入り'});
		var settings = menu.add({title: '設定'});
		
		// 一覧表示
		list.addEventListener('click', function () {
			g.gCal.get('LAST_QUERY', function (res) {
				require('CreateWindow').EventList(g, res.entry).open();
			}, true);
		});
		// 検索機能
		search.addEventListener('click', function () {
			require('CreateWindow').Search(g).open();
		});
		// データ更新
		reload.addEventListener('click', function () {
			ScrollableView.fireEvent('reload');
		});
		// お気に入り機能
/*		favorite.addEventListener('click', function () {
			alert('お気に入り機能');
		});*/
		// 設定画面
		settings.addEventListener('click', function () {
			require('CreateWindow').Settings(g).open();
		});
	};
} else {
	// iOS用のUI
}