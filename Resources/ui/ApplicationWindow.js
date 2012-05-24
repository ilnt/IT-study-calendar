var win = Ti.UI.currentWindow;

// Global object
g = win.g;

// load Loading View
LoadingView = require('ui/LoadingView')();
win.add(LoadingView);

// set gCal
g.gCal = require('lib/google_cal')(LoadingView);

if (g.enableCal) {
	// load Scrollable View
	var ScrollableView = require('ui/ScrollableView')(g);
	win.add(ScrollableView);
} else {
	// load Scrollable_ View (New version)
	var ScrollableView = require('ui/ScrollableView_')(g);
	win.add(ScrollableView);
	g.EventListView = ScrollableView;
}

// Android Only(Menu)
if (g.android) {
	win.activity.onCreateOptionsMenu = function (e) {
		var menu = e.menu;
		
		// カレンダーUI有効時のみ
		if (g.enableCal) {
			var list = menu.add({title: '一覧'});
			// 一覧表示
			list.setIcon(Ti.Android.R.drawable.ic_menu_agenda);
			list.addEventListener('click', function () {
				g.gCal.get('LAST_QUERY', function (res) {
					require('ui/CreateWindow').EventList(g, res.entry).open();
				}, true);
			});
		}
		// 検索機能
		var search = menu.add({title: '検索'});
		search.setIcon(Ti.Android.R.drawable.ic_menu_search);
		search.addEventListener('click', function () {
			require('ui/CreateWindow').Search(g).open();
		});
		// データ更新
		var reload = menu.add({title: '更新'});
		reload.setIcon(Ti.Android.R.drawable.ic_menu_rotate);
		reload.addEventListener('click', function () {
			ScrollableView.fireEvent('reload', {cache: false});
		});
		// 設定画面
		var settings = menu.add({title: '設定'});
		settings.setIcon(Ti.Android.R.drawable.ic_menu_preferences);
		settings.addEventListener('click', function () {
			require('ui/CreateWindow').Settings(g).open();
		});
	};
} else {
	// iOS用のUI
}