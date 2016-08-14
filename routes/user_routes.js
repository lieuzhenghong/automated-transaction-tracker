var User = require('../models/user.js');

module.exports = (app) => {

app.get('/setup', (req, res) => {
  var lieu = new User({
    name: "Lieu Zheng Hong",
    password: "password",
    admin: true 
  });

  lieu.save((err) => {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({success: true});
  })
})
  
}


