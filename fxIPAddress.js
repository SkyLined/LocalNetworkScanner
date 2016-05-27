function fuIPAddress(sIPAddress) {
  var asComponents = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.exec(sIPAddress);
  if (!asComponents) throw new TypeError("Invalid IPv4 address " + sIPAddress);
  var uIPAddress = 0;
  for (var uByte = 0; uByte < 4; uByte++) {
    uIPAddress = (uIPAddress << 8) + parseInt(asComponents[uByte + 1]); // no sanity checks!
  };
  return uIPAddress;
};

function fsIPAddress(uIPAddress) {
  var asIPAddress = [];
  for (var uByte = 0; uByte < 4; uByte++) {
    asIPAddress[uByte] = ((uIPAddress >> (24 - uByte * 8)) & 0xFF).toString();
  };
  return asIPAddress.join(".");
};
