Vue.component("exp-document-view", {
	template: "#exp-document-view",
	mixins: [crossdMixins],
    data: function () {
        return {
        	document: {
        		DocumentID: -1,
        		DocumentTypeID: 1,
        		Type: "",
        		DocDate: new Date(Date.now()).toISOString(),
        		RegNumber: 1,
        		RegistrationDate: new Date(Date.now()).toISOString(),
        		Number: 1,
        		Description: null,
        		/*ObjectID:null,*/
        		ContragentID: null,
        		ContragentName: null,
        		DocumentStatusID: 1,
        		ContractID: null,
        		RecordStatusID: 1,
        		ObjectPersonID: null,
        		SendingID: null,
        		Status: "Не утверждена",
        		expDocDetails: null,
        		details: null,
        		RecordStatusID: 1
        	},
        	showEditDocumentDialog: false,
        };
    },

    computed: {
	
    },

    methods: {
      
    	editDocument: function () {
    		var vm = this;
    		vm.document.DocDate = vm.parseDate(vm.document.DocDate);
    		vm.document.RegistrationDate = vm.parseDate(vm.document.RegistrationDate);
    		this.documentFormMode = "edit";
    		this.showEditDocumentDialog = true;
    	},

    	

        loadDocument: function () {
        	var vm = this;
            $.ajax({
            	method: "get",
            	data: { documentId: vm.$route.params.DocumentId },
            	url: "/fooDocument/GetExpDocument2/",
            	success: function (data, status, xhr) {
            		if (data) {
            			vm.document = data;
            		}
            	}
            });
        },

         /*goToDocumentsList: function (event, categoryId) {
            this.$router.go(-1);
        },*/
        

        goToDocumentsList: function () {
            this.$router.replace({ path: "/" });
        },

        onDocumentSaved: function (event) {
            console.log(event);
            var vm = this;
            this.showEditDocumentDialog = false;

                vm.loadDocument();
                vm.$message({
                    showClose: true,
                    type: "success",
                    message: 'Изменения в документе были успешно сохранены'
                });
 
        },
    },

    filters: {
        nodata: function (value, replaceText) {
            if (value) {
                return value;
            } else if (replaceText) {
                return replaceText;
            }
            return "не указано"
        }
    },

   
    created: function () {
    	this.loadDocument();

   }
});