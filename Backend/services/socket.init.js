
const userModel = require('../DB/model/user');
const { initIO } = require('./socket');

function socketInit(server)
{ 
  console.log("Socket start ");
  const io = initIO(server);
  io.on('connection', socket => {
    socket.on('updateSocketID', async userId => {
      await userModel.findByIdAndUpdate(userId, { socketID: socket.id });
      console.log(userId);
    });
    console.log({socket_id: socket.id});
  });
}

module.exports = socketInit;
