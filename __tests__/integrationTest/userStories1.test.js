const request = require('supertest');
const app = require("../../app");


//User stories 1
//As an Angler I want to be able to accurately document details of my catch in order to share these details with my friends
describe("integration test of user stories 1", ()=>{
    test("case1: rendering the details of an existing fish", ()=>{
        return request(app).get('/fishDetails/631141f6f2b83d25661fe8af').then((response) => {
            expect(response.type).toBe('text/html');
            expect(response.text).toContain('<h5>Angler: user</h5>');
            expect(response.text).toContain('<p>Period: morning</p>');
            expect(response.text).toContain('<p>Species: bream</p>');
            expect(response.text).toContain('<p>Size: 1cm</p>');
            expect(response.text).toContain('<p>Weight: 2g</p>');
            expect(response.text).toContain('<p>Weather: windy</p>');
            expect(response.text).toContain('<p>Location: </p>');
            expect(response.text).toContain('<p>Mates: Victor</p>');
        })
    })
})