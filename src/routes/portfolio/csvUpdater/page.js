
const parse_birthday = (date) => {
    if (date.length>0){
    date = date.split('/')
    date = date[0] + '-' + date[1]
    }
    return date
};

const clean_status = (status) => {

    if ((status === 'Lead') || (status === 'Inactive') || (status === 'Active')) {
        return(status)
    } else if ((status === "Trial") || (status === "Waiting")) {
        return("Lead")
    } else{
        return("Unknown")
    }
};

const clean_phone= (number) => {
    console.log(number)
    let new_number = number.replace(/[^0-9 ]/g, "")
    new_number = new_number.replace(/\s/g, "")
    console.log(new_number)
    if (new_number.length === 10){
        new_number = "+1-"+new_number.substring(0,3) + '-' + new_number.substring(3,6) + '-' + new_number.substring(6,)
    } else if((new_number.length === 11) && (new_number[0]==='1')){
        new_number = "+1-"+new_number.substring(1,4) + '-' + new_number.substring(4,7) + '-' + new_number.substring(7,)
    } else if(number.length>0) {
        new_number = "ERROR: "+ number
        console.log("no match")
        console.log(number)
    }
    console.log(new_number)
        return new_number
};
