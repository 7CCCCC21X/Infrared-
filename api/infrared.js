// 放在项目根目录的 /api 下，Vercel 自动识别
export default async function handler(req, res) {
  // 预检请求：让浏览器通过 CORS 校验
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'address param missing' });

  const target = `https://infrared.finance/api/points/user/${address}?address=${address}&chainId=80094`;

  try {
    const resp = await fetch(target, { headers: { accept: 'application/json' } });
    const data = await resp.json();

    // 关键：给响应加 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 可选：缓存 60 秒减少请求量
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'proxy_failed', detail: err.message });
  }
}
