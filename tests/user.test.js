const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

const { use } = require('../src/app')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Anshul',
        email: 'anshulkishore3100@gmail.com',
        password: '11Anshul@'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Anshul',
            email: 'anshulkishore3100@gmail.com'
        },
        token: user.tokens[0].token
    })

    //To assert that password is in encoded form
    expect(user.password).not.toBe('11Anshul@')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'anshul@gmail.com',
        password: '007what!!'
    }).expect(400)
})

test('Should get profile for an authenticated user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for an unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete profile for an authenticated user', async () => {
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for an unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Harry'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Harry')
})

test('Should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'Boston'
    })
    .expect(400)
})