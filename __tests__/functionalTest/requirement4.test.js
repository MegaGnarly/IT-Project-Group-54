const {openBrowser, goto, write, click, closeBrowser} = require('taiko');

//Requirement 4
//I want to go fishing in a spot/time slot/weather condition/aiming for species/etc., will I success or not?
//user stories 4
//As an Angler, I want to see behaviour/habitat pattern of certain fish 
//in order to analyse fish patterns for future success
(async ()=>{
    try{
        await openBrowser();
        await goto("localhost:8080");
        await click("User");
        await click("username");
        await write("user");
        await click("password");
        await write("password");
        await click("Login");
        await click("sugestion");
        await click("Search species:");
        await write("shark");
        await click("Search");
        await click("Let's Go!");
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();