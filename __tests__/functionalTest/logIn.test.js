const {openBrowser, goto, write, click, closeBrowser} = require('taiko');

(async ()=>{
    try{
        await openBrowser();
        await goto("localhost:8080");
        await click("User");
        await click("username");
        await write("user");
        await click("password");
        await write("wrongPassword");
        await click("Sign in");
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();