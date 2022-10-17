const {openBrowser, goto, write, click, closeBrowser} = require('taiko');

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
        await click("Your Fish");
        await dropDown(below("Filter by:")).select("Species");
        await click("Filter by");
        await write("jelly fish");
        await click("Search");
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();

// testing if the search function still works when the searching target not exist