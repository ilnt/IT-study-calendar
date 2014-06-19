/**
 * ui/CreateWindow.js
 * Create Window
 */

function Create(g) {
	var opendWindows = [];
	
	function createWindow(options) {
		// Ti.UI.createWindow wrapper
		if (! Ti.Platform.Android && Ti.Platform.version.split(".")[0] >= 7) {
			options.top = 20;
		}
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
	
	this.Scrollable = function () {
		var win = createWindow({
			backgroundColor: '#fff',
			navBarHidden: true,
			exitOnClose: true,
			orientationModes: g.orientationModes
		});
		
		var view = loadView("ui/ScrollableView");
		win.add(view);
		
		return win;
	};
	// Event List Window
	this.EventList = function (title) {
		var view = require('ui/EventListView').call(g, title);
		
		return view;
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
	return new Create(this);
};