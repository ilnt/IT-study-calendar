/**
 * lib/calendar.js
 * Calendar Event
 */

function Calendar(g) {
	if (Ti.Platform.Android) {
		this.addEvent = function (options) {
			var cals = Ti.Android.Calendar.allCalendars;
			var dialog = Ti.UI.createOptionDialog({
				title: "登録するカレンダーを選択してください。",
				options: cals.map(function (cal) {return cal.name})
			});
			dialog.addEventListener("click", function (e) {
				if (e.index < 0)
					return false;
				
				cals[e.index].createEvent(options);
				
				g.alert("カレンダー", "カレンダーに登録されました。");
			});
			dialog.show();
		};
		this.intent = function (options) {
			var intent_cal = Ti.Android.createIntent({
				action: Ti.Android.ACTION_EDIT,
				type: 'vnd.android.cursor.item/event'
			});
			intent_cal.putExtra("title", options.title);
			intent_cal.putExtra("eventLocation", options.location);
			intent_cal.putExtra("description", options.description);
			intent_cal.putExtra("eventTimezone", "JST");
			// JST -> UTC
			var timezoneOffset = 32400000;
			// It doesn't work.
			intent_cal.putExtra("beginTime", options.begin.getTime() - timezoneOffset);
			intent_cal.putExtra("endTime", options.end.getTime() - timezoneOffset);
			intent_cal.putExtra("allDay", options.allDay);
			
			try {
				Ti.Android.currentActivity.startActivity(intent_cal);
			} catch (e) {
				g.alert("Intent", 'この操作を実行できるアプリケーションはありません。');
			}
		};
	} else {
		var calendar_permisson = require('com.ti.calendar.permission'),
			calendar = require('com.gs.calendar');
		
		this.addEvent = function (options) {
			var eventDialog = calendar.createEventDialog(options);
			eventDialog.addEventListener("complete", function (e) {
				if (e.success) {
					g.alert("カレンダー", "カレンダーに登録されました。");
					Ti.API.info("Calendar: Success.");
				} else switch (e.action) {
					case eventDialog.CANCELED:
						Ti.API.info("Calendar: User has canceled the dialog.");
						break;
					case eventDialog.NOT_SUPPORTED:
						g.alert("カレンダー", "カレンダーへの登録には iOS 4 以降が必要です。");
						Ti.API.info("Calendar: EventKit is only supported on iOS 4 and newer.");
						break;
					case eventDialog.SAVED:
						g.alert("カレンダー", "カレンダーへの登録に失敗しました。再試行してください。");
						Ti.API.info("Calendar: Error while trying to save the event.");
						break;
				}
			});
			calendar_permisson.authorization({
				success: function () {
					eventDialog.open();
				},
				fail: function () {
					g.alert("プライバシー設定", "カレンダーへのアクセスが許可されていません。");
				}
			});
		};
	}
}

module.exports = function () {
	return new Calendar(this);
};