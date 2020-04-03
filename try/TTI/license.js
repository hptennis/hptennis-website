'use strict'

class License{

    constructor(notValidBefore, notValidAfter, key,customer,serial,hcf,maintDate,state,version,s2s,wrm){
      this.notValidBefore = License.toFullDateStr(notValidBefore),
      this.notValidAfter = License.toFullDateStr(notValidAfter),
      this.key = key,
      this.customer =customer,
      this.serial = serial,
      this.hcf =hcf,
      this.maintDate = License.toFullDateStr(maintDate),
      this.state = state,
      this.version =version,
      this.s2s = s2s,
      this.wrm = wrm
    }

    static shortHcfWithToolTip(hcf){
        var hcfStr = hcf[0]
        if (hcfStr.includes("None") || hcfStr.includes("All"))
        {
            return "<div>"+hcfStr+"</div>"
        }

        return "<div title='"+hcf+"'>"+hcfStr.substring(0,12)+"...</div>"
    }

    static toFullDateStr(date)
    {
        var dateStr = "";

        if (date.length>10){
           dateStr = moment(date).format();
        } else
        {
            dateStr = moment(date,"DD-MM-YYYY").format(); 
        }

        if (dateStr==="Invalid date")
        {
             dateStr = moment(date, "DD-MM-YYYY hh:mm",false).format();
        }
        return dateStr;
    }

    static shortDateWithToolTip(date){
        return "<div title='"+date+"'>"+License.shortDate(date)+"</div>"
    }

    static shortDateTime(date) {
       ;
        var dStr = moment(date).format("DD-MM-YYYY hh:mm");
       return dStr;
    }

    static shortDate(date) {
        var dStr = moment(date).format("DD-MM-YYYY");
         return dStr;
    }

    static shortTime(date) {
        return moment(date).format("hh:mm");
    }

   


    setBorrowed(start,end)
    {
        this.borrowed = {"notValidBefore": start , "notValidAfter": end }
    }

    toString(){
        return `${this.key}` & `${this.serial}`
    }

    toRow()
    {
        var row = { "notValidBefore": notValidBefore, "notValidAfter" : notValidAfter,  "key" : key, "customer" : data.customer, "serial" : data.serial, "hcfList" : data.hcf, "maintDate" : data.maintDate}
    /*    var row = { "creationDate" : this.creationDate,
            this.key = key,
            this.customer =customer,
            this.serial = serial,
            this.hcf =hcf,
            this.maintDate = maintDate,
            this.state = state,
            this.version =version,
            this.s2s = s2s,
            this.wrm = wrm}
            */
    }

    // get maintDate() {
    //     return this.maintDate
    // }

    // set maintDate(date) {
    //      this.maintDate = date
    // }


}