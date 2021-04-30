var store = new Vuex.Store({
	state: {
		_typeListLoaded: false,
		_statusListLoaded: false,
		_requestTypeList: [],
		_requestStatusList: []
	},
	mutations: {
		setRequestTypeList: function (state, data) {
			state._requestTypeList = data;
			state._typeListLoaded = true;
		},
		setRequestStatusList: function (state, data) {
			state._requestStatusList = data;
			state._statusListLoaded = true;
		}
	},
	actions: {
		loadRequestType: function (context, params) {
			var f = async function () {
				let result;
				try {
					result = await $.ajax({
						url: "/Repair/GetRequestStatusList",
						type: 'GET'
					})
					return result;
				}
				catch (error) {
					console.log(error);
				}

			};
			f().then(r => {
				context.commit("setRequestTypeList", r);
			});
			
			//context.commit("setRequestTypeList", this.loadAjaxAsync("/Repair/GetRequestTypeList"));
			//$.ajax({
			//	method: "get",
			//	url: "/Repair/GetRequestTypeList",
			//	dataType: "json",
			//	success: function (response, status, xhr) {
			//		context.commit("setRequestTypeList", context.state, response)
			//		console.log('get request type list');

			//	},
			//	error: function (xhr, status, error) {
			//		console.log('error');
			//	}
			//});

		},
		loadRequestStatus: function (context, params) {
			var f = async function() {
				let result;
				try {
					result = await $.ajax({
						url: "/Repair/GetRequestStatusList",
						type: 'GET'
					})
					return result;
				}
				catch (error) {
					console.log(error);
				}
				f().then(r => {
					context.commit("setRequestStatusList", r);
				});

			}

			//context.commit("setRequestStatusList", f());
			//$.ajax({
			//	method: "get",
			//	url: "/Repair/GetRequestStatusList",
			//	dataType: "json",
			//	success: function (response, status, xhr) {
			//		context.commit("setRequestStatusList", context.state, response);
			//		console.log('get request status list');

			//	},
			//	error: function (xhr, status, error) {
			//		console.log(error);
			//	}
			//});
		},

		
	},
	getters: {
		requestTypeLoaded: function (state, getters) {
			return state._typeListLoaded;
		},
		requestStatusLoaded: function (state, getters) {
			return state._typeListLoaded;
		},
		requestTypeList: function (state, getters) {
			return state._requestTypeList;
		},
		requestStatusList: function (state, getters) {
			return state._requestStatusList;
		},
		get: function (state, getters) {
			return name => {
				if (name === "RequestTypeID") return getters.requestTypeList;
				else if (name === "RequestStatusID") return getters.requestStatusList;
			}
		}
	},
});