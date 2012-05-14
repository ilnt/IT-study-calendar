// Calendar View
var win = Ti.UI.currentWindow;
module.exports = function (g, date, month_d) {
	// this function
	var f = arguments.callee;
	// イベント間利用Array
	var	eventItems = [];
	// 日付のマスのindex番号
	var eventIndex = 0;
	function addLabel(view, labelArr, type) {
		labelArr.forEach(function (elem, index, arr) {
			// day表示
			var day = Ti.UI.createView({
				width: g.disp.width / arr.length,
				top: 0,
				bottom: 0,
				left: 0,
				layout: 'vertical'
			});
			view.add(day);
			// label表示
			var label = Ti.UI.createLabel({
				text: elem
			});
			day.add(label);
			switch (type) {
				case 'day':
					var itemIndex = eventIndex++;
					// 全ての日付のマスにイベントリスナーを追加
					day.addEventListener('click', function () {
						var items = eventItems[itemIndex];
						// イベントが存在する場合
						if (items)
							require('CreateWindow').EventList(g, items).open();
					});
					label.top = 0;
					label.left = 0;
					label.color = '#000';
					label.font = {fontSize: 15, fontFamily: 'Arial'};
					break;
				default:
					label.color = '#000';
					label.font = {fontSize: 15, fontFamily: 'Arial'};
					break;
			}
		});
	}
	function place(view, item) {
		var	count = 0,
			itemArr = [];
		item.forEach(function (elem, index) {
			if (index === 0 || index % 7 === 0) {
				if (index !== 0) count++;
				itemArr[count] = [];
			}
			itemArr[count].push(elem);
		});
		var c = 0;
		itemArr.forEach(function (elem) {
			addLabel(view[c++], elem, 'day');
		});
	}
	// Control event
	var children = [];
	var controlEvent = new (function () {
		this.plot = function (callback, cache) {
			// Eventを載せる
			g.gCal.get({
				'start-min': date.lastMonthYear + '-' + date.zeroPadding(date.lastMonth + 1) + '-' + date.zeroPadding(days[0]) + 'T00:00:00+09:00',
				'start-max': date.nextMonthYear + '-' + date.zeroPadding(date.nextMonth + 1) + '-' + date.zeroPadding(days[days.length - 1]) + 'T23:59:59+09:00',
				'max-results': 1440
			}, function (res) {
				var entry = {};
				Ti.API.info('Event: ' + res.entry.length);
				res.entry.forEach(function (item) {
					var d = item.when.start.split('T')[0];
					if (! entry[d]) entry[d] = [];
					entry[d].push(item);
				});
				var weekArr = tableView.getData()[0].rows.slice(2);
				var children = [];
				weekArr.forEach(function (item) {
					children = children.concat(item.getChildren());
				});
				children.forEach(function (child, index) {
					var text = 'Rewrite child: ' + (index + 1) + '/' + children.length;
					Ti.API.info(text);
					var items = entry[ymd[index]];
					if (items) {
						// add event item to array
						eventItems.push(items);
						items.forEach(function (item, index) {
							var label = Ti.UI.createLabel({
								top: 0,
								height: 11,
								font: {fontSize: 9, fontFamily: 'Arial'},
								color: '#99f',
								text: item.title,
								ellipsize: true
							});
							child.add(label);
						});
					} else
						eventItems.push(null);
				});
				if (typeof callback === 'function') callback();
			}, cache);
		};
		this.erase = function () {
			// eventItemsを初期化
			eventItems = [];
			// elementを削除
			children.forEach(function (child) {
				child.getChildren().forEach(function (item, index) {
					if (index !== 0) child.remove(item);
				});
			});
		};
	})();
	
	// Wrapper view
	var	tableView = Ti.UI.createTableView({
		height: g.disp.height,
		borderWidth: 0,
		zIndex: 0,
		touchEnabled: false
	});
	
	var	month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		date = g.getDate(date);
	
	var	rowData = [],
		viewHeight = g.disp.height;
	
	// 月の表示
	var monthBar = Ti.UI.createTableViewRow({
		height: viewHeight / 20,
		layout: 'horizontal'
	});
	addLabel(monthBar, [month[date.month]]);
	// 週の表示
	var weekBar = Ti.UI.createTableViewRow({
		height: viewHeight / 20,
		layout: 'horizontal'
	});
	addLabel(weekBar, week);
	rowData.push(monthBar, weekBar);
	
	viewHeight -= viewHeight / 10;
	
	// 日を載せる列の表示
	var lineNum = 6;
	var weekArr = [];
	for (var i = 0; i < lineNum; i++) {
		weekArr.push(
			Ti.UI.createTableViewRow({
				height: viewHeight / 6,
				borderWidth: 0,
				backgroundColor: "#fff",
				selectedBackgroundColor: "#fff",
				layout: 'horizontal'
			})
		);
	}
	
	// 日の表示
	var	days = date.days,
		ymd = date.ymd,
		nextMonthPaddingDays = date.nextMonthPaddingDays;
	
	place(weekArr, days);
	// 先月、来月部分の背景変更
	weekArr.forEach(function (item) {
		children = children.concat(item.getChildren());
	});
	children.slice(0, date.firstDay).forEach(function (child) {
		child.backgroundColor = "#ccc";
	});
	children.slice(- nextMonthPaddingDays).forEach(function (child) {
		child.backgroundColor = "#ccc";
	});
	
	tableView.data = rowData.concat(weekArr);
	
	tableView.addEventListener('reload', function () {
		controlEvent.erase();
		controlEvent.plot();
	});
	tableView.addEventListener('load', function () {
		if (eventItems.length === 0)
			controlEvent.plot(null, true);
	});
	win.addEventListener('blur', function () {
		controlEvent.erase();
		win.fireEvent('scv_blur', {m:month_d});
	});
	
	return tableView;
};