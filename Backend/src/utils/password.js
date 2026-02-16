const bcrypt = require('bcrypt')

async function hashPassword(password){
    const saltRound = 10
    return bcrypt.hash(password, saltRound)
}

async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}

module.exports = {hashPassword, comparePassword}