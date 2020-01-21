let crypto = require("crypto");
const query = require('./db.js');
function common (shopIdenty){
    this.getkey =async function(){
        let sql = 'select APPKEY from kry_config where  SHOPCODE = ?';
        let sqldata = [];
        sqldata.push(shopIdenty)
        let ret = [];
        try {
            ret = await query(sql, sqldata);

        } catch (error) {
            ret = []
        }
        if(!ret||ret.length<=0){
            return "";
        }else{
            return ret[0].APPKEY;
        }
    }

    this.getCOMMUNITYID =async function(){
        let sql = 'select COMMUNITYID from kry_config where  SHOPCODE = ?';
        let sqldata = [];
        sqldata.push(shopIdenty)
        let ret = [];
        try {
            ret = await query(sql, sqldata);

        } catch (error) {
            ret = []
        }
        if(!ret||ret.length<=0){
            return "";
        }else{
            return ret[0].COMMUNITYID;
        }
    }
    this.sha256 = function(initPWD){
        let sha = crypto.createHash('sha256');//创建哈希加密算法，后边可以是md5，sha1,sha256等
        let password = sha.update(initPWD).digest('hex');
        return password;
    }
    this.getsing=async function(){
        let sing = this.sha256("appKey"+await this.getkey()+"shopIdenty"+data.shopIdenty+"timestamp"+data.timestamp+"version"+data.version+await this.gettokey())
        return sing;
    }
    this.gettokey =async function(){
        let sql = 'select TOKEY from kry_config where  SHOPCODE = ?';
        let sqldata = [];
        sqldata.push(shopIdenty)
        let ret = [];
        try {
            ret = await query(sql, sqldata);

        } catch (error) {
            ret = []
        }

        if(!ret||ret.length<=0){
            return "";
        }else{

            return ret[0].TOKEY;
        }
    }
    let data = {};
    init= async ()=>{
        data.appKey =await this.getkey();
        data.shopIdenty=shopIdenty;
        data.timestamp = Date.now().toString().substring(0,10);
        //data.tokey =await this.gettokey();
        data.version = "1.0";
        data.sign =await this.getsing();
        return data
    }
    this.getdatas=async function(){
        return await init();
    }
}
module.exports = common;