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
        await click("Login");
    }catch(error){
        console.log(error)
    }finally{
        closeBrowser();
    }
})();

//Requirement 3
//I receive a monthly/yearly report on my fishing career, has my skilled improved or not? Have I excelled 
//among my fellow anglers or not? I can also refresh my memory by looking at the timeline of the highlights.

//user stories 6
//As an Angler, I want to be able to compete/compare my catches with others 
//in order to receive the sense of achievement

//user stories 8
//As an Angler/User, I want to be able to scroll through other people’s catches
//in order to get a better sense of community, more interaction