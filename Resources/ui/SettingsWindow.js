// Settings Window [実装途中]
var win = Ti.UI.currentWindow;

var config = require('/config/settings');
var settings = config.settings;

var view = (function (g) {
	var sections = [];
	var tableView = Ti.UI.createTableView({
		backgroundColor: '#000',
		color: '#fff'
	});
	Object.keys(settings).forEach(function (item) {
		var section = Ti.UI.createTableViewSection({
			headerTitle: item
		});
		sections.push(section);
		region = config.load('region');
		var row = Ti.UI.createTableViewRow({
			title: region.length > 0 ? region.join(',') : '地域未指定',
			hasChild: true
		});
		section.add(row);
		
		row.addEventListener('click', function () {
			var win = Ti.UI.createWindow({
				backgroundColor: '#000',
				color: '#fff',
				navBarHidden: false,
				title: item
			});
			var table = Ti.UI.createTableView();
			win.add(table);
			
			var data = [];
			Object.keys(settings[item]).forEach(function (title) {
				var tableViewRow = Ti.UI.createTableViewRow({
					title: title
				});
				if (~ region.indexOf(title)) tableViewRow.hasCheck = true;
				data.push(tableViewRow);
			});
			table.data = data;
			table.addEventListener('click', function (e) {
				var row = e.row;
				var title = row.title;
				var index;
				if (row.hasCheck === true) {
					row.hasCheck = false;
					index = region.indexOf(title);
					region.splice(index, 1);
				} else {
					row.hasCheck = true;
					region.push(title);
				}
			});
			
			win.addEventListener('blur', function () {
				row.title = region.length > 0 ? region.join(',') : '地域未指定';
				config.set('region', region);
			});
			win.open();
		});
	});
	tableView.data = sections;
	
	return tableView;
})(win.g);
win.add(view);