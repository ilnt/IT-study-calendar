// Event list View
var win = Ti.UI.currentWindow;
module.exports = function (g, title) {
	var table = Ti.UI.createTableView();
	
	var header = Ti.UI.createTableViewRow({
		title: title ? title : '一覧',
		color: '#fff',
		backgroundColor: '#4080bf',
		backgroundSelectedColor: '#4080bf',
		font: {fontSize: 18, fontWeight: 'bold'},
		touchEnabled: false
	});
	table.data = [header];
	
	table.addEventListener('openView', function (items) {
		var rowData = [];
		var dateSection = false;
		items.forEach(function (item) {
			// date format
			// 2012-05-01T12:00:00.000+09:00 -> 2012-05-01 OR 2012-05-01 -> 2012-05-01
			var dateStr = item.when.start.split('.')[0].split(':');
			dateStr = String(dateStr.length === 1
				? dateStr
				: dateStr.slice(0, -1).join(':').split('T')[0]);
			
			if (! dateSection || dateSection.headerTitle !== dateStr) {
				dateSection = Ti.UI.createTableViewSection({
					headerTitle: dateStr
				});
				rowData.push(dateSection);
			}
			var row = Ti.UI.createTableViewRow({
				title: item.title,
				color: '#000',
				hasChild: true
			});
			dateSection.add(row);
			
			row.addEventListener('click', function () {
				require('CreateWindow').EventDetail(g, item).open();
			});
		});
		if (rowData.length === 0) {
			rowData = [Ti.UI.createTableViewRow({
				title: '該当するイベントがありません。',
				color: '#000'
			})];
		}
		table.data = [header].concat(rowData);
	});
	
	return table;
};