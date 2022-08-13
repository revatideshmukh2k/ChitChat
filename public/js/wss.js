import * as store from './store.js'
import * as ui from './ui.js'
import * as webRTCHandler from './webRTCHander.js'
import * as constants from './constants.js'
import * as strangerUtils from './strangerUtils.js'

let socketIO = null

export const registerSocketEvents = (socket) => {
    socket.on('connect', () => {
        socketIO = socket
        console.log("Successfully connected")
        store.setSocketId(socket.id)
        ui.updatePersonalCode(socket.id)
    })

    socket.on('pre-offer', (data) => {
        webRTCHandler.handlePreOffer(data)
    })

    socket.on("pre-offer-answer", (data) => {
        webRTCHandler.handlePreOfferAnswer(data);
      });
  
      socket.on('user-hanged-up', () => {
        console.log("wss file")
        webRTCHandler.handleConnectedUserHangedUp()
      })
      socket.on("webRTC-signaling", (data) => {
        switch (data.type) {
          case constants.webRTCSignaling.OFFER:
            webRTCHandler.handleWebRTCOffer(data);
            break;
          case constants.webRTCSignaling.ANSWER:
            webRTCHandler.handleWebRTCAnswer(data);
            break;
          case constants.webRTCSignaling.ICE_CANDIDATE:
            webRTCHandler.handleWebRTCCandidate(data);
            break;
          default:
            return;
        }
      });

      // socket.on('stranger-socket-id',(data) =>{
      //   strangerUtils.connectWithStrangers(data)
      // })

}

export const sendPreOffer =  (data) => {
    socketIO.emit('pre-offer', data)
}

export const sendPreOfferAnswer = (data) => {
    socketIO.emit("pre-offer-answer", data);
  };

export const sendDataUsingWebRTCSignaling = (data) => {
    socketIO.emit("webRTC-signaling", data);
  };

export const sendUserHangedUp = (data) => {
  socketIO.emit('user-hanged-up', data)
}

// export const changeStrangerConnectionStatus = (data) => {
//   socketIO.emit('stranger-connection-status', data)
// }

// export const getStrangerSocketId = () => {
//   socketIO.emit('get-stranger-socket-id')
// }