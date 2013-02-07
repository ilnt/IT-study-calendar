// Event list View

module.exports = function (title) {
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
	wrapper.add(header);
	var headerLabel = Ti.UI.createLabel({
		top: 0,
		left: g.dip(5),
		height: g.dip(50),
		text: title ? title : '一覧',
		color: '#fff',
		font: {fontSize: 18, fontWeight: 'bold'}
	});
	header.add(headerLabel);
	
	var table = Ti.UI.createTableView();
	wrapper.add(table);
	
	view.addEventListener('openView', function (e) {
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
				hasChild: true,
				font: {fontSize: 18}
			});
			dateSection.add(row);
			
			row.addEventListener('click', function () {
				g.createWindow.EventDetail(item).open();
			});
		});
		
		table.data = rowData;
	});
	
	return view;
};