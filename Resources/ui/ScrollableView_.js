// Scrollable View
var win = Ti.UI.currentWindow;
module.exports = function (g) {
	var	month = {b:0, f:0},
		// View管理用Object
		views = {},
		now = new Date().toString();
	
	function addCalendar(month_d) {
		var date = new Date(now);
		date.setMonth(date.getMonth() + month_d);
		// load EventList View
		var date = g.getDate(date);
		var EventListView = require('ui/EventListView')(g, date.year + '年 ' + (date.month + 1) + '月');
		var query = {
			'start-min': date.year + '-' + date.zeroPadding(date.month + 1) + '-' + '01T00:00:00+09:00',
			'start-max': date.year + '-' + date.zeroPadding(date.month + 1) + '-' + date.zeroPadding(date.currentMonthLastDate) + 'T23:59:59+09:00',
			'max-results': 1440
		};
		// reload event
		EventListView.addEventListener('reload', function (cache) {
			g.gCal.get(query, function (res) {
				EventListView.fireEvent('openView', res.entry);
			}, cache);
		});
		// set views obj
		views[month_d] = {
			loaded: false,
			view: EventListView,
			query: query
		};
		return EventListView;
	}
	
	var scroll = Ti.UI.createScrollableView({
		top: 0,
		height: g.disp.height,// - 48,
	//	views: [addBlankView('先月に移動'), addCalendar(0), addBlankView('来月に移動')],
		views: [addCalendar(-- month.b), addCalendar(0), addCalendar(++ month.f)],
		showPagingControl: false
	});
	// 先頭にViewを追加
	scroll.addBefore = function (view) {
		// 先頭にViewを追加することでViewのindex番号が変わり1つ前(左)にズレるので1つ次(右)へ移動
		this.moveNext();
		this.setViews((view instanceof Array ? view : [view]).concat(this.views));
	};
	// 末尾にViewを追加
	scroll.addAfter = function (view) {
		this.addView(view);
	};
	
	// デフォルトのページを中央に設定
	var currentPageIndex = parseInt(scroll.views.length / 2);
	scroll.setCurrentPage(currentPageIndex);
	
	// イベント一覧の更新
	scroll.addEventListener('reload', function (cache) {
		// 設定変更などで全てのViewの再描画が必要な場合
		if (cache === 'refresh') {
			Object.keys(views).forEach(function (key) {
				var viewObj = views[key];
				if (viewObj.loaded)
					viewObj.view.fireEvent('reload', true);
			});
		} else {
			var currentView = scroll.views[scroll.getCurrentPage()];
			currentView.fireEvent('reload', cache);
		}
	});
	// スクロール時にViewを追加
	scroll.addEventListener('scroll', function (e) {
		var	pageSize = scroll.views.length,
			currentPage = e.currentPage,
			viewsId = Object.keys(views);
		
		viewsId.sort(function (a, b) {return a - b});
		Ti.API.info('currentPage: ' + currentPage);
		var viewObj = views[viewsId[currentPage]];
		// 読み込み済みか
		if (! viewObj.loaded) {
			viewObj.loaded = true;
			viewObj.view.fireEvent('reload', true);
		} else
			g.gCal.setCurrentQuery(viewObj.query);
		// 先頭, 末尾の場合にViewを追加
		if (currentPage === 0)
			scroll.addBefore(addCalendar(-- month.b));
		else if (currentPage === pageSize - 1)
			scroll.addAfter(addCalendar(++ month.f));
	});
	
	return scroll;
};