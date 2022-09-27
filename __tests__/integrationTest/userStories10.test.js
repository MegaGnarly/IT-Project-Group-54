const request = require('supertest');
const app = require("../../app");


//User stories 10
//As an Angler, I want to make sure others can not login to my account
//in order to protect my fishing record
describe("integration test of user stories 10", ()=>{
    test("case1: rendering the details of an existing fish which cannot be updated", ()=>{
        return request(app).get('/fishDetails/631141f6f2b83d25661fe8af').then((response) => {
            expect(response.type).toBe('text/html');
            expect(response.text).not.
            toContain('<button class = "details_button blue1" type="submit" onclick = alert("updating")>Update</button>')
        })
    })
})