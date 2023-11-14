function s1() {
	$.ajax({
		type: "GET",
		url: "https://www.zcool.com.cn/",
		dataType: "jsonp", //跨域采用jsonp方式
		complete: (response) => {
			if (response.status == 200){
				window.location.href = "https://www.zcool.com.cn/u/17973793";
			}
			else{
				alert("您所在地区的网络无法访问Zcool");
			}
		}
	});
}

function s2() {
	$.ajax({
		type: "GET",
		url: "https://behance.com/",
		dataType: "jsonp", //跨域采用jsonp方式
		complete: (response) => {
			if (response.status == 200){
				window.location.href = "https://www.behance.net/dorafx"
			}
			else{
				alert("您所在地区的网络无法访问Behance");
			}
		}
	});
}

function s3() {
	$.ajax({
		type: "GET",
		url: "https://vimeo.com/",
		dataType: "jsonp", //跨域采用jsonp方式
		complete: (response) => {
			if (response.status == 200){
				window.location.href = "https://vimeo.com/user99520914"
			}
			else{
				alert("您所在地区的网络无法访问Vimeo");
			}
		}
	});
}

function s4() {
	
}

function s5() {
	$.ajax({
		type: "GET",
		url: "https://github.com/",
		dataType: "jsonp", //跨域采用jsonp方式
		complete: (response) => {
			if (response.status == 200){
				window.location.href = "https://github.com/dorafx";
			}
			else{
				alert("您所在地区的网络无法访问Github");
			}
		}
	});
}

function Language() {
	//判断浏览器的首选语言
	var language = navigator.language;
	console.log("11111", language)
	if (language == "zh-CN") {
		location.href = "中文网址";
	} else {
		location.href = "英文网址";
	}
}

function test() {
	var onSuccess = function(geoipResponse) {
		/* There's no guarantee that a successful response object
		 * has any particular property, so we need to code defensively. */
		if (!geoipResponse.country.iso_code) {
			return;
		}
		/* ISO country codes are in upper case. */
		var code = geoipResponse.country.iso_code.toLowerCase();
		document.getElementById('result').innerHTML = code;
	};
	var onError = function(error) {};
	return function() {
		geoip2.country(onSuccess, onError);
	};
}
