/**
 * Calendar
 */

function Calendar() {
	this.addEvent = function (options) {
		var cals = Ti.Android.Calendar.allCalendars;
		var dialog = Ti.UI.createOptionDialog({
			title: "登録するカレンダーを選択してください",
			options: cals.map(function (cal) {return cal.name})
		});
		dialog.addEventListener("click", function (e) {
			if (e.index < 0)
				return false;
			
			cals[e.index].createEvent({
				"title": options.title,
				"location": options.location,
				"description": options.description,
				"begin": (new Date(options.start)).toLocaleString(),
				"end": (new Date(options.end)).toLocaleString(),
				"allDay": options.allday
			});
			
			alert("カレンダーに登録されました");
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
		intent_cal.putExtra("eventTimezone", options.timezone);
		intent_cal.putExtra("dtstart", options.start);
		intent_cal.putExtra("dtend", options.end);
		intent_cal.putExtra("allDay", options.allday);
		
		try {
			Ti.Android.currentActivity.startActivity(intent_cal);
		} catch (e) {
			alert('この操作を実行できるアプリケーションはありません。');
			Ti.API.debug('Intent: ' + JSON.stringify(e));
		}
	};
}

module.exports = new Calendar();