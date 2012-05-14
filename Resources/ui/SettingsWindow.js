// Settings Window
var win = Ti.UI.currentWindow;

var config = require('/config/settings');
var settings = config.settings;

var view = (function (g) {
	var sections = [];
	var tableView = Ti.UI.createTableView({
		backgroundColor: '#000',
		color: '#fff'
	});
	settings.forEach(function (item) {
		var section = Ti.UI.createTableViewSection({
			headerTitle: item.name
		});
		sections.push(section);
		var setval = config.load(item.id);
		var row = Ti.UI.createTableViewRow();
		
		switch (item.type) {
			case 'check':
				row.title = 'カレンダービューβを使う(要再起動)';
				row.hasCheck = setval ? setval : item.init;
				row.addEventListener('click', function () {
					setval = ! setval;
					row.hasCheck = setval;
					config.set(item.id, setval);
				});
				break;
			
			case 'select':
				row.title = setval ? setval.join(',') : item.init;
				row.hasChild = true;
				setval = setval ? setval : [];
				row.addEventListener('click', function () {
					var win = Ti.UI.createWindow({
						backgroundColor: '#000',
						color: '#fff',
						navBarHidden: false,
						title: item.name
					});
					var table = Ti.UI.createTableView();
					win.add(table);
					
					var data = [];
					Object.keys(item.data).forEach(function (title) {
						var tableViewRow = Ti.UI.createTableViewRow({
							title: title
						});
						if (~ setval.indexOf(title)) tableViewRow.hasCheck = true;
						data.push(tableViewRow);
					});
					table.data = data;
					table.addEventListener('click', function (e) {
						var	row = e.row,
							title = row.title,
							index;
						if (row.hasCheck === true) {
							row.hasCheck = false;
							index = setval.indexOf(title);
							setval.splice(index, 1);
						} else {
							row.hasCheck = true;
							setval.push(title);
						}
					});
					
					win.addEventListener('blur', function () {
						row.title = setval.length > 0 ? setval.join(',') : item.init;
						Ti.API.info('setcal: ' + JSON.stringify(setval));
						config.set(item.id, setval);
					});
					win.open();
				});
				break;
		}
		section.add(row);
	});
	tableView.data = sections;
	
	return tableView;
})(win.g);
win.add(view);