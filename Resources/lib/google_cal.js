/**
 * lib/google_cal.js
 * Google Calendar Feed Parser
 */

function Cal(g) {
	var	baseURL = 'https://www.google.com/calendar/feeds/fvijvohm91uifvd9hratehf65k%40group.calendar.google.com/public/embed?alt=json',
		dataCache = {},
		predefined = {
			LAST_QUERY: null,
			CURRENT_QUERY: null
		};
	
	// character reference -> str
	var charref = (function () {
		var htmlEntities = {
				'&amp;'		: '&',
				'&gt;'		: '>',
				'&lt;'		: '<',
				'&nbsp;'	: ' ',
				'&quot;'	: '"'
			},
			pattern = /&#([0-9]+);/g,
			refconv = function (str, charCode) {
				return String.fromCharCode(charCode);
			};
		
		return function (str) {
			str = str.replace(pattern, refconv);
			Object.keys(htmlEntities).forEach(function (entity) {
				str = str.split(entity).join(htmlEntities[entity]);
			});
			return str;
		};
	})();
	
	// set GET query
	function queryString(query) {
		// call query
		if (typeof query === 'string') {
			var pred = predefined[query];
			query = pred ? pred : query;
		}
		predefined.LAST_QUERY = query;
		predefined.CURRENT_QUERY = query;
		var q = [];
		Object.keys(query).forEach(function (key, i) {
			if (i === 0) q[0] = '';
			q.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
		});
		query = q.join('&');
		return query;
	}
	// Google Calendar Object -> internal Object
	function format(obj) {
		obj = obj.feed;
		if (obj.generator.version !== '1.0') {
			g.alert("エラー", "新しい Google カレンダーに対応していない可能性があります。");
		}
		var calobj = {
			updated: obj.updated.$t,
			title: obj.title.$t,
			subtitle: obj.subtitle.$t,
			link: obj.link[0].href,
			author: [],
			openSearch: {
				totalResults: obj.openSearch$totalResults.$t,
				startIndex: obj.openSearch$startIndex.$t,
				itemsPerPage: obj.openSearch$itemsPerPage.$t
			},
			entry: []
		};
		obj.author.forEach(function (item, index) {
			calobj.author[index] = {
				name: item.name.$t,
				email: item.email && item.email.$t || null
			};
		});
		if (! (obj.entry instanceof Array))
			obj.entry = [];
		obj.entry.forEach(function (item, index) {
			eventobj = {
				id: item.id.$t,
				link: item.link[0].href,
				title: item.title.$t.trim(),
				content: item.content.$t.trim(),
				where: item.gd$where[0].valueString.trim(),
				when: {
					start: item.gd$when[0].startTime,
					end: item.gd$when[0].endTime,
					time: 0,
					allday: false
				}
			};
			
			// check allday & check time format
			if (!~ eventobj.when.start.indexOf("T")) {
				eventobj.when.start += "T00:00:00.000+09:00";
				eventobj.when.end += "T00:00:00.000+09:00";
				eventobj.when.allday = true;
			}
			eventobj.when.time = new Date(eventobj.when.start).getTime();
			
			// HTML entity decode
			eventobj.title = charref(eventobj.title);
			eventobj.content = charref(eventobj.content);
			
			// get Region
			var title = eventobj.title;
			try {
				var state = title.split(']')[0].split('[')[1].split('/');
				eventobj.state = {
					prefecture: state[0] || null,
					city: state[1] || null
				};
			} catch (e) {
				Ti.API.info('state split error');
				eventobj.state = {
					prefecture: null,
					city: null
				};
			}
			calobj.entry[index] = eventobj;
		});
		
		// obj.entry sort
		calobj.entry.sort(function (a, b) {
			return a.when.time - b.when.time;
		});
		
		return calobj;
	}
	// Region filter
	function filter(data) {
		var settings = g.config.settings;
		var region = g.config.load('region');
		if (region.length > 0) {
			data.entry = data.entry.filter(function (item) {
				// フィルタ対象の地域を回す
				return region.some(function (pref) {
					// 地域の検索対象文字列一覧を回す
					return settings.region.data[pref].some(function (pref) {
						// 検索文字列と等しい場合にTRUE
						return item.state.prefecture === pref;
					});
				});
			});
		}
		return data;
	}
	// get Google Calendar
	this.get = function (query, callback, cache) {
		Ti.API.info('Request: ' + JSON.stringify(query));
		query = queryString(query);
		// Cache
		if (typeof cache === "boolean" && cache) {
			// Cache check
			var data = dataCache[query];
			if (data) {
				data = filter(JSON.parse(data));
				// カレンダーUI有効時のみ
				if (g.enableCal)
					// ウィンドウが完全に表示される前に描画を始めると失敗する
					setTimeout(callback, 1000, data);
				else
					callback(data);
				return false;
			}
		}
		// Open loading view
		var loading = g.loading.window();
		loading.fireEvent('show');
		// HTTP Client
		var client = Ti.Network.createHTTPClient({
			onload: function (e) {
				var res = JSON.parse(this.responseText);
				var data = format(res);
				// Cache
				dataCache[query] = JSON.stringify(data);
				// Close loading view
				loading.fireEvent('hide');
				callback(filter(data));
			},
			onerror: function (e) {
				// Close loading view
				loading.fireEvent('hide');
				g.alert("エラー", "ネットワークエラー");
			},
			timeout: 5000
		});
		client.open('GET', baseURL + query);
		client.send();
	};
	// search Google Calendar
	this.search = function (query, search_str, callback) {
		var pred = predefined[query];
		query = pred ? pred : query;
		
		var a_Z = new RegExp('[A-Za-z0-9_]');
		search_str = search_str.split('').map(function (cha) {
			return a_Z.test(cha) ? cha : '\\' + cha;
		}).join('');
		
		Ti.API.info('search: ' + search_str);
		var regexp = new RegExp(search_str, 'i');
		
		this.get(query, function (res) {
			res = res.entry.filter(function (item) {
				//return ~ item.title.indexOf(search_str);
				return regexp.test(item.title);
			});
			callback(res);
		}, true);
	};
	// set current query
	this.setCurrentQuery = function (query) {
		predefined.CURRENT_QUERY = query;
	};
}

module.exports = function () {
	return new Cal(this);
};