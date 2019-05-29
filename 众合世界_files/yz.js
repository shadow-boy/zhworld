/**
 * Created by yanghaochuan on 2017/12/01.
 *
 * 浏览器兼容性，动态调节背景图，页面dom操作相关
 *
 */

//判断当前浏览类型
function BrowserType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    console.log(userAgent)
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return '0';
        }
        else if (fIEVersion == 8) {
            return "0";
        }
        else if (fIEVersion == 9) {
            return "IE9";
        }
        else if (fIEVersion == 10) {
            return "IE10";
        }
        else if (fIEVersion == 11) {
            return "IE11";
        }
        else {
            return "0"
        }//IE版本过低
    }//isIE end

    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
    if (isEdge) {
        return "Edge";
    }
}

(function () {
    // 版本太低
    if (BrowserType() == '0') {
        var str = '当前浏览器版本太低，请升级浏览器使用'
        document.getElementsByTagName('body')[0].innerHTML = '<h1 style="font-size: 30px">' + str + '<h1>'
        alert(str)
        return
    }

    // 动态调节背景图大小
    window.onload = function () {
        var w = 1200
        var window_w = window.innerWidth
        var banner = document.getElementById('banner')
        if (window_w <= w) {
            banner.style.width = w + 'px'
        }
        if (window_w >= w) {
            banner.style.width = '100%'
        }
        if(window_w<770 ){
            banner.style.width = '100%'
        }
        window.onresize = function () {
            window_w = window.innerWidth
            if (window_w <= w) {
                banner.style.width = w + 'px'
            }
            if (window_w >= w) {
                banner.style.width = '100%'
            }
            if(window_w<770 ){
                banner.style.width = '100%'
            }
        }
    }
})()

$(function () {
    var win_h = $(window).height()
    var win_w = $(window).width()
    var flag = false; // 此变量用于区分用户与师傅； false ---> 用户， true ---> 师傅；默认为用户
    var isReg = false; // 注册
    var isLand = true; // 登录

    // 点击注册
    $('#reg').click(function () {
        $('#regMask').show()
        $('#landRegBox').show()
        $('#uploadBox').hide()
        $('body').css('overflow', 'hidden')
    })

    // 点击关闭注册弹框
    $('#regCloseImg, #uploadCloseImg').click(function () {
        $('#regMask').hide()
        $('body').css('overflow', '')
    })

    // 点击用户注册
    $('#regClass .landUser').click(function () {
        flag = false; // 用户
        $(this).css({
            'color': 'rgba(98,111,121,1)',
            'background': '#fff'
        })
        $('#regClass .landTeacher').css({
            'color': '#fff',
            'background': 'rgba(118, 162, 177, 0.66)'
        })
        $('#regInputOk .landInputOkClick').html('注册');
		
		$("#reg_password").hide();
    })

    // 点击师傅注册
    $('#regClass .landTeacher').click(function () {
        flag = true; // 师傅
        $(this).css({
            'color': 'rgba(98,111,121,1)',
            'background': '#fff'

        })
        $('#regClass .landUser').css({
            'color': '#fff',
            'background': 'rgba(118, 162, 177, 0.66)'
        })
        $('#regInputOk .landInputOkClick').html('下一步');
		
		$("#reg_password").show();
    })

    // 用户注册或师傅注册
    $('#regInputOk .landInputOkClick').click(function(){
        if ($('#regInputPhoneText').val().length != 11 || $('#regInputCodeText').val() == '') {
            alert('请正确填写手机号、密码和验证码')
            return
        }
        
		var mobile = $('#regInputPhoneText').val();
		var msgcode = $('#regInputCodeText').val();
		var password = $('#password').val();
		
		// flag为true，则为师傅注册，否则为用户注册
        if(flag){
            // todo 执行师傅注册相关
			$.ajax({
				type : "POST",
				url:"/index.php/Public/user_reg",
				data : {
					'mobile' : mobile,
					'type'   : 1,
					'msgcode': msgcode,
					'password': password
				},
				success: function(data){
					data = JSON.parse(data);
					
					if(data.code == 0 || data.code == -1005){
						
						// 师傅注册需进入下一步
						$('#landRegBox').hide()
						$('#uploadBox').show()
						
					}else{
						alert(data.msg);
					}
					
				}
			});
			
			
        }else{
            // todo 执行用户注册相关
			$.ajax({
				type : "POST",
				url:"/index.php/Public/user_reg",
				data : {
					'mobile' : mobile,
					'type'   : 2,
					'msgcode': msgcode
				},
				success: function(data){
					data = JSON.parse(data);
					if(data.code == 0){
						location.reload();
					}else{
						alert(data.msg);
					}
					
				}
			});
		}
    });

    

    
	
	
	// 点击登录
    $('#land').click(function () {
        $('#landRegMask').show()
        $('body').css('overflow', 'hidden')
    })

    // 点击关闭登录弹框
    $('#landCloseImg').click(function () {
        $('#landRegMask').hide()
        $('body').css('overflow', '')
    })

    // 点击用户登录
    $('#landRegClass .landUser').click(function () {
        $(this).css({
            'color': 'rgba(98,111,121,1)',
            'background': '#fff'
        })
        $('#landRegClass .landTeacher').css({
            'color': '#fff',
            'background': 'rgba(118, 162, 177, 0.66)'
        })
    })

    // 点击师傅登录
    $('#landRegClass .landTeacher').click(function () {
        flag = true;
		$(this).css({
            'color': 'rgba(98,111,121,1)',
            'background': '#fff'

        })
        $('#landRegClass .landUser').css({
            'color': '#fff',
            'background': 'rgba(118, 162, 177, 0.66)'
        })
    })

    // 点击登录
    $('#landInputOk').click(function () {
        if ($('#landInputPhoneText').val().length != 11 || $('#landInputCodeText').val() == '') {
			alert('请正确填写手机号和验证码')
            return
        }

		var mobile = $('#landInputPhoneText').val();
		var msgcode = $('#landInputCodeText').val();
		
		$.ajax({
			type : "POST",
			url:"/index.php/Public/user_login",
			data : {
				'mobile' : mobile,
				'type'   : 2,
				'msgcode': msgcode
			},
			success: function(data){
				data = JSON.parse(data);
				if(data.code == 0){
					location.reload();
				}else{
					alert(data.msg);
				}
				
			}
		});
        

    })

    
    // 获取页面滚动条宽度
    function getScrollbarWidth() {
        var oP = document.createElement('p'), styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll',
        }, i, scrollbarWidth;

        for (i in styles){
            oP.style[i] = styles[i];
        }
        document.body.appendChild(oP);
        scrollbarWidth = oP.offsetWidth - oP.clientWidth;
        oP.remove();

        return scrollbarWidth;
    }

    // 获取地址栏URL参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null) return unescape(r[2]); return null;
    }

    // detail页面选项卡切换
    $('.detail_tab_click').each(function (_i,e) {
        $(e).click(function(){
            var _this = this
            $('.detail_tab_click').css({
                'zIndex': '0',
                'color': 'rgba(58,48,35,1)'
            })
            $('.detail_tab_click_c').each(function (i,e) {
                $(_this).css({
                    'zIndex': '1',
                    'color': 'rgba(33,161,219,1)'
                })
                if(_i == i){
                    $(this).show()
                }else{
                    $(this).hide()
                }
            })
        })
    })

    // detail页面商品图片切换
    $('#detail_click_img li img').mouseover(function(){
        $('#detail_click_show_img img').attr('src', $(this).attr('src'))
    })

    // detail页面增加减少商品
    $('#detail_reduce').click(function(){
        var num = $('#detail_reNum').html()
        if(parseInt(num) <= 0){
            return
        }
        num -= 1
        $('#detail_reNum').html(num)
    })
    $('#detail_add').click(function(){
        var num = parseInt($('#detail_reNum').html())
        num += 1
        $('#detail_reNum').html(num)
    })

    // detail页面商品类型选择
    $('#detail_click_type .detail_type_same_click').each(function(i,e){
        $(e).children('span').click(function () {
            $(this).parent().children('span').removeClass('addClass_OK_border')
            $(this).addClass('addClass_OK_border')
        })

    })

    // createOrder页面收货地址选择
    $('#order_click_address li').click(function () {
        $('#order_click_address li').removeClass('addClassAddress')
        $(this).addClass('addClassAddress')
    })

   

    // myOrder页面弹出框
    $('.myOrderClickRef_1').click(function () {
        $('body').css('overflow', 'hidden')
        $('.myOrderClassMask .myOrderMask1').text('您确定要'+$(this).text()+'吗？')
        $('.myOrderClassMask').css({
            'width': win_w + getScrollbarWidth() + 'px',
            'display': 'block'
        })
    })
    $('.myOrderMaskClose').click(function () {
        $('body').css('overflow', '')
        $('.myOrderClassMask').css({
            'width': '100%',
            'display': 'none'
        })
    })

    

    // myOrder页面选项卡切换
    $('#my_order_content .my_order_choose').each(function (_i, _e) {

        $(_e).click(function () {
            $('#my_order_content .my_order_choose').removeClass('myOrderLAddColor')
            $(_e).addClass('myOrderLAddColor')
            $('#my_order_content .my_order_content_r').each(function (i, e) {
                if(_i == i){
                    $(e).show()
                }else {
                    $(e).hide()
                }
            })
        })
    })

    // myOrder页面根据参数控制选项卡
    $('#my_order_content li').each(function (i, e) {
        if(GetQueryString('typeId') == i){
            $($('#my_order_content .my_order_choose')[i-1]).click()
        }
    })

    // myOrder页面添加地址
    $('.my_order_content_r2_addAds').click(function () {
        $('.my_order_content_r2_add_edit').show()
    })
    $('.my_order_content_r2_sbtn5').click(function () {
        $('.my_order_content_r2_add_edit').hide()
    })

    // myOrder页面选项卡切换
    $('.my_order_content_r4_ul_l li').each(function (_i, _e) {
        $(_e).click(function () {
            $('.my_order_content_r4_ul_l li').removeClass('myOrderLIChangeColor')
            $(_e).addClass('myOrderLIChangeColor')
            $('.my_order_content_r4_ul_r').each(function (i, e) {
                if(_i == i){
                    $(e).show()
                }else {
                    $(e).hide()
                }
            })
        })
    })

    // orderDetail物流时间定时器
    var orderDetailTime = 10   // 后台传来的时间数据，默认为秒
    var timer = setInterval(function () {
        orderDetailTime--
        if(orderDetailTime < 0) {
            clearInterval(timer)
            $('#orderDetailTimeChange').parent().hide()
            $('#orderIsGet').text('已收货')
            return
        }
        var dhms = secondsFormat(orderDetailTime)
        $('#orderDetailTimeChange').text(dhms)
    },1000)

    // 秒数转为时分秒
    function secondsFormat( s ) {
        var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整
        var hour = Math.floor( (s - day*24*3600) / 3600);
        var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 );
        var second = s - day*24*3600 - hour*3600 - minute*60;
        return day + ' 天 '  + hour + ' 时 ' + minute + ' 分 ' + second + ' 秒 ';
    }
})
