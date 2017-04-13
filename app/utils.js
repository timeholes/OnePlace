function cutLinks(str, length) {
  str = str.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
  while ((str.indexOf("http") >= 0) && (str.indexOf("http") <= length)) {
    var start = str.indexOf("http");
    var part1 = str.substring(0, start);
    var end = str.indexOf(' ', start);
    if (end >= 0) {
      var part2 = str.substring(end);
    } else {
      var part2 = '';
    };
    str = part1 + part2;
  };
  return str;
};

module.exports.cutLinks = cutLinks;