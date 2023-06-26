const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('200: should respond with a JSON object containing an array of topic objects, each of which should contain the "slug" and "description" properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {

        const { topics } = body;

        topics.forEach((topic) => {
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            })
        })
        })
    })
    test('400: should respond with error message "Bad Request" if client makes sort_by request on property that does not exist', () => {
        return request(app)
        .get('/api/topics?sort_by=not_slug')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad Request'})
        })
    })
})
