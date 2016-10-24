# SMS Reminder Service

I wrote this SMS Reminder service as my WITS project. My unit loans a lot of
items every month and borrowers often forget to return their item. This service
is able to send an SMS to the borrower (and to my superior) to remind them to
return their items automatically.

I used a third-party service, Twilio, to send the SMSes.

**version 0.20**

Version 0.20 is the second version ready to be deployed. Here is the current
feature set as of this version:


## New features:

* Signup and login feature
  * Change phone number, password, username

* Add new stores
  * Choose contributors (only contributors can access your stores)

* Edit stores
  * Rename store, add contributors

## Features in v0.10:

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
* Show loan **in detail** with fields:
  * Date
  * Expiry date
  * Returned (Boolean)
  * Name
  * Items (item name, item amount)
  * **Return items button**
  * **Renew loan button**
* Automated SMS sending to borrower when the following events occur:
  * A loan is made
  * A loan is renewed
  * A loan is returned
  * Seven (7) days before loan expiry
  * Three (3) days before loan expiry
  * Loan expires

