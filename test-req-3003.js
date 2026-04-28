const http = require('http');
http.get('http://localhost:3003/api/user/products?page=1&perPage=3&is_featured=true', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
  });
}).on('error', err => console.log('Error:', err.message));
