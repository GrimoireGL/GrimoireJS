import test from 'ava';
import sinon from 'sinon';
import EEObject from '../../lib-es5/Base/EEObject';

test('emitException should throws exception when the events was not handled', (t) => {
    const anEventEmittor = new EEObject();
    t.throws(() => anEventEmittor.emitException("the-error", {
        handled: false
    }));
    anEventEmittor.on("the-error", (o) => {
        o.handled = false;
    });
    t.throws(() => anEventEmittor.emitException("the-error", {
        handled: false
    }));
    anEventEmittor.on("error", (o) => {
        o.handled = false;
    });
    t.throws(() => anEventEmittor.emitException("the-error", {
        handled: false
    }));
});

test('emitException should not throws exception when the events was handled', (t) => {
    const anEventEmittor = new EEObject();
    anEventEmittor.on("the-error", (o) => {
        o.handled = true;
    });
    t.notThrows(() => anEventEmittor.emitException("the-error", {
        handled: false
    }));
    anEventEmittor.removeAllListeners();
    anEventEmittor.on("error", (o) => {
        o.handled = true;
    });
    t.notThrows(() => anEventEmittor.emitException("the-error", {
        handled: false
    }));
});


test('emitException should call EventEmitter in valid order and should not called after handled',t=>{
  const ee = new EEObject();
  const f1 = sinon.spy();
  const f2 = sinon.spy();
  const g1 = sinon.spy();
  const g2 = sinon.spy();
  const g3 = sinon.spy();
  ee.on("the-error",f1);
  ee.on("the-error",f2);
  ee.on("error",g1);
  ee.on("error",(o)=>{
    o.handled = true;
    g2();
  });
  ee.on("error",g3);
  t.notThrows(()=>ee.emitException("the-error",{handled:false}));
  sinon.assert.callOrder(f2,f1,g3,g2);
  sinon.assert.notCalled(g1);
});
