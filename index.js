var ws = require("nodejs-websocket");
// 这里用到了moment，请大家自行安装
var moment = require('moment');

console.log("开始建立连接...")

let users = [];
let conns = {}

// 向所有连接的客户端广播
function boardcast(obj) {
  console.log('boardcast', obj);
  if(obj.bridge && obj.bridge.length) {
    obj.bridge.forEach(item => {
      conns[item].sendText(JSON.stringify(obj));
    })
    return;
  }
  server.connections.forEach(function(conn) {
      conn.sendText(JSON.stringify(obj));
  })
}

function getDate(){
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

var server = ws.createServer(function(conn){
  conn.on("text", function (obj) {
    obj = JSON.parse(obj);
    // 讲所有uid对应的连接conn存到一个对象里面
    conns[''+obj.uid] = conn;
    if(obj.type===1){
      let isuser = users.some(item => {
        return item.uid === obj.uid
      })
      if(!isuser) {
        users.push({
          nickname: obj.nickname,
          uid: obj.uid
        });
      }
      boardcast({
        type: 1,
        date: getDate(),
        msg: obj.nickname+'加入聊天室',
        users: users,
        uid: obj.uid,
        nickname: obj.nickname,
        bridge: obj.bridge
      });
    } else {    
      let isuser = users.some(item => {
        return item.uid === obj.uid
      })
      if(!isuser) {
        users.push({
          nickname: obj.nickname,
          uid: obj.uid
        });
      }  
      boardcast({
        type: 2,
        date: getDate(),
        msg: obj.msg,
        uid: obj.uid,
        users: users,
        nickname: obj.nickname,
        bridge: obj.bridge,
        status: 1,
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
