node_modules -> gulp-asset-rev -> index.js 

 var buf = fs.readFileSync(assetPath);

var md5 = createHash(buf, options.hashLen || 7);

var verStr = (options.verConnecter || "-") + md5;

var myDate = new Date();
var wyq = myDate.toLocaleDateString()+'-'+Math.ceil(Math.random()*100000);

src = src + "?v=" + wyq;
// src = src.replace(verStr, '').replace(/(\.[^\.]+)$/, verStr + "$1");