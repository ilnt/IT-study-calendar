// Settings Window
module.exports = function (g) {
	var	config = require('config/settings'),
		settings = config.settings,
		sections = [],
		tableView = Ti.UI.createTableView({
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
			case 'button':
				row.title = item.title;
				row.addEventListener('click', function () {
					var callback = item.callback;
					if (callback)
						callback(g);
				});
				break;
			
			case 'check':
				row.title = item.title;
				row.hasCheck = setval !== item.init ? setval : item.init;
				row.addEventListener('click', function () {
					function cb() {
						setval = ! setval;
						row.hasCheck = setval;
						config.set(id, setval);
					}
					// settingsに指定されたcallbackの実行(主にUI初期化)
					var callback = item.callback;
					if (callback)
						// callbackがfalseを返したときは実行取り消し
						callback(g, ! setval, function (res) {
							if (res !== false) cb();
						});
					else cb();
				});
				break;
			
			case 'select':
				row.title = JSON.stringify(setval) !== JSON.stringify(item.init) ? setval.join(',') : item.title;
				row.hasChild = true;
				row.addEventListener('click', function () {
					var win = require('ui/CreateWindow').Selecting(g, item);
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
						var preSetval = config.load(id);
						if (preSetval.toString() !== setval.toString()) {
							row.title = JSON.stringify(setval) !== JSON.stringify(item.init)
								? setval.join(',') : item.title;
							config.set(id, setval);
							// settingsに指定されたcallbackの実行(主にUI初期化)
							var callback = item.callback;
							if (callback)
								callback(g);
						}
					});
					win.open();
				});
				break;
		}
		section.add(row);
	});
	tableView.data = sections;
	
	return tableView;
};