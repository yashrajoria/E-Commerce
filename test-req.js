const http = require('http');
http.get('http://localhost:3000/api/user/products?page=1&perPage=3&is_featured=true', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data.substring(0, 500));
  });
}).on('error', err => console.log('Error:', err.message));
