import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  const signature = req.headers['x-line-signature'];
  const body = JSON.stringify(req.body);
  
  const hash = crypto
    .createHmac('SHA256', process.env.LINE_CHANNEL_SECRET)
    .update(body)
    .digest('base64');
    
  if (hash !== signature) {
    return res.status(401).send('Unauthorized');
  }

  const events = req.body.events;
  
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;
      
      // AI ตอบกลับแบบฉลาด
      let replyText = '';
      
      if (userMessage.includes('สวัสดี') || userMessage.includes('หวัดดี')) {
        replyText = 'สวัสดีครับ! ผมเป็นบอท AI ยินดีช่วยเหลือครับ 😊';
      } else if (userMessage.includes('ชื่อ')) {
        replyText = 'ผมชื่อ AI Bot ครับ สร้างด้วย Vercel + LINE';
      } else if (userMessage.includes('ทำอะไรได้')) {
        replyText = 'ผมตอบคำถาม คุยเล่น ช่วยเหลือได้ครับ ลองถามมาเลย!';
      } else {
        replyText = `คุณพูดว่า: "${userMessage}"\n\nผมเข้าใจแล้วครับ มีอะไรให้ช่วยอีกไหม?`;
      }
      
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          replyToken: replyToken,
          messages: [{ type: 'text', text: replyText }]
        })
      });
    }
  }
  
  res.status(200).send('OK');
}
