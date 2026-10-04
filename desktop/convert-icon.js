const pngToIco = require('png-to-ico').default || require('png-to-ico');
const fs = require('fs');
const path = require('path');

// Convert jpg/png to ico
pngToIco(path.join(__dirname, 'assets', 'icon.png'))
  .then(buf => {
    fs.writeFileSync(path.join(__dirname, 'assets', 'icon.ico'), buf);
    console.log('✅ icon.ico created successfully!');
  })
  .catch(err => {
    console.error('Error converting icon:', err.message);
  });
