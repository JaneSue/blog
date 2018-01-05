// 端口
exports.port = process.env.PORT || 3000;

// mongodb配置
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/blog'
};

// cookie secret
exports.cryptoKey = 'k3yb0ardc4t';