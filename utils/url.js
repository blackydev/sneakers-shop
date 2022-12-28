exports.getHostURL = (req) => req.protocol + "://" + req.get("host");
