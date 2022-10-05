const {openBrowser, goto, write, click, closeBrowser, accept} = require('taiko');

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
        await dropDown(below("Sort with:")).select("Time");
        await click("Search");
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();

//user stories 5
//As an Angler, I want to be able to see regular reports 
//in order to reflect upon my fishing memories and trends