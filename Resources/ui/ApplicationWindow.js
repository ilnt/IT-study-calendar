var win = Ti.UI.currentWindow;

// Global object
g = win.g;

// load Loading View
LoadingView = require('LoadingView')();
win.add(LoadingView);

// set gCal
g.gCal = require('lib/google_cal')(LoadingView);

if (g.enableCal) {
	// load Scrollable View
	var ScrollableView = require('ScrollableView')(g);
	win.add(ScrollableView);
} else {
	// load Scrollable_ View (New version)
	var ScrollableView = require('ScrollableView_')(g);
	win.add(ScrollableView);
	g.EventListView = ScrollableView;
}

// Android Only(Menu)
if (g.android) {
	win.activity.onCreateOptionsMenu = function (e) {
		var menu = e.menu;
		var search = menu.add({title: '検索'});
		var reload = menu.add({title: '更新'});
//		var favorite = menu.add({title: 'お気に入り'});
		
		// カレンダーUI有効時のみ
		if (g.enableCal) {
			var list = menu.add({title: '一覧'});
			// 一覧表示
			list.addEventListener('click', function () {
				g.gCal.get('LAST_QUERY', function (res) {
					require('CreateWindow').EventList(g, res.entry).open();
				}, true);
			});
		}
		// 検索機能
		search.addEventListener('click', function () {
			require('CreateWindow').Search(g).open();
		});
		// データ更新
		reload.addEventListener('click', function () {
			ScrollableView.fireEvent('reload', {cache: false});
		});
		// お気に入り機能
/*		favorite.addEventListener('click', function () {
			alert('お気に入り機能');
		});*/
		// 設定画面
		var settings = menu.add({title: '設定'});
		settings.addEventListener('click', function () {
			require('CreateWindow').Settings(g).open();
		});
	};
} else {
	// iOS用のUI
}