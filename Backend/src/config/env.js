function env() {
    require('dotenv').config({ path: ['.env.local', '.env'] })
    return {
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET
    }
}

module.exports = env()