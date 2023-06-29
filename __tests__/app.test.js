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
    test('status:200, returns an empty array when article_id is valid but does not have any comments', () => {
        return request(app)
        .get('/api/articles/11/comments')
        .expect(200)
        .then(({body}) => {

            const { comments } = body;

            expect(comments).toEqual([])

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

describe('POST /api/articles/:article_id/comments', () => {
    test('status:201, posts comment on article and responds with posted comment', () => {
        
        const newComment = {
            username: "lurker",
            body: "Birds aren't real"
        }
        
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {

            const { comment } = body;

            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: "Birds aren't real",
                article_id: 1,
                author: "lurker",
                votes: 0,
                created_at: expect.any(String)
            })
        })
    })
    test('status:201, posts comment with no extra properties other than username and body', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({ username: "lurker", body: "let me try something", should_not_exist: "something" })
        .expect(201)
        .then(({body}) => {

            const { comment } = body;

            expect(comment).not.toHaveProperty('should_not_exist')
        })
    })
    test('status:400, responds with "Bad Request" when username is not defined', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({ body: "400 when" })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status:400, responds with "Bad Request" when comment body is not defined', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({ username: "lurker" })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status:404, responds with "Not Found" when username does not exist', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({ username: "lovestopost", body: "love it!" })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
    test('status:400, responds with "Invalid Input" when article_id is an invalid type', () => {
        return request(app)
        .post('/api/articles/:not_article_id/comments')
        .send({ username: "lurker", body: "400 when" })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    })
    test('status:404, responds with "Not Found" when article_id is a valid type but does not exist', () => {
        return request(app)
        .post('/api/articles/9999/comments')
        .send({ username: "lurker", body: "404 when" })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('status:201, updates the number of votes on an article and responds with the updated article', () => {
        
        const newVotes = { inc_votes: 1 }

        return request(app)
        .patch('/api/articles/1')
        .send(newVotes)
        .expect(201)
        .then(({ body }) => {
            
            const { article } = body;

            expect(article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 101,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
           
        })
    })
    test('status:201, updates the number of votes on an article when given a number which puts votes into negative numbers', () => {
        
        const newVotes = { inc_votes: -101 }

        return request(app)
        .patch('/api/articles/1')
        .send(newVotes)
        .expect(201)
        .then(({ body }) => {
            
            const { votes } = body.article;

            expect(votes).toBe(-1)
           
        })
    })
    test('status:400, responds with "Bad Request" when inc_votes is not a number', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: "this shouldn't work" })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status:400, responds with "Bad Request" when inc_votes is undefined', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status:400, responds with "Invalid Input" when article_id is an invalid type', () => {
        return request(app)
        .patch('/api/articles/:not_article_id')
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    })
    test('status:404, responds with "Not Found" when article_id is a valid type but does not exist', () => {
        return request(app)
        .patch('/api/articles/9999')
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('status:204, responds with no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({res}) => {
           
            const { statusMessage } = res;
            
            expect(statusMessage).toBe('No Content')

        })
    })
    test('status:400, responds with "Invalid Input" when comment_id is an invalid type', () => {
        return request(app)
        .delete('/api/comments/:not_comment_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    })
    test('status:404, responds with "Not Found" when comment_id is a valid type but does not exist', () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})
