// Scrollable View
var win = Ti.UI.currentWindow;
module.exports = function (g) {
	var	month = {b:0, f:0},
		views = {},
		now = new Date().toString();
	
	function addCalendar(month_d) {
		if (views[month_d])
			return false;
		var date = new Date(now);
		date.setMonth(date.getMonth() + month_d);
		var CalendarView = require('CalendarView')(g, date, month_d);
		views[month_d] = {
			loaded: false,
			view: CalendarView,
			m: month_d
		};
		return CalendarView;
	}
	
	var scroll = Ti.UI.createScrollableView({
	//	views: [addBlankView('先月に移動'), addCalendar(0), addBlankView('来月に移動')],
		views: [addCalendar(-- month.b), addCalendar(0), addCalendar(++ month.f)],
		showPagingControl: false
	});
	// 先頭にViewを追加
	scroll.addBefore = function (view) {
		this.moveNext();
		this.setViews((view instanceof Array ? view : [view]).concat(this.views));
	};
	// 末尾にViewを追加
	scroll.addAfter = function (view) {
	//	this.setViews(this.views.concat(view));
		this.addView(view);
	};
	
	var currentPageIndex = parseInt(scroll.views.length / 2);
	scroll.setCurrentPage(currentPageIndex);
	
	scroll.addEventListener('reload', function () {
		var currentView = scroll.views[scroll.getCurrentPage()];
		currentView.fireEvent('reload');
	});
	scroll.addEventListener('scroll', function (e) {
		var	pageSize = scroll.views.length,
			currentPage = e.currentPage,
			viewsId = Object.keys(views);
		
		viewsId.sort(function (a, b) {return a - b});
		Ti.API.info('currentPage: ' + currentPage);
		var viewObj = views[viewsId[currentPage]];
		if (! viewObj.loaded) {
			viewObj.loaded = true;
			viewObj.view.fireEvent('load');
			Ti.API.info('month_d: ' + viewObj.m);
		}
		if (currentPage === 0)
			scroll.addBefore(addCalendar(-- month.b));
		else if (currentPage === pageSize - 1)
			scroll.addAfter(addCalendar(++ month.f));
	});
	
	// Windowがフォーカスを失ったときにtrueに設定され、フォーカスが戻るとfalseに
	var focus_on = false;
	
	// Windowがフォーカスを失ったときにUI初期化
	win.addEventListener('scv_blur', function (month_d) {
		month_d = month_d.m;
		var currentPage = scroll.getCurrentPage();
		var page = Object.keys(views).indexOf(String(month_d));
		if (currentPage !== page + 1) {
			var viewObj = views[month_d];
			viewObj.loaded = false;
			Ti.API.info('loaded false month_d: ' + month_d);
		} else
			Ti.API.info('month_d: ' + month_d);
		focus_on = true;
	});
	
	// Windowにフォーカスが戻ったときにUIを再構築
	win.addEventListener('focus', function () {
		if (focus_on) {
			Ti.API.info('window focus');
			var	currentPage = scroll.getCurrentPage();
			var view = scroll.views[currentPage];
			view.fireEvent('load');
		}
		focus_on = false;
	});
	
	return scroll;
};