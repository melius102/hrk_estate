const clog = console.log;

const tmpMiddleware = store => next => action => {

    clog('store.getState()', store.getState());
    clog('action', action);

    const result = next(action);
    clog('store.getState()', store.getState());

    return result;
}

export default tmpMiddleware;