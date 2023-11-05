let mutations = {
  setToken(state, payload) {
    state.user.token = payload.token;
  },
  setUserData(state, payload) {
    state.user.token = payload.token;
    state.user.displayName = payload.displayName;
    state.user.email = payload.email;
  },
  signOut(state) {
    state.user.token = '';
  }
};

export default mutations;