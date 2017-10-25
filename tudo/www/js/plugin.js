//第一页 首页
App.controller('home', function (page) {
    //a 存储localStorage 主要数据
    //b  存储localStorage 完成数据
    var a = [];
    var b;
    //判断存在
    var rd = localStorage['msg'];
    if (typeof rd !== 'undefined' && rd !== 'undefined' && rd !== '[]' && rd !== '{}' && rd.length > 19) {
        a = JSON.parse(rd);
    };
    var rt = localStorage['cplt'];
    if (typeof rt !== 'undefined' && rt !== 'undefined' && rt !== '') {
        b = rt;
    };
    //已完成侧边栏赋值
    $(".asidecontent").innerHTML = b;
    //切换页面效果
    this.transition = 'slide-right';

    // dexIndex 记录选中的需要删除的内容的数组
    var delIndex = [];
    // 主要数据a 存在
    if (a.length > 0) {
        //添加当前年月标题
        $(page).find(".nopage").hide();
        var e = new Date();
        e = e.getFullYear() + "/" + (e.getMonth() + 1);
        $(page).find(".content").append("<h4>" + e + "</h4>");

        //判断是否有提醒 判断是否完成
        a.forEach(function (el, index) {
            var noticeDiv;
            var completeClass;
            if (el.notice == false) {
                noticeDiv = "";
            } else {
                noticeDiv = '<div class = "miniNotice" ><i class="glyphicon glyphicon-time"></i>' + el.noticeDate + " " + el.noticeTime + '</div>';
            };
            if (el.complete == false) {
                completeClass = "";
            } else {
                completeClass = "complete";
            }
            //输出localStorage数据至主页
            $(page).find(".content").append(
                '<div class =" eachTodo btn">' +
                '<div class="gou"><span class="goutext">√</span></div>' +
                '<div class = "miniTitle ' + completeClass + ' ">' + el.title + '</div>' +
                '<div class = "miniDate">创建日期: ' + el.creatDate + ' </div>' +
                '<div class = "miniDate">修改日期: ' + el.changeDate + ' </div>' +
                '<div class = "miniContent" > ' + el.content + '</div>' +
                noticeDiv +
                '</div>'
            );
        });
        //对存在的便签添加点击事件 至修改页
        var found = $(page).find(".eachTodo");
        found.on("click", function () {
            var a = [$(this).index(".eachTodo")];
            App.load("page2", a);
        });
        //对存在的便签添加长按事件 至删除模式
        found.on("longTap", function abc() {
            //解绑点击
            found.off("click");
            //解绑长按
            found.off("longTap");
            //查找需要删除标签的数组中是否存在对应的点击标签,
            //不存在push进入数组
            if (delIndex.indexOf($(this).index(".eachTodo")) < 0) {
                delIndex.push($(this).index(".eachTodo"));
            };
            //样式变更
            $(".button4").fadeIn();
            $(".gou").show();
            $(".plus").hide();
            $(this).addClass("selected");
            $(this).find(".gou").toggleClass("gouactive");
            $(this).find(".goutext").toggle();
            //如果选中了一个 既长按之后必定触发
            if ($(".selected").length == 1) {
                //绑定点击事件
                found.on("click", function () {
                    //判断选中的是否在数组存在 不存在则push
                    if (delIndex.indexOf($(this).index(".eachTodo")) < 0) {
                        delIndex.push($(this).index(".eachTodo"));
                    } else {
                        //存在则删除对应
                        delIndex.splice(delIndex.indexOf($(this).index(".eachTodo")), 1);
                    }
                    //样式变更
                    $(this).toggleClass("selected");
                    $(this).find(".gou").toggleClass("gouactive");
                    $(this).find(".goutext").toggle();
                    //当不选中任何便签时时退出删除模式
                    if ($(".selected").length == 0) {
                        $(".gou").hide();
                        $(".plus").show();
                        $(".button4").fadeOut();
                        //解绑点击选中事件
                        found.off("click");
                        //重新绑定点击进入修改页事件
                        found.on("click", function () {
                            var a = [$(this).index(".eachTodo")];
                            App.load("page2", a);
                        });
                        //重新绑定整个长按事件
                        found.on("longTap", abc);
                    };
                });
            };
        });
    };
    //点击删除按钮时
    $(page).find(".button4").on("click", function () {
        //选中1个时 提示删除便签的标题
        if (($(".selected").length == 1)) {
            del($(".selected").find(".miniTitle").html(), a, delIndex);
        } //选中多个时  提示删除便签的总数
        else if (($(".selected").length > 1)) {
            del($(".selected").length, a, delIndex);
        };
    });
    //添加按钮遮罩层
    $(page).find(".shadow").hide().on("click", function () {
        $(this).hide();
        $(".plus").show();
    });
    $(page).find(".plus").on("click", function () {
        $(".shadow").fadeToggle();
        $(this).hide();
    });

    //添加文字笔记 阻止冒泡
    $(page).find(".note").on("click", function () {
        App.load('page2');
        event.stopPropagation();
    });
    //添加照片笔记 阻止冒泡
    $(page).find(".takepic").on("click", function () {
        App.load('page2', ["takepic"]);
        event.stopPropagation();
    });
    //添加手写笔记 进入手写专用页 阻止冒泡
    $(page).find(".handwrite").on("click", function () {
        App.load('page3');
        event.stopPropagation();
    });
    // 搜索
    $(page).find(".button2").on("click", function () {
        $(".allnote").hide();
        $(".search").fadeIn();
    });
    //搜索 on input时触发
    $(page).find(".search").on("input", function () {
        //按标题搜索
        var title = $(".miniTitle");
        //indexOf检索到的匹配 未检索到的隐藏
        title.map(function (index, el) {
            if (el.innerText.indexOf($(".search").val())) {
                $(this).parent().hide();
            } else {
                $(this).parent().show();
            };
        });
    }).on("blur", function () {
        //失焦时改变样式
        $(this).hide();
        $(".allnote").show();
    });
    //侧边栏
    $(page).on("swipeRight", function () {
        $(".aside").css("left", "0");
    });
    $(page).on("swipeLeft", function () {
        $(".aside").css("left", "-100%");
    });
    $(page).find(".left").on("click", function () {
        $(".aside").css("left", "0");
    });
    //侧边栏赋值
    var titleComplete = $(page).find(".complete");
    titleComplete.map(function (index, el) {
        $(page).find(".asidecontent")[0].innerHTML +=
            "<div class='miniComplete'>" + el.innerText + "</div>";
    });
    //存储 b数据
    localStorage.setItem("cplt", $(page).find(".asidecontent")[0].innerHTML);
    $(page).find(".clearAll").on("click", function () {
        localStorage.setItem("cplt", "");
        $(".asidecontent").html("");
    });
    //提醒震动模块
    setTimeout(function timeNotice() {
        var date = new Date();
        var yyyy = date.getFullYear();
        var MM = date.getMonth() + 1
        var dd = date.getDate();
        var hh = date.getHours();
        var mm = date.getMinutes();
        var dateArr = [MM, dd, hh, mm];
        dateArr.forEach(function (el, index) {
            dateArr[index] = format(el);
        });
        //设置时间格式
        var nowDate = yyyy + "-" + dateArr[0] + "-" + dateArr[1] + " " + dateArr[2] + ":" + dateArr[3];
        var notice = $(page).find(".miniNotice");
        //判断相等
        notice.map(function (index, el) {
            if (el.innerText == nowDate) {
                el.innerText = "时间到!";
                shock();
            };
        });
        setTimeout(timeNotice, 25000);
    }, 25000);
});
//第二页
App.controller('page2', function (page, data) {
    // ifComplete 判断是否完成
    var ifComplete;
    //点击改变输入框可编辑
    $(page).find(".edit").hide().on("click", function () {
        $(".notecontent").attr("contenteditable", "true");
        $(".notecontent").focus();
        showHide(page);
    });
    //进入后聚焦输入框
    $(page).find(".notecontent").focus();
    $(page).find(".back").hide();
    //点击ok以后判断
    $(page).find(".ok").on("click", function () {
        //标题内容都未空 返回
        if ($(".notetitle").html() == "" && $(".notecontent").html() == "" && isNaN(data)) {
            showBottom("不能保存一条空笔记");
            App.load('home');
        } else {
            // 任意非空
            showBottom("正在保存笔记到我的第一个笔记本...")
            $(".notecontent").removeAttr("contenteditable")
            showHide(page)
        };
    });
    //点击返回按钮
    $(page).find(".back").on("click", function () {
        // xx 读取 主要数据
        var xx = [];
        // msg存在
        if (localStorage.getItem("msg")) {
            xx = JSON.parse(localStorage.getItem("msg"));
        };
        //获取设定的时间
        var nd = $(".date").val();
        var nt = $(".time").val();
        //如果通过主页面点击便签进入
        if (!isNaN(data)) {
            //判断完成            
            if (ifComplete == undefined) {} else {
                zz.complete = ifComplete;
            };
            //赋值页面形成修改页
            zz.title = $(".notetitle").html() == "" ? "无标题笔记" : $(".notetitle").html();
            zz.content = $(".notecontent").html();
            zz.notice = (nd == "" ? false : true);
            zz.noticeDate = nd;
            zz.noticeTime = nt;
            zz.changeDate = new Date().toLocaleString();
            //删除数组中的原数据
            yy.splice(data[0], 1);
            //将新数据push到数组第一个
            yy.unshift(zz);
            //保存
            localStorage.setItem("msg", JSON.stringify(yy));
        } else {
            //若新建
            //设置创建时间
            var d = new Date();
            d = d.toLocaleString();
            //数据赋值
            var jsonData = {
                title: $(".notetitle").html() == "" ? "无标题笔记" : $(".notetitle").html(),
                content: $(".notecontent").html(),
                creatDate: d,
                notice: nd == "" ? false : true,
                noticeDate: nd,
                noticeTime: nt,
                changeDate: d,
                complete: false
            };
            //推送至数组第一个
            xx.unshift(jsonData);
            //保存
            localStorage.setItem("msg", JSON.stringify(xx));
        };
        //回首页
        App.load("home");
    });
    //底部文本编辑栏
    $(page).find(".foot").hide();
    //显示/隐藏
    $(page).find(".button5").on("click", function () {
        $(".foot").slideToggle();
        $(".glyphicon-font").toggleClass("color");
    });
    //拍照/从图库导入
    $(page).find(".button3").on("click", function () {
        choose();
    });
    //焦点title时隐藏文本样式编辑栏,并且不允许使用文本样式编辑栏
    $(page).find(".notetitle").on("focus", function () {
        $(".foot").slideUp();
        $(".glyphicon-font").toggleClass("disab");
        $(".button5").off();
    }).on("blur", function () {
        //失焦时重新显示,并绑定数据
        $(".glyphicon-font").toggleClass("disab");
        $(".glyphicon-font").removeClass("color");
        $(".button5").on("click", function () {
            $(".foot").slideToggle();
            $(".glyphicon-font").toggleClass("color");
        });
    });
    //提醒
    $(page).find(".glyphicon-calendar").on("click", function () {
        $(".noticeTimeSet").fadeToggle();
    });
    //设置日期时间
    $(page).find(".input1").on("click", function () {
        $(".timeSet").fadeIn();
    });
    //必须先设置日期再设置时间
    $(page).find(".date").on("change", function () {
        if ($(this).val() != "") {
            $(".time").removeAttr("disabled");
        } else {
            $(".time").attr("disabled", "disabled");
            $(".time").val("");
        };
    });
    //取消
    $(page).find(".btn-warning").on("click", function () {
        $(".timeSet").hide()
        $(".noticeTimeSet").hide()
    });
    //添加提醒
    $(page).find(".btn-success").on("click", function () {
        $(".timeSet").hide();
        $(".noticeTimeSet").hide();
        //不为空提示
        if ($(".date").val() != "") {
            showBottom("提醒已添加");
            $(".glyphicon-calendar").addClass("color");
            ifComplete = false;
        }
        //为空提示 
        else {
            showBottom("提醒已取消");
            $(".glyphicon-calendar").removeClass("color");
        };
        //赋值显示
        $(".noticeTime").text($(".date").val() + " " + $(".time").val());
    });
    //将事件设置为完成 清空提醒样式
    $(page).find(".input2").on("click", function () {
        showBottom("完成");
        ifComplete = true;
        $(".glyphicon-calendar").removeClass("color");
        $(".noticeTime").text("");
        $(".noticeTimeSet").hide();
        $(".date").val("").trigger("change");
    });
    //清空提醒
    $(page).find(".input3").on("click", function () {
        showBottom("提醒已清除");
        $(".glyphicon-calendar").removeClass("color");
        $(".noticeTime").text("");
        $(".noticeTimeSet").hide();
        $(".date").val("").trigger("change");
    });
    //文本编辑栏功能 [加粗,斜体,背景颜色,上标,下标.水平线,checkbox]
    var textEffect = [{
        cmdName: "bold",
        class: "glyphicon-bold",
        exVal: "",
        active: false
    }, {
        cmdName: "italic",
        class: "glyphicon-italic",
        exVal: "",
        active: false
    }, {
        cmdName: "backColor",
        class: "glyphicon-text-background",
        exVal: "#FEFFA6",
        active: false
    }, {
        cmdName: "superscript",
        class: "glyphicon-superscript",
        exVal: "",
        active: false
    }, {
        cmdName: "subscript",
        class: "glyphicon-subscript",
        exVal: "",
        active: false
    }, {
        cmdName: "insertHorizontalRule",
        class: "glyphicon-text-color",
        exVal: "",
        active: false
    }, {
        cmdName: "insertOrderedList",
        class: "glyphicon-th-list",
        exVal: "",
        active: false
    }, {
        cmdName: "insertHTML",
        class: "glyphicon-check",
        exVal: "<input type='checkbox'>",
        active: false
    }];
    //为标签添加事件
    textEffect.forEach(function (el, index) {

        $(page).find(".foot").find("ul").append("<li><i class='glyphicon " + el.class + "'></i></li>");
        //document.execCommand 文本编辑命令
        $(page).find(".foot").find("." + el.class).on("click", function () {
            document.execCommand(el.cmdName, false, el.exVal);
            //前5个命令切换
            if (index <= 4) {
                $(this).toggleClass("color");
            } //重新聚焦
            $(".notecontent").focus();
        });
    });
    //判断是否是修改页面
    if (!isNaN(data)) {
        //读取 localStroage
        var yy = localStorage.getItem("msg");
        yy = JSON.parse(yy);
        // localStroage中对应下标data的数据
        var zz = yy[data];
        //赋值形成修改页面
        $(page).find(".notetitle").html(zz.title);
        $(page).find(".notecontent").html(zz.content).removeAttr("contenteditable");
        showHide(page);
        //如果标签中没有图片 (此为bug 有图片时会导致图片地址被删除)
        if ($(page).find(".notecontent").html().indexOf("img") < 0) {
            //将所有html分割为单字符串的数组
            var tel = $(page).find(".notecontent").html().split("");
            //tellArr 全字符串拼接11位 
            var telArr = [];
            //teltrue 正确的电话号码
            var teltrue = [];
            //遍历单字符串数字,进行拼接11位,push至telArr
            tel.map(function (el, index, arr) {
                var tel = "";
                for (var i = index; i < index + 11; i++) {
                    tel += arr[i];
                };
                telArr.push(tel);
            });
            //遍历拼接后的11位字符串,正则判断是否满足电话,满足的输出至teltrue
            telArr.map(function (el, index, arr) {
                var reg = /^1[0-9]{10}$/g;
                if (reg.test(el)) {
                    teltrue.push(el);
                };
            });
            //遍历正确电话数组,查找整个html
            teltrue.map(function (el, index, arr) {
                var telori = $(page).find(".notecontent").html()
                var str = new RegExp(el);
                //将对应的字符串替换为用a href="tel:"模式的标签
                //实现点击进入拨号界面
                var d = telori.replace(str, "<a href='tel:" + el + "'class='tel'>" + el + "</a>");
                //赋值
                $(page).find(".notecontent").html(d);
            });
            //提醒存在时,为修改页面添加样式
            if (zz.notice == true) {
                $(page).find(".noticeTime").text(zz.noticeDate + " " + zz.noticeTime);
                $(page).find(".glyphicon-calendar").addClass("color");
                $(page).find(".date").val(zz.noticeDate);
                $(page).find(".time").val(zz.noticeTime);
            };
        };
    };
    //隐藏的点击按钮 进入页面后触发
    $(page).find(".hideClick").on("click", function () {
        setTimeout(function () {
            $(page).find(".notecontent").focus();
        }, 200);
    });
    //自动照相
    $(page).find(".hideClick").trigger("click");
    setTimeout(function () {
        if (data[0] == "takepic") {
            photo(1);
        };
    }, 250);
    //手写模块专用 将手写生成的base64地址添加至输入框中
    if (data.pic != undefined) {
        setTimeout(function () {
            addpic(data.pic);
        }, 500);
    };

});
//第三页
App.controller('page3', function (page) {
    //手写模块
    //另类引入方法,适用app.js,测试可用
    var sketchpad;
    //cvs 画布
    var cvs = $(page).find("#sketchpad")[0];
    //添加点击画布后使用插件new生成画布
    $(page).find("#sketchpad").on("click", function () {
        sketchpad = new Sketchpad({
            element: '#sketchpad',
            width: 400,
            height: 550,
        });
    });
    //延时触发生成画布的点击事件
    setTimeout(function () {
        $(page).find("#sketchpad").slideDown().trigger("click").off("click");
    }, 300);
    //撤销
    $(page).find(".undo").on("click", function () {
        sketchpad.undo();
    });
    //重做
    $(page).find(".redo").on("click", function () {
        sketchpad.redo();
    });
    //清除
    $(page).find(".clear").on("click", function () {
        cvs.height = cvs.height;
    });
    //返回
    $(page).find(".back").on("click", function () {
        App.load("home")
    });
    //保存 将手写的base64传至page2
    $(page).find(".save").on("click", function () {
        var pic = {
            "pic": cvs.toDataURL("image/png")
        };
        App.load("page2", pic);
    });
});
App.load('home');

//showHide functions
function showHide(page) {
    $(page).find(".foot").hide();
    $(page).find(".ok").fadeToggle();
    $(page).find(".edit").toggle();
    $(page).find(".back").fadeToggle();
    $(page).find(".button5").toggle();
    $(page).find(".button4").toggle();
    $(page).find(".button3").toggle();
};



/**
 * 选择图片模块 
 * 可选择拍照或从相册加载 
 */
function choose() {
    var options = {
        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_TRADITIONAL, // default is THEME_TRADITIONAL THEME_DEVICE_DEFAULT_LIGHT
        title: '请选择',
        buttonLabels: ['启动相机', '从相册选择'],
        androidEnableCancelButton: true, // default false
        addCancelButtonWithLabel: '取消',
        // addDestructiveButtonWithLabel: 'Delete it',
        // destructiveButtonLast: true // you can choose where the destructive button is shown
    };
    // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
    // of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
    window.plugins.actionsheet.show(options, call);
};

function call(buttonIndex) {
    setTimeout(function () {
        // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
        // alert('button index clicked: ' + buttonIndex);
        var type
        if (buttonIndex == 1) {
            type = 1;
            photo(type);
            //CAMERA	number	1	用摄像头拍摄图片
        } else if (buttonIndex == 2) {
            type = 0;
            photo(type);
            //PHOTOLIBRARY	number	0	从设备相册选择图片
        };
    });
};
//拍照并显示
function photo(type) {
    var destinationType;

    document.addEventListener("deviceready", onDeviceReady, false);

    //Cordova加载完成会触发
    function onDeviceReady() {
        destinationType = navigator.camera.DestinationType;
        // destinationType DATA_URL	number	0
        // destinationType  FILE_URI	number	1	
    }
    //拍照
    function capturePhoto() {
        //拍照并获取Base64编码的图像（quality : 存储图像的质量，范围是[0,100]）
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
            quality: 99,
            sourceType: type,
            destinationType: 1,
            // allowEdit: true,
            correctOrientation: true
        });
    };

    //拍照成功
    function onPhotoDataSuccess(imageURL) {
        addpic(imageURL)
        showBottom("拍照成功")
    };
    //拍照失败
    function onFail(message) {
        showBottom("取消拍摄")
    };
    capturePhoto();
};
//vibrate mode
function shock() {
    navigator.vibrate([3000, 1000, 3000, 1000, 3000]);
};

function stopshock() {
    navigator.vibrate([])
};
//nativeUI toast
function showBottom(e) {
    window.plugins.toast.showLongBottom(e)
};
//addpic
function addpic(pic) {
    var range = window.getSelection().getRangeAt(0);
    var strongNode = document.createElement('img');
    // 选中区域文本
    strongNode.setAttribute('src', pic);
    // 删除选中区
    // 在光标处插入新节点
    range.insertNode(strongNode);
    window.getSelection().removeAllRanges();
};
//删除模块
function del(e, local, del) {
    var title, message;
    if (typeof e === "number") {
        title = "删除" + e + "条笔记";
        message = '确定要删除这些笔记吗';
    } else if (typeof e === "string") {
        title = "删除: " + e;
        message = '你确定要删除这条笔记吗';
    };
    //确认框
    function onConfirm(buttonIndex) {
        if (buttonIndex == 1) {
            function sortNumber(a, b) {
                return b - a
            };
            del.sort(sortNumber);
            del.forEach(function (el) {
                local.splice(el, 1);
            });
            showBottom("已删除笔记!");
            localStorage.setItem("msg", JSON.stringify(local));
            location.reload();
        } else {
            showBottom("取消删除");
        };
    };
    navigator.notification.confirm(
        message, // message
        onConfirm, // callback to invoke with index of button pressed
        title, // title
        ['好', '取消'] // buttonLabels
    );
};


//添加0 
function format(el) {
    if (el < 10) {
        el = "0" + el;
    };
    return el
};