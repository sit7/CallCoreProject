Vue.component("exp-document-form", {
	template: "#exp-document-form",
	mixins:[crossdMixins],
	data: function () {
		return {
			documentModel: null,
			types: [],
			statuses:[],
			objectPersons: [],
			remains: []
		};
	},

	props: {
		document: Object,
        
	},

	computed: {
	},

	methods: {

		generateNewModel: function () {
			return {
				DocumentID: -1,
				DocumentTypeID: 3,
				Type: "Списание по меню",
				DocDate: new Date(Date.now()).toISOString(),
				RegNumber:1,
				RegistrationDate: new Date(Date.now()).toISOString(),
				Number: 1,
				Description: null,
				/*ObjectID:null,*/
				ContragentID: null,
				ContragentName: null,
				DocumentStatusID: 1,
				ContractID: null,
				RecordStatusID:1,
				ObjectPersonID:null,
				SendingID: null,
				Status:"Не утверждена",
				expDocDetails: null,
				details: null,
				RecordStatusID:1
			};
		},

		getRemains: function (query) {
    		var vm = this;
    		
    			$.ajax({
    				method: "get",
    				url: "/fooExpDocDetail/GetRemainByDocumentID/",
    				data: { documentID: vm.document.DocumentID },
    				success: function (response) {
    					vm.remains = response;
    				}
    			});
    		
        },
		
		getTypes: function() {
				$.ajax({
					method: "post",
					url: "/fooDocument/GetExpTypes",
					contentType: "application/json; charset=utf-8",
					success: function (responce) {
						this.types = responce
					}
				})

		},




		handleDetailChanged: function (data) {
			console.log(data);
			this.documentModel.fooExpDocDetail = data;
			var vm = this;


			var result = 0;
			vm.documentModel.fooExpDocDetail.forEach(function (item) {
				return result += item.Summa;
			});
			vm.documentModel.Summa = result;
		},
        
		saveDocument: function () {

			var validForms = []
			var vm = this;

			var document = this.documentModel;
			this.$refs.ExpDocumentForm.validate(function (valid, data) {

				if (valid) {
					if (document.DocumentID < 0) {
						$.ajax({
							url: "/fooDocument/AddDocument/",
							dataType: "json",
							contentType: "application/json; charset=utf-8",
							method: "post",
							data: JSON.stringify({ document: document/*, foodsModified: vm.productsModified*/ }),
							success: function (response) {
								console.log(response);
								if (response.success) {
									vm.$emit("close", { type: "edit", data: response.data });
									// vm.$refs.form.resetFields();
									vm.$message({
										showClose: true,
										message: "Сведения о документе добавлены",
										type: 'success'
									});
								} else {
									vm.$alert(data, 'Ошибка', {
										type: "error",
										confirmButtonText: 'OK',
									});
								}
								document.DocumentID = response.data[0].DocumentID;
								var event = {
									document: document,
									newDocumentID: response,
									mode: vm.mode
								};
								vm.$emit("form-saved", event);
							}
						});
					}


					else {
						console.log(document);
						$.ajax({
							url: "/fooDocument/SaveDocument/",
							dataType: "json",
							contentType: "application/json; charset=utf-8",
							method: "post",
							data: JSON.stringify({ document: document/*, foodsModified: vm.productsModified*/ }),
							success: function (response) {
								if (response.success) {
									//vm.$emit("close", { type: "edit", data: response.data });
									// vm.$refs.form.resetFields();
									vm.$message({
										showClose: true,
										message: "Сведения о документе сохранены",
										type: 'success'
									});
								} else {
									vm.$alert(response.data, 'Ошибка', {
										type: "error",
										confirmButtonText: 'OK',
									});
								}
								console.log(response);
								var event = {
									document: document,
									newDocumentID: response.data,
									mode: vm.mode
								};

								vm.$emit("form-saved", event);
							}

						});
					}
				}
			});

		},

	},

	watch: {

		"documentModel.DocDate": function (value) {
			var vm = this;
			this.documentModel.DocDate = moment(value).toISOString();

			if (vm.document.ObjectPersonID == null & vm.objectPersons) {
				vm.documentModel.ObjectPersonID = vm.objectPersons.find(function (item) {
					return item.IsMain === 1;
				}).ObjectPersonID;
			}
		},
		
		"document.DocumentID": function (value) {
			var vm = this;
			if (vm.document.DocumentID < 0) {
				vm.documentModel = vm.generateNewModel();
			} else {
				vm.documentModel = vm.cloneData(vm.document);
			}
			if (vm.document.ObjectPersonID == null)
			{
				vm.documentModel.ObjectPersonID = vm.objectPersons.find(function (item) {
					return item.IsMain === 1;
				}).ObjectPersonID;
			}

		},

		"documentModel.RegistrationDate": function (value) {
			this.documentModel.RegistrationDate = moment(value).toISOString();
		},

		
		"documentModel.DocumentStatusID": function (value) {
			var vm = this;
			if ((vm.statuses.lenght > 0)) {
				vm.documentModel.Status = vm.statuses.find(function (item) {
					return item.StatusID === vm.documentModel.DocumentStatusID;
				}).Name;
			}
		},

		"documentModel.DocumentTypeID": function (value) {
			var vm = this;
			if ((vm.types.lenght > 0)) {
				vm.documentModel.DocumentTypeID = vm.types.find(function (item) {
					return item.DocumentTypeID === vm.documentModel.DocumentTypeID;
				}).Name;
			}
		},
	},

    created: function () {
    	var vm = this;

    	$.ajax({
    		method: "get",
    		url: "/fooDocument/GetDocumentStatuses",
    		success: function (responce) {
    			vm.statuses = responce
    		}
    	});

    	vm.getTypes();
    	vm.getRemains();

    	if (!vm.document.DocumentID < 0) {
    		vm.documentModel = vm.generateNewModel();
    	} else {
    		vm.documentModel = vm.cloneData(vm.document);
    	}
    	$.ajax({
    		method: "get",
    		url: "/fooResponsiblePersons/GetResponsibleByDate",
    		data: { date: vm.parseDate(vm.documentModel.DocDate) },
    		success: function (responce) {
    			vm.objectPersons = responce
    			if (vm.document.ObjectPersonID == null) {
    				vm.documentModel.ObjectPersonID = vm.objectPersons.find(function (item) {
    					return item.IsMain === 1;
    				}).ObjectPersonID;
    			}
    		}
    	})

  
     
    },
});