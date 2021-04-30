Vue.component("inc-document-view", {
	template: "#inc-document-view",
	mixins: [crossdMixins],
    data: function () {
        return {
        	document: {
        		DocumentID: -1,
        		DocumentTypeID: 1,
        		Type: "Товарная накладная",
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
        		incDocDetails: null,
        		details: null,
        		RecordStatusID: 1
        	},
        	showEditDocumentDialog: false,
        };
    },

    computed: {
	contragentLink: function () {
    		//window.location.assign("/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
    		//window.open(location.host + "/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
    		return "/fooContract/ContractsNew/counteragent-"+ this.document.ContragentID;
	},
	contractLink: function () {
		//window.location.assign("/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
		//window.open(location.host + "/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
		return "/fooContract/ContractsNew/contract-" + this.document.ContractID;
	},

	isContract: function () {
		//window.location.assign("/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
		//window.open(location.host + "/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
		return this.document.ContractID === null ? 0 : 1;
	},
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
            	url: "/fooDocument/GetIncDocument2/",
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