import https from 'https';
const opts = {
  headers: {
    'Origin': 'https://ais-dev-pbgxrzcuvyouy46fbpt3gq-383302654371.us-west2.run.app'
  }
};
https.get('https://useducationcenter.org/asset/json/zones/gnmath.json', opts, (res) => {
  console.log("CORS headers:");
  console.log("Access-Control-Allow-Origin:", res.headers['access-control-allow-origin']);
});
