var store = new Vuex.Store({
    state: {
        documentId: null,
        documentType: null,
        isApproved: null
    },

    getters: {

        documentId: function (state) {
            return state.documentId;
        },

        isWriteOffByRemainDocument: function (state) {
            var docTypes = [3, 7, 9, 10];
            return docTypes.some(function (type) {
                return type === state.documentType;
            }) || !state.isApproved;
        },

        isApproved: function (state) {
            return state.isApproved;
        },

        isEditableDocument: function (state) {
            var docTypes = [3, 7, 9, 10];
            return !docTypes.some(function (type) {

                return type === state.documentType;
            });
        }

    },

    actions: {

        setDocumentId: function (context, id) {
            context.commit("modifyDocumentId", id);
        },

        setDocumentType: function (context, id) {
            context.commit("modifyDocumentType", id);
        },

        setApprovement: function (context, value) {
            context.commit("modifyIsApproved");
        }
    },

    mutations: {
        modifyDocumentId: function (state, id) {
            state.documentId = id;
        },

        modifyDocumentType: function (state, id) {
            state.documentType = id;
        },

        modifyIsApproved: function (state, value) {
            state.isApproved = value;
        }
    }
});