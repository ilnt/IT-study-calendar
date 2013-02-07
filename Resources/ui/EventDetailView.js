// Event View

var calendar = require("lib/calendar");

module.exports = function (o) {
	var g = this;
	
	var outer = Ti.UI.createView();
	
	var view = Ti.UI.createView({
		layout: 'vertical'
	});
	outer.add(view);
	
	var header = Ti.UI.createView({
		height: g.dip(50),
		backgroundColor: '#177bbd',
	});
	var headerLabel = Ti.UI.createLabel({
		height: g.dip(50),
		top: 0,
		left: g.dip(5),
		text: 'イベント詳細',
		color: '#fff',
		font: {fontSize: 18, fontWeight: 'bold'}
	});
	header.add(headerLabel);
	view.add(header);
	
	// set menu
	g.createMenu(outer, {}, true);
	
	function createTextLine(keyStr, valStr) {
		var key = Ti.UI.createLabel({
			top: 0,
			left: 5,
			height: 32,
			text: keyStr,
			color: '#222',
			font: {fontSize: 16}
		});
		view.add(key);
		var val = Ti.UI.createLabel({
			top: -27,
			left: 50,
			text: valStr,
			color: '#555',
			font: {fontSize: 16}
		});
		view.add(val);
		
		return {
			key: key,
			val: val
		};
	}
	
	function label(str, parent) {
		var text = Ti.UI.createLabel({
			left: 0,
			width: g.disp.width,
			text: str,
			color: '#222',
			font: {fontSize: 16}
		});
		(parent ? parent : view).add(text);
		return text;
	}
	
	// 2012-05-01T12:00:00.000+09:00 -> ['2012-05-01', '12:00'] OR 2012-05-01 -> ['2012-05-01', '']
	function dateFormat(date_str) {
		var date_arr = date_str.split('.')[0].split(':');
		date_arr = date_arr.length === 1
			? [date_arr, '']
			: date_arr.slice(0, -1).join(':').split('T');
		return date_arr;
	}
	
	var	d = {
			start: dateFormat(o.when.start),
			end: dateFormat(o.when.end),
			startTimeInMS: new Date(o.when.start).getTime(),
			endTimeInMS: new Date(o.when.end).getTime()
		},
		period = [],
		allday = false;
	// 終日指定の場合
	if (d.start[1] === '' && d.end[1] === '') {
		period[0] = new Date(d.start[0]).getTime();
		period[1] = new Date(d.end[0]);
		period[1].setDate(period[1].getDate() - 1);
		
		d.end[0] = [period[1].getFullYear(), period[1].getMonth() + 1, period[1].getDate()].join('-');
		
		period[1] = period[1].getTime();
		// １日だけの場合
		allday = period[0] === period[1];
	}
	var timeLabel = String(allday ? d.start[0] : d.start[0] + ' ' + d.start[1] + ' ~ ' + d.end[0] + ' ' + d.end[1]);
	
	var title = label(o.title);
	title.top = 3;
	title.font = {fontSize: 18};
	title.backgroundColor = '#f9f9f9';
	
	var hr = Ti.UI.createView({
		top: 3,
		height: 3,
		backgroundColor: '#177bbd'
	});
	view.add(hr);
	
	var time = createTextLine('時間 :', timeLabel);
	time.val.font = {fontSize: 15};
	time.val.color = '#555';
	var place = createTextLine('場所 :', o.where);
	var content = createTextLine('内容 :', o.content);
	content.val.height = 'auto';
	var link = label('Googleカレンダーへのリンク');
	link.top = 15;
	link.left = 5;
	link.color = '#04b';
	link.addEventListener('click', function () {
		Ti.Platform.openURL(o.link);
	});
	if (Ti.Platform.Android) {
		// Auto link
		content.val.autoLink = Titanium.UI.Android.LINKIFY_WEB_URLS;
		
		// 地図検索
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_VIEW,
			data: 'geo:0,0?q=' + encodeURIComponent(o.where)
		});
		chooser = Ti.Android.createIntentChooser(intent, 'アプリケーションを選択');
		place.val.color = '#04b';
		place.val.addEventListener('click', function () {
			Ti.Android.currentActivity.startActivity(chooser);
		});
		
		// intent の多重発行防止
		var intent_enable = true;
		var intent_call = function (callback) {
			if (intent_enable) {
				intent_enable = false;
				setTimeout(function () {
					intent_enable = true;
				}, 500);
				callback();
			}
		};
		
		// 共有
		var share = Ti.UI.createButton({
			title: '共有',
			top: 50,
			width: g.disp.width
		});
		view.add(share);
		var intent_share = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: 'text/plain'
		});
		intent_share.putExtra(Ti.Android.EXTRA_TEXT, o.title + ' #IT勉強会カレンダー');
		share.addEventListener('click', function () {
			intent_call(function () {
				Ti.Android.currentActivity.startActivity(intent_share);
			});
		});
		
		// カレンダーへ登録
		var cal = Ti.UI.createButton({
			title: 'カレンダーへ登録',
			top: 5,
			width: g.disp.width
		});
		view.add(cal);
		cal.addEventListener('click', function () {
			intent_call(function () {
				calendar.addEvent({
					"title": o.title,
					"location": o.where,
					"description": o.content,
					"timezone": "JST",
					"start": Number(d.startTimeInMS),
					"end": Number(d.endTimeInMS),
					"allday": allday
				});
			});
		});
	}
	
	return outer;
};