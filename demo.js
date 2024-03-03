const { default: mongoose } = require("mongoose")

const getWatchHistory = async(req,res) => {

    const user = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                forigenField:"_id",
                \
            }
        }
    ])
}