
const asynchandler = (reqhandler) => {
    return (req, res, next) => {
        Promise.resolve(reqhandler(req, res, next)).catch((error) => next(error))
    }
}

// export {asynchandler}
// const asynchandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status((error.code || 500).json({
//             success : false,
//             message : error.message
//         }))
//     }
// }


// const asynchandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.send((error.code || 500).json({
//             success : false,
//             message : error.message
//         }))
//     }
// }
// export asynchandler;
