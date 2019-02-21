"use strict";
// 依赖表加载成功后的回调函数
winit.initNext = function () {
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;

	win.Map = 1;
	var flags = winit.flags;

	// console.log("init time:", Date.now() - startTime);
	// 清除运营商注入的代码
	var clear = function () {
		//清除window上新增的对象
		var k;
		for (k in window) {
			if (window.hasOwnProperty(k) && !win[k]) window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i,
			arr = document.body.children;
		for (i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if (!k.getAttribute("pi")) document.body.removeChild(k);
		}
	};
	//clear();

	pi_modules.depend.exports.init(winit.deps, winit.path);

	winit = undefined; //一定要立即释放，保证不会重复执行
	//先登录

	//二级页面相关的图片和代码资源
	TIME_STR += "before load time: " + (Date.now() - PRE_TIME);
	PRE_TIME = Date.now();
	var div = document.createElement('div');
	div.setAttribute("id", "pi")
	div.setAttribute("pi", "1");
	div.setAttribute("class", "process");
	// div.setAttribute("style", "position:absolute;bottom:10px;left: 2%;width: 95%;height: 10px;background: #262626;padding: 1px;border-radius: 20px;border-top: 1px solid #000;border-bottom: 1px solid #7992a8;z-index:9999;");
	var divProcess = document.createElement('div');
	var divProcessBg = document.createElement('div');
	var divProcessIcon = document.createElement('div');
	divProcess.setAttribute("style", "width: 0%;height: 100%;border-radius: 20px;position:relative");
	// divProcessBg.setAttribute("style", "width: 100%;height: 15px;background-size: 100% 100%;background-image:url(../res/common/sliderProgress.png)");
	// divProcessIcon.setAttribute("style", "width:50px;height:50px;background-size: 100% 100%;position:absolute;right:-30px;top:-15px;background-image:url(../res/common/slider.png)");
	divProcessIcon.setAttribute("class", "rotating")
	div.appendChild(divProcess);
	divProcess.appendChild(divProcessBg);
	divProcess.appendChild(divProcessIcon);
	var container = document.getElementById("process-container")
	if (container) {
		container.appendChild(div);
	}

	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	modProcess.show(function (r) {
		modProcess.value = r * 0.2;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function (r) {
		dirProcess.value = r * 0.8;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});

	


	
	var html,util,lang; // pi/util/html,pi/widget/util,pi/util/lang
	var fm;  // fileMap
	var fpFlags = {};  // 进入首页面的资源加载标识位
	var updateFlags = {}; // 更新标识位
	appCheckUpdate();
	h5CheckUpdate();

	// app下载入口函数
	var appLoadEntrance = function(){
		pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util","pi/util/lang"], {}, function (mods, tmpfm) {
			html = mods[0],
			util = mods[1],
			lang = mods[2];
			fm = tmpfm;
			const setting = JSON.parse(localStorage.getItem('setting'));
			lang.setLang(setting && setting.language || 'zh_Hans');  // 初始化语言为简体中文
	
			// 判断是否第一次进入,决定是显示片头界面还是开始界面
			var userinfo = html.getCookie("userinfo");
			pi_modules.commonjs.exports.flags = html.userAgent(flags);
			flags.userinfo = userinfo;
	
			/**
			 * 先判断浏览器对webp的支持；
			 * 加载所有的预处理图片
			 * 第一级目录：首页需要的资源；
			 * 第二级目录：其他；
			 * 
			 */
			html.checkWebpFeature(function (r) {
				flags.webp = flags.webp || r;
				loadWalletLoginSource();  // 登录相关
				loadImages();
				loadChatSource();  // 聊天
				loadEarnSource();  // 活动
				loadWalletFirstPageSource();  //钱包
			});
		}, function (result) {
			alert("加载基础模块失败, " + result.error + ":" + result.reason);
		}, modProcess.handler);
	}
	
	// 加载钱包项目登录相关资源
	var loadWalletLoginSource = function(){
		var sourceList = [
			"app/view/base/",
			"app/store/memstore.js",
			"app/net/login.js",
			"app/net/push.js",
			"earn/client/app/net/",
			"chat/client/app/net/init_1.js"
		];
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			console.log("load loadWalletLoginSource-----------------");
			// 聊天登录
			pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init_1").exports.registerRpcStruct(fm);
			// 活动注册
			pi_modules.commonjs.exports.relativeGet("earn/client/app/net/init").exports.registerRpcStruct(fm);
			// 钱包store初始化
			pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.initStore(); 
			// erlang服务器推送注册
			pi_modules.commonjs.exports.relativeGet("app/net/push").exports.initPush();
			// erlang服务器连接登录
			pi_modules.commonjs.exports.relativeGet("app/net/login").exports.openConnect();
			fpFlags.storeReady = true;
			enterApp();

			// loadChatSource();  // 聊天
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}
	
	// 加载一些需要预加载的图片
	var loadImages = function () {
		var suffixCfg = {
			png: 'down', jpg: 'down', jpeg: 'down', webp: 'down', gif: 'down'
		};

		util.loadDir(["app/res/image/currency/","app/res/image1/"], flags, fm, suffixCfg, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 加载钱包首页所需资源
	var loadWalletFirstPageSource = function () {
		// var routerPathList = calcRouterPathList();
		var sourceList = [
			"app/components1/",
			"app/res/css/",
			"app/res/js/",
			"app/view/play/home/",
			"app/view/chat/home/",
			"app/view/wallet/home/",
			"app/view/earn/home/",
			"app/view/ceshi/"
		];
		// sourceList = sourceList.concat(routerPathList);  
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
			console.log("load loadWalletFirstPageSource-----------------");
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			fpFlags.walletReady = true;
			enterApp();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 全部所需资源下载完成,进入app,显示界面
	var enterApp = function(){
		console.log(`storeReady = ${fpFlags.storeReady},chatReady = ${fpFlags.chatReady},earnReady = ${fpFlags.earnReady},walletReady = ${fpFlags.walletReady}`);
		if( fpFlags.storeReady && fpFlags.chatReady && fpFlags.earnReady && fpFlags.walletReady ){
			util.loadDir(["pi/ui/"], flags, fm, undefined, function (fileMap) {
				var tab = util.loadCssRes(fileMap);
				tab.timeout = 90000;
				tab.release();
				// debugger
				// 加载根组件
				var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
				root.cfg.full = false; //PC模式
				var index = pi_modules.commonjs.exports.relativeGet("app/view/base/main").exports;
				index.run(function () {
					// 关闭读取界面
					document.body.removeChild(document.getElementById('rcmj_loading_log'));
				});
				// loadImages();  // 预加载图片
				loadLeftSource();
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}
	}

	// 加载剩下的资源
	var loadLeftSource = function () {

		var level2SourceList = [
			"app/core/",
			"app/logic/",
			"app/components/",
			"app/res/",
			"app/api/",
			"app/view/",
			"chat/client/app/view/",
			"chat/client/app/widget/",
			"chat/client/app/res/",
			"earn/client/app/view/",
			"earn/client/app/test/",
			"earn/client/app/components/",
			"earn/client/app/res/"
		];

		// 加载其他文件
		util.loadDir(level2SourceList, flags, fm, undefined, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			// debugger;
			var setStore = pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.setStore;
			setStore('flags/level_2_page_loaded', true);
			console.timeEnd('all resource loaded');
			loadLeftImages();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}


	// 加载一些需要预加载的图片
	var loadLeftImages = function () {
		var suffixCfg = {
			png: 'down', jpg: 'down', jpeg: 'down', webp: 'down', gif: 'down'
		};

		util.loadDir(["app/res/image/","chat/client/app/res/images/","earn/client/app/res/image/"], flags, fm, suffixCfg, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 加载聊天代码
	var loadChatSource = function () {
		var sourceList = [
			"chat/client/app/view/chat/contact.tpl",
			"chat/client/app/view/chat/contact.js",
			"chat/client/app/view/chat/contact.wcss",
			"chat/client/app/view/chat/messageRecord.tpl",
			"chat/client/app/view/chat/messageRecord.js",
			"chat/client/app/view/chat/messageRecord.wcss",
			"chat/client/app/widget/topBar/topBar1.tpl",
			"chat/client/app/widget/topBar/topBar1.js",
			"chat/client/app/widget/topBar/topBar1.wcss",
			"chat/client/app/widget/utilList/",
			"chat/client/app/widget/imgShow/"
		]; 
		// var sourceList = [
		// 	"chat/client/app/view/chat/",
		// 	"chat/client/app/widget/"
		// ]; 
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
			console.log("load loadChatSource-----------------");
			var tab = util.loadCssRes(fileMap);
			// 将预加载的资源缓冲90秒，释放
			tab.timeout = 90000;
			tab.release();
			fpFlags.chatReady = true;
			enterApp();
			// loadEarnSource();  // 活动
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		},dirProcess.handler);
	}

	// 加载活动代码
	var loadEarnSource = function () {
		var sourceList = [
			"earn/client/app/view/home/",
			"earn/client/app/components/",
			"earn/client/app/view/activity/miningHome.tpl",
			"earn/client/app/view/activity/miningHome.js",
			"earn/client/app/view/activity/miningHome.wcss",
			"earn/client/app/view/activity/inviteAward.tpl",
			"earn/client/app/view/activity/inviteAward.js",
			"earn/client/app/view/activity/inviteAward.wcss",
			"earn/client/app/xls/",
			"earn/xlsx/"
		];
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			console.log("load loadEarnSource-----------------");
			// debugger
			fpFlags.earnReady = true;
			enterApp();
			// loadWalletFirstPageSource();  //钱包
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}



	// 检查h5更新
	function h5CheckUpdate(){
		// H5更新模块
		var h5UpdateMod = pi_modules.update.exports;
		// app更新模块
		var appUpdateMod = pi_modules.appUpdate.exports;
		h5UpdateMod.setIntercept(true);
		h5UpdateMod.setServerInfo("app/boot/");

		// 更新h5
		var updateH5 = function(){
			// 注：必须堵住原有的界面操作，不允许任何触发操作
			h5UpdateMod.update(function (e) {
				//{type: "saveFile", total: 4, count: 1}
				console.log("update progress: ", e);
				pi_update.updateProgress(e);
			});
		}

		// needUpdateCode  0 1 2 3 
		h5UpdateMod.checkUpdate(function (needUpdateCode) {
			if(needUpdateCode === 0){
				updateFlags.checkH5Update = true;
				updateFlags.checkAppUpdate && updateFlags.checkH5Update && appLoadEntrance();
			}else{
				// 判断当前app版本是否大于等于依赖的版本号
				var appLocalVersion = appUpdateMod.getAppLocalVersion();
				var canUpdate = false;
				if(appLocalVersion){  
					var dependAppVersionArr = h5UpdateMod.getDependAppVersion().split(".");
					var appLocalVersionArr = appUpdateMod.getAppLocalVersion().split(".");
					for(var i = 0;i < dependAppVersionArr.length;i++){
						if(i === dependAppVersionArr.length - 1){
							canUpdate = appLocalVersionArr[i] >= dependAppVersionArr[i];
							break;
						}
						if(appLocalVersionArr[i] < dependAppVersionArr[i]){
							canUpdate = false;
							break;
						}else if(appLocalVersionArr[i] > dependAppVersionArr[i]){
							canUpdate = true;
							break;
						}
					}
				}else{  // 还没获取到本地版本号  不更新
					canUpdate = false;
				}
				var remoteVersion = h5UpdateMod.getRemoteVersion();
				var option = {
					updated:h5UpdateMod.getH5Updated(),
					version:remoteVersion.slice(0,remoteVersion.length - 1).join(".")
				};

				if(canUpdate){
					pi_update.modifyContent(option);
					updateH5();
				}
				
			}
			
		});
	}
	// app更新检查
	function appCheckUpdate(){
		// 底层更新模块
		var appUpdateMod = pi_modules.appUpdate.exports;
		appUpdateMod.needUpdate(function (isNeedUpdate) {
			if (isNeedUpdate > 0) {
				var option = {
					updated:appUpdateMod.getAppUpdated(),
					version:appUpdateMod.getAppRemoteVersion(),
					alertBtnText:"App 需要更新"
				};
				pi_update.modifyContent(option);
				appUpdateMod.update(function (isSuccess) {
					pi_update.closePop();
					// alert("更新失败");
					console.log("appUpdate " + isSuccess);
				},function(total,process){
					console.log("total = " + total + " process = " + process);
					var e = { type: "saveFile", total: total, count: process};
					pi_update.updateProgress(e);
				});
				
			}else{
				updateFlags.checkAppUpdate = true;
				updateFlags.checkAppUpdate && updateFlags.checkH5Update && appLoadEntrance();
			}
		});
	}
};

// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps &&
		self.pi_modules &&
		self.pi_modules.butil &&
		self._babelPolyfill &&
		winit.initNext();
	!self._babelPolyfill && setTimeout(winit.init, 100);
})();
