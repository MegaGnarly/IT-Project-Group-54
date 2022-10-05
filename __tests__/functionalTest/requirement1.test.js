const {openBrowser, goto, write, click, closeBrowser} = require('taiko');

//Requirement 1
//I displayed the details of my past catch during the bragging and 
//other anglers are convinced of my skills and learn something from the catch.
(async ()=>{
    try{
        await openBrowser();
        await goto("localhost:8080");
        await click("User");
        await click("username");
        await write("user");
        await click("password");
        await write("password");
        await click("Sign in");
        await click("fish");
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();