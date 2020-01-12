import { mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm.vue'

describe('LoginForm', () => {
  describe('onlogin', () => {
    let loginForm
    let onloginStub
    beforeEach(done => {
      onloginStub = sinon.stub()
      loginForm = mount(LoginForm, {
        propsData: { onlogin: onloginStub }
      })
      loginForm.setData({
        email: 'foo@domain.com',
        password: '12345678'
      })
      loginForm.vm.$nextTick(done)
    })

    describe('resolve', () => {
      it('being resolved', done => {
        onloginStub.resolves()

        loginForm.find('button').trigger('click')
        expect(onloginStub.called).to.equal(false) // not being resolved yet
        expect(loginForm.vm.error).to.equal('') // initialize error message
        expect(loginForm.vm.disableLoginAction).to.equal(true) //login action is disabled

        loginForm.vm.$nextTick(() => {
          expect(onloginStub.called).to.equal(true)
          const authInfo = onloginStub.args[0][0]
          expect(authInfo.email).to.equal(loginForm.vm.email)
          expect(authInfo.password).to.equal(loginForm.vm.password)
          loginForm.vm.$nextTick(() => {
            expect(loginForm.vm.error).to.equal('') // login message is still empty
            expect(loginForm.vm.disableLoginAction).to.equal(false)

            done()
          })
        })
      })
    })

    describe('reject', () => {
      it('being rejected', done => {
        onloginStub.rejects(new Error('login error!'))

        loginForm.find('button').trigger('click')
        expect(onloginStub.called).to.equal(false) // not being rejected yet
        expect(loginForm.vm.error).to.equal('')
        expect(loginForm.vm.disableLoginAction).to.equal(true)

        loginForm.vm.$nextTick(() => {
          expect(onloginStub.called).to.equal(true)
          const authInfo = onloginStub.args[0][0]
          expect(authInfo.email).to.equal(loginForm.vm.email)
          expect(authInfo.password).to.equal(loginForm.vm.password)
          loginForm.vm.$nextTick(() => {
            expect(loginForm.vm.error).to.equal('login error!')
            expect(loginForm.vm.disableLoginAction).to.equal(false)

            done()
          })
        })
      })
    })
  })
})