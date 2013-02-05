// Event list View
var win = Ti.UI.currentWindow;
module.exports = function (g, title) {
	var table = Ti.UI.createTableView();
	
	var header = Ti.UI.createTableViewRow({
		title: title ? title : '一覧',
		color: '#fff',
		backgroundColor: '#177bbd',
		backgroundSelectedColor: '#177bbd',
		font: {fontSize: 18, fontWeight: 'bold'},
		touchEnabled: false
	});
	table.data = [header];
	
	table.addEventListener('openView', function (e) {
		var items = e.items,
			rowData = [],
			dateSection = false,
			last_dateStr = "",
			week = ["日", "月", "火", "水", "木", "金", "土"];
		
		if (items.length === 0) {
			rowData = [Ti.UI.createTableViewRow({
				title: '該当するイベントがありません。',
				color: '#000'
			})];
		} else items.forEach(function (item) {
			// date format
			// 2012-05-01T12:00:00.000+09:00 -> 2012-05-01T12 OR 2012-05-01 -> 2012-05-01
			var dateStr = item.when.start.split('.')[0].split(':');
			dateStr = String(dateStr.length === 1
				? dateStr
				: dateStr.slice(0, -1).join(':').split('T')[0]);
			
			if (! dateSection || last_dateStr !== dateStr) {
				last_dateStr = dateStr;
				dateSection = Ti.UI.createTableViewSection({
					headerTitle: dateStr + " (" + week[new Date(item.when.start).getDay()] + ")"
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
				require('ui/CreateWindow').EventDetail(g, item).open();
			});
		});
		
		table.data = [header].concat(rowData);
	});
	
	return table;
};