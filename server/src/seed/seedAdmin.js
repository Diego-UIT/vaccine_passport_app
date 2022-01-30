const CryptoJS = require('crypto-js')
const { Admin } = require('../models')

exports.createAdmin = async () => {
    const username = process.env.DEFAULT_ADMIN_USERNAME
    const password = process.env.DEFAULT_ADMIN_PASSWORD
    const secret_key = process.env.PASSWORD_SECRET_KEY

    try {
        const admin = await Admin.findOne({username: username})
        if (admin !== null) {
            return true
        }
        const newAdmin = new Admin({
            username: username,
            password: CryptoJS.AES.encrypt(
                password,
                secret_key
            )
        })
        await newAdmin.save()
        console.log('-----------------------')
        console.log('Admin created with')
        console.log(`Username => ${username}`)
        console.log(`Password => ${password}`)
        console.log('-----------------------')
    } catch(error) {
        console.log(error)
        return false
    }
}