const Common = require('./common');
const User_common = require('./user_common.js');
const Order_common = require('./order_common.js');
let Kry_post = require('./kry_post');
function Hello(querys) {
    this.sayHello = async function () {
        switch (querys.b) {
            case "getpurchaseAsn":
                var order_common = new Order_common()

                var DataList =await order_common.getpurchaseAsn(querys.a,"SKU13196")
                if(DataList.zr_type==-1){
                    return DataList
                }
                return {msg: "成功", zr_type: 0 ,data:DataList}
                break;
            case "getfetchWarehouseList":
                var order_common = new Order_common()
                var DataList =await order_common.getfetchWarehouseList(querys.a)
                if(DataList.zr_type==-1){
                    return DataList
                }
                return {msg: "成功", zr_type: 0 ,data:DataList}
                break;
            case "getPurchaseMoney":
                var order_common = new Order_common()
                var DataList =await order_common.getPurchaseMoney(querys.a,'SKU6646')
                if(DataList.zr_type==-1){
                    return DataList
                }
                return {msg: "成功", zr_type: 0 ,data:DataList}
                break;
            case "DailySettlement":
                var order_common = new Order_common()
                var DataList =await order_common.DailySettlement(querys.a,querys.stime,querys.etime)
                if(DataList.zr_type==-1){
                    return DataList
                }
                return {msg: "成功", zr_type: 0 ,data:DataList}
                break;
            case "getDayDataList":
                var order_common = new Order_common()
                var DataList =await order_common.getDayDataList(querys.a,querys.y,querys.t,querys.stime,querys.etime)
                if(DataList.zr_type==-1){
                    return DataList
                }
                return {msg: "成功", zr_type: 0 ,data:DataList}
                break;
            case "getDataDis":
                var order_common = new Order_common()
                var DataList =await order_common.getDataDis(querys.a,[querys.id])
                if(DataList.zr_type==-1){
                    return DataList
                }
                return {msg: "成功", zr_type: 0 ,data:DataList}
                break;
            default:
                return {msg: "未查找到方法", zr_type: -1}
        }
    }
}

module.exports = Hello;