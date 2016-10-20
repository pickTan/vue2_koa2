/**
 * Created by pengfeng on 2016/10/17.
 */
var adaptUILayout = (function(){

//根据校正appVersion或userAgent校正屏幕分辨率宽度值
    var regulateScreen = (function(){
        var cache = {};

        //默认尺寸
        var defSize = {
            width  : window.screen.width,
            height : window.screen.height
        };

        var ver = window.navigator.appVersion;

        var _ = null;

        var check = function(key){
            return key.constructor == String ? ver.indexOf(key) > -1 : ver.test(key);
        };

        var add = function(name, key, size){
            if(name && key)
                cache[name] = {
                    key : key,
                    size : size
                };
        };

        var del = function(name){
            if(cache[name])
                delete cache[name];
        };

        var cal = function(){
            if(_ != null)
                return _;

            for(var name in cache){
                if(check(cache[name].key)){
                    _ = cache[name].size;
                    break;
                }
            }

            if(_ == null)
                _ = defSize;

            return _;
        };

        return {
            add : add,
            del : del,
            cal : cal
        };
    })();


//实现缩放
    var adapt = function(uiWidth){
        var
            deviceWidth,
            devicePixelRatio,
            targetDensitydpi,
            //meta,
            initialContent,
            head,
            viewport,
            ua;

        ua = navigator.userAgent.toLowerCase();
        //whether it is the iPhone or iPad
        isiOS = ua.indexOf('ipad') > -1 || ua.indexOf('iphone') > -1;

        //获取设备信息,并矫正参数值
        devicePixelRatio = window.devicePixelRatio;
        deviceWidth      = regulateScreen.cal().width;

        //获取最终dpi
        targetDensitydpi = uiWidth / deviceWidth * devicePixelRatio * 160;

        //use viewport width attribute on the iPhone or iPad device
        //use viewport target-densitydpi attribute on the Android device
        initialContent   = isiOS
            ? 'width='+ uiWidth +', user-scalable=no'
            : 'target-densitydpi=' + targetDensitydpi + ', width='+ uiWidth+', user-scalable=no';

        //add a new meta node of viewport in head node
        head = document.getElementsByTagName('head');
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = initialContent;
        head.length > 0 && head[head.length - 1].appendChild(viewport);
    };
    return {
        regulateScreen : regulateScreen,
        adapt : adapt
    };
})();
/*
 *640为当期页面指定的统一分辨率，其他分辨率下均为此分辨率的放缩变化
 */
adaptUILayout.adapt(640);
