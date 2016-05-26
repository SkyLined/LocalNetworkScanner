function fXHRScanIPAddressPorts(sIPAddress, auPortNumbers, fCallback) {
  var auDetectedPorts = [];
  (function fLoop() {
    if (auPortNumbers.length) {
      var uPortNumber = auPortNumbers.pop(),
          oXHR = new XMLHttpRequest(),
          bFinished = false,
          oTimeout = setTimeout(function fXHRTimeout() {
            if (!bFinished) {
              bFinished = true;
              oXHR.abort();
              fLoop();
            };
          }, 2000);
      oXHR.onreadystatechange = function fXHRReadyStateChangeEventHandler(oEvent) {
        if (oXHR.readyState == 4 && !bFinished) {
          bFinished = true;
          clearTimeout(oTimeout);
          auDetectedPorts.push(uPortNumber);
          fLoop();
        };
      };
      oXHR.open("GET", "http://" + sIPAddress + ":" + uPortNumber);
      oXHR.send();
    } else {
      console.log("IP: " + sIPAddress + ", ports: " + (auDetectedPorts.join(", ") || "none"));
      fCallback(auDetectedPorts);
    };
  })();
};