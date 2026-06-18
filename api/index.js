import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, '../dist/server/server.js');
const serverModule = await import(serverPath);
const serverHandler = serverModule.default ?? serverModule;

function nodeRequestToWebRequest(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const init = {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
  };
  return new Request(url.toString(), init);
}

export default async function vercelHandler(req, res) {
  try {
    const request = nodeRequestToWebRequest(req);
    const response = await serverHandler.fetch(request, undefined, undefined);

    res.statusCode = response.status;
    for (const [name, value] of response.headers) {
      res.setHeader(name, value);
    }

    const buffer = await response.arrayBuffer();
    res.end(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end('<h1>Server error</h1>');
  }
}
