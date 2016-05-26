function fGetIPAddresses(oIFrame, fSuccessCallback, fErrorCallback) {
    //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
    function fcGetRTCPeerConnection(oWindow) {
      return oWindow && (oWindow.RTCPeerConnection || oWindow.mozRTCPeerConnection || oWindow.webkitRTCPeerConnection);
    }
    var cRTCPeerConnection = fcGetRTCPeerConnection(window) || fcGetRTCPeerConnection(oIFrame.contentWindow);
    if (!cRTCPeerConnection) {
      fErrorCallback("RTCPeerConnection feature not available");
      return;
    };
    
    var oRTCPeerConnection = new cRTCPeerConnection( 
      { "iceServers": [
        { "urls": "stun:stun.services.mozilla.com" },
      ] },
      { "optional":   [
        { "RtpDataChannels": true },
      ] }
    );
    
    dsIPAddresses = {};
    oRTCPeerConnection.onicecandidate = function fRTCPeerConnectionIceEventHandler(oRTCPeerConnectionIceEvent){
      var oRTCIceCandidate = oRTCPeerConnectionIceEvent.candidate;
      if (oRTCIceCandidate) {
        var asCandidate = oRTCIceCandidate.candidate.split(" ");
        if (asCandidate[7] == "host") {
          var sIPAddress = asCandidate[4];
          if (/[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7}/.exec(sIPAddress)) {
            dsIPAddresses[sIPAddress] = 1;
          } else {
            console.log("Ignored RTCIceCandidate " + JSON.stringify(oRTCIceCandidate.candidate) + ": not an IP address.");
          };
        } else {
          console.log("Ignored RTCIceCandidate " + JSON.stringify(oRTCIceCandidate.candidate) + ": not a \"host\".");
        };
      } else {
        fSuccessCallback(Object.keys(dsIPAddresses));
      };
    };
    
    oRTCPeerConnection.createDataChannel("");
    oRTCPeerConnection.createOffer(
      function fCreateOfferSuccess(oRTCSessionDescription){
        oRTCPeerConnection.setLocalDescription(
          oRTCSessionDescription,
          function fSetLocalDescriptionSuccess(){
          },
          function fSetLocalDescriptionError(sErrorMessage){
            fErrorCallback("Could not set local description: " + sErrorMessage);
          }
        );
      },
      function fCreateOfferError(sErrorMessage){
        fErrorCallback("Could not create offer: " + sErrorMessage);
      }
    );
};
