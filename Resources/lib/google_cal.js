/*
 * Google Calendar API
 */
function cal(g) {
	var	baseURL = 'https://www.google.com/calendar/feeds/fvijvohm91uifvd9hratehf65k%40group.calendar.google.com/public/embed?alt=json',
		dataCache = {},
		predefined = {
			LAST_QUERY: {}
		},
		config = require('/config/settings');
	
	function queryString(query) {
		// last use query
		predefined.LAST_QUERY = query;
		var q = [];
		Object.keys(query).forEach(function (key, i) {
			if (i === 0) q[0] = '';
			q.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
		});
		query = q.join('&');
		return query;
	}
	function format(obj) {
		obj = obj.feed;
		if (obj.generator.version !== '1.0') {
			alert("Googleカレンダーの仕様が変更された可能性があります。");
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
				email: item.email.$t
			};
		});
		if (! obj.entry instanceof Array)
			obj.entry = [];
		obj.entry.forEach(function (item, index) {
			eventobj = {
				id: item.id.$t,
				title: item.title.$t,
				content: item.content.$t,
				link: item.link[0].href,
				where: item.gd$where[0].valueString,
				when: {
					start: item.gd$when[0].startTime,
					end: item.gd$when[0].endTime
				}
			};
			var title = eventobj.title;
			try {
				var state = title.split(']')[0].split('[')[1].split('/');
				eventobj.state = {
					prefecture: state[0] || null,
					city: state[1] || null
				}
			} catch (e) {
				Ti.API.info('state split error');
				eventobj.state = {
					prefecture: null,
					city: null
				}
			}
			calobj.entry[index] = eventobj;
		});
		
		// obj.entry sort
		calobj.entry.sort(function (a, b) {
			return new Date(a.when.start).getTime() - new Date(b.when.start).getTime();
		});
		
		return calobj;
	}
	function filter(data) {
		// Region filter
		var settings = config.settings;
		var region = config.load('region');
		if (region.length > 0) {
			data.entry = data.entry.filter(function (item) {
				// フィルタ対象の地域を回す
				return region.some(function (pref) {
					// 地域の検索対象文字列一覧を回す
					return settings.Region[pref].some(function (pref) {
						// 検索文字列と等しい場合にTRUE
						return item.state.prefecture === pref;
					});
				});
			});
		}
		return data;
	}
	
	this.get = function (query, callback, cache) {
		// If offline
		/* これを使うと、b-mobile SIMなどで正常に動作しない
		if (Titanium.Network.online === false) {
			alert('ネットワークに接続されていません。');
			return false;
		}
		*/
		Ti.API.info('Request: ' + JSON.stringify(query));
		query = queryString(query);
		// Cache
		if (cache) {
			// Cache check
			var data = dataCache[query];
			if (data) {
				data = filter(JSON.parse(data));
				// ウィンドウが完全に表示する前に描画を始めると失敗する
				setTimeout(callback, 1000, data);
				return false;
			}
		}
		// Open loading view
		g.LoadingView.fireEvent('openBar');
		// HTTP Client
		var client = Ti.Network.createHTTPClient({
			ondatastream: function (e) {
				// Ti.API.info(e.progress);
				Ti.API.info(e.totalSize);
			},
			onload: function (e) {
				var res = JSON.parse(this.responseText);
				var data = format(res);
				// Cache
				dataCache[query] = JSON.stringify(data);
				// Close loading view
				g.LoadingView.fireEvent('closeBar');
				callback(filter(data));
			},
			onerror: function (e) {
				// Close loading view
				g.LoadingView.fireEvent('closeBar');
				alert('Network error.');
			},
			timeout: 5000
		});
		client.open('GET', baseURL + query);
		client.send();
	};
	this.search = function (query, search_str, callback) {
		var pred = predefined[query];
		query = pred ? pred : query;
		
		var regexp = new RegExp(search_str, "i");
		
		this.get(query, function (res) {
			res = res.entry.filter(function (item) {
				//return ~ item.title.indexOf(search_str);
				return regexp.test(item.title);
			});
			callback(res);
		}, true);
	};
};