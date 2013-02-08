// Search View

module.exports = function () {
	var g = this;
	
	var wrapper = Ti.UI.createView({
		layout: 'vertical',
		top: 0
	});
	
	var view = Ti.UI.createView({
		height: Ti.UI.SIZE,
		top: 0
	});
	
	var outer = Ti.UI.createView();
	var eventList = g.createWindow.EventList("一覧");
	outer.add(eventList);
	
	var menu = {
		"設定": {
			click: function () {
				g.createWindow.Settings().open();
			}
		}
	};
	g.createMenu(outer, menu, true);
	
	var search = Ti.UI.createSearchBar({
		width: Ti.Platform.Android ? g.disp.width / 10 * 7 : Ti.UI.FILL,
		top: 0,
		left: 0,
		showCancel: false,
		hintText: '検索キーワード'
	});
	search.addEventListener('return', function (e) {
		search.blur();
		var search_str = e.value;
		g.gCal.search('CURRENT_QUERY', search_str, function (items) {
			eventList.fireEvent('openView', {items: items});
		});
	});
	view.add(search);
	
	if (Ti.Platform.Android) {
		search.height = g.dip(60);
		
		var button = Ti.UI.createButton({
			width: g.disp.width / 10 * 3,
			right: 0,
			title: '検索'
		});
		button.addEventListener('click', function () {
			search.fireEvent('return', {value: search.value});
		});
		view.add(button);
	}
	
	wrapper.add(view);
	wrapper.add(outer);
	
	return wrapper;
};