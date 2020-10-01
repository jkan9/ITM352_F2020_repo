age_count = 1; //start the age count
age = 54;
while(age_count < age){ 
    if( age_count >= age/2 ) {
        console.log("Don't ask how old I Am!");
        process.exit();
    } else {
        console.log(`age ${age_count}`);
    }

age_count++;
}
console.log(`Jonathan is` + age_count +  `year old`)