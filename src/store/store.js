import Vue from "vue";
import Vuex from "vuex";
import { app } from "../api/firebase";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import router from "../router/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    status: null,
    error: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    removeUser(state) {
      state.user = null;
    },
    setStatus(state, payload) {
      state.status = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    signUpAction({ commit }, payload) {
      commit("setStatus", "loading");
      createUserWithEmailAndPassword(
        getAuth(app),
        payload.email,
        payload.password
      )
        .then((response) => {
          commit("setUser", response.user.uid);
          commit("setStatus", "success");
          commit("setError", null);
          router.replace("/login");
          console.log(
            `USER ${response.user.email} HAS BEEN SUCCESSFULLY CREATED!`
          );
        })
        .catch((error) => {
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    signInAction({ commit }, payload) {
      signInWithEmailAndPassword(getAuth(app), payload.email, payload.password)
        .then((response) => {
          commit("setUser", response.user.uid);
          commit("setStatus", "success");
          commit("setError", null);
          console.log(
            `USER ${response.user.email} HAS BEEN SUCCESFULLY LOGGED IN!`
          );
          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: response.user.uid,
              jwt: response.user.accessToken,
            })
          );
          router.push("/");
        })
        .catch((error) => {
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },

    signOutAction({ commit }) {
      signOut(getAuth(app))
        .then(() => {
          commit("setUser", null);
          commit("setStatus", "success");
          commit("setError", null);
          localStorage.clear("user");
          console.log("logged out");
          router.push("/login");
        })
        .catch((error) => {
          commit("setStatus", "failure");
          commit("setError", error.message);
        });
    },
  },

  getters: {
    user(state) {
      return state.user;
    },

    status(state) {
      return state.status;
    },

    error(state) {
      return state.error;
    },
  },

  modules: {},
});
