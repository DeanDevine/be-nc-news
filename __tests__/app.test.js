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

describe('GET /api/articles/:article_id', () => {
    test('status:200, responds with a JSON object containing specified article which has the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {

        expect(body.article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
            })
        })
    })
    test('status:400, responds with "Invalid Input" when article_id is an invalid type', () => {
        return request(app)
        .get('/api/articles/not_article_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    })
    test('status:404, responds with "Not Found" when article_id is a valid type but does not exist', () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe('GET /api/articles', () => {
    test('status:200, responds with a JSON object containing an array of article objects, each of which contains the following properties: author, title, article_id, topic, created_at, votes, article_img_url', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {

        const { articles } = body;

        expect(articles).toHaveLength(5);

        articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                    })
        })
        })
    })
    test('status:200, each article object has a comment_count property which is the total count of all comments with that article_id', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            
            const { articles } = body;

            articles.forEach((article) => {
                expect(article).toHaveProperty("comment_count", expect.any(String));

            })
        })
    });
    test('status:200, article objects do not have a body property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            
            const { articles } = body;

            console.log(articles)

            articles.forEach((article) => {
                expect(article).not.toHaveProperty("body");

            })
        })
    });
    test('status:200, articles are sorted by their created_at date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            
            const { articles } = body;

            const oldestArticle = {
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                topic: 'mitch',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2'
              }

            expect(articles[0]).toEqual(oldestArticle)

        })
    })
    test('status:404, responds with error message "Not Found" when path does not exist', () => {
        return request(app)
        .get('/api/article')
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
          });
      });
});
