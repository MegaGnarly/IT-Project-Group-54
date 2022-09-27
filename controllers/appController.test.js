const sessionStorage = require('sessionstorage');
var fish = require('../models/fish');
var User = require('../models/user');

let thing = 2;

const appController = require('../controllers/appController')

describe("Interacting with database", () => {

    describe("Testing viewFish", () => {
        test("should redirect to login if not authenticated", async () => {
            const mockReq = mockRequest({isAuthenticated: false});
            const mockRes = mockResponse({});
            expect(await appController.viewFish(mockRequest, mockResponse).mockReturnValueOnce(res.redirect('/login')))
        })
    })
})