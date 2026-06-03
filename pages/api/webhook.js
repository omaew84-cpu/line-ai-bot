// วางที่: /api/webhook.js
const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export default async function handler(req, res) {
  if (req.method === 'GET') return res.send('OK');
  
  const events = req.body.events || [];
  
  for (const e of events) {
    if (e.type === 'message' && e.message.type === 'text') {
      const msg = e.message.text.toLowerCase();
      let reply = '';
      
      if (msg.includes('สวัสดี') || msg.includes('ไง')) {
        reply = 'สวัสดีค่ะ 🙏 ยินดีต้อนรับสู่ Maewai AI\nพิมพ์ "ราคา" ดูสินค้าได้เลย';
      } else if (msg.includes('ราคา')) {
        reply = '💰 แพ็กเกจ ฿299 / ฿599 / ฿1,299\nสนใจพิมพ์ "สั่งซื้อ"';
      } else if (msg.includes('สั่ง')) {
        reply = 'รับออเดอร์ค่ะ! แจ้งชื่อ-ที่อยู่-เบอร์ได้เลย';
      } else {
        reply = `รับทราบ: "${e.message.text}"\nแอดมินตอบกลับเร็วๆ นี้`;
      }
      
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          replyToken: e.replyToken,
          messages: [{ type: 'text', text: reply }]
        })
      });
    }
  }
  res.status(200).json({ ok: true });
}
