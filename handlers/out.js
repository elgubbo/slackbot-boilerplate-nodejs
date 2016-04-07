var BOT_NAME = 'pollbot';
var TOKEN = process.argv[2];
var EMOTICONS = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':ten:'];
var FRUITEMOTICONS = [':lemon:', ':apple:', ':tangerine:', ':cherries:', ':grapes:', ':watermelon:', ':strawberry:', ':peach:', ':melon:', ':banana:', ':pineapple:', ':pear:'];

module.exports = function (req, res, next) {
  console.log('received poll');

  console.log(process.argv);
  var token = req.body.token;
  if (token !== TOKEN) {
    return res.status(200).end();
  }

  var userName = req.body.user_name;
  if (userName == BOT_NAME) {
    return res.status(200).end();
  }
  var text = req.body.text;
  var pollParts = text.match(/(?:[^\s"]+|"[^"]*")+/g);
  pollParts.splice(0, 1);
  var poll = buildPoll(pollParts);

  var botPayload = {
    response_type: "in_channel",
    attachments : [
      poll
    ],
  };
  return res.status(200).json(botPayload);
};


var buildPoll = function(parts) {
  if( !(Object.prototype.toString.call( parts ) === '[object Array]')) {
      return false;
  }
  var attachment = {
    "color": "#36a64f",
    text: "",
    pretext : "There is a new poll! React to this message with the emoticon left of your preferred answer! \n",
  };
  parts.forEach(function(part, index) {
    if ((index < FRUITEMOTICONS.length) && index != 0) {
      attachment.text = attachment.text + FRUITEMOTICONS[index-1] + ": " + part.replace(/"([^"]+(?="))"/g, '$1') +"\n";
    } else {
      attachment.title = part.replace(/"([^"]+(?="))"/g, '$1') + "\n"
    }
  });
  return attachment;
}