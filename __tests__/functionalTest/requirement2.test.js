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
        await click("Details");
        await click("Copy");
        confirm('share it to Facebook?', async () => await accept())
        await click('Share');
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();

//Requirement 2
//I share my catch of the day/month/year to a fellow angler by sending the link or showing him/her in person

//user stories 7
//As a Friend of an angler, I want to be able to receive links to a catch
//in order to remotely see what was caught