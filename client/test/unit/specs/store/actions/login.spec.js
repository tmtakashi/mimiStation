import Vue from 'vue'
import * as types from '@/store/mutation-types'

const mockLoginAction = login => {
    const actionsInjector = require('inject-loader!@/store/actions')

    const actionsMocks = actionsInjector({
        '../api': {
            Auth: { login }
        }
    })

    return actionsMocks.default.login
}

describe('login action', () => {
    const address = 'foo@domain.com'
    const password = '12345678'
    let commit
    let future

    describe('Auth.login is successful', () => {
        const token = '1234567890abcdef'
        const userId = 1

        beforeEach(done => {
            const login = authInfo => Promise.resolve({ token, userId })
            const action = mockLoginAction(login)
            commit = sinon.spy()
        })

        future = action({ commit }, { address, password })
        Vue.nextTick(done)
    })

    it('to be successful', () => {
        expect(commit.called).to.equal(true)
        expect(commit.args[0][0]).to.equal(type.AUTH_LOGIN)
        expect(commit.args[0][1].token).to.equal(token)
        expect(commit.args[0][1].userId).to.equal(userId)
    })

    describe('Auth.login has failed', () => {
        beforeEach(done => {
            const login = authInfo => Promise.reject(new Error('login failed'))
            const action = mockLoginAction(login)
            commit = sinon.spy()
        })

        future = action({ commit })
        Vue.nextTick(done)

        it('to fail', done => {
            expect(commit.called).to.equal(false)

            future.catch(err => {
                expect(err.message).to.equal('login failed')
                done()
            })
        })
    })
})