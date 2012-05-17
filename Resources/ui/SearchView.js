// Search View
var win = Ti.UI.currentWindow;
module.exports = function (g) {
	var wrapper = Ti.UI.createView({
		height: g.disp.height,
		layout: 'vertical',
		top: 0
	}); 
	
	var view = Ti.UI.createView({
		height: g.disp.height / 10,
		top: 0
	});
	
	var eventList = require('EventListView')(g);
	eventList.height = g.disp.height / 10 * 9;
	
	var search = Ti.UI.createSearchBar({
		width: g.disp.width / 10 * 7,
		left: 0,
		showCancel: false,
		hintText: '検索キーワード'
	});
	search.addEventListener('return', function (e) {
		search.blur();
		var search_str = e.value;
		g.gCal.search('CURRENT_QUERY', search_str, function (items) {
			eventList.fireEvent('openView', items);
		});
	});
	view.add(search);
	
	var button = Ti.UI.createButton({
		width: g.disp.width / 10 * 3,
		right: 0,
		title: '検索'
	});
	button.addEventListener('click', function () {
		search.fireEvent('return', {value: search.value});
	});
	view.add(button);
	
	wrapper.add(view);
	wrapper.add(eventList);
	
	return wrapper;
};