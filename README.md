# SMS Reminder Service

See the app [here](https://loan-tracker.herokuapp.com/).

I wrote this SMS Reminder service as my WITS project. My unit loans a lot of
items every month and borrowers often forget to return their item. This service
is able to send an SMS to the borrower (and to my superior) to remind them to
return their items automatically.

I used a third-party service, Twilio, to send the SMSes.

## Feature showcase

### Search by rank, name or phone number:

<img src= "https://thumbs.gfycat.com/PositiveUnawareCub-size_restricted.gif"
width = "500">

### Add a new loan in seconds:

<img src= "https://thumbs.gfycat.com/ActiveHealthyImago-size_restricted.gif"
width = "500">

### SMSes are automatically sent:

<img src= "/docs/img/sms_reminder.jpg"
width = "500">

## Features:

* Automated SMS sending to borrower when the following events occur:
  * A loan is made
  * A loan is renewed
  * A loan is returned
  * Seven (7) days before loan expiry
  * Three (3) days before loan expiry
  * Loan expires
* Signup and login
  * Change phone number, password, display name
* Add new stores
  * Choose contributors (only contributors can access your stores)
* Edit stores
  * Rename store, add contributors
* Add new loan with fields:
  * Name
  * Phone number
  * Expiry date 
  * Item name, item amount (unlimited items)
* Show loans with fields:
  * Date
  * Expiry date
  * Name
  * Phone number
* Show loan in detail with fields:
  * Date
  * Expiry date
  * Returned (Boolean)
  * Name
  * ~~Items (item name, item amount)~~ **not shown; items may be sensitive**
  * Return items button
  * Renew loan button

