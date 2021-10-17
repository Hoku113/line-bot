"use strict";

const express = require("express");
const line = require("@line/bot-sdk");


const PORT = process.env.PORT || 3000;

const config = {
	channelSecret: "7ae9be46e00471a4867fb1df7e5c675d",
	channelAccessToken: "UVvcprbcVIdjzMqfe87f981t9O3JMEaqjlpsju0BIGyuNwxx3PjzcgO9OedBF1LxkjU/8qGgLzPhKMgPfnupVz9kg3Bn8gIP+6WlahXZ6WRgRsGf2tpYuHGiiBpwzpGC+Dk9wfsM9hjR99SgqQUg0wdB04t89/1O/w1cDnyilFU=",
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
	if (event.type !== 'message' || event.message.type !== 'text') {
	  return Promise.resolve(null);
	}
  
	return client.replyMessage(event.replyToken, {
	  type: 'text',
	  text: event.message.text 
	});
  }
  
  app.listen(PORT);
  console.log(`Server running at ${PORT}`);