const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/garaj_db';

console.log('🔄 Server başlatılıyor, MongoDB bağlantısı deneniyor...');

// 5 saniye içinde bağlanamazsa beklemeyi kesip hatayı basması için zaman aşımı ekliyoruz
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 
})
  .then(() => {
    console.log('✅ MongoDB veritabanına başarıyla bağlandı.');
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda aktif ve dinleniyor.`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    console.log('💡 Lütfen MongoDB servisinizin çalıştığından ve URI adresinin doğru olduğundan emin olun.');
  });