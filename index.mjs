import handler from 'serve-handler';
import http from 'node:http';

const options = {
	public: './public'
};

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, options);
});

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
