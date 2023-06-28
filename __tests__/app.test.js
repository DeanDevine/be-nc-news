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
        .get('/api/articles/:not_article_id')
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
    test('status:200, responds with a JSON object containing an array of article objects, each of which contain the following properties: author, title, article_id, topic, created_at, votes, article_img_url and do not contain a body property. Objects also contain a comment_count property which is the total count of all comments with that article_id', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {

        const { articles } = body;

        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
                expect(article).not.toHaveProperty("body")
        })
        })
    })
    test('status:200, articles are sorted by their created_at date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            
            const { articles } = body;

            expect(articles).toHaveLength(13);

            expect(articles).toBeSorted('created_at', { descending: true })

        })
    })
});

describe('GET /api/articles/:article_id/comments', () => {
    test('status:200, responds with a JSON object containing an array of comment objects for the given article_id of which each object has the following properties: comment_id, votes, created_at, author, body, article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {

            const { comments } = body;

            expect(comments).toHaveLength(11);

            comments.forEach((comment) => {
                expect(comment).toMatchObject({

                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)

                })
            })

        })
    })
    test('status:200, comments are sorted by their created_at date in ascending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {

            const { comments } = body;

            expect(comments).toHaveLength(11)

            expect(comments).toBeSorted('created_at', { ascending: true })

        })
    })
    test('status:200, returns an array containing an article object which contains no comments when article_id is valid but does not have any comments', () => {
        return request(app)
        .get('/api/articles/11/comments')
        .expect(200)
        .then(({body}) => {

            const article = [{"article_id": 11, 
            "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700", 
            "author": "icellusedkars", "body": "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?", 
            "created_at": "2020-01-15T22:21:00.000Z", 
            "title": "Am I a cat?", 
            "topic": "mitch", 
            "votes": 0}]

            const { comments } = body;

            expect(comments).toEqual(article)

        })

    })
    test('status:400, responds with "Invalid Input" when article_id is an invalid type', () => {
        return request(app)
        .get('/api/articles/:not_article_id/comments')
        .expect(400)
        .then(({body}) => {

            expect(body.msg).toBe('Invalid Input')

        })
    })
    test('status:404, responds with "Not Found" when article_id is a valid type but does not exist', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body}) => {

            expect(body.msg).toBe('Not Found')

        })
    })
});
