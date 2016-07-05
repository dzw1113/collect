/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

// function joinLottery(idw){
//     alert(idw)
//     showLotteryResult({
//                     "score":"",  //   用户剩余积分
//                     "surFreeCount":"",  //    用户当天剩余免费抽奖次数
//                     "surCount":"",  //    用户当天剩余抽奖次数
//                     "prizeId":"saf213",  // 奖品编号
//                     "prizeName":"",  //   奖品名称
//                     "prizeDesc":"",  //   奖品描述
//                     "prizeDir":"http://yun.duiba.com.cn/images/0d7flpb5nj.jpg",  //    奖品图片地址
//                     "prizeType":"",  //   奖品类型
//                     "price":"",  //   参考价
//                     "points":"",  //  奖品积分值
//                     "ticketCode":"",  //  卡券编号
//                     "ticketName":"",  //  卡券名称
//                     "ticketType":"",  //  卡券类型
//                     "ticketAmt":"",  //   卡券额度
//                     "discountAmt":"",  // 打折额度
//                     "preferenceDesc":"",  //  优惠详情
//                     "useType":"",  // 使用类型
//                     "ticketUsedDesc":"",  //  使用说明
//                     "effectTime":"",  //  生效时间
//                     "loseTime":"",  //    失效时间
//                     "effectDays":"",  //  有效天数

//                 });
// }
// function queryJoinRecords(){
//     showJoinRecords({
//         "recordsList":[{
//             "name":"王尼尼玛",
//             "prizeName":"爱厨平底锅爱厨平底锅爱厨平底锅爱厨平底锅",
//             "dateTime":"20151010"
//         },
//         {
//             "name":"王尼尼玛",
//             "prizeName":"爱厨平底锅",
//             "dateTime":"20151010"
//         },{
//             "name":"王尼尼玛",
//             "prizeName":"爱厨平底锅",
//             "dateTime":"20151010"
//         },{
//             "name":"王尼尼玛",
//             "prizeName":"爱厨平底锅",
//             "dateTime":"20151010"
//         }]
//     })
// }





$(function () {
	    //填充奖品详情列表数据
    function prizeList(arr){
    	var item="",html="";
    	$.each(arr,function(k,v){
            item='<div class="row h4">'+v.prizeDesc+'</div>'
            item=item+'<div class="row h4">价值'+v.price+'元</div>'
            item=item+'<div class="remain h3"><span>还剩</span><span class="span-box radius8">'+v.prizeCount+'</span><span>份</span></div>'
            var item='<div class="img left"><a href="#"><img src="'+v.prizeDir+'" alt=""></a></div>'+
                      '<div class="item-bd-txt left">'+
                            item+
                      '</div>';
    		html=html+'<div class="item-bd">'+item+'</div>';
    	});

    	// html='<div class="description"><h4>奖品详情</h4>'+html+'</div>'
    	$('.box-br').html(html);
    }

    function description(){
        var bn=$(".head-banner");
        if(bn && bn.get(0)){
            var bnimg=bn.find(".item-img");
            if(bnimg && bnimg.get(0)){
                bnimg.html('<img src="'+loadjson.imageUrl+'" />');
            }
        }
        var item="";
    	var html='<tr><td class="col1 h3"><span>参与条件:</span></td><td class="col2"><span>'+formatDate1(loadjson.startTime)+"至"+formatDate1(loadjson.endTime)+'</span></td></tr>';
        html=html+'<tr><td class="col1 h3"><span>参与条件:</span></td><td class="col2"><span>'+loadjson.joinCondition+'</span></td></tr>';
    	if(loadjson.lotteryDesc){
	    	$.each(loadjson.lotteryDesc.split('\n'),function(i,v1){
				item=item+'<li>'+v1+'</li>'
			});
    	}
// <tr>
//                                                 <td class="col1 h3">
//                                                     <span>参与条件:</span>
//                                                 </td>
//                                                 <td class="col2">
//                                                     <span>江西南昌 豪都世纪花园 业主</span>
//                                                 </td>
//                                             </tr>


		html=html+'<tr><td class="col1 h3"><span>活动规则:</span></td><td class="col2"><span>'+item+'</span></td></tr>';
		$('.table1').html(html);
    }

    function formatDate(t){
        var s=t.substring(0,4);
            s=s+"/"+t.substring(4,6)+"/"+t.substring(6,8);
        return s;
    }
    function formatDate1(t){
        var s=t.substring(0,4);
            s=s+"年"+t.substring(4,6)+"月"+t.substring(6,8)+"日";
        return s;
    }

    var loadjson,showLotteryResultjson,CFG;
    function loadData(json){//加载页面 json为当前抽奖详情信息
        if(json && YW.isString(json)){
            loadjson=$.parseJSON(json)
        }else{
            loadjson=json||{};
        }
        prizeList(loadjson.prizeList);//奖品
        $("#promotioncontent").html(loadjson.promotionConten);
        var oDiv=$("#showtime");
        if (oDiv && oDiv.get(0)) {
                new YW.date.ShowTime(oDiv.get(0), {'day': 'day','hour': 'hour','minute': 'minute','second':'second','timeend':formatDate(loadjson
                    .endTime)+' 00:00:00','timestart': ''});
            }
        description();//规则
        $("#prizebtn").bind("click",function(){
            window.joinLottery && joinLottery(loadjson.lotteryId);
        })

        $(".tab-nav2").bind("click",function(){
            window.queryJoinRecords && queryJoinRecords();
        })
    }




    function showLotteryResult(json){//json为参加抽奖返回报文信息
        if(json && YW.isString(json)){
            Resultjson=$.parseJSON(json)
        }else{
            Resultjson=json||{};
        }

        if(typeof Resultjson.score  != "undefined"){
            alert("参与成功");
        }else{
            alert("参与失败");
        }
    }


    function showJoinRecords(json){//json为当前抽奖活动的中奖纪录
        // <tr>
        //     <td class="col1">王**尼玛嘛</td>
        //     <td class="col2">爱厨平底锅</td>
        //     <td class="col3">2015年10月10日</td>
        // </tr>
        var html="",Records;
        if(json && YW.isString(json)){
            Recordsjson=$.parseJSON(json)
        }else{
            Recordsjson=json||{};
        }

        // {
        //     "name":"王**尼玛嘛",
        //     "prizeName":"爱厨平底锅",
        //     "dateTime":"20151010"
        // }
        var item="";
            item=item+'<td class="col1">姓名</td>';
            item=item+'<td class="col2">奖品名称</td>';
            item=item+'<td class="col3">时间</td>';
            html=html+'<tr class="th">'+item+'</tr>'
        $.each(Recordsjson.recordsList,function(k,v){
            item="";
            item=item+'<td class="col1">'+v.name+'</td>';
            item=item+'<td class="col2"><div class="txtoverflow">'+v.prizeName+'</div></td>';
            item=item+'<td class="col3">'+formatDate(v.dateTime)+'</td>';
            html=html+"<tr>"+item+"</tr>"
        });

        $(".table2").html(html);
    }
    window.loadData=loadData;
    window.showLotteryResult=showLotteryResult;
    window.showJoinRecords=showJoinRecords;







// loadData({
//     "joinCondition":"江西南昌 豪都世纪花园 业主",//活动参与条件
//     "promotionConten":"豪都世纪豪园的业主在活动截止时间之前缴纳九月物业费，即可参与“高温无情，缴费有礼”的抽奖活动，最高可获得价值516元的杭州三日游。",//活动内容
//     "lotteryId":"A1234",//抽奖编号
//     "lotteryName":"抽奖名称",//抽奖名称
//     "lotteryDesc":"当您参加积分抽奖时\n兑换不同时间段内的一个或多个抽 奖编号\n多个抽奖编号包括起号\n止号以及中间连续编号为您所兑换的抽奖编号。当抽奖结束时，采用随机或人工抽取的形式抽取抽奖编号作为中奖标识。",//抽奖描述
//     "startTime":"20151001000000",//抽奖开始时间
//     "endTime":"20151005",//抽奖结束时间
//     "lotteryStatus":"01",//01未开始;02已开始;03已结束
//     "imageUrl":"img/banner/banner3.png",//背景图片
//     "prizeStartDate":"2015-10-01 00:00:00",//奖品领取开始时间
//     "prizeEndDate":"2015-10-01 00:00:00",//奖品领取结束时间
//     "maxCount":"",   //最多抽奖次数
//     "freeCount":"",   //免费抽奖次数
//     "period":"",  //控制周期
//     "surFreeCount":"",  // 用户当天剩余免费抽奖次数
//     "surCount":"",  //    用户当天剩余抽奖次数
//     "prizeList":[{
//         "prizeId":"",  // 奖品编号
//         "prizeName":"primo3智能音乐运动耳机",  //   奖品名称
//         "prizeCount":"60",  //  奖品数量
//         "prizeDesc":"运动监测，语音提醒，形状记忆；随风奔跑，速速变身乐活潮客。",  //   奖品描述
//         "prizeDir":"img/组-6.png",  //    奖品图片地址
//         "prizeScore":"",  //  抽奖所需积分
//         "prizeType":"",  //   奖品类型
//         "price":"30",  //   参考价
//         "points":"",  //  奖品积分值
//         "ticketCode":"",  //  卡券编号
//         "ticketName":"",  //  卡券名称
//         "ticketType":"",  //  卡券类型
//         "ticketAmt":"",  //   卡券额度
//         "discountAmt":"",  // 打折额度
//         "preferenceDesc":"",  //  优惠详情
//         "useType":"",  // 使用类型
//         "ticketUsedDesc":"",  //  使用说明
//         "effectTime":"",  //  生效时间
//         "loseTime":"",  //    失效时间
//         "effectDays":"",  //  有效天数
//         }//   奖品列表
//     ]
// });







})


/*----------   2015-10-16 14:14:07   ----------*/