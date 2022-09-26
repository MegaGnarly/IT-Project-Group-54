const appController = require("../../controllers/appController")
const fish = require("../../models/fish")

// testing user stories No.2 
//As an Angler, I want to have catches be connected to user profiles
// in order to allow for better archiving and to make it more social 
// unit test when the user is not logged in, viewFish function would noe excute
describe("unit test on viewFish function", ()=>{
    const user = true;
    const req = {
        isAuthenticated: jest.fn().mockReturnValue(false)
    };
    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    }

    beforeAll(()=>{
        res.render.mockClear();
        res.redirect.mockClear();

        fish.find = jest.fn().mockResolvedValue([{}])

        appController.viewFish(req,res);
    })

    test("test case 1", ()=>{
        expect(res.render).toHaveBeenCalledTimes(0);
    })
})