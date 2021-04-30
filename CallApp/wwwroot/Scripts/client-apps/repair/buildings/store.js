var store = new Vuex.Store(
	{
		state: {
			_searchString: "",
			_buildings: [],
            _objectName: String,
            _objects: [],
            _statusId: Number,
            findindex: function (array, key) {
                return array.findIndex(function (item) { return item.BuildingID === key; });
            }
		},

        getters: {
            buildings: function (state, getters) {
                return state._buildings;
            },
		
            StatusID: function (state, getters) {
                return state._statusId;
            },

            Header: function (state, getters) {
                return state._objectName;
            },
            Objects: function (state, getters) {
                return state._objects;
            }
		},
        actions: {
            getobjectlist: function (context, params) {
                $.ajax({
                    url: '/repBuilding/GetObjectBuildingGroups',
                    method: 'get',
                    success: function (response) {
                        console.log('get');
                        context.commit('m_setGroups', response);
                    }
                });
            },
            init: function (context, params) {
                $.ajax({
                    url: "/repBuilding/GetBuildingsByObject",
                    method: "post",
                    data: { key: params },
                    success: function (response) {
                        context.commit('m_setHeader', response.Header);
                        context.commit('m_setStatus', response.StatusID);
                        context.commit('m_setDetails', response.Details);
                    }
                });
               
            },
            deleteBuilding: function (context, params) {
                context.commit('m_deleteBuilding', params);
            },
            updateBuilding: function (context, params) {
                context.commit('m_updateBuilding', params);
            },
            verifyBuilding: function (context, params) {
                context.commit('m_verifyBuilding', params);
            },
            undoverifyBuilding: function (context, params) {
                context.commit('m_undoVerify', params);
            }
		
		},
        mutations: {
            // ОНИ
            m_setDetails: function (state, data) {
                state._buildings = data;
            },
            // UltraShortName
            m_setHeader: function (state, data) {
                state._objectName = data;
            },
            // ReadyStatus
            m_setStatus: function (state, data) {
                state._statusId = data;
            },
            m_setGroups: function (state, data) {
                state._objects = data;
            },
            
            m_deleteBuilding: function (state, data) {
                var index = state.findindex(state._buildings, data);
                if (index !== -1) state._buildings.splice(index, 1);
            },
            m_updateBuilding: function (state, data) {
                var index = state.findindex(state._buildings, data.data.BuildingID);
                if (index !== -1) state._buildings[index] = data.data;

                else state._buildings.push(data.data);
                data.method();
            },
            m_verifyBuilding: function (state, data) {
                var index = state.findindex(state._buildings, data);
                if (index !== -1) state._buildings[index].IsVerified = true;
            },

            m_undoVerify: function (state, data) {
                var index = state.findindex(state._buildings, data);
                if (index !== -1) state._buildings[index].IsVerified = false;
            }
		}
	}
);