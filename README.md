# SMS Reminder Service

**version 0.10**

Version 0.10 is the first version ready to be deployed. Here is the current
feature set as of this version:

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

