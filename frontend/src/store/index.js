import Vue from 'vue'
import Vuex from 'vuex'
import Constants from '../util/Constants'
import kurentoUtils from 'kurento-utils'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    ws: null,
    linkURL: '',
    state: Constants.I_CAN_START,
    isSeekable: false,
    webRtcPeer: null,
    videoPositon: null,
    remoteVideoReference: null
  },
  getters: {
    getLinkURL: state => state.linkURL,

  },
  mutations: {
    setlinkurl(state, newLink) {
      state.linkURL = newLink
    },
    setState(state, newState) {
      state.state = newState;
    },
    setVideoRef(state, video) {
      state.remoteVideoReference = video
    }
  },
  actions: {
    setlinkurl(context, newlink) {
      context.commit('setlinkurl', newlink)
    },
    startConnection({ commit, state, dispatch }) {
      state.ws = new WebSocket('wss://localhost:8443/player')

      state.ws.onmessage = function (message) {
        const parsedMensage = JSON.parse(message.data)

        console.log('Received message: ' + message.data);

        switch (parsedMensage.id) {
          case 'startResponse':
            dispatch('startResponse', parsedMensage)
            break;
          case 'error':
            if (state.state === Constants.I_AM_STARTING)
              commit('setState', Constants.I_CAN_START)
            console.log('Error message from serve: ' + parsedMensage.message)
            break;
          case 'playEnd':
            dispatch('playEnd')
            break;
          case 'videoInfo':
            dispatch('showVideoData', parsedMensage)
            break;
          case 'iceCandidate':
            state.webRtcPeer.addIceCandidate(parsedMensage.candidate, function (error) {
              if (error)
                console.error('Error adding candidate ' + error)
            });
            break;
          case 'seek':
            console.log(parsedMensage);
            break;
          case 'position':
            state.videoPositon = parsedMensage.position;
            break;
          default:
            if (state.state === Constants.I_AM_STARTING)
              commit('setState', Constants.I_CAN_START)
            console.error('Unrecognized message')
        }
      }
    },
    start({ commit, state, dispatch }) {
      commit('setState', Constants.I_AM_STARTING)

      var userMediaConstraints = {
        audio: true,
        video: true,
      }

      console.log('Creating WebRtcPeer in ' + ' mode and generating local sdp offer ...');

      function onIceCandidate(candidate) {

        console.log('Local candidate' + JSON.stringify(candidate));

        const message = {
          id: 'onIceCandidate',
          candidate: candidate
        }
        dispatch('sendMensage', message);

      }
      const options = {
        remoteVideo: state.remoteVideoReference,
        mediaConstraints: userMediaConstraints,
        onicecandidate: onIceCandidate
      }

      state.webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function (error) {
        if (error)
          return console.error(error)

        function onOffer(error2, offerSdp) {
          if (error2)
            return console.error('Error generating the offer');
          const message = {
            id: 'start',
            sdpOffer: offerSdp,
            videourl: state.linkURL
          }
          dispatch('sendMensage', message)
        }
        state.webRtcPeer.generateOffer(onOffer)
      })


    }

    ,
    sendMensage({ state }, message) {

      const jsonMessage = JSON.stringify(message);
      console.log('Sending message: ' + jsonMessage);
      console.error(state.ws)
      state.ws.send(jsonMessage)
    },
    playEnd({ commit }) {
      commit('setState', Constants.I_CAN_START)
    },
    startResponse({ commit, state }, message) {

      commit('setState', Constants.I_CAN_STOP)
      console.log("SDP answer received from server. Processing ...");
      console.info(message)
      state.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        if (error)
          return console.error(error);
      });
    },
    setVideoRef({ commit }, video) {
      commit('setVideoRef', video)
    },
  }
})

export { store };