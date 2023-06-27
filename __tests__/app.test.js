const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('status:200, responds with a JSON object containing an array of topic objects, each of which should contain the "slug" and "description" properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {

        const { topics } = body;

        expect(topics).toHaveLength(3);

        topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
        })
        })
    })
    test('status:404, responds with error message "Not Found" when path does not exist', () => {
        return request(app)
          .get('/api/topic')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Not Found');
          });
      });
})

describe('GET /api', () => {
    test('status:200, responds with a JSON object containing an array of /api endpoint objects, each of which contains a property that describes what the endpoint serves', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {

        const { endpoints } = body;

        const endpointsJSON = require('../endpoints.json')

        expect(Object.keys(endpoints).length).toBeGreaterThanOrEqual(3)

        expect(endpoints).toEqual(endpointsJSON)

        })

    })
})
