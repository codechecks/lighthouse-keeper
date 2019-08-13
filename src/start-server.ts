export function startServer(root: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const { createServer } = require("http-server/lib/http-server");

    const server = createServer({ root: root });

    server.listen(3000, "127.0.0.1", (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
      }
    });
  });
}
