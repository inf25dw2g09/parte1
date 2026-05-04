const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 🔍 FUNÇÃO DE LIGAÇÃO COM RETRY (Tenta até conseguir ligar)
function connectWithRetry() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ MySQL ainda não está pronto... a tentar novamente em 3s');
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log('✅ Ligado ao MySQL com sucesso!');
            connection.release();
        }
    });
}

connectWithRetry();

module.exports = db;