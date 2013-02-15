/**
 * lib/calendar.js
 * Calendar Event
 */

function Calendar(g) {
	if (Ti.Platform.Android) {
		var calendar_intent = require('com.ti.calendar.intent');
		
		this.addEvent = function (options) {
			// 全日設定時に日付がズレる問題の暫定的対処
			var adjustment = options.allDay ? 3600 * 10 * 1000 : 0;
			if ("beginTime" in options)
				options.beginTime = String(options.beginTime.getTime() + adjustment);
			if ("endTime" in options)
				options.endTime = String(options.endTime.getTime() + adjustment);
			
			calendar_intent.create(options);
		};
	} else {
		var calendar_permisson = require('com.ti.calendar.permission'),
			calendar = require('com.gs.calendar');
		
		this.addEvent = function (options) {
			if ("title" in options)
				options.eventTitle = options.title;
			if ("location" in options)
				options.eventLocation = options.location;
			if ("description" in options)
				options.eventNotes = options.description;
			if ("beginTime" in options)
				options.eventStartDate = options.beginTime;
			if ("endTime" in options)
				options.eventEndDate = options.endTime;
			if ("allDay" in options)
				options.eventAllDay = options.allDay;
			
			options.animated = true;
			options.barColor = "#000";
			
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