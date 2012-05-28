// Event View
module.exports = function (g, o) {
	var view = Ti.UI.createView({
		layout: 'vertical'
	});
	
	function label(str) {
		var text = Ti.UI.createLabel({
			top: 10,
			left: 0,
			text: str,
			color: '#000',
			font: {fontSize: 16}
		});
		view.add(text);
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
	var time = label(timeLabel);
	var title = label('タイトル: ' + o.title);
	var place = label('場所: ' + o.where);
	var content = label('内容: ' + o.content);
	var link = label(' Googleカレンダーへのリンク');
	link.color = '#04b';
	link.addEventListener('click', function () {
		Ti.Platform.openURL(o.link);
	});
	if (g.android) {
		// Auto link
		content.autoLink = Titanium.UI.Android.LINKIFY_WEB_URLS;
		
		// 地図検索
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_VIEW,
			data: 'geo:0,0?q=' + encodeURIComponent(o.where)
		});
		chooser = Ti.Android.createIntentChooser(intent, 'アプリケーションを選択');
		place.color = '#04b';
		place.addEventListener('click', function () {
			Ti.Android.currentActivity.startActivity(chooser);
		});
		
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
			Ti.Android.currentActivity.startActivity(intent_share);
		});
		
		// カレンダーへ登録
		var cal = Ti.UI.createButton({
			title: 'カレンダーへ登録',
			top: 5,
			width: g.disp.width
		});
		view.add(cal);
		var intent_cal = Ti.Android.createIntent({
			action: Ti.Android.ACTION_EDIT,
			type: 'vnd.android.cursor.item/event'
		});
		intent_cal.putExtra("title", o.title);
		intent_cal.putExtra("eventLocation", o.where);
		intent_cal.putExtra("description", o.content);
		intent_cal.putExtra("startTime", new Date(o.when.start).getTime());
		intent_cal.putExtra("endTime", new Date(o.when.end).getTime());
		intent_cal.putExtra("dtstart", new Date(o.when.start).getTime());
		intent_cal.putExtra("dtend", new Date(o.when.end).getTime());
		intent_cal.putExtra("allDay", allday);
		cal.addEventListener('click', function () {
			try {
				Ti.Android.currentActivity.startActivity(intent_cal);
			} catch (e) {
				alert('この操作を実行できるアプリケーションはありません。');
				Ti.API.debug('Intent: ' + JSON.stringify(e));
			}
		});
	}
	
	return view;
};