const Common = require('./common');
const User_common = require('./user_common.js');
let Kry_post = require('./kry_post');
function Hello(querys) {
    let common = new Common(querys.a);
    this.sayHello = async function () {
        let common_cs = await common.getdatas();
        let xq = await common.getCOMMUNITYID();
        if (!common_cs.appKey&&querys.b!='getJF') {
            return {msg: "未查找到数据", zr_type: -1}
        } else {
            switch (querys.b) {
                //会员单一积分查询
                case "getJF":
                    var user_common = new User_common(querys.APPUSER_ID);
                    var userdislist = await user_common.getCustomerList();
                    if (userdislist.zr_type == -1) {
                        return userdislist;
                    }
                    var userdislistjf = await user_common.getCuserdis(querys.a);
                    if(userdislist.zr_type==-1){
                        return userdislistjf
                    }
                    return {msg: '查询成功', zr_type: 0,data :userdislistjf.result}
                    break;
                //会员积分查询
                case "getJFS":
                    var user_common = new User_common(querys.APPUSER_ID);
                    var userdislist = await user_common.getCustomerList();
                    if (userdislist.zr_type == -1) {
                        return userdislist;
                    }
                    var sjf = 0;
                    for(let i = 0 ; userdislist.length>i ;i++){
                        var userdislistjf = await user_common.getCuserdis(userdislist[i].SHOPCODE);
                        if(userdislist.zr_type==-1){
                            return userdislistjf
                        }
                        delete userdislist[i].SHOPCODE
                        userdislist[i].jf =Number(userdislistjf.result.integral)
                        sjf+=Number(userdislistjf.result.integral)
                    }
                    return {msg: '查询成功', zr_type: 0,data :userdislist,sjf:sjf}
                    break;
                //创建会员
                case "create":
                    var user_common = new User_common(querys.APPUSER_ID);
                    var userdislist = await user_common.getUserDis();
                    if (userdislist.zr_type == -1) {
                        return userdislist;
                    }
                    if (!userdislist.NAME) {
                        return {msg: "请先进行实名认证", zr_type: -1}
                    }
                    if (!querys.password || querys.password.length < 6 || isNaN(querys.password)) {
                        return {msg: "请填写正确消费密码", zr_type: -1}
                    }
                    let common_ca = {};
                    common_ca.address = "";
                    common_ca.email = "";
                    common_ca.environmentHobby = "";
                    common_ca.groupId = "";
                    common_ca.invoiceTitle = "";
                    common_ca.wxIconUrl = "";
                    common_ca.memo = "";
                    common_ca.attentionWxTime = Date.now().toString().substring(0, 10);
                    common_ca.birthday = Date.now().toString().substring(0, 10);
                    common_ca.consumePwd = querys.password;
                    common_ca.customerId = 0;
                    common_ca.customerMainId = 0;
                    common_ca.loginId = userdislist.TEL;
                    common_ca.loginType = 0;
                    common_ca.name = userdislist.NAME;
                    common_ca.sex = userdislist.SEX ? userdislist.SEX == "0" ? 1 : 0 : -1;
                    let ret = await Kry_post("/open/v1/crm/createOrUpgradeMember", common_cs, common_ca);
                    if (ret.code == 0) {
                        let secess = await user_common.intoUsercard(ret.result.customerId, xq, querys.a);

                        if (secess && secess.affectedRows > 0) {
                            return {msg: '会员卡申请成功', zr_type: 0}
                        } else {
                            return {msg: '会员卡已经存在', zr_type: -1}
                        }

                    } else {
                        return {msg: ret.message, zr_type: -1}
                    }
                    break;

                //会员二维码
                case "QR_code":
                    var user_common = new User_common(querys.APPUSER_ID);
                    var userdislist = await user_common.getUserDis();
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
                        QR_coderet = await Kry_post("/open/v1/crm/member/generateToken", common_cs, common_ca1);

                        if (QR_coderet.code == 0) {
                            return {msg:"成功", zr_type: 0,data:QR_coderet}
                        }else{
                            return {msg: QR_coderet.message, zr_type: -1}
                        }
                    } else {
                        return {msg: QR_coderet.message, zr_type: -1}
                    }
                    break;
                default:
                    return {msg: "未查找到方法", zr_type: -1}
            }
        }
    };
};
module.exports = Hello;