/*version 14.08.01*/
'use strict';
var Language = 'English';
var IsDebug = false;
var IsDevelop = true;
var IsCheckTarget = true;
var SectionMain = 'divMain';
var SectionQuick = 'divQuick';
var SectionScript = 'script';
const CsVersion = '14.08.01';
const CsVersionDate = '2024/06/10';
var CsConfirm = "Are you sure?";
var CsBack = 'Back';
var CsSendData = 'Sending and Receiving Data';
var CsSendingData = 'Sending and Receiving Data';
var CsLoadData = 'Data Loading';
var CsLoadingData = 'Data Loading';
var CsComplete = 'Complete';
//Global Variable
var MaxScreenWidth = 0;
var MaxScreenHeight = 0;
const ESCAPE_KEY = 27 // Escape (Esc) key
const SPACE_KEY = 32 // space key
const TAB_KEY = 9 //  tab key
const ENTER_KEY = 13 //  enter key
const BACKSPACE_KEY = 8 //  backspace key
const DELETE_KEY = 127 //  delete key
const ARROW_LEFT_KEY = 37 // left arrow key
const ARROW_UP_KEY = 38 // up arrow key
const ARROW_RIGHT_KEY = 39 // right arrow key
const ARROW_DOWN_KEY = 40 // down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
/* Control Request*/
const BANNED_REQUESTS = 200;
const REDUCTION_INTERVAL = 200; // 1 second
const RELEASE_INTERVAL = 2 * 60 * 1000; // 2 minutes
/* virtualHost */
var virtualHost = '';
/*** Base Of Platform ***/
//Platform - UltraCode - UltraForm - UltraCookie - UltraStorage - UltraLanguage

/** Platform **/
const Platform = new function () {
    this.RequestTimer = null;
    this.RequestCount = 0;
    //PlatformActive
    this.platformActive = function (status) {
        var element = _('.sp-platform', false);
        if ((element != null) && (typeof element.classList != 'undefined')) {
            //change Status
            if (typeof status !== 'undefined') {
                if ((element.classList.contains('sp-platform-error')) ||
                    (element.classList.contains('sp-platform-warning')))
                    return;
                if (status == true)
                    element.classList.add('sp-platform-active');
                else if (status == 'error') {
                    if (element.classList.contains('sp-platform-active'))
                        element.classList.remove('sp-platform-active');
                    element.classList.add('sp-platform-error');
                }
                else if (status == 'warning') {
                    if (element.classList.contains('sp-platform-active'))
                        element.classList.remove('sp-platform-active');
                    element.classList.add('sp-platform-warning');
                }
            }
            else {
                if (element.classList.contains('sp-platform-active'))
                    element.classList.remove('sp-platform-active');
                if (Platform.RequestTimer == null)
                    Platform.RequestTimer = setInterval(Platform.platformTimer, REDUCTION_INTERVAL);
                Platform.RequestCount++;

                if (Platform.RequestCount >= BANNED_REQUESTS)
                    status = 'error';
                else if (Platform.RequestCount >= (BANNED_REQUESTS / 2))
                    status = 'warning';

                if (status == 'error')
                    element.classList.add('sp-platform-error');
                else if (status == 'warning')
                    element.classList.add('sp-platform-warning');
            }
        }
    }

    this.platformTimer = function () {
        Platform.RequestCount--;
        var element = _('.sp-platform', false);
        if ((element != null) && (typeof element.classList != 'undefined')) {
            if ((Platform.RequestCount <= BANNED_REQUESTS) && (Platform.RequestCount >= (BANNED_REQUESTS / 2))) {
                if (element.classList.contains('sp-platform-error'))
                    element.classList.remove('sp-platform-error');
                element.classList.add('sp-platform-warning');
            }
            else if (Platform.RequestCount <= (BANNED_REQUESTS / 2)) {
                if (element.classList.contains('sp-platform-warning'))
                    element.classList.remove('sp-platform-warning');
                element.classList.add('sp-platform-active');
            }
        }
        if (Platform.RequestCount == 0) {
            clearInterval(Platform.RequestTimer);
            Platform.RequestTimer = null;

            if ((element != null) && (typeof element.classList != 'undefined')) {
                if (element.classList.contains('sp-platform-error'))
                    element.classList.remove('sp-platform-error');
                if (element.classList.contains('sp-platform-warning'))
                    element.classList.remove('sp-platform-warning');
            }
        }
    }

    this.PlatformStatus = function (targetId, status, UltraType) {
        if (typeof status !== 'undefined') {
            if (Platform.ClearTimer != null) {
                clearTimeout(Platform.CloseTimer);
                Platform.CloseTimer = null;
            }
            if (_('.sp-platform-status', false) != null) {
                _('.sp-platform-status').innerHTML = status;
                return true;
            }
            else if (_(targetId, false) != null) {
                if ((!Platform.CheckScript(targetId)) && (targetId != SectionMain)) {
                    if (typeof UltraType !== 'undefined') {
                        if (UltraType.toLowerCase() != 'refresh')
                            _(targetId).innerHTML = status;
                    }
                    else
                        _(targetId).innerHTML = status;
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        }
        else {
            Platform.CloseTimer = setTimeout(function () {
                clearTimeout(Platform.CloseTimer);
                Platform.CloseTimer = null;
                if (_('.sp-platform-status', false) != null)
                    _('.sp-platform-status').innerHTML = '';
            }, 10000);
        }
    }
    this.loadCss = function (Value, Name) {
        var objHead = document.getElementsByTagName('head');
        if (objHead[0]) {
            var objCSS = objHead[0].appendChild(document.createElement('link'));
            objCSS.id = Name;
            objCSS.rel = 'stylesheet';
            objCSS.href = Value;
            objCSS.type = 'text/css';
        }
    }
    this.animate = function (element, Animation, callback) {
        const node = _(element);
        if (node !== null) {
            node.classList.add('animated', Animation)
            function handleAnimationEnd() {
                node.classList.remove('animated', Animation)
                node.removeEventListener('animationend', handleAnimationEnd)
                if (typeof callback === 'function') callback()
            }
            node.addEventListener('animationend', handleAnimationEnd)
        }
    }
    var UltraScript = new Array();
    this.importScript = function (urls, callBack, force) {
        if (urls.length > 0) {
            for (var i = 0; i < urls.length; i++) {
                var newurl = true;
                for (var s = 0; s < UltraScript.length; s++)
                    if (UltraScript[s].url == urls[i])
                        newurl = false;
                if ((newurl) && (urls[i] != ''))
                    UltraScript.push({ url: urls[i], isload: null, isforce: force });
            }
        }
        this.loadScript(callBack)
    }
    this.loadScript = function (callBack) {
        var url = '';
        var index;
        //isforce
        for (var i = 0; i < UltraScript.length; i++)
            if ((UltraScript[i].isload == null) && (UltraScript[i].isforce == true)) {
                url = UltraScript[i].url;
                UltraScript[i].isload = false;
                index = i;
                break;
            }
        if (url == '')
            for (var i = 0; i < UltraScript.length; i++)
                if (UltraScript[i].isload == null) {
                    url = UltraScript[i].url;
                    UltraScript[i].isload = false;
                    index = i;
                    break;
                }
        if (url != '') {
            /* Adding the script tag to the head as suggested before*/
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (typeof index != 'undefined') {
                if (script.readyState) {  //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == 'loaded' || script.readyState == 'complete') {
                            script.onreadystatechange = null;
                            if (UltraScript[index] != undefined)
                                UltraScript[index].isload = true;
                            Platform.loadScript(callBack);
                        }
                    };
                } else {  //Others
                    script.onload = function () {
                        if (UltraScript[index] != undefined)
                            UltraScript[index].isload = true;
                        Platform.loadScript(callBack);
                    };
                    // Catch any errors while loading the script
                    script.addEventListener('error', function () {
                        Platform.showLog(Platform.Language('ErrorFailedLoad') + url, 'error');
                        Platform.loadScript(callBack);
                    });
                }
            }
            script.src = url;
            script.async = false; // optionally
            /* Fire the loading*/
            var head = document.head || document.getElementsByTagName('head')[0];
            if (head != null)
                head.appendChild(script);
        }
        else if (typeof callBack == 'function')
            callBack();
    }
    this.initialFunctions = function (Function) {
        var Functions = Function.split('|');
        for (var no = 0; no < Functions.length; no++)
            if (Functions[no].trim() != '')
                Functions[no] = '/javascript/functions/' + Functions[no].trim() + '.js?ver=' + CsVersion;
        Platform.importScript(Functions, function () {
            Platform.showLog(Platform.Language('InstallFunctions'), 'info');
            if (IsDebug) console.log(Functions);
        });
    }
    this.initialPlugins = function (Plugin) {
        var Plugins = Plugin.replaceAll(',', '|').split('|');
        for (var no = 0; no < Plugins.length; no++)
            if (Plugins[no].trim() != '')
                Plugins[no] = '/javascript/plugins/' + Plugins[no].trim() + '/initial.js?ver=' + CsVersion;
        Platform.importScript(Plugins, function () {
            Platform.showLog(Platform.Language('InstallPlugins'), 'info');
            if (IsDebug) console.log(Plugins); _RunReady(document, true);
        });
    }

    this.executeScript = function (scriptElements, target) {
        var scripts = Array.prototype.slice.call(scriptElements);
        var Urls = [];
        scripts.forEach(function (item) {
            if (item.src != '')
                Urls.push(item.src);
        });
        Platform.importScript(Urls, function () {

            scripts.forEach(function (item) {
                try {
                    if (item.src == '')
                        window.eval(item.textContent);
                }
                catch (err) {
                    Platform.showLog(Platform.Language('executeScript'), 'warning', err);
                }
            });
            if (_ReadyPlatform) {
                if (target != null)
                    _RunReady(target);
                else
                    _RunReady();
            }
        });
    }

    this.parseScriptById = function (element, targetId) {
        var target = null;
        if (typeof targetId == 'undefined')
            target = _(element);
        else
            target = UltraCode.getTarget(element, targetId);

        if ((target != null) && (typeof target.getElementsByTagName !== 'undefined'))
            Platform.executeScript(target.getElementsByTagName('script'), target);
        else
            _RunReady();
    }

    this.parseScript = function (_source) {
        var doc = new DOMParser().parseFromString(_source, 'text/html');

        if ((doc != null) && (typeof doc.getElementsByTagName !== 'undefined'))
            Platform.executeScript(doc.getElementsByTagName('script'), null);
    }
    this.history = function (Param) {
        //Param = Param.toLowerCase().replace('_acttype=page&', '').replace('_acttype=act&', '');
        if (history.pushState !== undefined) {
            history.pushState(Param, document.title, Param);
            history.replaceState(Param, document.title, Param);
        }
    }
    this.CheckScript = function (targetId) {
        return (typeof targetId === 'undefined') || (targetId == null) ||
            (targetId.toLowerCase() == 'divscript') || (targetId.toLowerCase() == 'script');
    }

    this.Run = function (Url, config) {
        try {
            Platform.platformActive();
            var element = null;
            if (config.element != undefined) {
                element = config.element;
                if (element.classList != null)
                    element.classList.add('sp-ultra-wait');
            }
            var responseType = '';
            var contentType = '';
            var param = '';
            var callback;
            var success;
            var error;
            var targetId;
            config.url = Url;
            if (config.param != undefined)
                param = config.param;
            if (config.callback != undefined)
                callback = config.callback;
            if (config.success != undefined)
                success = config.success;
            if (config.error != undefined)
                error = config.error;
            if (config.id != undefined)
                targetId = config.id;
            if (config.responseType != undefined)
                responseType = config.responseType;
            if (config.contentType != undefined)
                contentType = config.contentType;


            if (Url.startsWith('/')) {
                if (Url.indexOf('?') != -1) {
                    param = Url.substring(Url.indexOf('?') + 1) + '&' + param;
                    Url = Url.substring(0, Url.indexOf('?'));
                }
            }
            else {
                if (param != '')
                    param = 'act=' + Url + '&' + param;
                else
                    param = 'act=' + Url;
                Url = '/';
            }
            //default division in page
            if ((typeof targetId !== 'undefined') && (targetId == '') && (_(SectionMain, false) != null))
                targetId = SectionMain;

            /*Check target*/
            if ((IsCheckTarget) && (!Platform.CheckScript(targetId)) && (_(targetId) == null) &&
                (typeof config.create == 'undefined') && (!config.create)) {
                Platform.showLog(Platform.Language('PleaseCheckTarget'), 'error', 'target:' + targetId);
            }
            else {
                /*run Action not Page*/
                if ((param == null) || (param.toLowerCase().indexOf('_acttype=') == -1))
                    param += '&_acttype=act';
                //add target id
                if (targetId != '')
                    param += '&_target=' + encodeURIComponent(targetId);
                //add element id
                if ((element != null) && (UltraCode.getAttribute(element, 'ultra-id', null) != null))
                    param += '&_element=' + encodeURIComponent(UltraCode.getAttribute(element, 'ultra-id', null));
                //add Browser Information
                if ((typeof navigator !== 'undefined') && (typeof navigator.userAgent !== 'undefined'))
                    param += '&_browser=' + encodeURIComponent('{name:' + navigator.userAgent + ',width:' + window.innerWidth + ',height:' + window.innerHeight + '}');
                //add platform State
                if ((typeof Platform.UltraState !== 'undefined') && (Platform.UltraState != null) && (Platform.UltraState.length > 0))
                    param += '&_state=' + encodeURIComponent(Platform.jsonState());
                //add referer Page
                if (typeof window.location !== 'undefined')
                    param += '&_referer=' + encodeURIComponent(window.location.pathname);
                //javascript version
                param += '&_version=' + CsVersion;

                /*Run Ajax */
                var ajaxIndex = dynamicContent_ajaxObjects.length;
                dynamicContent_ajaxObjects[ajaxIndex] = new sack();
                var items = param.split(/&/g);
                for (var no = 0; no < items.length; no++) {
                    var tokens = items[no].split('=');
                    if (tokens.length == 2)
                        dynamicContent_ajaxObjects[ajaxIndex].setVar(tokens[0], tokens[1]);
                }
                dynamicContent_ajaxObjects[ajaxIndex].requestFile = virtualHost + Url;
                if (responseType != '')
                    dynamicContent_ajaxObjects[ajaxIndex].responseType = responseType;
                if (contentType != '')
                    dynamicContent_ajaxObjects[ajaxIndex].contentType = contentType;

                dynamicContent_ajaxObjects[ajaxIndex].onCompletion = function () {
                    if (IsDebug)
                        console.log(dynamicContent_ajaxObjects[ajaxIndex]);

                    config.responseType = dynamicContent_ajaxObjects[ajaxIndex].responseType;
                    config.responseURL = dynamicContent_ajaxObjects[ajaxIndex].responseURL;
                    callback(element, targetId, dynamicContent_ajaxObjects[ajaxIndex].response, config);
                    if ((success !== undefined) && (typeof success === 'function'))
                        success(element, targetId, dynamicContent_ajaxObjects[ajaxIndex].response, config);
                    dynamicContent_ajaxObjects[ajaxIndex] = false;
                };
                dynamicContent_ajaxObjects[ajaxIndex].onError = function () {
                    if ((typeof error !== 'undefined') && (typeof error === 'function'))
                        error(element, targetId, dynamicContent_ajaxObjects[ajaxIndex].response, config);
                    else if (dynamicContent_ajaxObjects[ajaxIndex].response == '')
                        dynamicContent_ajaxObjects[ajaxIndex].response = showError(dynamicContent_ajaxObjects[ajaxIndex].response);
                    Platform.StopWaiting(element, targetId, '');
                    UltraCode.setValue(element, targetId, dynamicContent_ajaxObjects[ajaxIndex].response);
                    dynamicContent_ajaxObjects[ajaxIndex] = false;
                };
                dynamicContent_ajaxObjects[ajaxIndex].runAJAX();
            }
            return true;
        }
        catch (err) {
            Platform.showLog(Platform.Language('ErrorOpenUrl'), 'error', err);

            return false;
        }
    }

    this.RunAjax = function (element, targetId, response, config) {
        if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
            element.classList.remove('sp-ultra-wait');

        if (Platform.CheckScript(targetId))
            Platform.parseScript(response);
        else {
            var target = UltraCode.getTarget(element, targetId);
            if (target != null) {
                UltraCode.setValue(element, target, response);
                Platform.parseScriptById(element, target);
            }
            else if ((typeof config !== 'undefined') && (typeof config.create !== 'undefined') && (config.create)) {
                var div = document.createElement('div');
                div.innerHTML = response;
                div.id = targetId;
                document.body.appendChild(div);
                Platform.parseScriptById(element, targetId);
            }
            else if (IsCheckTarget)
                Platform.showLog(Platform.Language('PleaseCheckTarget'), 'error', 'target:' + targetId);
        }
        //Enabled element
        UltraCode.setEnable(element);
    }
    this.iOS = function () {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    //Show Notice -> option is json()
    //{closebutton:'false',timeout:2000,position:'top/top-right'}
    this.ShowNotice = function (type, Title, Message, Option) {
        try {
            var close = true;
            var closebutton = true;
            var position = 'sp-top-right';
            var animation = 'fadeInDown';
            var timeOut = 3000;
            if (type == '')
                type = 'info';
            else if (type.toLowerCase() == 'information')
                type = 'info';
            if (Option !== undefined) {
                if (Option.closebutton !== undefined)
                    closebutton = Option.closebutton;
                if (Option.close !== undefined)
                    close = Option.close;
                if (Option.position !== undefined)
                    position = Option.position;
                if (Option.timeOut !== undefined)
                    timeOut = Option.timeOut;
            }
            var notiParent = _('divNotice', 'create');
            if ((notiParent.innerHTML == null) || (notiParent.innerHTML.trim() == '')) {
                notiParent.className = '';
                notiParent.classList.add('sp-notice');
                if (position.indexOf('top') > 0)
                    notiParent.classList.add('sp-notice-top');
                else
                    notiParent.classList.add('sp-notice-bottom');

                if (position.indexOf('right') > 0)
                    notiParent.classList.add('sp-notice-right');
                else if (position.indexOf('left') > 0)
                    notiParent.classList.add('sp-notice-left');
                else
                    notiParent.classList.add('sp-notice-center');
            }
            var notiClass = 'sp-notice-' + type.toLowerCase() + ' ' + animation;//animated
            var notiElm = 'divNotice' + _Notice;
            var notiClose = '';
            if (closebutton)
                notiClose = "<img class='sp-notice-close' src='/themes/base/images/white/close.png' ultra-role='remove' />";
            notiParent.innerHTML += "<div id='" + notiElm + "' class='sp-notice-item " + notiClass + "' ultra-role='remove'>" + notiClose +
                "<div class='sp-notice-image'><img src='/themes/base/images/white/" + type.toLowerCase() + ".svg' /></div>" +
                "<div class='sp-notice-text'><div class='sp-notice-title'>" + Title + "</div><div>" + Message + "</div></div></div>";
            _RunReady('divNotice');
            if (close == true) {
                var notiDelay = 3000;
                if (parseInt(timeOut) != 'NaN')
                    notiDelay = parseInt(timeOut);
                setTimeout(function () { if (_(notiElm) != null) _(notiElm).parentNode.removeChild(_(notiElm)); }, notiDelay);
            }
            _Notice++;

            return true;
        }
        catch (err) {
            Platform.Console('error', err);

            return false;
        }
    }
    this.showLog = function (log, logtype, lognote) {
        if (logtype == undefined)
            logtype = 'log'

        switch (logtype) {
            case 'info':
                if (console != null) {
                    if (typeof console.info !== 'undefined') {
                        if (typeof lognote != 'undefined')
                            console.info(log, lognote);
                        else
                            console.info(log);
                    }
                    else {
                        if (typeof lognote != 'undefined')
                            console.info(log, lognote);
                        else
                            console.log(log);
                    }
                }
                break;
            case 'error':
                ShowNotice('Error', Platform.Language('Error'), log);
                if (console != null) {
                    if (typeof console.error !== 'undefined') {
                        if (typeof lognote != 'undefined')
                            console.info(log, lognote);
                        else
                            console.error(log);
                    }
                    else {
                        if (typeof lognote != 'undefined')
                            console.info(log, lognote);
                        else
                            console.log(log);
                    }
                }
                Platform.sendLog(log, logtype);
                break;
            case 'warning':
                if (console != null) {
                    if (typeof console.warn !== 'undefined') {
                        if (typeof lognote != 'undefined')
                            console.info(log, lognote);
                        else
                            console.warn(log);
                    }
                    else {
                        if (typeof lognote != 'undefined')
                            console.info(log, lognote);
                        else
                            console.log(log);
                    }
                }
                break;
            default:
                if ((IsDevelop) && (console != null)) {
                    if (typeof lognote != 'undefined')
                        console.info(log, lognote);
                    else
                        console.log(log);
                }
                break;
        }
    }
    this.Console = function (log, lognote) {
        if (console != null) {
            if (typeof console.error !== 'undefined') {
                if (typeof lognote != 'undefined')
                    console.info(log, lognote);
                else
                    console.error(log);
            }
            else {
                if (typeof lognote != 'undefined')
                    console.info(log, lognote);
                else
                    console.log(log);
            }
        }
    }
    //send error log to server
    this.sendLog = function (log, logtype) {
        //Platform.ShowAction(null, '/user/error/javascript/?LogText=' + log + '&LogTitle=' + logtype + ' ' + window.location.href,
        //    function (targetId, value) { console.log(value) });
    }
    /*Page*/
    this.ShowPage = function (element, Url, targetId, SuccessCall, ErrorCall, Ishistory) {
        //disable element
        UltraCode.setDisable(element);

        Platform.StartWaiting(element, targetId, 0);
        var Result = Platform.Run(Url, {
            Ishistory: Ishistory,
            element: element,
            id: targetId,
            param: '_acttype=page',
            callback: this.ShowPageBack,
            success: SuccessCall,
            error: ErrorCall
        });
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        return Result;
    }
    this.ShowPageBack = function (element, targetId, response, config) {
        if (config.Ishistory == undefined) {
            if (config.url.startsWith("/"))
                Platform.history(config.url);
            else
                Platform.history('/?act=' + config.url);
        }
        if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
            element.classList.remove("sp-ultra-wait");

        Platform.RunAjax(element, targetId, response);
        Platform.StopWaiting(element, targetId);

        //Enabled element
        UltraCode.setEnable(element);
    }
    this.ShowRun = function (element, Url, targetId, SuccessCall, ErrorCall) {
        //set disabled
        UltraCode.setDisable(element);
        //add wait class
        if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
            element.classList.add("sp-ultra-wait");

        return Platform.Run(Url, {
            element: element,
            id: targetId,
            callback: this.RunAjax,
            success: SuccessCall,
            error: ErrorCall
        })
    }
    /*Dialog*/
    this.Dialogs = [];
    this.DialogZIndex = 70;
    this.ShowDialog = function (element, Url, width, height, SuccessCall, ErrorCall, Option) {
        //set disabled
        UltraCode.setDisable(element);
        var target = "divDialog" + this.Dialogs.length;
        this.ShowBox(target, width, height, 'dialog', Option);
        Platform.animate('.sp-dialog-overlay', 'fadeIn');
        var Result = Platform.Run(Url, {
            element: element, param: '_acttype=dialog&_level=' + this.Dialogs.length + '&_width=' + width + '&_height=' + height,
            id: target, callback: this.ShowDialogBack, success: SuccessCall, error: ErrorCall
        });
        this.Dialogs.push(target);
        if (document.body.className.indexOf('dialog') == -1) {
            document.body.classList.add('dialog');
            if (IsDebug)
                Platform.showLog('add dialog');
        }
        return Result;
    }
    this.ShowBox = function (targetId, width, height, type, Option) {
        var _BoxWidth, _BoxHeight;

        var screenWidth = screen.width;
        if (Platform.iOS)
            screenWidth = window.outerWidth;
        if ((MaxScreenWidth != 0) && (screenWidth > MaxScreenWidth))
            screenWidth = MaxScreenWidth;
        var screenHeight = screen.height;
        if (Platform.iOS)
            screenHeight = window.outerHeight;
        if ((MaxScreenHeight != 0) && (screenHeight > MaxScreenHeight))
            screenHeight = MaxScreenHeight;

        if (typeof width === 'undefined')
            _BoxWidth = screenWidth * 0.75;
        else if (width <= 1)
            _BoxWidth = screenWidth * width;
        else
            _BoxWidth = width

        if (typeof height === 'undefined')
            _BoxHeight = screenHeight * 0.75;
        else if (height <= 1)
            _BoxHeight = screenHeight * height;
        else
            _BoxHeight = height;
        //Dialog Option
        var modal = false;
        if (IsDebug)
            console.log(Option);
        if ((typeof Option !== 'undefined') && (Option != null)) {
            if (typeof Option.zindex !== 'undefined')
                this.DialogZIndex = Option.zindex;
            if (typeof Option.modal !== 'undefined')
                modal = Option.modal;
        }
        var Target = _(targetId, 'create');
        Target.innerHTML = "<" + type + " class=\"sp-" + type + "-overlay\" id=\"divDialog\" style='display: block;z-index:" + (this.DialogZIndex + this.Dialogs.length) + ";'>" +
            "<app-" + type + " class='sp-" + type + "' style='width:" + _BoxWidth + "px;height:" + _BoxHeight + "px;left:50%;top:50%;transform:translate(-50%,-50%);display:block;'>" +
            "<div class='sp-" + type + "-button'><img src='/themes/base/images/close.png' title='" + CsBack + "' onclick=\"javascript:CloseDialog('" + targetId + "');\" /></div>" +
            "<section class='sp-" + type + "-base'><main id='" + targetId + "Main" + "' class='sp-" + type + "-main sp-main-loading'>" + CsSendData + "</main></section></app-" + type + "></dialog>";
        //focus in dialog and blar button(link)
        Target.tabIndex = 0;
        //Dialog and Modal
        if (!modal) {
            function _dialogClick(evt) {
                if (evt.target.className == 'sp-dialog-overlay') {
                    Target.removeEventListener('click', _dialogClick);
                    CloseDialog(targetId);
                }
            }
            function _dialogKey(evt) {
                if (evt.keyCode == 27) {
                    document.removeEventListener('keyup', _dialogKey);
                    CloseDialog(targetId);
                }
            }
            Target.addEventListener('mousedown', _dialogClick);
            document.addEventListener('keyup', _dialogKey);
        }
        return Target;
    }
    this.ShowDialogBack = function (element, targetId, value, config) {
        /*old '.sp-dialog-main'*/
        if ((_(targetId + 'Main') != null) && (_(targetId + 'Main').className.indexOf('sp-main-loading') != -1))
            _(targetId + 'Main').classList.remove('sp-main-loading');
        Platform.RunAjax(element, targetId + 'Main', value);
    }

    this.CloseDialog = function (targetId, value) {
        if (typeof targetId == 'undefined') {
            if (_('.sp-dialog-overlay') != null)
                targetId = _('.sp-dialog-overlay').parentElement.id;
        }
        else if (targetId == "-1")
            targetId = this.Dialogs[this.Dialogs.length - 1];

        if (_(targetId) != null)
            Platform.animate('#' + targetId + ' > .sp-dialog-overlay', 'fadeOut', Platform.ClearDialog(targetId));
        else
            Platform.ClearDialog(targetId);
    }
    this.ClearDialog = function (targetId) {
        if (typeof targetId == 'undefined') {
            if (_('.sp-dialog-overlay') != null)
                targetId = _('.sp-dialog-overlay').parentElement.id;
        }
        else {
            if (targetId == "-1")
                targetId = this.Dialogs[this.Dialogs.length - 1];
            else if ((targetId.toLowerCase() == 'all') && (_('.sp-dialog-overlay') != null)) {
                Array.prototype.forEach.call(__('.sp-dialog-overlay'), function (child) {
                    Platform.ClearDialog(child.parentElement.id);
                });
                return;
            }
        }
        if (_(targetId) != null)
            _(targetId).parentNode.removeChild(_(targetId));
        if ((this.Dialogs.length > 0) && (this.Dialogs.indexOf(targetId) !== -1))
            this.Dialogs.splice(this.Dialogs.indexOf(targetId), 1);
        if (this.Dialogs.length == 0)
            document.body.classList.remove('dialog');
    }
    //Refresh
    this.ShowRefresh = function (element, Url, targetId, SuccessCall, ErrorCall) {
        //set disabled
        UltraCode.setDisable(element);

        if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
            element.classList.add("sp-ultra-wait");

        if (targetId != "") {
            var target = UltraCode.getTarget(element, targetId);
            if (target != null) {
                var waiting = document.createElement("div");
                waiting.classList.add('sp-ultra-waiting');
                target.appendChild(waiting);
                UltraCode.setDisable(target);
            }
        }

        return Platform.Run(Url, {
            element: element,
            id: targetId,
            callback: this.ShowRefeshBack,
            success: SuccessCall,
            error: ErrorCall
        })
    }
    this.ShowRefeshBack = function (element, targetId, response, config) {
        Platform.RunAjax(element, targetId, response);
    }
    /* Action */
    this.ShowAction = function (element, Url, CallBack) {
        return Platform.Run(Url, {
            element: element,
            callback: function (element, targetId, value, config) {
                if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
                    element.classList.remove('sp-ultra-wait');

                CallBack(element, value, config);
            }
        })
    }
    this.JsonAction = function (element, Url, CallBack) {
        return Platform.Run(Url, {
            element: element,
            // contentType: 'application/json',
            callback: function (element, targetId, value, config) {
                if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
                    element.classList.remove('sp-ultra-wait');

                CallBack(element, value, config);
            }
        })
    }
    /* Quick */
    this.CloseTimer = null;
    this.ClearTimer = null;
    this.ShowQuick = function (element, Url, targetId, SuccessCall, ErrorCall) {
        //set disabled
        UltraCode.setDisable(element);

        Platform.StopQuick();
        Platform.OpenQuickBox(element, targetId);
        return Platform.Run(Url, {
            element: element, param: '_acttype=quick', id: targetId,
            callback: this.OpenQuick, success: SuccessCall, error: ErrorCall
        });
    }
    this.OpenQuick = function (element, targetId, value, config) {
        if ((_(SectionQuick) != null) && (_(SectionQuick).className.indexOf('sp-main-loading') != -1))
            _(SectionQuick).classList.remove('sp-main-loading');

        Platform.RunAjax(element, '.sp-quick-main', value);
        Platform.StartQuick();
    }
    this.OpenQuickBox = function (element, targetId) {
        _(SectionQuick, 'create').innerHTML = "<div class='sp-quick-flow'><button class='sp-quick-button'>" +
            "<img src='/themes/base/images/close.png' title='" + CsBack + "'/></button></div><div class='sp-quick-main'>" + CsSendData + "</div>";
        _(SectionQuick).classList.add('sp-quick-active');
        _(SectionQuick).onmouseover = this.StopQuick;
        _(SectionQuick).onmouseout = this.StartQuick;
        _('.sp-quick-button').addEventListener("click", Platform.CloseQuick);
    }
    this.CloseQuick = function () {
        Platform.StopQuick();
        if (_(SectionQuick, false) != null)
            _(SectionQuick).classList.remove('sp-quick-active');
        Platform.ClearTimer = setTimeout(function () { _(SectionQuick).innerHTML = ''; }, 20000);
    }
    this.StartQuick = function () {
        _('.sp-quick-button').addEventListener('focusout', Platform.CloseQuick);
        _('.sp-quick-button').focus();
        Platform.CloseTimer = setTimeout(function () { Platform.CloseQuick(); }, 20000);
    }
    this.StopQuick = function () {
        clearTimeout(Platform.ClearTimer);
        if (_('.sp-quick-button', false) != null)
            _('.sp-quick-button').removeEventListener('focusout', Platform.CloseQuick);
    }
    /* Popup */
    this.Popups = [];
    this.PopupZIndex = 80;
    this.ShowPopup = function (evt, Url, width, height) {
        var target = "divPopup" + this.Popups.length;
        var Popup = document.createElement('menu');
        document.body.appendChild(Popup);
        Popup.id = target;
        Popup.classList.add('sp-popup');
        Popup.classList.add('sp-popup-active');
        Popup.style.position = 'absolute';
        Popup.style.width = width + 'px';
        Popup.style.height = height + 'px';
        Popup.style.top = Platform.mouseY(evt) - 100 + 'px';
        Popup.style.left = Platform.mouseX(evt) + 'px';

        Platform.Run(Url, {
            element: evt.target,
            param: '_acttype=run&_width=' + width + '&_height=' + height,
            id: target,
            callback: this.OpenPopup
        });
        this.Popups.push(target);
    }
    this.OpenPopup = function (element, targetId, value, config) {
        if ((_(targetId) != null) && (_(targetId).className.indexOf('sp-main-loading') != -1))
            _(targetId).classList.remove('sp-main-loading');

        Platform.RunAjax(element, targetId, value);
    }
    /*LoadPage */
    this.LoadPage = function (element, Url, targetId, SuccessCall, ErrorCall) {
        Platform.StartWaiting(element, targetId);
        try {
            var _window = window.open(Url, '_self');
            if (_window != null) {
                if ((SuccessCall !== 'undefined') && (typeof SuccessCall === 'function'))
                    SuccessCall(element, targetId, '');

                _window.addEventListener("load", (event) => {
                    Platform.StopWaiting(element, targetId);
                });
            }
            else {
                if ((ErrorCall !== 'undefined') && (typeof SuccessCall === 'function'))
                    ErrorCall(element, target, '');
            }
            return _window;
        }
        catch (err) {
            if ((ErrorCall !== 'undefined') && (typeof SuccessCall === 'function'))
                ErrorCall(element, targetId, '');

            Platform.showLog(Platform.Language('ErrorOpenUrl'), 'error', err);

            Platform.StopWaiting(element, targetId);
        }
    }
    /*OpenPage*/
    this.OpenPage = function (element, Url, targetId, SuccessCall, ErrorCall) {
        Platform.StartWaiting(element, targetId);
        try {
            var _window = window.open(Url, '_blank');
            if (_window != null) {
                _window.focus();
                if ((SuccessCall !== 'undefined') && (typeof SuccessCall === 'function'))
                    SuccessCall(element, targetId, '');

                _window.addEventListener("load", (event) => {
                    Platform.StopWaiting(element, targetId);
                });
            }
            else {
                if ((ErrorCall !== 'undefined') && (typeof SuccessCall === 'function'))
                    ErrorCall(element, targetId, '');
                Platform.StopWaiting(element, targetId);
            }
            return _window;
        }
        catch (err) {
            if ((ErrorCall !== 'undefined') && (typeof SuccessCall === 'function'))
                ErrorCall(element, targetId, '');

            Platform.showLog(Platform.Language('ErrorOpenUrl'), 'error', err);

            Platform.StopWaiting(element, targetId);
        }
    }
    /*Open*/
    this.Load = function (element, Url, targetId, SuccessCall, ErrorCall) {
        Platform.StartWaiting(element, targetId);
        return Platform.Run(Url, {
            element: element, param: '_acttype=none', id: targetId,
            callback: function (element, targetId, value, config) {
                Platform.StopWaiting(element, targetId);
                var _window = window.open('', '_self');
                _window.document.write(value);
                // _window.document.close();

            }, success: SuccessCall, error: ErrorCall
        });
    }
    /*Open*/
    this.Open = function (element, Url, targetId, SuccessCall, ErrorCall) {
        Platform.StartWaiting(element, targetId);
        return Platform.Run(Url, {
            element: element, param: '_acttype=none', id: targetId,
            callback: function (element, targetId, value, config) {
                Platform.StopWaiting(element, targetId);
                var _window = window.open('', '_blank');
                _window.document.write(value);
                //_window.document.close();

            }, success: SuccessCall, error: ErrorCall
        });
    }
    /* Load Frame */
    this.LoadFrame = function (element, Url, targetId, SuccessCall, ErrorCall) {
        Platform.StartWaiting(element, targetId);
        try {
            _(targetId).onload = function () {
                Platform.StopWaiting(element, targetId);

                if (typeof SuccessCall === 'function')
                    SuccessCall(element, targetId, '');
            }
            _(targetId).onerror = function () {
                if (typeof ErrorCall !== 'function')
                    ErrorCall(element, targetId, '');
                else
                    Platform.showLog(Platform.Language('ErrorOpenUrl'), 'error', err);

                Platform.StopWaiting(element, targetId);
            }
            _(targetId).src = Url;

            return true;
        }
        catch (err) {
            if (typeof ErrorCall !== 'function')
                ErrorCall(element, targetId, '');
            else
                Platform.showLog(Platform.Language('ErrorOpenUrl'), 'error', err);

            Platform.StopWaiting(element, targetId);

            return false;
        }
    }
    /*Upload*/
    this.UploadIndex = 0;
    this.UploadFile = function (file, directory, targetId, Option, Finished) {
        if (IsDebug)
            Platform.showLog("Upload" + directory);
        try {
            var fileId = '';
            if (typeof file == "string") {
                fileId = file;
                file = _(file, true).files[Platform.UploadIndex];
                if (file == null) {
                    Platform.showLog("Cannot Open file" + fileId, 'error');
                    _(targetId).innerHTML = Platform.Language('ErrorOpenfile');
                    return false;
                }
            }
            else {
                fileId = file.id;
            }

            //check file accept and max size
            if (UltraCode.getAttribute(file, 'maxSize', null) != null) {
                if (file.size > parseFloat(UltraCode.getAttribute(file, 'maxsize', null))) {
                    Platform.showLog("file is Large:" + fileId, 'error');
                    _(targetId).innerHTML = Platform.Language('ErrorfileSize');
                    return false;
                }
            }

            if (directory != '')
                directory = "&directory=" + directory;
            var _Option = '';
            if (Option !== undefined) {
                if (!Option.startsWith('&'))
                    _Option = '&'
                _Option += Option;
            }
            if (_('Captcha') != null)
                _Option += "&captcha=" + _('Captcha').value;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/user/upload/?filename=" + file.name + directory + _Option, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    var uploaded = e.loaded;
                    var total = e.total;
                    var Result = 'upload:' + Math.round((e.loaded / e.total) * 100) + '%';
                    Platform.PlatformStatus(targetId, Result);
                }
            }, false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var Message = xhr.responseText;
                    try {
                        var Json = JSON.parse(Message);
                        if (Json != null) {
                            if (Json.Status == 'success') {
                                Platform.PlatformStatus(targetId, Json.Message);
                                Finished(fileId, Json.FileUrl, Json.PreviewUrl);
                            }
                            else
                                Platform.ShowNotice(Json.Status, Platform.Language('ErrorInUpload'), Json.Message);
                        }
                        else
                            Platform.ShowNotice('error', Platform.Language("ErrorInParser"), Message);
                    }
                    catch (err) {
                        if (_(targetId) != null)
                            _(targetId).innerHTML += err;
                        else
                            Platform.ShowNotice("Error", Platform.Language("ErrorInUpload"), err);
                        Platform.showLog('ErrorInUpload', 'warning', err);
                    }
                }
            }
            xhr.send(file);
        }
        catch (err) {
            if (_(targetId) != null)
                _(targetId).innerHTML += err;
            else
                Platform.ShowNotice("Error", Platform.Language("ErrorInUpload"), err);
            Platform.showLog('ErrorInUpload', 'warning', err);
            return false;
        }
    }
    this.ShowMessage = function (element, LogType, Url, width, height, SuccessCall, ErrorCall) {
        var _DialogWidth, _DialogHeight;

        var screenWidth = screen.width;
        if (Platform.iOS)
            screenWidth = window.outerWidth;
        if ((MaxScreenWidth != 0) && (screenWidth > MaxScreenWidth))
            screenWidth = MaxScreenWidth;
        var screenHeight = screen.height;
        if (Platform.iOS)
            screenHeight = window.outerHeight;
        if ((MaxScreenHeight != 0) && (screenHeight > MaxScreenHeight))
            screenHeight = MaxScreenHeight;

        if (typeof width === 'undefined')
            _DialogWidth = screenWidth * 0.75;
        else if (width <= 1)
            _DialogWidth = screenWidth * width;
        else
            _DialogWidth = width
        if (typeof height === 'undefined')
            _DialogHeight = screenHeight * 0.75;
        else if (height <= 1)
            _DialogHeight = screenHeight * height;
        else
            _DialogHeight = height;

        var _Color = 'white';
        if (LogType.toLowerCase() == 'warning')
            _Color = 'yellow';
        //Dialog Option
        var targetId = "divDialog" + this.Dialogs.length;
        var Target = _(targetId, 'create');
        Target.innerHTML = "<dialog class=\"sp-dialog-overlay\" id=\"divDialog\" style='display: block;z-index:" + (this.DialogZIndex + this.Dialogs.length) + ";'>" +
            "<app-message class='sp-dialog sp-bg-" + _Color + "' style='width:" + _DialogWidth + "px;height:" + _DialogHeight + "px;left:50%;top:50%;transform:translate(-50%,-50%);display:block;'>" +
            "<section class='sp-dialog-base'><main id='" + targetId + "Main" + "' class='sp-dialog-main sp-main-loading'>" + CsSendData + "</main></section></app-message></dialog>";
        //focus in dialog and blar button(link)
        Target.tabIndex = 0;
        Platform.animate('.sp-dialog-overlay', 'fadeIn');
        Platform.Run(Url, {
            element: element, param: '_acttype=dialog&_level=' + this.Dialogs.length + '&_width=' + width + '&_height=' + height,
            id: targetId, callback: this.ShowMessageBack, success: SuccessCall, error: ErrorCall
        });
        this.Dialogs.push(targetId);
        if (document.body.className.indexOf('dialog') == -1) {
            document.body.classList.add('dialog');
            if (IsDebug)
                Platform.showLog('add dialog');
        }
    }

    this.ShowMessageBack = function (element, targetId, value, config) {
        /*old '.sp-dialog-main'*/
        if ((_(targetId + 'Main') != null) && (_(targetId + 'Main').className.indexOf('sp-main-loading') != -1))
            _(targetId + 'Main').classList.remove('sp-main-loading');
        Platform.RunAjax(element, targetId + 'Main', value);
    }
    /* State */
    this.UltraState = new Array();
    this.setState = function (state, value) {
        for (var s = 0; s < Platform.UltraState.length; s++) {
            var StateItem = Platform.UltraState[s];
            if (StateItem.name.toLowerCase() == state.toLowerCase()) {
                StateItem.value = value;
                for (var index = 0; index < StateItem.items.length; index++) {
                    if (StateItem.items[index].action != '') {
                        Platform.showLog("Set State Run:" + StateItem.items[index].action);
                        UltraCode.Run(StateItem.items[index].target, StateItem.items[index].action);
                    }
                }
            }
        }
    }
    this.useState = function (element, state, callback) {
        var newstate = true;
        for (var s = 0; s < Platform.UltraState.length; s++) {
            var StateItem = Platform.UltraState[s];
            if (StateItem.name.toLowerCase() == state.toLowerCase()) {
                if (typeof callback === 'undefined')
                    StateItem.items.push({ target: element, action: '' });
                else
                    StateItem.items.push({ target: element, action: callback });
                newstate = false;
            }
        }
        //New State
        if ((newstate) && (state != '')) {
            if (typeof callback === 'undefined')
                Platform.UltraState.push({ name: state, value: '', items: new Array({ target: element, action: '' }) });
            else
                Platform.UltraState.push({ name: state, value: '', items: new Array({ target: element, action: callback }) });
        }
    }
    this.getState = function (state) {
        if (typeof state !== 'undefined') {
            for (var s = 0; s < Platform.UltraState.length; s++) {
                if (Platform.UltraState[s].name.toLowerCase() == state.toLowerCase())
                    return Platform.UltraState[s].value;
            }
        }
    }
    this.checkState = function (state) {
        for (var s = 0; s < Platform.UltraState.length; s++)
            if (Platform.UltraState[s].name.toLowerCase() == state.toLowerCase())
                return true;

        return false;
    }
    this.jsonState = function () {
        var result = new Array;
        for (var s = 0; s < Platform.UltraState.length; s++)
            result.push({
                name: Platform.UltraState[s].name, value: Platform.UltraState[s].value
            });
        return JSON.stringify(result);
    }
    this.mouseX = function (evt) {
        try {
            if (evt.pageX) {
                return evt.pageX;
            } else if (evt.clientX) {
                return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            }
        }
        catch (err) {
            Platform.showLog('MouseX', 'warning', err);
        }
        return 0;
    }
    this.mouseY = function (evt) {
        try {
            if (evt.pageY) {
                return evt.pageY;
            } else if (evt.clientY) {
                return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            }
        }
        catch (err) {
            Platform.showLog('MouseY', 'warning', err);
        }
        return 0;
    }
    this.checkReadOnly = function (element) {
        if (element != null) {
            if ((typeof element.disabled !== 'undefined') && (element.disabled))
                return true;
            else if ((typeof element.readOnly !== 'undefined') && (element.readOnly))
                return true;
            else
                return false;
        }
        else
            return true;
    }
    ///press Enter for go to next Item
    this.nextFocus = null;
    this.nextEvent = null;
    this.nextInput = function (evt) {
        var key = evt.keyCode ? evt.keyCode : evt.which;
        if (key == ENTER_KEY) {
            var target = evt.target;
            if ((target.tagName.toLowerCase() == 'textarea') && (!evt.ctrlKey))
                return true;
            //Open for Select
            if ((target.tagName.toLowerCase() == 'select') && (UltraCode.getAttribute(target, 'data-select', null) == null)) {
                if (typeof target.show != 'undefined')
                    target.show();
                target.setAttribute('data-select', 'select');
                return true;
            }
            var Indexs = __(UltraCode.getForm(target), '[data-index]:not([data-index^="-"]');
            if ((typeof Indexs != 'undefined') && (Indexs.length > 0)) {
                var Indexbables = [].slice.call(Indexs).sort(function (a, b) {
                    return UltraCode.getAttribute(a, 'data-index', 0) - UltraCode.getAttribute(b, 'data-index', 0);
                });

                var DataIndex = UltraCode.getAttribute(target, 'data-index', null);
                if (DataIndex == null) DataIndex = target.tabIndex;
                //select current Item or larger then curentItem
                if (DataIndex == -1) DataIndex = 0;

                for (var i = 0; i < Indexbables.length; i++) {
                    if ((Indexbables[i] == target) || (parseFloat(Indexbables[i].getAttribute('data-index')) > DataIndex)) {
                        var IndexElement = Indexbables[i + 1];
                        if (IndexElement != null) {
                            if (!Platform.checkReadOnly(IndexElement)) {
                                IndexElement.focus();
                                if ((IndexElement.tagName.toLowerCase() == 'input') || (IndexElement.tagName.toLowerCase() == 'textarea'))
                                    IndexElement.select();
                                if (IsDebug)
                                    console.log(IndexElement)
                                evt.preventDefault();
                                return false;
                            }
                            else if (IndexElement.getAttribute('ultra-waiting') != null) {
                                this.nextFocus = IndexElement.id;
                                this.nextEvent = evt;

                                if (IsDebug)
                                    Platform.showLog('nextFocus:' + this.nextFocus);

                                evt.preventDefault();
                                return false;
                            }
                        }
                    }
                }
                //Form Submit when Index end of list
                if ((Indexbables[Indexbables.length - 1] == target) && (UltraCode.getForm(target) != null)) {
                    var submit = __(UltraCode.getForm(target), 'input[form-submit]');
                    if ((submit != null) && (!Platform.checkReadOnly(submit)))
                        submit.click();
                }
                evt.preventDefault();
                return false;
            }
            else {
                var tabs = __(UltraCode.getForm(target), '[tabindex]:not([tabindex^="-"]');
                if ((typeof tabs != 'undefined') && (tabs.length > 0)) {
                    var tabbables = [].slice.call(tabs).sort(function (a, b) {
                        return a.tabIndex - b.tabIndex;
                    });
                    var DataIndex = target.tabIndex;
                    if (DataIndex == -1) DataIndex = 0;

                    //select curent Item or larger then curentItem
                    for (var i = 0; i < tabbables.length; i++) {
                        var tabelement = tabbables[i + 1];
                        if ((tabbables[i].tabIndex == DataIndex) && (tabelement != null) && (!Platform.checkReadOnly(tabelement))) {
                            tabelement.focus();
                            if ((tabelement.tagName.toLowerCase() == 'input') || (tabelement.tagName.toLowerCase() == 'textarea'))
                                tabelement.select();
                            evt.preventDefault();
                            return false;
                        }
                    }
                    //Form Submit when Index end of list
                    if ((tabs[tabs.length - 1] == target) && (UltraCode.getForm(target) != null)) {
                        var submit = __(UltraCode.getForm(target), 'input[form-submit]');
                        if ((submit != null) && (!Platform.checkReadOnly(submit)))
                            submit.click();
                    }
                    evt.preventDefault();
                    return false;
                }
            }
        }
        return true;
    }
    var _Languages = [];
    var _LanguageNumber = [];
    this.setLanguage = function (json) {
        if (_Languages.indexOf(json.Name) == -1) {
            _Languages[json.Name] = json.Words;
            if (typeof json.Number != 'undefined')
                _LanguageNumber[json.Name] = json.Number;

            Platform.showLog('Append Language :' + json.Name, 'info');
        }
        else
            Platform.showLog('Duplicate Language :' + json.Name, 'info');
    }
    this.Number = function (str) {
        if ((typeof str === 'string') && (typeof _LanguageNumber[Language] !== 'undefined'))
            for (var i = 0; i < 10; i++)
                str = str.replace(_LanguageNumber[Language][i], i);

        return str;
    }
    ///
    this.Language = function (Text) {
        if (typeof Text === 'undefined')
            return Language;
        try {
            if (typeof _Languages[Language] !== 'undefined')
                if (typeof _Languages[Language][Text] !== 'undefined')
                    return _Languages[Language][Text];
        }
        catch (err) {
            Platform.showLog('language', 'warning', err);
        }
        return Text;
    }

    this.setOpacity = function (targetId, opacityAsInt) {
        var opacityAsDecimal = opacityAsInt;
        if (opacityAsInt > 100)
            opacityAsInt = opacityAsDecimal = 100;
        else if (opacityAsInt < 0)
            opacityAsInt = opacityAsDecimal = 0;
        opacityAsDecimal /= 100;
        if (opacityAsInt < 1)
            opacityAsInt = 1;

        targetId.style.opacity = (opacityAsDecimal);
        targetId.style.filter = 'alpha(opacity=' + opacityAsInt + ')';
    }


    this.StartWaiting = function (element, targetId, mode) {
        try {
            //set disabled
            UltraCode.setDisable(element);
            //add wait class
            if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
                element.classList.add("sp-ultra-wait");

            var Progress = _('divProgress', false);
            if ((Progress !== null) && (typeof Progress.style.display !== 'undefined'))
                _('divProgress').style.display = 'block';

            if ((targetId == SectionMain) && (_(SectionMain) != null))
                _(SectionMain).classList.add('sp-main-loading');
            else if ((targetId == SectionScript) || (targetId == 'script')) {
                document.body.classList.add('sp-main-loading');
            }
            else {
                var target = UltraCode.getTarget(element, targetId);
                if (target != null) {
                    Platform.setOpacity(target, 75);
                    if (mode == 0)
                        target.innerHTML = CsLoadData;
                }
            }
        }
        catch (err) {
            Platform.Console('error', err);
        }
    }
    this.StopWaiting = function (element, targetId) {
        try {
            if (_('divProgress', false) !== null)
                _('divProgress').style.display = 'none';
            if (_('.sp-main-loading', false) !== null)
                _('.sp-main-loading', false).classList.remove("sp-main-loading");

            if (_('.sp-main-section', false) !== null)
                Platform.animate('.sp-main-section', 'fadeIn');
            else if (_('.sp-main', false) !== null)
                Platform.animate('.sp-main', 'fadeIn');

            var target = UltraCode.getTarget(element, targetId)
            if (target != null) {
                Platform.setOpacity(target, 100);
                UltraCode.setEnable(target);
            }

            window.scroll({ top: 0, left: 0, behavior: 'smooth' });

            if ((typeof element !== 'undefined') && (element != null) && (element.classList != null))
                element.classList.remove("sp-ultra-wait");

            UltraCode.setEnable(element);
        }
        catch (err) {
            Platform.Console('error', err);
        }
    }

    /*** Intial platform ***/
    var __Initial = [];
    this.Initial = function (element) {
        for (var i = 0; i < __Initial.length; i++) {
            try {
                if (typeof __Initial[i] === "function")
                    __Initial[i](element);
            } catch (err) {
                Platform.showLog('Error Ready ', 'warning', err);
            }
        }
    }
    this.pushInitial = function (handel) {
        __Initial.push(handel);
    }
};

/** Ultra Code **/
const UltraCode = new function () {
    this.events = [];
    function _appendUrl(url, action, param) {
        if (action != '') {
            if (!action.startsWith('/')) {
                if (url.indexOf('?') != -1)
                    url += '&actiontype=' + action
                else
                    url += '?actiontype=' + action;
            }
            else if (action != '/')
                url = (url + action).replace('//', '/');
        }
        if ((typeof param !== 'undefined') && (param != '')) {
            if (url.includes('?'))
                url += "&" + param;
            else
                url += "?" + param;
        }
        return url
    }
    this.appendUrl = function (url, param) {
        if ((typeof param !== 'undefined') && (param != '')) {
            if (url.includes('?'))
                url += "&" + param;
            else
                url += "?" + param;
        }
        return url
    }

    this.Boolean = function (value) {
        if ((typeof value === 'undefined') || (value == null))
            return false;

        if (typeof value === 'boolean')
            return value;
        else if (typeof value === 'string')
            return value.toLowerCase() == 'true';
        else if (typeof value === 'number')
            return value == 1;
        else
            return false;
    }
    this.clearComma = function (value) {
        if ((typeof value === 'undefined') || (value == null))
            return '';
        else
            return value.replaceAll(',', '');
    }

    this.getEvents = function (element, type) {
        var result = [];
        if (this.events != null)
            for (var i = 0; i < this.events.length; i++)
                if ((this.events[i].element == element) && (this.events[i].type == type))
                    result.push(this.events[i]);
        return result;
    }

    this.setAttribute = function (element, name, value, append) {
        if ((element != null) && (typeof element.getAttribute != 'undefined')) {

            if (element.getAttribute(name) == null)
                element.setAttribute(name, value);
            else if ((typeof append != 'undefined') && (append))
                element.setAttribute(name, element.getAttribute(name) + "," + value);
        }
    }

    this.getAttribute = function (element, name, defaultValue) {
        var result = defaultValue;
        if ((element != null) && (typeof element.getAttribute != 'undefined') && (element.getAttribute(name) != null))
            result = element.getAttribute(name);
        return result;
    }
    ///disabled element
    this.getDisable = function (element) {
        if (UltraCode.getAttribute(element, 'disabled', null) != null)
            return true;
        else
            return false;
    }
    //readonly element
    this.getReadonly = function (element) {
        if (UltraCode.getAttribute(element, 'readonly', null) != null)
            return (element.readonly != false);
        else
            return false;
    }
    this.getUltra = function (element, name, base) {
        var result = base;
        if ((element != null) && (typeof element.getAttribute != 'undefined')) {
            if (UltraCode.getAttribute(element, 'ultra-' + name, null) != null)
                result = UltraCode.getAttribute(element, 'ultra-' + name, null);
            else if (UltraCode.getAttribute(element, 'form-' + name, null) != null)
                result = UltraCode.getAttribute(element, 'form-' + name, null);
        }
        return result;
    }
    this.getParam = function (element, action, param) {
        if ((typeof param != 'undefined') && (param != null) && (param != '')) {
            var fields = '';
            var inputs = param.replaceAll(',', '|').split('|');
            for (var i = 0; i < inputs.length; i++) {
                var fieldname = inputs[i].trim();
                if (fieldname.indexOf('=') == -1) {
                    var Input = null;
                    if (UltraCode.getForm(element) != null)
                        Input = _(UltraCode.getForm(element), inputs[i]);
                    if (Input == null)
                        Input = _(inputs[i]);

                    if (Input != null) {
                        if (Input.getAttribute('data-name') != null)
                            fieldname = Input.getAttribute('data-name');

                        if (fieldname != '') {
                            if (fields != '') fields += "&";

                            if ((typeof Input.type != 'undefined') && ((Input.type.toLowerCase() == 'checkbox') || (Input.type.toLowerCase() == 'radio')))
                                fields += fieldname + '=' + Input.checked;
                            else if (Input.tagName.toLowerCase() == 'textarea') {
                                if (typeof Input.getAttribute !== 'undefined') {
                                    if ((Input.getAttribute('data-editor') != null) && (typeof getEditor !== 'undefined') && (getEditor(Input.id) != null))
                                        fields += fieldname + '=' + encodeURIComponent(getEditor(Input.id));
                                    else if ((Input.getAttribute('data-html') != null) && (_HtmlEditor[Input.id] != null))
                                        fields += fieldname + '=' + encodeURIComponent(_HtmlEditor[Input.id].getValue());
                                }
                                else
                                    fields += fieldname + '=' + encodeURIComponent(Input.value);
                            }
                            else
                                fields += fieldname + '=' + encodeURIComponent(Input.value);
                        }
                    }
                    else
                        Platform.showLog(Platform.Language('ErrorFindData') + inputs[i], 'warning');
                }
                else {
                    if (fields != '') fields += "&";
                    fields += inputs[i];
                }
            }
            if (fields != '') {
                if (action.includes('?'))
                    action += "&"; else action += "?";
                action += fields;
            }
            return action;
        }
        else
            return action;
    }
    this.Run = function (element, action) {
        try {
            if (IsDebug)
                console.log('run action', action, 'element', element);

            if (action.toLowerCase().startsWith('javascript:')) {
                eval(action);
            }
            else if ((action.toLowerCase().startsWith('{')) && (action.toLowerCase().endsWith('}'))) {
                eval(action.substring(1, action.length - 1));
            }
            else {
                var ultras = action.split(';');
                for (var i = 0; i < ultras.length; i++) {
                    var param = ultras[i].trim();
                    if (param != '') {
                        var funcName = action.substring(0, param.indexOf('('));
                        var funcParam = action.substring(param.indexOf('(') + 1, param.lastIndexOf(')'));
                        if (IsDebug)
                            Platform.showLog('Run function:' + funcName + " param:" + funcParam);

                        var func = _UltraFunction.find(Funcs => Funcs.Name.toLowerCase() == funcName.toLowerCase());
                        if (typeof func !== 'undefined') {
                            if (func.Active)
                                return func.Action(element, funcParam);
                            else {
                                Platform.showLog('function is InActive:' + funcName);
                                return false;
                            }
                        }
                        else {
                            Platform.showLog(Platform.Language('ErrorFindFunction') + funcName + " param:" + funcParam);
                            return false;
                        }
                    }
                }
            }
        }
        catch (err) {
            Platform.showLog(Platform.Language('ErrorInFunction') + ':' + action, 'warning', err);
            return false;
        }
    }
    //Compile Paramter split
    this.Compile = function (param) {
        try {
            var Params = param.split(",");
            for (var r = 0; r < Params.length; r++)
                Params[r] = decodeURIComponent(UltraCode.clearQuote(Params[r].trim()));
            return Params;
        }
        catch (err) {
            Platform.showLog('Compile function (' + action + ')', 'error', err);
            return param;
        }
    }
    //clear Quote from first and last
    this.clearQuote = function (param) {
        if (param != null) {
            if (param.length < 2)
                return param;
            if ((param.startsWith("'")) && (param.endsWith("'")))
                return param.substring(1, param.length - 1);
            else if ((param.startsWith('"')) && (param.endsWith('"')))
                return param.substring(1, param.length - 1);
            else
                return param;
        }
        else
            return null
    }
    this.InputElements = ['INPUT', 'SELECT', 'TEXTAREA'];
    this.setValue = function (element, targetId, value) {
        var target = UltraCode.getTarget(element, targetId);
        if (target != null) {
            if ((typeof this.InputElements.includes != 'undefined') && (this.InputElements.includes(target.tagName))) {
                target.value = value;
                this.Validate(target);
            }
            else if ((target.tagName == 'IMG') || (target.tagName == 'PICTURE')) {
                target.src = value;
            }
            else
                target.innerHTML = value;

            if (IsDebug)
                Platform.showLog('Set:' + targetId + ' Value:' + value);

            if ((target.onchange != null) || (UltraCode.Boolean(UltraCode.getAttribute(target, 'ultra-changed'))))
                target.onchange();
        }
    }
    this.checkKey = function (evt, key) {
        if (typeof evt !== 'undefined') {
            var keyCode = evt.keyCode ? evt.keyCode : evt.which;
            switch (evt.key) {
                case key:
                    return true;
            }
        }
        else
            return false;
    }
    this.checkInput = function (evt) {
        if (typeof evt !== 'undefined') {
            if (evt.target == null)
                return false;
            //dont check when readonly and disabled
            if (!UltraCode.getReadonly(evt.target))
                UltraCode.Validate(evt.target);
            else
                return false;
        }
        else
            return false;
    }
    this.isFloat = function (value) {
        if ((value != '') && (/^[+-]?\d+(\.\d+)?$/.test(value)) && (!isNaN(parseFloat(value))))
            return true;
        else
            return false;
    }
    this.Validate = function (Item, ErrorCall) {
        var container = Item;
        switch (Item.tagName.toLowerCase()) {
            case 'input':
                if (Item.type != 'button') {
                    if (this.getForm(Item) != null) {
                        var parent = __(this.getForm(Item), '[data-container="' + Item.id + '"]');
                        if ((typeof parent !== 'undefined') && (parent[0] != null))
                            container = parent[0];
                    }

                    if (Item.type == 'checkbox') {
                        if ((Item.getAttribute('data-required') != null) && (!Item.checked)) {
                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorRequiredData'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorRequiredData');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorRequiredData'));
                            return false;
                        }
                    }
                    else {
                        if ((UltraCode.getAttribute(Item, 'data-required', null) != null) && (Item.value == '')) {
                            //when related file
                            if (UltraCode.getAttribute(Item, 'data-related', null) != null) {
                                var relatedItem = _(this.getForm(Item), UltraCode.getAttribute(Item, 'data-related', null));
                                if ((relatedItem != null) && (relatedItem.value != ''))
                                    return true;
                            }

                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorRequiredData'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorRequiredData');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorRequiredData'));
                            return false;
                        }
                        if ((UltraCode.getAttribute(Item, 'minlength', null) != null) && (Item.value != '') &&
                            (Item.value.length < parseFloat(UltraCode.getAttribute(Item, 'minlength', null)))) {
                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorMinLength'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorMinLength');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated', 'sp-invalidate-min');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorMinLength'));
                            return false;
                        }
                        if ((UltraCode.getAttribute(Item, 'maxlength', null) != null) &&
                            (Item.value.length > parseFloat(UltraCode.getAttribute(Item, 'maxlength', null)))) {
                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorMaxLength'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorMaxLength');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated', 'sp-invalidate-max');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorMaxLength'));
                            return false;
                        }
                        //Clear , from Number (money)
                        var value = Item.value.replaceAll(',', '');
                        if (Item.getAttribute('minvalue') != null && (value != '') &&
                            (!UltraCode.isFloat(value) || (parseFloat(value) < parseFloat(Item.getAttribute('minvalue'))))) {
                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorMinValue'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorMinValue');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated', 'sp-invalidate-min');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorMinValue'));
                            return false;
                        }
                        if (Item.getAttribute('maxvalue') != null && (value != '') &&
                            (!UltraCode.isFloat(value) || (parseFloat(value) > parseFloat(Item.getAttribute('maxvalue'))))) {
                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorMaxValue'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorMaxValue');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated', 'sp-invalidate-max');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorMaxValue'));
                            return false;
                        }
                        //check data-type
                        if (Item.value.trim() != '') {
                            var DataType = Item.type;
                            if (Item.getAttribute('data-type') != null) {
                                DataType = Item.getAttribute('data-type');
                                if (DataType == 'email') {
                                    var patternEmail = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
                                    if (patternEmail.test(Item.value) == false) {
                                        if (IsDebug)
                                            Platform.showLog(Platform.Language('ErrorValidateEmail'), 'warning', Item);
                                        //change Title/class and Call Error
                                        container.title = Platform.Language('ErrorValidateEmail');
                                        if (container.classList != null) {
                                            container.classList.remove('sp-validated');
                                            container.classList.add('sp-invalidated', 'sp-invalidate-type');
                                        }
                                        if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                            ErrorCall(Platform.Language('ErrorValidateEmail'));
                                        return false;
                                    }
                                }
                                else if (DataType == 'mobile') {
                                    if ((!UltraForm.ValidNumber(Item.value)) && (Item.value.length < 10)) {
                                        if (IsDebug)
                                            Platform.showLog(Platform.Language('ErrorValidatePhone'), 'warning', Item);
                                        //change Title/class and Call Error
                                        container.title = Platform.Language('ErrorValidatePhone');
                                        if (container.classList != null) {
                                            container.classList.remove('sp-validated');
                                            container.classList.add('sp-invalidated', 'sp-invalidate-type');
                                        }
                                        if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                            ErrorCall(Platform.Language('ErrorValidatePhone'));
                                        return false;
                                    }
                                }
                                else if (DataType == 'number') {
                                    if (!UltraForm.isNumber(Item.value.replaceAll(',', ''))) {
                                        if (IsDebug)
                                            Platform.showLog(Platform.Language('ErrorValidateNumber'), 'warning', Item);
                                        //change Title/class and Call Error
                                        container.title = Platform.Language('ErrorValidateNumber');
                                        if (container.classList != null) {
                                            container.classList.remove('sp-validated');
                                            container.classList.add('sp-invalidated', 'sp-invalidate-type');
                                        }
                                        if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                            ErrorCall(Platform.Language('ErrorValidateNumber'));
                                        return false;
                                    }
                                }
                                else if (DataType == 'url') {
                                    var patternEmail = /^([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
                                    if (patternEmail.test(Item.value) == false) {
                                        if (IsDebug)
                                            Platform.showLog(Platform.Language('ErrorValidateUrl'), 'warning', Item);
                                        //change Title/class and Call Error
                                        container.title = Platform.Language('ErrorValidateUrl');
                                        if (container.classList != null) {
                                            container.classList.remove('sp-validated');
                                            container.classList.add('sp-invalidated', 'sp-invalidate-type');
                                        }
                                        if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                            ErrorCall(Platform.Language('ErrorValidateUrl'));
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case 'textarea':
                if (Item.getAttribute('data-required') != null) {
                    var AreaValue = Item.value.trim();
                    if (Item.getAttribute('data-editor') != null) {
                        try {
                            AreaValue = getEditor(Item.id);
                        }
                        catch (err) {
                            if (IsDebug)
                                Platform.showLog(Platform.Language('ErrorLoadEditor'), 'warning', Item);
                            //change Title/class and Call Error
                            container.title = Platform.Language('ErrorLoadEditor');
                            if (container.classList != null) {
                                container.classList.remove('sp-validated');
                                container.classList.add('sp-invalidated', 'sp-invalidate-type');
                            }
                            if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                                ErrorCall(Platform.Language('ErrorLoadEditor'));
                        }
                    }

                    if (AreaValue == '') {
                        if (IsDebug)
                            Platform.showLog(Platform.Language('ErrorRequiredData'), 'warning', Item);
                        //change Title/class and Call Error
                        container.title = Platform.Language('ErrorRequiredData');
                        if (container.classList != null) {
                            container.classList.remove('sp-validated');
                            container.classList.add('sp-invalidated');
                        }
                        if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                            ErrorCall(Platform.Language('ErrorRequiredData'));
                        return false;
                    }
                }
                break;
            case 'select':
                if (Item.getAttribute('data-required') != null)
                    if (Item.value.trim() == '') {
                        if (IsDebug)
                            Platform.showLog(Platform.Language('ErrorRequiredData'), 'warning', Item);
                        //change Title/class and Call Error
                        container.title = Platform.Language('ErrorRequiredData');
                        if (container.classList != null) {
                            container.classList.remove('sp-validated');
                            container.classList.add('sp-invalidated');
                        }
                        if ((container == Item) && (typeof ErrorCall !== 'undefined'))
                            ErrorCall(Platform.Language('ErrorRequiredData'));
                        return false;
                    }
                break;
        }
        if (Item.value != '') {
            container.title = '';
            if ((container != null) && (container.classList != null)) {
                container.classList.remove('sp-invalidated');
                if ((Item.type != 'checkbox') && (Item.type != 'radio') && (Item.type != 'hidden'))
                    container.classList.add('sp-validated');
            }
            return true;
        }
        else if ((container != null) && (container.classList != null)) {
            container.classList.remove('sp-invalidated');
            if ((Item.type != 'checkbox') && (Item.type != 'radio') && (Item.type != 'hidden'))
                container.classList.remove('sp-validated');
            return true;
        }
    }
    this.getForm = function (element, base, level = 0) {
        //check loop
        if (level == 100)
            return null;
        //check element form
        if (element.tagName.toLowerCase() == 'form')
            return element;
        //check element platform form
        else if (element.tagName.toLowerCase() == 'ultra-form')
            return element;
        //get Parent
        else if (element.parentElement != null)
            return this.getForm(element.parentElement, element, level + 1);
        //get form by element base form
        else if ((typeof base !== 'undefined') && (base.form != null) && (typeof base.form === 'object'))
            return base.form;
        else
            return null;
    }
    this.getTarget = function (element, targetId, level = 0) {
        //check loop
        if (level == 100)
            return null;

        if (typeof targetId !== 'string') {
            if (typeof targetId !== 'undefined')
                return targetId;
            else
                return null;
        }
        else {
            if ((typeof element !== 'undefined') && (element != null)) {
                if (element.id == targetId)
                    return element;
                //check element form
                if ((element.tagName.toLowerCase() == 'form') && (_(element, targetId) != null))
                    return _(element, targetId);
                //check element platform form
                else if ((element.tagName.toLowerCase().startsWith('app')) && (_(element, targetId) != null))
                    return _(element, targetId);
                //get Parent
                else if (element.parentElement != null)
                    return this.getTarget(element.parentElement, targetId, level + 1);
            }
            return _(targetId);
        }
    }
    //Disable and add disabled class
    this.setDisable = function (element) {
        if (element != null) {
            element.classList.add('sp-ultra-disabled');

            element.setAttribute('ultra-waiting', 'true');
            element.disabled = true;

            //Childs
            var nodes = element.getElementsByTagName('*');
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].disabled == false) {
                    nodes[i].setAttribute('ultra-waiting', 'true');
                    nodes[i].disabled = true;
                }
            }
        }
    }
    //Enable and Remove disabled class
    this.setEnable = function (element) {
        if (element != null) {
            if (element.classList.contains('sp-ultra-disabled'))
                element.classList.remove('sp-ultra-disabled');

            if (element.getAttribute('ultra-waiting') != null)
                element.removeAttribute('ultra-waiting');

            if (element.getAttribute('ultra-disabled') == null)
                element.disabled = false;

            //Childs
            var nodes = element.getElementsByTagName('*');
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].getAttribute('ultra-waiting') != null) {
                    nodes[i].removeAttribute('ultra-waiting');
                    nodes[i].disabled = false;
                }
            }
        }
        //Focus Item When Set Next Focus
        if ((typeof Platform.nextFocus !== 'undefined') && (Platform.nextFocus != null)) {
            var _Focus;
            if (Platform.nextEvent != null)
                _Focus = _(UltraCode.getForm(Platform.nextEvent.target), Platform.nextFocus);
            else
                _Focus = _(Platform.nextFocus);
            if ((_Focus != null) && (!_Focus.disabled)) {
                _Focus.focus();

                if (_Focus.onfocus != null)
                    _Focus.onfocus();

                if (IsDebug)
                    Platform.showLog('nextFocus', 'information', _Focus);

                Platform.nextFocus = null;
                Platform.nextEvent = null;
            }
        }
        Platform.PlatformStatus();
    }
    this.getContentWidth = function (element) {
        var styles = getComputedStyle(element)

        return element.clientWidth
            - parseFloat(styles.paddingLeft)
            - parseFloat(styles.paddingRight)
    }
    this.getOffset = function (el) {
        const rect = el.getBoundingClientRect();
        const Parent = el.closest('.sp-dialog');
        if (Parent != null) {
            const rectParent = Parent.getBoundingClientRect();
            return {
                right: rect.right,
                left: rect.left + window.scrollX - rectParent.left,
                top: rect.top + window.scrollY - rectParent.top,
                bottom: window.innerHeight - rect.height - rect.top,
                width: rect.width,
                height: rect.height,
            };
        }
        else
            return {
                right: rect.right,
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                bottom: window.innerHeight - rect.height - rect.top,
                width: rect.width,
                height: rect.height,
            };
    }
    //Enable and Remove disabled class
    this.showPicker = function (element, target, pickerClass, showClass, ItemClass, minWith, minHeight) {
        if (element != null) {
            var position = '';
            var Picker = _(element, '.' + ItemClass);
            if (Picker != null) {
                var style = Picker.currentStyle || window.getComputedStyle(Picker);
                var borderLeft = parseInt(style.borderLeftWidth);
                var borderRight = parseInt(style.borderRightWidth);

                if (typeof Picker.style != 'undefined') {
                    Picker.style.left = UltraCode.getOffset(element).left - borderLeft + 'px';
                    if (UltraCode.getOffset(element).width >= minWith)
                        Picker.style.width = UltraCode.getOffset(element).width + borderLeft + borderRight + 'px';
                    else if (UltraCode.getOffset(element.parentNode).width >= minWith)
                        Picker.style.width = UltraCode.getOffset(element.parentNode).width + borderLeft + borderRight + 'px';
                    else
                        Picker.style.width = minWith + 'px';

                    //check out of screen width
                    if ((parseInt(Picker.style.left) + parseInt(Picker.style.width)) > window.screen.width)
                        Picker.style.left = (window.screen.width - parseInt(Picker.style.width)) + 'px';

                    var Margin = UltraCode.getOffset(element.parentNode).height;
                    //check out of screen height
                    if (UltraCode.getOffset(element).top + minHeight > window.innerHeight) {
                        Picker.style.bottom = UltraCode.getOffset(element).bottom + Margin + 'px';
                        Picker.style.top = 'auto';
                        position = 'top';
                    }
                    else {
                        Picker.style.top = UltraCode.getOffset(element).top + Margin + 'px';
                        Picker.style.bottom = 'auto';
                        position = 'bottom';
                    }
                }
            }
            //close other pickers
            Array.prototype.forEach.call(__ResetClass, function (Class) {
                Array.prototype.forEach.call(__(document, '.' + Class), function (item) {
                    if (item != target)
                        item.classList.remove(Class);
                });
            });
            if (target.className.indexOf(showClass) == -1) {
                target.classList.add(showClass);
                if (position != '')
                    target.classList.add(pickerClass + '-' + position);
                return true;
            }
            else
                return false;
        }
    }

    this.updatePicker = function (element, ItemClass) {
        if (element != null) {
            var Picker = _(element, '.' + ItemClass);
            if (Picker != null) {
                if (typeof Picker != 'undefined') {

                    var positionInfo = Picker.getBoundingClientRect();

                    var screenWidth = window.screen.width;
                    if (Platform.iOS)
                        screenWidth = window.outerWidth;

                    //check out of screen width
                    if (Picker.style.left + positionInfo.width > screenWidth)
                        Picker.style.left = screenWidth - Picker.style.left + Picker.style.width;

                    var screenHeight = window.screen.height;
                    if (Platform.iOS)
                        screenHeight = window.outerHeight;

                    //check out of screen height
                    if (Picker.style.top + positionInfo.height > screenHeight) {
                        var Margin = UltraCode.getOffset(element.parentNode).height;
                        Picker.style.bottom = UltraCode.getOffset(element).bottom + Margin + 'px';
                        Picker.style.top = 'auto';
                        position = 'top';
                    }
                }
            }
        }
    }
    this.showModal = function (element, target, pickerClass, showClass, ItemClass, maxWith) {
        if (element != null) {
            var Picker = _(element, '.' + ItemClass);
            if (Picker != null) {
                var style = Picker.currentStyle || window.getComputedStyle(Picker);
                var targetId = "divDialog" + Platform.Dialogs.length;
                var DialogBox = Platform.ShowBox(targetId, maxWith, maxWith, 'modal', Option);
                Platform.animate('.sp-dialog-overlay', 'fadeIn');
                Platform.Dialogs.push(targetId);

                //close other pickers
                Array.prototype.forEach.call(__ResetClass, function (Class) {
                    Array.prototype.forEach.call(__(document, '.' + Class), function (item) {
                        if (item != target)
                            item.classList.remove(Class);
                    });
                });
                Picker = _(targetId + 'Main');
                if ((Picker != null) && (Picker.className.indexOf('sp-main-loading') != -1))
                    Picker.classList.remove('sp-main-loading');

                return Picker;
            }
            else
                return false;
        }
    }

    this._GetTarget = function (element, targetId, ultraType) {
        if ((typeof targetId !== 'undefined') && (targetId != ''))
            return targetId;
        //default Type is Page
        if ((typeof ultraType === 'undefined') || (ultraType == null))
            ultraType = 'page';
        //get ultra or form target or set default
        switch (ultraType.toLowerCase()) {
            case 'run':
                return UltraCode.getUltra(element, 'target', SectionScript);
            case 'refresh':
                return UltraCode.getUltra(element, 'target', SectionMain);
            case 'quick':
                return UltraCode.getUltra(element, 'target', SectionQuick);
            case 'dialog':
                return UltraCode.getUltra(element, 'target', SectionScript);
            case 'blank':
            case '_blank':
                return UltraCode.getUltra(element, 'target', SectionScript);
            case 'self':
            case '_self':
                return UltraCode.getUltra(element, 'target', SectionScript);
            default:
                return targetId = UltraCode.getUltra(element, 'target', SectionMain);
        }
    }

    this.submit = function (element, form, action, targetId = '', option = '', success = '', error = '') {
        try {
            if ((typeof form == 'undefined') && (form == null)) {
                Platform.showLog('form tag is null', 'error');
                return;
            }
            if ((typeof action == 'undefined') && (action == null)) {
                Platform.showLog('url is null', 'error');
                return;
            }
            var ultraType = 'run';
            if (typeof option.ultratype != 'undefined')
                ultraType = option.ultratype;

            if (UltraForm.validation(form)) {
                ultraType = this.getAttribute(element, 'form-type', ultraType);
                //Get Target
                targetId = UltraCode._GetTarget(element, targetId, ultraType);
                //validate after base validate
                var ultraValidate = this.getAttribute(element, 'form-validate', '');
                if ((ultraValidate != '') && (UltraCode.Run(element, ultraValidate) != true))
                    return;

                var Url = _appendUrl(this.getAttribute(form, 'form-action', ''), action);
                //form level(dialog level)
                if (this.getAttribute(form, 'form-level', '') != '')
                    Url = this.appendUrl(Url, '_level=' + this.getAttribute(form, 'form-level', ''));

                if (success == '')
                    success = this.getAttribute(element, 'form-success', '');
                if (error == '')
                    error = this.getAttribute(element, 'form-error', '');

                //create Option
                if ((typeof option === 'undefined') || (option == '')) {
                    if (ultraType == 'dialog')
                        option = {
                            'ultratype': ultraType,
                            'width': this.getUltra(element, 'width', '0.8'),
                            'height': this.getUltra(element, 'height', '0.8')
                        };
                    else if (ultraType == 'quick')
                        option = {
                            'ultratype': ultraType,
                            'width': this.getUltra(element, 'width', '0.8')
                        };
                    else
                        option = { 'ultratype': ultraType };
                }
                //success in submit form
                UltraForm.sendData(element, form, Url, targetId, success, error, option);
            }
            else {
                Platform.showLog("Error in validation" + UltraForm.ShowHint(), 'warning');
                if (UltraForm.ShowHint() != '')
                    Platform.ShowNotice('warning', Platform.Language('warning'), UltraForm.ShowHint());
            }
        }
        catch (err) {
            Platform.ShowNotice('Error', Platform.Language('Error'), Platform.Language('ErrorInSend'));
            Platform.showLog(Platform.Language('ErrorInSend'), 'warning', err);
        }
    }

    this._Run = function (element, url, ultraType, targetId, SuccessCall, ErrorCall, Option) {
        switch (ultraType.toLowerCase()) {
            case 'run':
                return Platform.ShowRun(element, url, targetId, SuccessCall, ErrorCall);
            case 'refresh':
                return Platform.ShowRefresh(element, url, targetId, SuccessCall, ErrorCall);
            case 'quick':
                return Platform.ShowQuick(element, url, targetId, SuccessCall, ErrorCall);
            case 'dialog':
                var width = '0.7';
                var height = '0.6';
                if ((typeof Option !== 'undefined') && (Option != null)) {
                    if (Option.width != null)
                        width = Option.width;
                    if (Option.height != null)
                        height = Option.height;
                }
                return Platform.ShowDialog(element, url, width, height, SuccessCall, ErrorCall, Option);
            case 'blank':
                return Platform.Open(element, url, targetId, SuccessCall, ErrorCall);
            case '_blank':
                return Platform.OpenPage(element, url, targetId, SuccessCall, ErrorCall);
            case 'self':
                return Platform.Load(element, url, targetId, SuccessCall, ErrorCall);
            case '_self':
                return Platform.LoadPage(element, url, targetId, SuccessCall, ErrorCall);
            case 'frame':
                return Platform.LoadFrame(element, url, targetId, SuccessCall, ErrorCall);
            default:
                return Platform.ShowPage(element, url, targetId, SuccessCall, ErrorCall);
        }
    }

    this.send = function (element, form, url, targetId = '', option = '', SuccessCall, ErrorCall) {
        try {
            if ((typeof form == 'undefined') && (form == null)) {
                Platform.showLog('form tag is null', 'error');
                return;
            }
            if ((typeof url == 'undefined') && (url == null)) {
                Platform.showLog('url is null', 'error');
                return;
            }
            var ultraType = 'run';
            if (typeof option.ultratype != 'undefined')
                ultraType = option.ultratype;

            if (UltraForm.validation(form)) {
                var ultraType = this.getAttribute(element, 'form-type', ultraType);

                var Serialize = UltraForm.serialize(form);
                if (IsDebug)
                    Platform.showLog('Serialize:' + Serialize);

                Platform.PlatformStatus(targetId, CsSendData);

                if (url.includes('?'))
                    url += "&" + Serialize;
                else
                    url += "?" + Serialize;

                if (typeof SuccessCall === 'undefined') {
                    var success = UltraCode.getUltra(element, 'success', null);
                    if (success != null)
                        SuccessCall = function () { if (IsDebug) console.log(success); UltraCode.Run(element, success); }
                }
                if (typeof ErrorCall === 'undefined') {
                    var error = UltraCode.getUltra(element, 'error', null);
                    if (error != null)
                        ErrorCall = function () { if (IsDebug) console.log(error); UltraCode.Run(element, error); }
                }

                //Get Target
                targetId = UltraCode._GetTarget(element, targetId, ultraType);
                UltraCode._Run(element, url, ultraType, targetId, SuccessCall, ErrorCall);
            }
            else {
                Platform.showLog("Error in validation" + UltraForm.ShowHint(), 'warning');
                if (UltraForm.ShowHint() != '')
                    Platform.ShowNotice('warning', Platform.Language('warning'), UltraForm.ShowHint());
            }
        }
        catch (err) {
            Platform.ShowNotice('Error', Platform.Language('Error'), Platform.Language('ErrorInSend'));
            Platform.showLog(Platform.Language('ErrorInSend'), 'warning', err);
        }
    }

    this.Show = function (element, url, SuccessCall, ErrorCall) {
        UltraCode.setDisable(element);
        //Ultra
        if ((url.indexOf('(') > 0) && (url.indexOf(')') > 0)) {
            var funcName = url.substring(0, url.indexOf('('));
            var funcParam = url.substring(url.indexOf('(') + 1, url.lastIndexOf(')'));
            try {
                if (IsDebug)
                    Platform.showLog('function:' + funcName + ' param:' + funcParam);
                var func = _UltraFunction.find(Funcs => Funcs.Name.toLowerCase() == funcName.toLowerCase());
                if (typeof func !== 'undefined')
                    func.Action(element, funcParam);
                else
                    Platform.showLog(Platform.Language('ErrorFindFunction') + ':' + funcName + " param:" + funcParam);
            }
            catch (err) {
                Platform.showLog('Initial Ultra function (' + funcName + ')', 'error', err);
            }
        }
        //Ultra Action
        else {
            if (typeof SuccessCall === 'undefined') {
                var success = UltraCode.getUltra(element, 'success', null);
                if (success != null)
                    SuccessCall = function () { if (IsDebug) console.log(success); UltraCode.Run(element, success); }
            }
            if (typeof ErrorCall === 'undefined') {
                var error = UltraCode.getUltra(element, 'error', null);
                if (error != null)
                    ErrorCall = function () { if (IsDebug) console.log(error); UltraCode.Run(element, error); }
            }

            var ultraType = UltraCode.getUltra(element, 'type', 'page').toLowerCase();
            if (IsDebug)
                Platform.showLog(url + ' type:' + ultraType);

            var Option = {};
            if (ultraType == 'dialog') {
                Option.width = UltraCode.getUltra(element, 'width', '0.8');
                Option.height = UltraCode.getUltra(element, 'height', '0.8');
            }

            //Get Target
            var targetId = UltraCode._GetTarget(element, targetId, ultraType);
            return UltraCode._Run(element, url, ultraType, targetId, SuccessCall, ErrorCall, Option);
        }
    }

    //Ultra Code
    var _UltraRole = [];
    this.initialRole = function (Name, Action) {
        _UltraRole.push({ Name: Name, Action: Action, Active: true });
        if (IsDebug)
            Platform.showLog('Install' + Name);
    }

    //Ultra Code
    var _UltraFunction = [];
    this.initialFunction = function (Name, Action) {
        _UltraFunction.push({ Name: Name, Action: Action, Active: true });
        if (IsDebug)
            Platform.showLog('Install' + Name);
    }
    //Initial Ultra Role
    this.initialUltraRole = function (element, roles) {
        if ((element.getAttribute('ultra-role') != null) && (element.getAttribute('ultra-active') == null)) {
            roles.forEach(function (item, index) {
                try {
                    if (IsDebug)
                        Platform.showLog('inital Role:' + item + " id:" + element.id);

                    if (item.indexOf("-") > 0)
                        item = item.substring(0, item.indexOf("-"));

                    var Role = _UltraRole.find(Roles => Roles.Name.toLowerCase() == item);
                    if (typeof Role !== 'undefined') {
                        if (Role.Active)
                            Role.Action(element, index == roles.length - 1);
                        else
                            Platform.showLog(Platform.Language('RoleIsInActive') + ':>' + item + "< id:" + element.id);
                    }
                    else
                        Platform.showLog(Platform.Language('ErrorFindRole') + ':>' + item + "< id:" + element.id);
                }
                catch (err) {
                    Platform.showLog('Initial Ultra Code Role (' + roles + ')', 'error', err);
                }
            });
            if (element.getAttribute('ultra-active') == null)
                UltraCode.setAttribute(element, 'ultra-active', 'false');
        }
    }
    //Initial Ultra
    this.initUltraCode = function (base) {
        /*ultra*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra]'), function (element) {
                if (element.getAttribute('ultra-active') == null) {
                    var ultras = element.getAttribute('ultra').trim().split(';');
                    ultras.forEach(function (item) {
                        if (item.trim() != '')
                            UltraCode.Run(element, item.trim());
                    });
                    ///initial Ultra Role
                    if (element.getAttribute('ultra-role') != null) {
                        //if (element.getAttribute('ultra-active') != null)
                        //    element.removeAttribute('ultra-active');

                        var roles = element.getAttribute('ultra-role').toLowerCase().replaceAll(',', '|').split('|');
                        UltraCode.initialUltraRole(element, roles);
                    }
                    else {
                        UltraCode.setAttribute(element, 'ultra-active', 'ultra', true);
                        element.classList.add('sp-ultra-active');
                    }
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Form ', 'error', err);
        }
        /*role*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-role]'), function (element) {
                if (element.getAttribute('ultra-active') == null)
                    UltraCode.initialUltraRole(element, element.getAttribute('ultra-role').toLowerCase().replaceAll(',', '|').split('|'));
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Roles ', 'error', err);
        }
        /*form*/
        try {
            Array.prototype.forEach.call(__(base, 'form[form-action],ultra-form[form-action]'), function (frm) {
                if (UltraCode.getAttribute(frm, 'form-active', '') == '') {
                    var Result = UltraForm.initial(frm);
                    if (Result) {
                        /*submit*/
                        _ReadySubmit()
                        if (frm.getAttribute('form-submit') != null) {
                            _ReadySubmit(function (evt) {
                                UltraCode.submit(frm, frm, frm.getAttribute('form-submit'), UltraCode.getAttribute(frm, 'form-target', SectionMain));
                            });
                        }
                        /*Action*/
                        Array.prototype.forEach.call(__(frm, '*[form-action]'), function (element) {
                            //check form into parent form
                            if (element.tagName.toLowerCase() != "ultra-form") {
                                if (IsDebug)
                                    console.log(element);
                                var action = UltraCode.getAttribute(element, 'form-action', 'save').toLowerCase();
                                if (action == 'cancel') {
                                    if (element.onclick == null) {
                                        element.onclick = function (evt) {
                                            ShowRun(_appendUrl(frm.getAttribute('form-action'), 'cancel'),
                                                UltraCode.getAttribute(element, 'form-target', SectionMain));
                                            return false;
                                        }
                                        element.classList.add('sp-ultra-active');
                                    }
                                }
                                else if (element.onclick == null) {
                                    element.onclick = function (evt) {
                                        if (evt.target != null)
                                            evt.target.disabled = true;
                                        //Send Data 
                                        UltraCode.submit(element, frm, action, UltraCode.getAttribute(element, 'form-target', SectionMain));
                                        if (evt.target != null)
                                            evt.target.disabled = false;
                                        return false;
                                    }
                                    element.classList.add('sp-ultra-active');
                                }
                            }
                        });

                        frm.setAttribute('form-active', 'true');
                    }
                    else {
                        frm.setAttribute('form-active', 'false');

                        Platform.showLog('Initial Ultra Code Form ', 'error');
                    }
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Form ', 'error', err);
        }
        /*action*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-action]'), function (element) {
                if ((element.onclick == null) && (element.getAttribute('ultra-active') == null) &&
                    (UltraCode.getAttribute(element, 'disabled', null) == null)) {
                    element.onclick = function (evt) {
                        /*Start*/
                        if (UltraCode.getUltra(element, 'start', '') != '')
                            UltraCode.Show(element, UltraCode.getUltra(element, 'start'));
                        /*Confirm*/
                        if (UltraCode.getUltra(element, 'confirm', '') != '') {
                            if (confirm(UltraCode.getUltra(element, 'confirm', '')))
                                UltraCode.Show(element,
                                    UltraCode.getParam(element, UltraCode.getUltra(element, 'action'), UltraCode.getUltra(element, 'param', '')))
                        }
                        else
                            UltraCode.Show(element,
                                UltraCode.getParam(element, UltraCode.getUltra(element, 'action'), UltraCode.getUltra(element, 'param', '')))
                        //Close Dialog
                        if (UltraCode.getUltra(element, 'close', '') != '')
                            CloseDialog();

                        evt.stopPropagation();
                        return false;
                    }
                    element.classList.add("sp-ultra-active");
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Action ', 'error', err);
        }
        /*onchange*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-change]'), function (element) {
                if ((element.onchange == null) && (element.getAttribute('ultra-active') == null) &&
                    (UltraCode.getAttribute(element, 'disabled', null) == null)) {
                    element.onchange = function (evt) {
                        //Show Logs
                        if (IsDebug)
                            Platform.showLog(UltraCode.getUltra(element, 'change'));
                        //Run ultra-change
                        UltraCode.Show(element, UltraCode.getParam(element, UltraCode.getUltra(element, 'change'),
                            UltraCode.getUltra(element, 'param', '')));
                        if (evt != null) evt.stopPropagation();
                        return false;
                    }
                    element.classList.add("sp-ultra-active");
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Chnage ', 'error', err);
        }
        /*onclick*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-click]'), function (element) {
                if ((element.onclick == null) && (element.getAttribute('ultra-active') == null)) {
                    element.onclick = function (evt) {
                        UltraCode.Show(element, UltraCode.getParam(element, UltraCode.getAttribute(element, 'ultra-click'),
                            UltraCode.getAttribute(element, 'ultra-param', '')));
                        evt.stopPropagation();
                        return false;
                    }
                    element.classList.add("sp-ultra-active");
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Click', 'error', err);
        }
        /*onblur*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-blur]'), function (element) {
                if ((element.onblur == null) && (element.getAttribute('ultra-active') == null)) {
                    element.onblur = function (evt) {
                        UltraCode.Show(element, UltraCode.getParam(element, UltraCode.getUltra(element, 'blur'),
                            UltraCode.getUltra(element, 'param', '')))
                        evt.stopPropagation();
                        return false;
                    }
                    element.classList.add('sp-ultra-active');
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code blur ', 'error', err);
        }
        /*drag*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-drag]'), function (element) {
                element.draggable = true;
                if (element.ondragstart == null) {
                    element.ondragstart = function (evt) {
                        var ultradarg = element.getAttribute('ultra-drag');
                        //drag a tag sub element
                        if (ultradarg.startsWith(">")) {
                            var nodeList = __(element, ultradarg.replace('>', ''))
                            if ((nodeList != null) && (nodeList.length > 0))
                                ultradarg = nodeList[0].innerHTML.trim().replaceAll('&amp;', '&').
                                    replaceAll('  ', '').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
                        }
                        else if (ultradarg == "")
                            ultradarg = element.innerHTML;
                        evt.dataTransfer.setData('text', ultradarg);
                    }
                }
                if (element.ondragstart == null) {
                    element.ondragend = function (evt) {
                    }
                }
                if (element.ondragstart == null) {
                    element.ondragover = function (evt) {
                        evt.preventDefault();
                    }
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Drag', 'errro', err);
        }
        /*drop*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-drop]'), function (element) {
                if (element.ondrop == null) {
                    element.ondrop = function (evt) {
                        evt.preventDefault();
                        if (IsDebug)
                            Platform.showLog(_appendUrl(UltraCode.getAttribute(element, 'ultra-drop'), '', 'drag=' + evt.dataTransfer.getData("text")));
                        UltraCode.Show(element, _appendUrl(UltraCode.getAttribute(element, 'ultra-drop'), '', 'drag=' + evt.dataTransfer.getData("text")));

                        evt.preventDefault();
                        return false;
                    }
                }
                if (element.ondragover == null) {
                    element.ondragover = function (evt) {
                        evt.preventDefault();
                    }
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Drop', 'error', err);
        }
        /*select*/
        try {
            Array.prototype.forEach.call(__(base, '[ultra-select]'), function (element) {
                if ((element.getAttribute('data-select') == null) || (element.getAttribute('data-select') != 'select')) {
                    //Select when input or select
                    if ((element.tagName.toLowerCase() == 'select') || (element.tagName.toLowerCase() == "input")) {
                        element.value = UltraCode.getAttribute(element, 'ultra-select');
                        element.setAttribute('data-select', 'select');

                        if ((element.onchange != null) || (UltraCode.Boolean(UltraCode.getAttribute(element, 'ultra-changed')))) {
                            if (typeof element.onchange == 'function')
                                try {
                                    element.onchange();
                                }
                                catch (err) {
                                    Platform.showLog('ErrorInChange', 'warning', err);
                                }
                        }
                    }
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Select ' + err);
        }
        /*menu*/
        try {
            Array.prototype.forEach.call(__(base, '*[ultra-popup]'), function (element) {
                if ((element.oncontextmenu == null) && (UltraCode.getAttribute(element, 'disabled', null) == null)) {
                    element.oncontextmenu = function (evt) {
                        Platform.ShowPopup(evt, UltraCode.getAttribute(element, 'ultra-popup'), 150, 200);

                        evt.stopPropagation();
                        return false;
                    }
                    element.classList.add("sp-ultra-active");
                }
            });
        }
        catch (err) {
            Platform.showLog('Initial Ultra Code Action ', 'error', err);
        }

        return true;
    }

    ///get Plugin is Active and is Exist and Set Active and InActive
    this.Role = function (RoleName, Status) {
        var Role = _UltraRole.find(Roles => Roles.Name.toLowerCase() == RoleName.toLowerCase());
        if (typeof Role !== 'undefined') {
            //Get Role Status
            if (typeof Status === 'undefined') {
                if (Role.Active) {
                    Platform.showLog(Platform.Language('RoleIsActive') + ':' + Platform.Language(RoleName));
                    return true;
                }
                else {
                    Platform.showLog(Platform.Language('RoleIsInActive') + ':' + Platform.Language(RoleName));
                    return false;
                }
            }
            //Set Role Status
            else {
                Role.Active = Status;
                return true;
            }
        }
        else {
            Platform.showLog(Platform.Language('ErrorFindRole') + ':' + Platform.Language(RoleName));
            return false;
        }
    }
    ///get Plugin is Active and is Exist
    this.Function = function (FunctionName, Status) {
        var Function = _UltraFunction.find(Functions => Functions.Name.toLowerCase() == FunctionName.toLowerCase());
        if (typeof Function !== 'undefined') {
            //Get Role Status
            if (typeof Status === 'undefined') {
                if (Function.Active) {
                    Platform.showLog(Platform.Language('FunctionIsActive') + ':' + Platform.Language(Function));
                    return true;
                }
                else {
                    Platform.showLog(Platform.Language('FunctionIsInActive') + ':' + Platform.Language(Function));
                    return false;
                }
            }
            //Set Role Status
            else {
                Function.Active = Status;
                return true;
            }
        }
        else {
            Platform.showLog(Platform.Language('ErrorFindFunction') + ':' + Platform.Language(Function));
            return false;
        }
    }
};

var _HtmlEditor = [];
const UltraForm = new function () {
    var HintTag = '';
    var Hint = '';
    this.ShowHint = function () {
        if (HintTag != '')
            return '<span>' + Hint + '</span>';
        else
            return Hint;
    }
    // Validate Phone
    this.phonenumber = function (Mobile) {
        var phoneno = " /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/";
        if (Mobile.match(phoneno)) {
            return true;
        }
        else {
            if (this.HintDetailTag != '')
                Hint += '<span>' + CsValidPhone + '</span>';
            else
                Hint += CsValidPhone;
            return false;
        }
    }

    this.initial = function (form) {
        try {
            if (!this.checkForm(form))
                return false;

            var elements = this.getElements(form);
            if ((elements == null) || (typeof elements == 'undefined'))
                return false;

            for (var i = 0; i < elements.length; i++) {
                var item = elements[i];
                if (item.id != '') {
                    switch (item.tagName.toLowerCase()) {
                        case 'input':
                            //Old version
                            if (item.getAttribute('data-type') != undefined) {
                                var DataType = item.getAttribute('data-type');
                                if ((DataType.toLowerCase() == 'date') && (item.getAttribute('ultra-role') == undefined)) {
                                    UltraCode.initialUltraRole(item, 'datepicker');
                                }
                                else if ((DataType.toLowerCase() == 'time') && (item.getAttribute('ultra-role') == undefined)) {
                                    UltraCode.initialUltraRole(item, 'timepicker');
                                }
                                //Control Max length in number
                                else if ((DataType.toLowerCase() == 'number') && (item.getAttribute('maxlength') != undefined))
                                    item.addEventListener('keydown',
                                        function (evt) {
                                            var key = evt.keyCode ? evt.keyCode : evt.which;

                                            if (((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) &&
                                                (this.value.length + 1 > parseFloat(evt.target.getAttribute('maxlength')))) {
                                                evt.preventDefault();
                                                return false;
                                            }
                                        });
                            }
                            //Key Press when ultra-role is null
                            if ((item.getAttribute('ultra-role') == undefined) && (item.getAttribute("type") != 'hidden')) {
                                item.addEventListener('keypress', Platform.nextInput);

                                //set focus Select
                                if (!UltraCode.getReadonly(item)) {
                                    item.addEventListener('focus', function (evt) {
                                        if (evt.target != null) evt.target.select();
                                    });
                                }
                                //check Input
                                if (!UltraCode.getReadonly(item)) {
                                    item.addEventListener("input", UltraCode.checkInput);
                                    item.addEventListener("blur", UltraCode.checkInput);
                                }
                            }
                            break;
                        case 'select':
                            if (!UltraCode.getReadonly(item))
                                item.addEventListener("blur", UltraCode.checkInput);
                            break;
                        case 'textarea':
                            if ((item.getAttribute('data-editor') != undefined)) {
                                if (typeof initEditor != 'undefined')
                                    initEditor(item.id);
                                else
                                    Platform.showLog('initEditor is undefined');
                            }
                            else if (item.getAttribute('data-html') != undefined) {
                                if (typeof HtmlEditor != 'undefined') {
                                    switch (item.getAttribute('data-html').toLowerCase()) {
                                        case ".sql":
                                        case "sql":
                                            if (typeof initSqlEditor != undefined)
                                                _HtmlEditor[item.id] = initSqlEditor(item);
                                            else
                                                Platform.showLog('initSqlEditor is undefined');
                                            break;
                                        case ".js":
                                        case "js":
                                            if (typeof initJavaEditor != undefined)
                                                _HtmlEditor[item.id] = initJavaEditor(item);
                                            else
                                                Platform.showLog('initJavaEditor is undefined', 'error');
                                            break;
                                        case ".css":
                                        case "css":
                                            if (typeof initCssEditor != undefined)
                                                _HtmlEditor[item.id] = initCssEditor(item);
                                            else
                                                Platform.showLog('initCssEditor is undefined', 'error');
                                            break;
                                        case "ultra":
                                            if (typeof initUltraEditor != undefined)
                                                _HtmlEditor[item.id] = initUltraEditor(item);
                                            else
                                                Platform.showLog('initUltraEditor is undefined', 'error');
                                            break;
                                        default:
                                            if (typeof initHtmlEditor != undefined)
                                                _HtmlEditor[item.id] = initHtmlEditor(item);
                                            else
                                                Platform.showLog('initHtmlEditor is undefined', 'error');
                                            break;
                                    }
                                    _HtmlEditor[item.id].refresh();
                                }
                                else
                                    Platform.showLog('HtmlEditor is undefined', 'error');
                            }
                            else if (!UltraCode.getReadonly(item))
                                item.addEventListener("blur", UltraCode.checkInput);
                    }
                }
            }

            return true;
        }
        catch (err) {
            Platform.showLog(Platform.Language('ErrorIninitail'), 'warning', err);

            return false;
        }
    };

    this.getInput = function (form, q, element) {
        switch (element.tagName.toLowerCase()) {
            case 'input':
                switch (element.type) {
                    case 'checkbox':
                    case 'radio':
                        if ((element.indeterminate == null) || (element.indeterminate != true)) {
                            if (element.getAttribute('data-name') != null) {
                                if (element.getAttribute('data-name') != '')
                                    q.push(element.getAttribute('data-name') + '=' + element.checked);
                            }
                            else if (element.id != '')
                                q.push(element.id + '=' + element.checked);
                        }
                        break;
                    case 'hidden':
                        //choise
                        var value = element.value;
                        if (element.getAttribute('data-group') != null) {
                            value = '';
                            var elements = this.getElements(form);
                            if ((elements == null) || (typeof elements == 'undefined'))
                                break;

                            for (var i = 0; i < elements.length; i++) {
                                var item = elements[i];
                                if ((element.getAttribute('data-group') == item.getAttribute('data-group')) && (item.checked)) {
                                    if (value != '') value += ',';
                                    value += item.value;
                                }
                            }
                        }
                        if (element.getAttribute('data-name') != null) {
                            if (element.getAttribute('data-name') != '')
                                q.push(element.getAttribute('data-name') + '=' + encodeURIComponent(value));
                        }
                        else
                            q.push(element.id + '=' + encodeURIComponent(value));
                        break;
                    case 'button':
                        break;
                    default:
                        if (element.getAttribute('data-name') != null) {
                            if (element.getAttribute('data-name') != '')
                                q.push(element.getAttribute('data-name') + '=' + encodeURIComponent(element.value));
                        }
                        else
                            q.push(element.id + '=' + encodeURIComponent(element.value));
                        break;
                }
                break;
            case 'file':
                break;
            case 'textarea':
                try {
                    var value = encodeURIComponent(element.value);
                    if ((element.getAttribute('data-editor') != null) && (typeof getEditor != undefined))
                        value = encodeURIComponent(getEditor(element.id));
                    else if ((element.getAttribute('data-html') != undefined) && (_HtmlEditor[element.id] != null))
                        value = encodeURIComponent(_HtmlEditor[element.id].getValue());

                    if (element.getAttribute('data-name') != null) {
                        if (element.getAttribute('data-name') != '')
                            q.push(element.getAttribute('data-name') + '=' + value);
                    }
                    else
                        q.push(element.id + '=' + value);
                }
                catch (err) {
                    Platform.showLog(Platform.Language('ErrorFindData') + ' editor ', 'warning', err);
                }
                break;
            case 'select':
                switch (element.type) {
                    case 'select-one':
                        if (element.getAttribute('data-name') != undefined) {
                            if (element.getAttribute('data-name') != '')
                                q.push(element.getAttribute('data-name') + '=' + encodeURIComponent(element.value));
                        }
                        else
                            q.push(element.id + '=' + encodeURIComponent(element.value));
                        break;
                    case 'select-multiple':
                        for (var j = element.options.length - 1; j >= 0; j = j - 1) {
                            var value = '';
                            if (element.options[j].selected)
                                value += element.options[j].value;

                            if (element.getAttribute('data-name') != undefined) {
                                if (element.getAttribute('data-name') != '')
                                    q.push(element.getAttribute('data-name') + '=' + encodeURIComponent(value));
                            }
                            else
                                q.push(element.id + '=' + encodeURIComponent(value));
                        }
                        break;
                }
                break;
        }
    };
    //serialize
    this.serialize = function (form) {
        if (!this.checkForm(form))
            return false;

        var q = [];
        var elements = this.getElements(form);
        if ((elements == null) || (typeof elements == 'undefined'))
            return false;

        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            if (item.id != '')
                this.getInput(form, q, item);
        }
        return q.join('&');
    };

    this.ValidNumber = function (Number) {
        if (!isNaN(parseFloat(Number)) && isFinite(Number) == 'False')
            ShowNotice('Error', '', CsValidNumber);
        return !isNaN(parseFloat(Number)) && isFinite(Number);
    }
    this.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    this.checkForm = function (form) {
        const _form = this.getForm(form);
        if (_form == null || (_form.tagName.toLowerCase() !== 'form' && _form.tagName.toLowerCase() !== 'ultra-form')) {
            Platform.showLog(Platform.Language('ErrorFindData'), 'error', _form);

            Platform.ShowNotice('Error', Platform.Language('ErrorFindData'), 'validation:formid :' + form);
            return false;
        }
        else
            return true;
    }
    this.getForm = function (form) {
        if (typeof form === 'string')
            return _(form);
        else
            return form;
    }
    this.getElements = function (form) {
        const _form = this.getForm(form);
        if (typeof _form.elements != 'undefined')
            return _form.elements;
        else
            return _form.querySelectorAll('input,select,textarea,button');
    }
    this.validation = function (form) {
        Hint = '';
        if (!this.checkForm(form))
            return false;

        var elements = this.getElements(form);
        if ((elements == null) || (typeof elements == 'undefined')) {
            Platform.ShowNotice('Error', Platform.Language('ErrorFindData'), 'elements:formid :' + form);
            return false;
        }

        var Result = true;
        for (let i = 0; i < elements.length; i++) {
            var item = elements[i];
            if (item.id != '') {
                if (!UltraCode.Validate(item, function (error) { Hint += error })) {
                    Result = false;
                }
                else
                    item.style.borderColor = '#cccccc';
            }
        }
        return Result;
    };
    this.clear = function (form) {
        if (!this.checkForm(form))
            return false;
        var elements = this.getElements(form);
        if ((elements == null) || (typeof elements == 'undefined'))
            return false;

        for (let i = 0; i < elements.length; i++) {
            var item = elements[i];
            if (item.id != '') {
                switch (item.tagName.toLowerCase()) {
                    case 'input':
                        switch (item.type) {
                            case 'checkbox':
                            case 'radio':
                                item.checked = false;
                                break;
                            case 'button':
                                break;
                            default:
                                item.value = '';
                                break;
                        }
                        break;
                    case 'file':
                        item.removeAttribute('success');
                        break;
                    case 'textarea':
                        item.value = '';
                        break;
                    case 'select':
                        item.value = '';
                        break;
                }
            }
        };
        return;
    };


    this.sendData = function (element, form, url, targetId, SuccessCall, ErrorCall, Option) {
        UltraCode.setDisable(element);

        if (IsDebug)
            Platform.showLog('SendData:Url' + url + ' Target:' + targetId + ' Option:' + Option);
        this.upload(element, form, url, targetId, SuccessCall, ErrorCall, Option);
    }

    this.upload = function (element, form, url, targetId, SuccessCall, ErrorCall, Option) {
        if (!this.checkForm(form))
            return false;
        //Start Update 
        var IsStartUpdate = false;
        var elements = this.getElements(form);
        if ((elements == null) || (typeof elements == 'undefined'))
            return false;

        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            if ((item.id != '') && (item.value != '')) {
                switch (item.type) {
                    case 'file':
                        if ((item.getAttribute('success') == null) && (!IsStartUpdate)) {
                            IsStartUpdate = true;
                            item.setAttribute('success', 'true');
                            if (item.files.length > 0) {
                                //StartUpload
                                Platform.PlatformStatus(targetId, 'Start Upload');

                                var UploadUrl = '';
                                if (item.getAttribute('Url') != null) {
                                    UploadUrl = item.getAttribute('Url');
                                    if (IsDebug)
                                        Platform.showLog("Upload Url:" + UploadUrl, 'info');
                                }
                                if (item.getAttribute('directory') != null) {
                                    UploadUrl = item.getAttribute('directory');
                                    if (IsDebug)
                                        Platform.showLog("Upload directory:" + UploadUrl, 'info');
                                }
                                var UploadOption = '';
                                if (item.getAttribute('naming') != null) {
                                    UploadOption = 'naming=' + item.getAttribute('naming');
                                    if (IsDebug)
                                        Platform.showLog("Upload directory:" + UploadOption, 'info');
                                }
                                var PreviewTarget = '';
                                if (UltraCode.getAttribute(item, 'preview', null) != null) {
                                    PreviewTarget = item.getAttribute('preview');
                                    if (IsDebug)
                                        Platform.showLog("Preview target:" + PreviewTarget, 'info');
                                }
                                var UploadTarget = item.id + 'Url';
                                if (UltraCode.getAttribute(item, 'ultra-target', '') != '')
                                    UploadTarget = UltraCode.getAttribute(item, 'ultra-target', '');

                                Platform.UploadFile(item.id, UploadUrl, targetId, UploadOption,
                                    function (ItemName, FileUrl, PreviewUrl) {
                                        if (_(UploadTarget, true) != null)
                                            _(UploadTarget, true).value = FileUrl;
                                        if (_(PreviewTarget, true) != null)
                                            _(PreviewTarget, true).value = PreviewUrl;

                                        UltraForm.upload(element, form, url, targetId, SuccessCall, ErrorCall, Option);
                                    });
                                return;
                            }
                        }
                        break;
                }
            }
        }
        //Send Data
        if (!IsStartUpdate) {
            var Serialize = this.serialize(form);
            if (IsDebug)
                Platform.showLog('Serialize:' + Serialize);

            var UltraType = 'run';
            if ((Option != undefined) && (Option.ultratype != null))
                UltraType = Option.ultratype;

            Platform.PlatformStatus(targetId, CsSendData, UltraType);

            if (url.includes('?'))
                url += "&" + Serialize;
            else
                url += "?" + Serialize;
            UltraCode._Run(element, url, UltraType, targetId, SuccessCall, ErrorCall, Option);
        }
    }
}

/*** Cookies ***/
const UltraCookie = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" +
            encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires +
            (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};
/** Storage **/
const UltraStorage = {
    getItem: function (sKey) {
        return localStorage.getItem(sKey);
    },
    setItem: function (sKey, sValue) {
        localStorage.setItem(sKey, sValue);
    },
    removeItem: function (sKey) {
        localStorage.removeItem(sKey);
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return localStorage.getItem(sKey) != null
    }
};

/** Language **/
const UltraLanguage = {
    getString: function (language, string) {
        return string.replace(/[\u0660-\u0669]/g, function (c) {
            return c.charCodeAt(0) - 0x0660;
        }).replace(/[\u06f0-\u06f9]/g, function (c) {
            return c.charCodeAt(0) - 0x06f0;
        });
    },
    getKey: function (language, key) {
        if ((key >= 0x0660) && (Key <= 0x0669))
            return key - 0x0660;
        else if ((key >= 0x06f0) && (Key <= 0X06f9))
            return key - 0x06f0;
        else
            return key;
    }
}
//selector of element
//Default Selector is Id
//option can create and error is true
//Element and selector
function _(selector, option) {
    var node = null;
    if ((typeof selector === 'object') && (selector != null)) {
        if ((typeof option !== 'undefined') && (option != '')) {
            if ((option.includes('.')) || (option.includes('[')) || (option.includes(' ')) ||
                (option.includes('>')) || (option.includes('#')))
                node = selector.querySelectorAll(option);
            else
                node = selector.querySelectorAll('#' + option);
            if (node.length > 0)
                node = node[0];
            else
                node = null;
        }
    }
    else if (typeof selector === 'string' || selector instanceof String) {
        if ((selector.includes('.')) || (selector.includes('[')) || (selector.includes(' ')) ||
            (selector.includes('>')) || (selector.includes('#')))
            node = document.querySelector(selector);
        else
            node = document.getElementById(selector)
    }
    //check exist node
    if (node == null) {
        if ((typeof option === 'string') && (option.toLowerCase() == 'create')) {
            node = document.createElement('DIV');
            node.id = selector;
            document.body.appendChild(node);
        }
        else if ((typeof option !== 'undefined') && (option == true))
            Platform.showLog(Platform.Language('ErrorFindElement') + selector, 'warning');
    }
    return node;
}
//list of elements
function __(element, selector) {
    try {
        if (typeof selector == 'undefined')
            return document.querySelectorAll(element);
        else if (typeof element !== 'string')
            return element.querySelectorAll(selector);
        else if (_(element, true) != null)
            return _(element).querySelectorAll(selector);
        else
            Platform.showLog(Platform.Language('ErrorFindElement') + element, 'warning');
    }
    catch (err) {
        Platform.showLog(Platform.Language('ErrorFindElement'), 'error', err);
    }
}
//Set Value in Item
function _Value(selector) {
    return _(selector, true).value;
}
function _Value2(selector) {
    return encodeURIComponent(_(selector, true).value);
}
function _Checked(id, value) {
    element = _(id, true);
    if (element != null) {
        element.checked = UltraCode.Boolean(value);
        if ((element.onchange != null) || (UltraCode.Boolean(UltraCode.getAttribute(element, 'ultra-changed')))) {
            if (typeof element.onchange == 'function')
                try {
                    element.onchange();
                }
                catch (err) {
                    Platform.showLog(Platform.Language('ErrorInChange'), 'warning', err);
                }
        }
    }
}
//Add style into element
function _Style(id, styleProp) {
    var x = _(id);
    if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
    else if (x.currentStyle)
        var y = x.currentStyle[styleProp];
    return y;
}
function dogValue2(element) {
    Platform.showLog('old version');
    return _Value2(element)
}
function dog(element, option) {
    Platform.showLog('old version');
    return _(element, option);
}
function dogValue(element) {
    Platform.showLog('old version');
    return _Value(element);
}
function dogChecked(element, value) {
    Platform.showLog('old version');
    _Checked(element, value);
}

function printDiv(divName) {
    window.frames["print_frame"].document.body.innerHTML = _(divName).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
    //var printContents = ; 
    //var originalContents = document.body.innerHTML;
    //document.body.innerHTML = printContents;
    //window.print();
    //document.body.innerHTML = originalContents;
    //_Ready();
}
/* Show Popup */
function ShowPopup(evt, title, content) {
    if (_('divPopOver', 'create').innerHTML == '')
        _('divPopOver', 'create').innerHTML = "<div class='sp-popover' style='top:" + Platform.mouseY(evt) + "px;left:" + Platform.mouseX(evt) + "px'>" +
            "<div class='sp-arrow'></div><div class='sp-popover-title'>" + title + "</div><div class='sp-popover-content'>" + content + "</div><div>";
    else
        _('divPopOver', 'create').innerHTML = '';
    return false;
}
/*** AJAX ***/
var dynamicContent_ajaxObjects = new Array();
function sack(file) {
    this.xmlhttp = null;
    this.resetData = function () {
        this.method = "POST";
        this.queryStringSeparator = "?";
        this.argumentSeparator = "&";
        this.URLString = "";
        this.encodeURIString = true;
        this.execute = false;
        this.requestFile = file;
        this.vars = new Object();
        this.responseStatus = new Array(2);
        this.responseType = 'text';
        this.responseURL = '';
        this.contentType = "application/x-www-form-urlencoded";
    };

    this.resetFunctions = function () {
        this.onLoading = function () { };
        this.onLoaded = function () { };
        this.onInteractive = function () { };
        this.onCompletion = function () { };
        this.onError = function () { };
        this.onFail = function () { };
    };

    this.reset = function () {
        this.resetFunctions();
        this.resetData();
    };

    this.createAJAX = function () {
        try {
            this.xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (err) {
            try {
                this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (err) {
                this.xmlhttp = null;
            }
        }

        if (!this.xmlhttp) {
            if (typeof XMLHttpRequest != 'undefined') {
                this.xmlhttp = new XMLHttpRequest();
            } else {
                this.failed = true;
                ShowNotice('Error', '', Platform.Language('brower XML Http Requst'));
            }
        }
    };

    this.setVar = function (name, value) {
        this.vars[name] = Array(value, false);
    };

    this.encVar = function (name, value, returnvars) {
        if (true == returnvars)
            return Array(encodeURIComponent(name), encodeURIComponent(value));
        else
            this.vars[encodeURIComponent(name)] = Array(encodeURIComponent(value), true);
    }

    this.processURLString = function (string, encode) {
        encoded = encodeURIComponent(this.argumentSeparator);
        regexp = new RegExp(this.argumentSeparator + "|" + encoded);
        varArray = string.split(regexp);
        for (var i = 0; i < varArray.length; i++) {
            urlVars = varArray[i].split('=');
            if (true == encode)
                this.encVar(urlVars[0], urlVars[1]);
            else
                this.setVar(urlVars[0], urlVars[1]);
        }
    }

    this.createURLString = function (urlstring) {
        if (this.encodeURIString && this.URLString.length)
            this.processURLString(this.URLString, true);

        if (urlstring) {
            if (this.URLString.length)
                this.URLString += this.argumentSeparator + urlstring;
            else
                this.URLString = urlstring;
        }

        /* prevents caching of URLString*/
        this.setVar('_rndval', new Date().getTime());

        var urlstringtemp = new Array();
        for (var key in this.vars) {
            if (false == this.vars[key][1] && true == this.encodeURIString) {
                var encoded = this.encVar(key, this.vars[key][0], true);
                delete this.vars[key];
                this.vars[encoded[0]] = Array(encoded[1], true);
                key = encoded[0];
            }
            urlstringtemp[urlstringtemp.length] = key + '=' + this.vars[key][0];
        }
        if (urlstring)
            this.URLString += this.argumentSeparator + urlstringtemp.join(this.argumentSeparator);
        else
            this.URLString += urlstringtemp.join(this.argumentSeparator);
    }
    this.runResponse = function () {
        eval(this.response);
    }
    this.runAJAX = function (urlstring) {
        if (this.failed) {
            this.onFail();
            Platform.showLog('Fail', 'warning');
        } else {
            this.createURLString(urlstring);
            if (this.xmlhttp) {
                var self = this;
                this.xmlhttp.open(this.method, this.requestFile, true);
                try {
                    this.xmlhttp.setRequestHeader("Content-Type", this.contentType)
                } catch (e) { }

                this.xmlhttp.onreadystatechange = function () {
                    switch (self.xmlhttp.readyState) {
                        case 1:
                            self.onLoading();
                            break;
                        case 2:
                            self.onLoaded();
                            break;
                        case 3:
                            self.onInteractive();
                            break;
                        case 4:
                            if (IsDebug)
                                console.log(self.xmlhttp);
                            self.response = self.xmlhttp.responseText;
                            self.responseType = self.xmlhttp.responseType;
                            self.responseURL = self.xmlhttp.responseURL;
                            self.responseXML = self.xmlhttp.responseXML;
                            self.responseStatus[0] = self.xmlhttp.status;
                            self.responseStatus[1] = self.xmlhttp.statusText;
                            if (self.execute)
                                self.runResponse();
                            if (self.responseStatus[0] == '200')
                                self.onCompletion();
                            else {
                                self.onError();
                                if (self.responseStatus[0] != null)
                                    Platform.showLog('code:' + self.responseStatus[0] + ':' + self.responseStatus[1], 'warning');
                            }
                            self.URLString = '';

                            delete self.xmlhttp['onreadystatechange'];
                            self.xmlhttp = null;
                            self.responseStatus = null;
                            self.response = null;
                            self.responseXML = null;
                            break;
                    }
                };
                try {
                    this.xmlhttp.getResponseHeader("Set-Cookie");
                    this.xmlhttp.withCredentials = true;
                    this.xmlhttp.send(this.URLString);
                } catch (err) {
                    Platform.showLog('ErrorInAjax', 'error', err);
                }
            }
        }
    };
    this.reset();
    this.createAJAX();
}
/*** platform Ajax ***/
/*Notice*/
var _Notice = 0;
function ShowNotice(type, Title, Message, Option) {
    Platform.ShowNotice(type, Title, Message, Option);
}
//Page
function ShowPage(Url, targetId, Ishistory) {
    if (typeof targetId === 'undefined')
        targetId = SectionMain;
    Platform.ShowPage(null, Url, targetId, null, null, Ishistory);
}
//Run
function ShowRun(Url, targetId) {
    Platform.ShowRun(null, Url, targetId, null, null);
}
//refresh
function ShowRefresh(Url, targetId) {
    if (typeof targetId === 'undefined')
        targetId = SectionMain;
    Platform.ShowRefresh(null, Url, targetId, null, null);
}
//Action
function ShowAction(Url, CallBack) {
    Platform.ShowAction(null, Url, CallBack, null, null)
}
//Open Page
function OpenPage(Url, targetId, SuccessCall, ErrorCall) {
    if (typeof targetId === 'undefined')
        targetId = SectionMain;
    return Platform.OpenPage(null, Url, targetId, SuccessCall, ErrorCall);
}
//Load Page
function LoadPage(Url, targetId, SuccessCall, ErrorCall) {
    return Platform.LoadPage(null, Url, targetId, SuccessCall, ErrorCall);
}
//Quick
function ShowQuick(Url, targetId) {
    Platform.ShowQuick(null, Url, targetId);
}
//Dialog
function ShowDialog(Url, Desc, width, height, Option) {
    Platform.ShowDialog(null, Url, width, height, null, null, Option);
}
function CloseDialog(targetId, value) {
    return Platform.CloseDialog(targetId, value);
}
// RunAction
function RunAction(Url, Param, targetId) {
    Platform.Run(Url, { param: Param, id: targetId, callback: Platform.RunAjax });
}
// Upload File
function UploadFile(file, directory, target, Finished, Option) {
    Platform.UploadFile(file, directory, target, Option, Finished)
}
/* OpenUrl */
var BackFunction = '';
function OpenUrl(Url, Function, ErrorFunction) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open('GET', Url, true);
    }
    else if (typeof XDomainRequest != undefined) {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open('GET', Url);
    }
    else {
        // CORS not supported.
        xhr = null;
    }
    if (!xhr) {
        ShowNotice('Error', '', Platform.Language('CORS not supported'));
        return;
    }
    // Response handlers.
    xhr.onload = function () {
        BackFunction('', xhr.responseText);
    };

    xhr.onerror = function () {
        ErrorFunction('', xhr.responseText);
    };
    BackFunction = Function;
    xhr.send();
}
/****** Object Data *******/
function DataObject(form) {
    var _form = UltraForm.getForm(form);
    var Hint = '';
    var HintTag = '';

    var Error = null;

    this.sendData = function (Action, targetId) {
        UltraForm.sendData(null, _form, Action, targetId, null, null, { "ultraType": "run" });
    }
    this.initial = function () {
        return UltraForm.initial(_form);
    }

    this.validation = function () {
        return UltraForm.validation(_form);
    }
    this.ShowHint = function () {
        return UltraForm.ShowHint();
    }
    this.serialize = function () {
        return UltraForm.serialize(_form);
    }
}
/*** Ready platform ***/
var _ReadyPlatform = false;
var __Ready = [];
function _Ready(handler) {
    Platform.platformActive();
    //Add push to read list or run handler
    if (typeof handler !== 'undefined') {
        if (document.readyState == 'complete')
            handler();
        else
            __Ready.push(handler);
    }
    // run Ready list
    else if (_ReadyPlatform)
        _RunReady(document);
}
function _RunReady(base, Ready) {
    //Ready Platform (Install plugings and function)
    if (typeof Ready !== 'undefined') {
        Platform.showLog(Platform.Language('InstalledSmartPlatform'), 'info');
        _ReadyPlatform = Ready;
    }
    if (_ReadyPlatform) {

        //Run Ready
        for (var i = 0; i < __Ready.length; i++) {
            try {
                if (typeof __Ready[i] === "function")
                    __Ready[i]();
            } catch (err) {
                Platform.showLog('Error Ready ', 'warning', err);
            }
        }
        if (typeof base !== 'undefined')
            try {
                Platform.Initial(base);
            } catch (err) {
                Platform.showLog('Error ultra code ', 'warning', err);
            }
        Platform.platformActive(true);
        __Ready = [];
        Platform.showLog(Platform.Language('ReadySmartPlatform'), 'info');
    }
    else
        Platform.showLog(Platform.Language('NotReadySmartPlatform'), 'warning');
    return true;
}
// Submit
var frmSubmit;
function _ReadySubmit(handler) {
    document.removeEventListener('keydown', _submit);
    if (handler != undefined) {
        frmSubmit = handler;
        document.addEventListener('keydown', _submit);
    }
}
function _submit(evt) {
    if (evt.keyCode == 83 && (navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey)) {
        evt.preventDefault();
        frmSubmit(evt);
        return false;
    }
}
/*** Reset Class ***/
var __ResetClass = [
    'sp-nav-show', 'sp-widget-show', 'sp-menu-show',
    'sp-popup-active', 'sp-popup-show', 'sp-drop-show',
    'sp-select-show', 'sp-toggle-active'];
//mouseup and touchend
window.addEventListener('mouseup', function (evt) {
    var target = evt.target;
    if (target != null) {
        if (UltraCode.getAttribute(target, 'ultra-value', null) != null)
            return;
        if ((target.parentNode != null) && (UltraCode.getAttribute(target.parentNode, 'ultra-value', null) != null))
            return;
    }
    Array.prototype.forEach.call(__ResetClass, function (Class) {
        Array.prototype.forEach.call(__(document, '.' + Class), function (element) {
            element.classList.remove(Class);
        });
    });
});
//window.addEventListener("resize", function (evt) {
//    Array.prototype.forEach.call(__ResetClass, function (Class) {
//        Array.prototype.forEach.call(__(document, '.' + Class), function (element) {
//            element.classList.remove(Class);
//        });
//    });
//});

/*** Override base function ***/
//Add ReplaceAll and StartWith in string and Includes
//Set popstate function
window.addEventListener('popstate', function (evt) {
    if ((evt != null) && (evt.state != null)) {
        var Action = evt.state;
        if (IsDebug)
            console.log(Action)
        Platform.ShowPage(null, Action, SectionMain, null, null, false);
    }
}, false);

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (find, replace) {
        return this.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function (str) {
        if (this.indexOf(str) !== -1) return true;
        return false;
    };
}

if (!Element.prototype.getElementById) {
    Element.prototype.getElementById = function (id) {
        return this.querySelector('#' + id);
    };
}
if (!Element.prototype.getEventListeners) {
    Element.prototype.getEventListeners = function (type) {
        if (!this.eventListenerList) this.eventListenerList = {};

        // return reqested listeners type or all them
        if (type === undefined) return this.eventListenerList;
        return this.eventListenerList[type];
    };
}

/*** Start Platfrom */
document.addEventListener('DOMContentLoaded', function () {
    Platform.showLog(Platform.Language('StartSmartPlatform'), 'info');
    //Install Initial
    Platform.pushInitial(UltraCode.initUltraCode);
    //Install Functions
    Platform.initialFunctions('component|form|interface|media');
    //Install Plugins
    Platform.initialPlugins('interface|dropdown|select|list|toggle|datepicker|timepicker|keyboard|search|' +
        'number|clock|picker|page|chart|tablist|upload|filter|tree|modify|');
});

Platform.showLog('Smart Portal ' + CsVersion + ' Copyright ' + CsVersionDate, 'info');