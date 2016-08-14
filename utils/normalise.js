var mongoose = require('mongoose');

//normalise_date is a function that sets the timing of the loan to 8am sharp, no
//matter the time of the actual borrowing. 
//The reason for this is so that messages can be sent promptly at 8am in the
//morning.

function normalise_date(date) {
  // console.log(date);
  date.setHours(8,0,0,0);
  // console.log(date);
  // console.log(Date.parse(date));
  return(date);
}

module.exports = normalise_date;
