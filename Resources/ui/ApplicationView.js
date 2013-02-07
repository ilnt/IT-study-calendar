/**
 * ui/ApplicationView.js
 */

function ApplicationView() {
	var g = this;
	
	// wrapper
	var view = Ti.UI.createView();
	
	// load Loading View
	LoadingView = require('ui/LoadingView')();
	view.add(LoadingView);
	g.LoadingView = LoadingView;
	
	// set gCal
	g.gCal = require('lib/google_cal')(g);
	
	//	scrollable view
	var ScrollableView = require('ui/ScrollableView').call(g);
	view.add(ScrollableView);
	g.EventListView = ScrollableView;
	
	var menu = {
		"検索": {
			click: function () {
				g.createWindow.Search().open();
			}
		},
		"更新": {
			click: function () {
				ScrollableView.fireEvent('reload', {cache: false});
			}
		},
		"設定": {
			click: function () {
				g.createWindow.Settings().open();
			}
		}
	};
	g.createMenu(view, menu);
	
	return view;
}

module.exports = ApplicationView;