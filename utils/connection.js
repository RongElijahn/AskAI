const mongoose = require('mongoose');
const conn = mongoose.createConnection(
  'mongodb://127.0.0.1:27017/ChatGPT_Evaluation',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
   }
);
conn.on('open', () => {
	console.log('connect tp mongodb/ChatGPT_Evaluation');
});
conn.on('err', (err) => {
	console.log('err:' + err);
});

module.exports = conn; //commonJs 语法，导出conn模块。

