// Settings Window
var	win = Ti.UI.currentWindow,
	config = require('/config/settings'),
	settings = config.settings;

var view = (function (g) {
	var sections = [];
	var tableView = Ti.UI.createTableView({
		backgroundColor: '#000',
		color: '#fff'
	});
	Object.keys(settings).forEach(function (id) {
		var item = settings[id];
		var section = Ti.UI.createTableViewSection({
			headerTitle: item.name
		});
		sections.push(section);
		var setval = config.load(id);
		var row = Ti.UI.createTableViewRow();
		
		switch (item.type) {
			case 'check':
				row.title = item.title;
				row.hasCheck = setval !== item.init ? setval : item.init;
				row.addEventListener('click', function () {
					setval = ! setval;
					row.hasCheck = setval;
					config.set(id, setval);
				});
				break;
			
			case 'select':
				row.title = JSON.stringify(setval) !== JSON.stringify(item.init) ? setval.join(',') : item.title;
				row.hasChild = true;
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
						row.title = JSON.stringify(setval) !== JSON.stringify(item.init) ? setval.join(',') : item.title;
						config.set(id, setval);
						// UIに適用
						g.EventListView.fireEvent('reload', true);
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