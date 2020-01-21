
var request = require('request');

let kry_commonurl = "https://openapi.keruyun.com"
let kry_post = function (curl, gc, rc) {
    function http_builder_url(url, data) {
        if (typeof (url) == 'undefined' || url == null || url == '') {
            return '';
        }
        if (typeof (data) == 'undefined' || data == null || typeof (data) != 'object') {
            return '';
        }
        url += (url.indexOf("?") != -1) ? "" : "?";
        for (var k in data) {
            url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);

        }

        return url;
    }

    return new Promise((resolve, reject) => {

        request({
            url: http_builder_url(kry_commonurl + curl, gc),
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: rc,
            jsonReviver:function(a,b){
               JSON.parse(b);
               b.toString()

            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(getRealJsonData(body)) // 请求成功的处理逻辑
            } else {
                reject(response)
            }
        })
    })


}
module.exports = kry_post
function getRealJsonData(baseStr) {
    if (!baseStr || typeof baseStr != 'string') return;
    var jsonData = null;
    try {
        jsonData = JSON.parse(baseStr);
    } catch (err){
        return null;
    }
    var needReplaceStrs = [];
    loopFindArrOrObj(jsonData,needReplaceStrs);
    needReplaceStrs.forEach(function (replaceInfo) {
        var matchArr = baseStr.match(eval('/"'+ replaceInfo.key + '":[0-9]{15,}/'));
        if (matchArr) {
            var str = matchArr[0];
            var replaceStr = str.replace('"' + replaceInfo.key + '":','"' + replaceInfo.key + '":"');
            replaceStr += '"';
            baseStr = baseStr.replace(str,replaceStr);
        }
    });
    var returnJson = null;
    try {
        returnJson = JSON.parse(baseStr);
    }catch (err){
        return null;
    }
    return returnJson;
}

//遍历对象类型的
function getNeedRpStrByObj(obj,needReplaceStrs) {
    for (var key in obj) {
        var value = obj[key];
        if (typeof value == 'number' && value > 9007199254740992){
            needReplaceStrs.push({key:key});
        }
        loopFindArrOrObj(value,needReplaceStrs);
    }
}

//遍历数组类型的
function getNeedRpStrByArr(arr,needReplaceStrs) {
    for(var i=0; i<arr.length; i++){
        var value = arr[i];
        loopFindArrOrObj(value,needReplaceStrs);
    }
}

//递归遍历
function loopFindArrOrObj(value,needRpStrArr) {
    var valueTypeof = Object.prototype.toString.call(value);
    if (valueTypeof == '[object Object]') {
        needRpStrArr.concat(getNeedRpStrByObj(value,needRpStrArr));
    }
    if (valueTypeof == '[object Array]') {
        needRpStrArr.concat(getNeedRpStrByArr(value,needRpStrArr));
    }
}