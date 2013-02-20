/**
 * ui/EventDetailView.js
 * Event Detail View
 */

module.exports = function (o) {
	var g = this;
	
	var outer = Ti.UI.createView();
	
	var view = Ti.UI.createView({
		layout: 'vertical'
	});
	outer.add(view);
	
	var header = Ti.UI.createView({
		height: g.dip(50),
		backgroundColor: '#177bbd'
	});
	var headerLabel = Ti.UI.createLabel({
		height: g.dip(50),
		top: 0,
		left: g.dip(5),
		text: 'イベント詳細',
		color: '#fff',
		font: {fontSize: g.dip(18), fontWeight: 'bold'}
	});
	header.add(headerLabel);
	view.add(header);
	
	var menu = {
		"カレンダーへ登録": {
			click: function () {
				g.calendar.addEvent({
					title: o.title,
					location: o.where,
					description: o.content,
					beginTime: new Date(o.when.start),
					endTime: new Date(o.when.end),
					allDay: o.when.allday
				});
			}
		}
	};
	
	function createTextLine(keyStr, valStr) {
		var key = Ti.UI.createLabel({
			top: 0,
			left: g.dip(5),
			height: g.dip(32),
			text: keyStr,
			color: '#222',
			font: {fontSize: g.dip(16)}
		});
		view.add(key);
		var val = Ti.UI.createLabel({
			top: g.dip(-27),
			left: g.dip(50),
			text: valStr,
			color: '#555',
			font: {fontSize: g.dip(16)}
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
			width: Ti.UI.FILL,
			text: str,
			color: '#222',
			font: {fontSize: g.dip(16)}
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
			end: dateFormat(o.when.end)
		};
	
	if (o.when.allday)
		d.start[1] = d.end[1] = "";
	var timeLabel = String(d.start[0] + ' ' + d.start[1] + ' ~ ' + d.end[0] + ' ' + d.end[1]);
	
	var title = label(o.title);
	title.top = g.dip(3);
	title.font = {fontSize: g.dip(18)};
	title.backgroundColor = '#f9f9f9';
	
	var hr = Ti.UI.createView({
		top: g.dip(3),
		height: g.dip(3),
		backgroundColor: '#177bbd'
	});
	view.add(hr);
	
	var time = createTextLine('時間 :', timeLabel);
	time.val.font = {fontSize: g.dip(15)};
	time.val.color = '#555';
	var place = createTextLine('場所 :', o.where || " ");
	var content = createTextLine('内容 :', o.content || " ");
	content.val.height = 'auto';
	var link = label('Googleカレンダーへのリンク');
	link.top = g.dip(15);
	link.left = g.dip(5);
	link.color = '#04b';
	link.addEventListener('click', function () {
		Ti.Platform.openURL(o.link);
	});
	
	// share message
	var message = o.title + ' ' + o.link + ' #IT勉強会カレンダー';
	
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
		var intent_share = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: 'text/plain'
		});
		intent_share.putExtra(Ti.Android.EXTRA_TEXT, message);
		menu["共有"] = {
			click: function () {
				intent_call(function () {
					Ti.Android.currentActivity.startActivity(intent_share);
				});
			}
		};
	} else {
		menu["Twitter 共有"] = {
			click: function () {
				var canOpen = Ti.Platform.openURL('twitter://post?message=' + encodeURIComponent(message));
				if (! canOpen) {
					var dialog = g.alert('Twitter 共有', 'Twitter 公式アプリが必要です。');
					dialog.addEventListener("click", function () {
						Ti.Platform.openURL('https://itunes.apple.com/ja/app/twitter/id333903271');
					});
				}
			}
		};
	}
	
	// set menu
	g.createMenu(outer, menu, true);
	
	return outer;
};