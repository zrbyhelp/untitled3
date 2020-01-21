const mysql = require('mysql')
const pool = mysql.createPool({
    host: '172.17.5.136', //数据库所在的服务器域名或者IP
    user: 'root', //用户名
    password: 'songjq', //密码
    database: 'upm' //数据库名称
})


// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function( sql, values ) {
    // 返回一个 Promise
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {

                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

module.exports =  query
/*
* const db = require('./db.js');

let sql = 'select * from user where id = ?';
let data = [9];
    const rows = await query('select * from im_user')
    res.json({
        code: 0,
        msg: '请求成功',
        data: rows
    })

let sql = 'insert into user set ?';
let data = {
    username : 'lisi',
    password : '123',
    age : 12,
    departid : 1
}
db.base(sql,data,(ret) => {
    console.log(ret);
});

let sql = 'update user set username=? where id=?';
let data = ['zhaoliu',9];
db.base(sql,data,(ret) => {
    console.log(ret);
});

let sql = 'delete from user where id = ?';
let data = [12];
db.base(sql,data,(ret) => {
    console.log(ret);
});
* */