/*
 * CreateWindow
 * Windowの生成部分だけ抜き出したもの
 */
// Event List Window
exports.EventList = function (g, items) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#fff',
		navBarHidden: true,
		orientationModes: g.orientationModes
	});
	var view = require('EventListView')(g);
	win.add(view);
	win.addEventListener('open', function () {
		view.fireEvent('openView', items);
	});
	return win;
};
// Event Detail Window
exports.EventDetail = function (g, item) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#fff',
		navBarHidden: false,
		title: 'イベント詳細',
		orientationModes: g.orientationModes
	});
	var view = require('EventDetailView')(g, item);
	win.add(view);
	return win;
};
// Search Window
exports.Search = function (g) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#fff',
		navBarHidden: true,
		orientationModes: g.orientationModes
	});
	var SearchView = require('SearchView')(g);
	win.add(SearchView);
	return win;
};
// Settings Window
exports.Settings = function (g) {
	var win = Ti.UI.createWindow({
		url: 'SettingsWindow.js',
		backgroundColor: '#000',
		navBarHidden: false,
		title: '設定',
		orientationModes: g.orientationModes
	});
	return win;
};