function closebutton() {
	$(".single").hide();
}

function closebuttonvideo() {
	$(".single-video").hide();
	$('#SVideo').get(0).pause();
}

function closebuttonlink() {
	$(".single-linksource").hide();
	$('#SVideo2').get(0).pause();
}

function p1() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/01.webp");
}

function p2() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/02.webp");
}

function p3() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/03.webp");
}

function p4() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/04.webp");
}

function p5() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/05.webp");
}

function p6() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/06.webp");
}

function p7() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/07.webp");
}

function p8() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/08.webp");
}

function p9() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/09.webp");
}

function p10() {
	window.location.href = "floatbeacon.html";
}

function p11() {
	$(".single-video").show();
	$("#SVideo").attr("src", "https://demoreel-video.vercel.app/2035.mp4");
	$("#SVideo").attr("poster", "images/works/11.webp");
}

function p12() {
	$(".single-video").show();
	$("#SVideo").attr("src", "https://demoreel-video.vercel.app/DEMOREEL_x264.mp4");
	$("#SVideo").attr("poster", "images/works/12.webp");
}

function p13() {
	$(".single-video").show();
	$("#SVideo").attr("src", "https://demoreel-video.vercel.app/third-party-assets.mp4");
	$("#SVideo").attr("poster", "images/works/13.webp");
}

function p14() {
	window.location.href = "gallery/index.html";
}

function p15() {
	$(".single-video").show();
	$("#SVideo").attr("src", "https://demoreel-video.vercel.app/JNU60.mp4");
	$("#SVideo").attr("poster", "images/works/15.webp");
}

function p16() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/16.webp");
}

function p17() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/17.webp");
}

function p18() {
	window.location.href = "goodcloud.html";
}

function p19() {
	window.location.href = "forgotsth.html";
}

function p20() {
	window.location.href = "https://dorafx.top/3page/cd/index.html";
}

function p21() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/21.webp");
}

function p22() {
	window.location.href = "newyeargala.html";
}

function p23() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/23.webp");
}

function p24() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/24.webp");
}

function p25() {
	$(".single").show();
	$("#SImg").attr("src", "images/works/25.webp");
}

function p26() {
	setTimeout(function(){
		$(".single-linksource").show();
		$(".single-linksource-h").html("Minecraft Theatre");
		$(".single-linksource-p").html("前段时间我参与了一个剧院项目的建模工作，所以最近对剧院的设计布局开始感兴趣。这两天在休息的时候，玩Minecraft的同时建了一个剧院……");
		$(".single-linksource-h6").html("请选择作品预览平台:");
		$("#btnlink1").html("Zcool");
		$("#btnlink2").html("Behance");
		$("#btnlink1").attr("href","https://www.zcool.com.cn/work/ZNTkzOTE0NTY=.html");
		$("#btnlink2").attr("href","https://www.behance.net/gallery/142211397/Minecraft-Theatre");
		$("#btnlink3").hide();
		$("#btnlink4").hide();
	},50);
}

function p27() {
	setTimeout(function(){
		$(".single-linksource").show();
		$(".single-linksource-h").html("Motion Graphic Design");
		$(".single-linksource-p").html("可能是2023年的C4D结课作业");
		$(".single-linksource-h6").html("其他平台查看:");
		$("#single-linksource-h6").hide();
		$("#btnlink1").html("Zcool");
		$("#btnlink1").attr("href","https://www.zcool.com.cn/work/ZNjA3NjUyNTI=.html");
		$("#btnlink2").html("Behance");
		$("#btnlink2").attr("href","https://www.behance.net/gallery/147530811/Motion-Graphic-Design");
		$("#btnlink3").html("Bilibili");
		$("#btnlink3").attr("href","https://www.bilibili.com/video/BV14f4y1Z71r");
		$("#btnlink4").hide();
		$("#slvideo").show();
		$("#SVideo2").attr("src", "https://demoreel-video.vercel.app/cursor.mp4");
		$("#SVideo2").attr("poster", "images/works/27.webp");
	},50);
}