'use strict'

class Membership{


    

    constructor(timestamp, serial, firstname, surname, address1, address2, postcode, phone,	email, email_option, membership_type, payment_type, trialEndDate){
        this.timestamp = timestamp , 
        this.serial = serial, 
        this.firstname = firstname, 
        this.surname = surname , 
        this.address1 = address1, 
        this.address2 = address2, 
        this.postcode = postcode, 
        this.phone = phone,	
        this.email = email, 
        this.email_option = email_option, 
        this.membership_type = membership_type, 
        this.payment_type = payment_type, 
        this.trialEndDate = trialEndDate  
    }

    updateTime(timestamp) {
        this.lastUpdate = timestamp;
      }
    
}