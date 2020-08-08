layui.use('carousel', function(){
	var carousel = layui.carousel;
	
	
	//全屏
	carousel.render({
		elem: '#carousel01'//指向容器选择器
		,width: '100%' //设置容器宽度
		,full:true //开启全屏轮播
		,arrow: 'always' //始终显示箭头
		,anim: 'fade' //切换动画方式
		,autoplay: false //是否自动切换false
		,arrow: 'hover' //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
		,indicator: 'none' //指示器位置||外部：outside||内部：inside||不显示：none
		,interval: '5000' //自动切换时间:单位：ms（毫秒）
	});
	
	
	//常规轮播
	carousel.render({
		elem: '#carousel02'//指向容器选择器
		,width: '100%' //设置容器宽度
		,height: '260px' //设置容器高度
		,arrow: 'always' //始终显示箭头
		,anim: 'fade' //切换动画方式
		,autoplay: true //是否自动切换false
		,arrow: 'hover' //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
		,indicator: 'none' //指示器位置||外部：outside||内部：inside||不显示：none
		,interval: '3000' //自动切换时间:单位：ms（毫秒）
	});
	
	
	//标题跟随主体轮播
	carousel.render({
		elem: '#carousel03'//指向容器选择器
		,width: '100%' //设置容器宽度
		,height: '260px' //设置容器高度
		,arrow: 'always' //始终显示箭头
		,anim: 'fade' //切换动画方式
		,autoplay: true //是否自动切换false
		,arrow: 'hover' //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
		,indicator: 'none' //指示器位置||外部：outside||内部：inside||不显示：none
		,interval: '5000' //自动切换时间:单位：ms（毫秒）
	});
	//监听轮播切换事件
	carousel.on('change(carouselVice)', function(obj){ //carouselVice来源于对应HTML容器的 lay-filter="carouselVice" 属性值
  		var indexCarousel = obj.index; //当前条目的索引
  		if(indexCarousel == 0){
  			$("#indexCarousel").html("标题跟随主体轮播");
  		}else if(indexCarousel == 1){
  			$("#indexCarousel").html("标题跟随主体轮播二");
  		}else if(indexCarousel == 2){
  			$("#indexCarousel").html("标题跟随主体轮播三");
  		}
  	});
	
	
	//向上常规轮播
	carousel.render({
		elem: '#carousel04'//指向容器选择器
		,width: '100%' //设置容器宽度
		,height: '260px' //设置容器高度
		,arrow: 'always' //始终显示箭头
		,anim: 'updown' //切换动画方式
		,autoplay: true //是否自动切换false
		,arrow: 'always' //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
		,indicator: 'none' //指示器位置||外部：outside||内部：inside||不显示：none
		,interval: '3000' //自动切换时间:单位：ms（毫秒）
	});
	
	
	//左右常规轮播
	carousel.render({
		elem: '#carousel05'//指向容器选择器
		,width: '100%' //设置容器宽度
		,height: '260px' //设置容器高度
		,arrow: 'always' //始终显示箭头
		,anim: 'default' //切换动画方式
		,autoplay: true //是否自动切换false
		,arrow: 'hover' //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
		,indicator: 'none' //指示器位置||外部：outside||内部：inside||不显示：none
		,interval: '3000' //自动切换时间:单位：ms（毫秒）
	});
	
	
	//自定义轮播内容
	carousel.render({
		elem: '#carousel06'//指向容器选择器
		,width: '100%' //设置容器宽度
		,height: '260px' //设置容器高度
		,arrow: 'always' //始终显示箭头
		,anim: 'default' //切换动画方式
		,autoplay: true //是否自动切换false
		,arrow: 'hover' //切换箭头默认显示状态||不显示：none||悬停显示：hover||始终显示：always
		,indicator: 'none' //指示器位置||外部：outside||内部：inside||不显示：none
		,interval: '3000' //自动切换时间:单位：ms（毫秒）
	});
	
});





