const {openBrowser, goto, write, click, closeBrowser} = require('taiko');

//Requirement 3
//I receive a monthly/yearly report on my fishing career, has my skilled improved or not? Have I excelled 
//among my fellow anglers or not? I can also refresh my memory by looking at the timeline of the highlights.
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
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();