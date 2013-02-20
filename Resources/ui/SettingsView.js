/**
 * ui/SettingsView.js
 * Settings Window
 */

module.exports = function () {
	var g = this;
	
	var view = Ti.UI.createView();
	
	var wrapper = Ti.UI.createView({
		layout: "vertical"
	});
	view.add(wrapper);
	
	var header = Ti.UI.createView({
		height: g.dip(50),
		backgroundColor: '#177bbd'
	});
	var headerLabel = Ti.UI.createLabel({
		height: g.dip(50),
		top: 0,
		left: g.dip(5),
		text: '設定',
		color: '#fff',
		font: {fontSize: g.dip(18), fontWeight: 'bold'}
	});
	header.add(headerLabel);
	wrapper.add(header);
	
	// set menu
	g.createMenu(view, {}, true);
	
	var	config = g.config,
		settings = config.settings,
		sections = [],
		tableView = Ti.UI.createTableView({
			backgroundColor: '#000'
		});
	Object.keys(settings).forEach(function (id) {
		var item = settings[id];
		var section = Ti.UI.createTableViewSection({
			headerTitle: item.name
		});
		sections.push(section);
		var setval = config.load(id);
		var row = Ti.UI.createTableViewRow({
			height: g.dip(40),
			color: "#fff",
			font: {fontSize: g.dip(18)}
		});
		
		switch (item.type) {
			case 'button':
				row.title = item.title;
				row.addEventListener('click', function () {
					var callback = item.callback;
					if (callback)
						callback();
				});
				break;
			
			case 'option':
				var dataList = Object.keys(item.data);
				row.title = String(dataList[dataList.map(function (key) {return item.data[key]}).indexOf(setval)]);
				row.addEventListener('click', function () {
					dataList = Object.keys(item.data);
					var dialog = Ti.UI.createOptionDialog({
						title: item.name + 'を選択',
						options: dataList
					});
					dialog.addEventListener("click", function (e) {
						var index = e.index || 0,
							data = dataList[index];
						
						if (data && data !== row.title) {
							row.title = data;
							config.set('font-size', data);
							// settingsに指定されたcallbackの実行(主にUI初期化)
							var callback = item.callback;
							if (callback)
								callback();
						}
					});
					dialog.show();
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
						callback(! setval, function (res) {
							if (res !== false) cb();
						});
					else cb();
				});
				break;
			
			case 'select':
				row.title = JSON.stringify(setval) !== JSON.stringify(item.init) ? setval.join(',') : item.title;
				row.hasChild = true;
				row.addEventListener('click', function () {
					var win = g.createWindow.Selecting(item);
					
					var view = Ti.UI.createView();
					win.add(view);
					var wrapper = Ti.UI.createView({
						layout: "vertical"
					});
					view.add(wrapper);
					
					var header = Ti.UI.createView({
						height: g.dip(50),
						backgroundColor: '#177bbd'
					});
					var headerLabel = Ti.UI.createLabel({
						height: g.dip(50),
						top: 0,
						left: g.dip(5),
						text: item.name,
						color: '#fff',
						font: {fontSize: g.dip(18), fontWeight: 'bold'}
					});
					header.add(headerLabel);
					wrapper.add(header);
					// set menu
					g.createMenu(view, {}, true);
					
					var table = Ti.UI.createTableView({
						backgroundColor: '#000'
					});
					wrapper.add(table);
					
					var data = [];
					Object.keys(item.data).forEach(function (title) {
						var tableViewRow = Ti.UI.createTableViewRow({
							height: g.dip(40),
							title: title,
							color: '#fff',
							font: {fontSize: g.dip(18), fontWeight: 'bold'}
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
								callback();
						}
					});
					win.open();
				});
				break;
		}
		section.add(row);
	});
	tableView.data = sections;
	
	wrapper.add(tableView);
	return view;
};