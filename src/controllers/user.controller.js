import {asynchandler} from "../utils/asynchandler.js"

const userRegister = asynchandler(async (req, res,) => {
    res.status(200).json({
        message : "ok"
    })
})

export {userRegister}