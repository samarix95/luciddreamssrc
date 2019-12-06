exports.vk = (req, res) => {
    const io = req.app.get('io')
    // const user = {
    //     name: req.user,
    //     //photo: req.user.photos[0].value.replace(/_normal/, '')
    // }
    //const user = req.user
    io.in(req.session.socketId).emit('vk', req.user)
    res.end()
}