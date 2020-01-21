const Common = require('./common');
const User_common = require('./user_common.js');
let Kry_post = require('./kry_post');
function Hello() {
    //获取入库单据
    this.getpurchaseAsn = async function(shopcode,code){
        let common = new Common(shopcode);
        let common_cs = await common.getdatas();
        if (!common_cs.appKey) {
            return {msg: "未查找到数据", zr_type: -1}
        }
        let common_cas = {};
        common_cas.shopId=shopcode;
        common_cas.queryType=1;
        common_cas.rows=5;
        common_cas.page=1;
        common_cas.endDay = dateFtt("yyyy-MM-dd",new Date())
        common_cas.startDay = dateFtt("yyyy-MM-dd",new Date(new Date(new Date().toLocaleDateString()).getTime()-365*24*60*60*1000-1));
        common_cas.skuNameOrCode ='雪碧'
        common_cas.status =1
        console.log(common_cas)
        let list = await Kry_post("/open/v1/supplyChain/inboundPage", common_cs, common_cas);
        console.log(list)
        if(list.code!=0){
            return {msg: list.message, zr_type: -1}
        }
        return list.result
    }
    //获取仓库
    this.getfetchWarehouseList = async function(code){
        let common = new Common(code);
        let common_cs = await common.getdatas();
        if (!common_cs.appKey) {
            return {msg: "未查找到数据", zr_type: -1}
        }
        let common_cas = {};
        common_cas.shopId=code;
        common_cas.isDisable = 0
        let list = await Kry_post("/open/v1/supplyChain/warehouse/fetchWarehouseList", common_cs, common_cas);
        if(list.code!=0){
            return {msg: list.message, zr_type: -1}
        }
        return list.result
    }
    //获取采购价格
    this.getPurchaseMoney =async function (code,skuCode){
        let common = new Common(code);
        let common_cs = await common.getdatas();
        if (!common_cs.appKey) {
            return {msg: "未查找到数据", zr_type: -1}
        }
        let common_cas = {};
        common_cas.shopId=code;
        common_cas.warehouseId=(await this.getfetchWarehouseList(code))[0].id;
        common_cas.skuCode=skuCode;
        common_cas.start=0;
        common_cas.limit=1;
        let list = await Kry_post("/open/v1/cater/dish/findInventoryForDish", common_cs, common_cas);
        if(list.code!=0){
            return {msg: list.message, zr_type: -1}
        }
        console.log(list)
        return list.result
    }
    //日结算
    let orderlistas = {list:[],sumpricmoney:0,ylmoney:0},orderlistas1={list:[],sumpricmoney:0};
    this.DailySettlement =async function (code,stime,etime) {
        stime=stime||new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
        etime=etime||new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
        await this.DailySettlementfun(code,1,stime,etime)
        return {dis:orderlistas,dis1:orderlistas1};
    }
    this.DailySettlementfun=async function(code,y,stime,etime){
        let list =await this.getDayDataList(code,y,20,stime,etime)
        if(list.zr_type==-1){
            return list
        }
        if(list.items.length>0){
            for(let i = 0 ;i < list.items.length;i++){
              let dislist =await this.getDataDis(code,[list.items[i].orderId])
                for(let t = 0 ; t< dislist.length ; t++){
                    let DishInfo = dislist[t].dishInfos

                    for(let f = 0; f<DishInfo.length ;f++){
                        let getPurchaseMoney =await this.getPurchaseMoney(code,DishInfo[f].dishCode)
                        if(getPurchaseMoney.data.length>0){
                        orderlistas.sumpricmoney+=DishInfo[f].price/100
                        orderlistas.ylmoney+=getPurchaseMoney.data[0].cost/getPurchaseMoney.data[0].qty
                            console.log(getPurchaseMoney)
                        orderlistas.list.push({
                            id:list.items[i].orderId,
                            dis:{
                                name:DishInfo[f].dishName,
                                code :DishInfo[f].dishCode,
                                price :DishInfo[f].price,
                                quantity :DishInfo[f].quantity,
                                itemId :DishInfo[f].itemId,
                                ylmoney :getPurchaseMoney.data[0].cost
                            }
                        })
                        }else{
                            orderlistas1.sumpricmoney+=DishInfo[f].price/100
                            orderlistas1.list.push({
                                id:list.items[i].orderId,
                                dis:{
                                    name:DishInfo[f].dishName,
                                    code :DishInfo[f].dishCode,
                                    price :DishInfo[f].price,
                                    quantity :DishInfo[f].quantity,
                                    itemId :DishInfo[f].itemId
                                }
                            })
                        }
                    }
                }

            }
            y++
            await this.DailySettlementfun(code,y)
        }else{
            return;
        }
    }
    //获取订单数据
    this.getDayDataList =async function(code,y,t,stime,etime){
        let common = new Common(code);
        let common_cs = await common.getdatas();
        if (!common_cs.appKey) {
            return {msg: "未查找到数据", zr_type: -1}
        }
        let common_cas = {};
        common_cas.shopIdenty=code;
        common_cas.timeType=2;
        common_cas.pageNo=y;
        common_cas.pageSize=t;
        common_cas.startTime=stime||new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
        common_cas.endTime=etime||new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
        let list = await Kry_post("/open/v1/data/order/export2", common_cs, common_cas);
        if(list.code!=0){
            return {msg: list.message, zr_type: -1}
        }
        list.result.sumy = pageCount(list.result.totalRows,list.result.pageSize);
        return list.result
    }
    //获取订单详情
    this.getDataDis=async function(code,ids){
        let common = new Common(code);
        let common_cs = await common.getdatas();
        if (!common_cs.appKey) {
            return {msg: "未查找到数据", zr_type: -1}
        }
        let common_cas = {};
        common_cas.shopIdenty=code;
        common_cas.ids=ids;
        let list = await Kry_post("/open/v1/data/order/exportDetail", common_cs, common_cas);
        if(list.code!=0){
            return {msg: list.message, zr_type: -1}
        }
        return list.result
    }
}
function pageCount (totalnum,limit){
    return totalnum > 0 ? ((totalnum < limit) ? 1 : ((totalnum % limit) ? (parseInt(totalnum / limit) + 1) : (totalnum / limit))) : 0;
}
function dateFtt(fmt,date) {
    var o = {
        "M+" : date.getMonth()+1, //月份
        "d+" : date.getDate(), //日
        "h+" : date.getHours(), //小时
        "m+" : date.getMinutes(), //分
        "s+" : date.getSeconds(), //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S" : date.getMilliseconds() //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
module.exports = Hello;