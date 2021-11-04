import { createStore } from "vuex";
// import axios from 'axios'

export default createStore({
	state: {
		user: {},
		location: {},
		locationUsers: [],
		closestLocations: {},
		activeLocation: false,
		userItems: null,
		activeItem: null,
		dbLog: [],
		needRegeneration: false,
		fightStats: null,
		fightLog: [],
		csrf: '',
		modal: null,
		time: 0,
		host: 0,
	},

	mutations: {
		SET_TIME(state, time) {
			state.time = time;
		},

		SET_MODAL(state, modal) {
			state.modal = modal;
		},

		SET_FIGHTSTATS(state, fightStats) {
			state.fightStats = fightStats;
		},

		ADD_FIGHT_LOG(state, fightLog) {
			state.fightLog.push(fightLog);
		},

		CLEAR_FIGHT_LOG(state) {
			state.fightLog = [];
		},

		SET_USER(state, user) {
			Object.assign(state.user, toNums(user));
		},

		UPDATE_USER(state, user) {
			Object.assign(state.user, toNums(user));
		},

		SET_USER_ITEMS(state, items) {
			state.userItems = items;
		},

		SET_USER_LOCATION(state, locationId) {
			state.user.location = locationId;
		},

		SET_LOCATION(state, location) {
			state.location = location;
		},

		SET_LOCATION_USERS(state, locationUsers) {
			state.locationUsers = locationUsers;
		},

		ADD_LOCATION_USER(state, locationUser) {
			state.locationUsers.push(locationUser);
		},

		REMOVE_LOCATION_USER(state, userId) {
			console.log(state.locationUsers.filter(user => { console.log(user.id); return user.id != userId }), userId);
			state.locationUsers = state.locationUsers.filter(user => user.id != userId);
		},

		SET_CLOSEST_LOCATIONS(state, closestLocations) {
			state.closestLocations = closestLocations;
			// state.closestLocations = sortClosestLocationsByType(closestLocations);
		},

		SET_ACTIVE_LOCATION(state, activeLocation) {
			state.activeLocation = activeLocation;
		},

		SET_DB_LOG(state, dbLog) {
			state.dbLog = dbLog;
		},

		SET_CSRF(state, csrf) {
			state.csrf = csrf;
		},

		SET_ACTIVE_ITEM(state, item) {
			state.activeItem = item;
		},

		REMOVE_ITEM(state, itemId) {
			delete (state.userItems[itemId]);
		},

		PUT_ON_ITEM(state, itemId) {
			// console.log(state.userItems[itemId]);
			state.userItems[itemId].loc = 'WEARING';
		},

		TAKE_OFF_ITEM(state, itemId) {
			state.userItems[itemId].loc = 'INVENTORY';
		}
	},

	getters: {
		user(state) {
			return state.user;
		},

		userItems(state) {
			return state.userItems;
		},

		activeItem(state) {
			return state.activeItem;
		},

		csrf(state) {
			return state.csrf;
		},

		location(state) {
			return state.location;
		},

		locationUsers(state) {
			return state.locationUsers;
		},

		closestLocations(state) {
			return state.closestLocations;
		},

		activeLocation(state) {
			return state.activeLocation;
		},

		dbLog(state) {
			return state.dbLog;
		}
	},

	actions: {
		async init({ commit }) {
			await load('/init', (data, commit) => {
			commit('SET_USER', data.user);
			}, commit);
		},

		async changeLocation({ commit }, locationId) {
			await load('/change-location/' + locationId, (data, commit) => {
			commit('SET_USER_LOCATION', locationId);
			}, commit);
		},
	}
});


async function load(url, callback = false, commit) {
	try {
		let data = await fetch(url, {
			headers: { 'Content-Type': 'application/json' }
		});

		data = await data.json();
		if (callback) callback(data, commit);

		commit('SET_LOCATION', data.location);
		commit('SET_CLOSEST_LOCATIONS', data.closestLocations);
		if (data.db) {
			commit('SET_DB_LOG', data.db);
		}

		return data;
	} catch (e) {
		console.log(e);
	}
}
