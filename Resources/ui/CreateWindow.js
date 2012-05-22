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
	var view = require('ui/EventListView')(g);
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
	var view = require('ui/EventDetailView')(g, item);
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
	var view = require('ui/SearchView')(g);
	win.add(view);
	return win;
};
// Settings Window
exports.Settings = function (g) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#000',
		navBarHidden: false,
		title: '設定',
		orientationModes: g.orientationModes
	});
	var view = require('ui/SettingsView')(g);
	win.add(view);
	return win;
};
// Selecting Window
exports.Selecting = function (g, item) {
	var win = Ti.UI.createWindow({
		backgroundColor: '#000',
		color: '#fff',
		navBarHidden: false,
		title: item.name,
		orientationModes: g.orientationModes
	});
	return win;
};