var ws = require("nodejs-websocket");
// 这里用到了moment，请大家自行安装
var moment = require('moment');

console.log("开始建立连接...")

let users = [];

// 向所有连接的客户端广播
function boardcast(obj) {
  server.connections.forEach(function(conn) {
      conn.sendText(JSON.stringify(obj));
  })
}

function getDate(){
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

var server = ws.createServer(function(conn){
  conn.on("text", function (obj) {
    console.log('connections'.server.connections);
    obj = JSON.parse(obj);
    if(obj.type===1){
      users.push({
        nickname: obj.nickname,
        uid: obj.uid
      });
      boardcast({
        type: 1,
        date: getDate(),
        msg: obj.nickname+'加入聊天室',
        users: users,
        uid: obj.uid,
        nickname: obj.nickname
      });
    } else {
      boardcast({
        type: 2,
        date: getDate(),
        msg: obj.msg,
        uid: obj.uid,
        nickname: obj.nickname
      });
    }
  })
  conn.on("close", function (code, reason) {
    console.log("关闭连接")
  });
  conn.on("error", function (code, reason) {
    console.log("异常关闭")
  });
}).listen(8001)
console.log("WebSocket建立完毕")
