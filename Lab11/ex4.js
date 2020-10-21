function isNonNegIntString(string_to_check, returnErrors=false) {
    /* this function will check if string_to_check is a non-neg integer. return true if string_to_check is a non negative */
    errors = []; // assume no errors at first
if(Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

return returnErrors ? errors : (errors.length == 0);

}

attributes  =  "Jon;20;20.5;" + (0.5 - 20);
pieces = attributes.split(";")

function callback  (part, i) {
    console.log(console.log(`${part} is non neg int ${isNonNegIntString(part, true).join("***")}`));
}
pieces.forEach(function (item, i) {
    console.log( (typeof item == 'string' && item.length > 0)?true:false )
}); 
    
    

//console.log(isNonNegInt(`1.00`));