/*
 * CreateWindow
 * Windowの生成部分だけ抜き出したもの
 */
// Event List Window
exports.EventList = function (g, items) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#fff',
		navBarHidden: true
	});
	var view = require('EventListView')(g);
	win.add(view);
	win.addEventListener('open', function () {
		view.fireEvent('openView', items);
	});
	return win;
};
// Search Window
exports.Search = function (g) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#fff',
		navBarHidden: true
	});
	var SearchView = require('SearchView')(g);
	win.add(SearchView);
	win.g = g;
	return win;
};
// Settings Window
exports.Settings = function (g) {
	var win = Ti.UI.createWindow({
		url: 'SettingsWindow.js',
		backgroundColor: '#000',
		navBarHidden: false,
		title: '設定'
	});
	win.g = g;
	return win;
};