const appController = require("../../controllers/appController")
const fish = require("../../models/fish")

// unit test if the updateFish function works fine
describe("unit test on updateFish function", ()=>{
    const req = {
        params:{id:'user'},
        body:{
            name:'user'
        },
        isAuthenticated: jest.fn().mockReturnValue('True')
    };
    const res = {
        redirect: jest.fn()
    }

    beforeAll(()=>{
        res.redirect.mockClear();

        fish.updateOne = jest.fn().mockReturnValue('True')

        appController.updateFish(req,res);
    })

    test("test case 1", ()=>{
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith('/viewFish')
    })
})