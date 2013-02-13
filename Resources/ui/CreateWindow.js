/**
 * ui/CreateWindow.js
 * Create Window
 */

function create(g) {
	var opendWindows = [];

	function createWindow(options) {
		// Ti.UI.createWindow wrapper
		var win = Ti.UI.createWindow(options);
		g.currentWindow = win;
		win.addEventListener("focus", function () {
			g.currentWindow = win;
		});
		win.addEventListener("close", function () {
			opendWindows.pop();
		});
		opendWindows.push(win);
		return win;
	}

	function loadView(path) {
		// require wrapper
		return require(path).call(g);
	}

	this.remove = function (exit) {
		// 引数に true を指定すると全ての Window を閉じます
		opendWindows.slice(Ti.Platform.Android && exit ? 0 : 1)
			.forEach(function (win) {
				win.close();
			});
	};

	this.Application = function () {
		var win = createWindow({
			backgroundColor: '#fff',
			navBarHidden: true,
			exitOnClose: true,
			orientationModes: g.orientationModes
		});
		
		var view = loadView("ui/ApplicationView");
		win.add(view);
		
		return win;
	};

	// Event List Window
	this.EventList = function (title) {
		/*
		var win = createWindow({
			backgroundColor: '#fff',
			navBarHidden: true,
			orientationModes: g.orientationModes
		});
		*/
		var view = require('ui/EventListView').call(g, title);
		/*
		win.add(view);
		win.addEventListener('open', function () {
			view.fireEvent('openView', {items: items});
		});
		*/
		return view;
		// return win;
	};
	// Event Detail Window
	this.EventDetail = function (item) {
		var win = createWindow({
			backgroundColor: '#fff',
			navBarHidden: true,
			title: 'イベント詳細',
			orientationModes: g.orientationModes
		});
		
		var view = require('ui/EventDetailView').call(g, item);
		win.add(view);
		
		return win;
	};
	// Search Window
	this.Search = function () {
		var win = createWindow({
			backgroundColor: '#fff',
			navBarHidden: true,
			orientationModes: g.orientationModes
		});
		
		var view = loadView('ui/SearchView');
		win.add(view);
		
		return win;
	};
	// Settings Window
	this.Settings = function () {
		var win = createWindow({
			backgroundColor: '#000',
			navBarHidden: true,
			title: '設定',
			orientationModes: g.orientationModes
		});
		
		var view = loadView('ui/SettingsView');
		win.add(view);
		
		return win;
	};
	// Selecting Window
	this.Selecting = function (item) {
		var win = createWindow({
			backgroundColor: '#000',
			color: '#fff',
			navBarHidden: true,
			title: item.name,
			orientationModes: g.orientationModes
		});
		
		return win;
	};
}

module.exports = function () {
	return new create(this);
};