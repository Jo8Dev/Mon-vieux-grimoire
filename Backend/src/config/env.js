// Exportation des variables d'environnement pour les charger dans l'order suivant: .env.local, .env
function env() {
    require('dotenv').config({ path: ['.env.local', '.env'] })
    return {
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET
    }
}

module.exports = env()