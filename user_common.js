const query = require('./db.js');
const Common = require('./common');
let Kry_post = require('./kry_post');
 function  urser_common(userid) {
     //获取用户关联会员商户列表
     this.getCustomerList = async function(){
         let sql = 'SELECT a.COMMUNITYID,b.SHOPNAME,b.ADDRESS,a.SHOPCODE,c.DESCRIPTION FROM kry_customer_list a left join kry_config b on a.SHOPCODE = b.SHOPCODE left join subject_community c on b.COMMUNITYID = c.COMMUNITY_ID\n  where  APPUSER_ID = ?';
         let sqldata = [];
         sqldata.push(userid)
         let ret = [];
         try {
             ret = await query(sql, sqldata);
         } catch (error) {
             ret = {msg: "用户查询错误", zr_type: -1}
         }
         if(!ret||ret.length<=0){
             ret = {msg: "无用户数据", zr_type: -1}
         }
         return ret
     }
     //获取会员详情
     this.getCuserdis = async function(shopcode){
         let common = new Common(shopcode);
         let common_cs = await common.getdatas();
         var userdislist = await this.getUserDis();
         if (userdislist.zr_type == -1) {
             return userdislist;
         }
         if (!userdislist.NAME) {
             return {msg: "请先进行实名认证", zr_type: -1}
         }
         let common_ca1 = {};
         common_ca1.loginId= userdislist.TEL;

         common_ca1.loginType=0;
         let QR_coderet = await Kry_post("/open/v1/crm/login", common_cs, common_ca1);


         if (QR_coderet.code == 0) {
             common_ca1 = {};
             common_ca1.customerId = QR_coderet.result.customerId;
             QR_coderet = await Kry_post("/open/v1/crm/getCustomerDetailById", common_cs, common_ca1);

             if (QR_coderet.code == 0) {
                 return QR_coderet
             }else{
                 return {msg: QR_coderet.message, zr_type: -1}
             }
         } else {
             return {msg: QR_coderet.message, zr_type: -1}
         }
     }
     //用户主表数据查询
    this.getUserDis =async function () {
        let sql = 'select * from subject_appuser where  APPUSER_ID = ?';
        let sqldata = [];
        sqldata.push(userid)
        let ret = [];
        try {
            ret = await query(sql, sqldata);
        } catch (error) {
            ret = [{msg: "用户查询错误", zr_type: -1}]
        }
        if(!ret||ret.length<=0){
            ret = [{msg: "无用户数据", zr_type: -1}]
        }
        return ret[0]
    }
    this.getUserCard = async function (SHOPCODE) {
        let sql = 'select * from kry_customer_list where  APPUSER_ID = ? and SHOPCODE = ?';
        let sqldata = [];
        sqldata.push(userid)
        sqldata.push(SHOPCODE)
        let ret = [];
        try {
            ret = await query(sql, sqldata);
        } catch (error) {
            ret = [{msg: "用户查询错误", zr_type: -1}]
        }
        if(!ret||ret.length<=0){
            ret = [{msg: "无用户数据", zr_type: -1}]
        }
        return ret[0]
    }
    //用户卡号插入
     this.intoUsercard =async function (card,commid,SHOPCODE) {
         let sql = 'INSERT INTO kry_customer_list SET ?';
         let sqldata = {COMMUNITYID:commid,CUSTOMERID:card,APPUSER_ID:userid,SHOPCODE:SHOPCODE};
         let ret = [];
         try {
             ret = await query(sql, sqldata);
         } catch (error) {
             ret = {msg: "已经开过卡了", zr_type: -1}
         }
         return ret
     }
}
module.exports = urser_common;