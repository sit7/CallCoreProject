Vue.component("inc-document-form", {
	template: "#inc-document-form",
	mixins:[crossdMixins],
	data: function () {
		return {
			documentModel: null,
			contragents: [],
			contracts: [],
			statuses:[],
			foods: [],
			objectPersons: []
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
				DocumentTypeID: 1,
				Type: "Товарная накладная",
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
				incDocDetails: null,
				details: null,
				RecordStatusID:1
			};
		},

		getContracts: function() {
			if (this.documentModel.ContragentID != null) {
				$.ajax({
					method: "post",
					url: "/fooContract/GetContractsByContragent2",
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify({ year: 2020, counteragentId: this.documentModel.ContragentID }),
					success: function (responce) {
						this.contracts = responce
					}
				})
			}
		},




		handleDetailChanged: function (data) {
			console.log(data);
			this.documentModel.fooIncDocDetail = data;
			var vm = this;


			var result = 0;
			vm.documentModel.fooIncDocDetail.forEach(function (item) {
				return result += item.Summa;
			});
			vm.documentModel.Summa = result;
		},
        
		saveDocument: function () {

			var validForms = []
			var vm = this;

			var document = this.documentModel;
			this.$refs.IncDocumentForm.validate(function (valid, data) {

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

		contractValidator: function (rule, value, callback) {

			var vm = this;
			if (vm.contracts) {
				var contractIndex = vm.contracts.findIndex(function (item1, index) {
					return item1.ContractID === vm.documentModel.ContractID;
				});

				var result = 0;
				vm.foods = vm.contracts[contractIndex].foods;
				if (vm.contracts[contractIndex].foods) {
					if(vm.documentModel.incDocDetails)
					{
					vm.documentModel.incDocDetails.forEach(function (item) {
						var productIndex = vm.contracts[contractIndex].foods.findIndex(function (item1, index) {
							return item1.FoodID === item.FoodID;
						}) >= 0 ? 0 : -1;
						result += productIndex;

					});
					}
				}
				if (result < 0)
				{
					callback(new Error("В документе есть продукты, которых нет в спецификации!"));
				}
				else {
					callback();
				}
			}

		}

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

		"documentModel.ContragentID": function (value) {
			//var newdate = new Date(this.documentModel.RegistrationDate);
			var vm = this;
    		
			if (this.documentModel.ContragentID != null) {
				$.ajax({
					//method: "post",
					url: "/fooContract/GetContractsByContragent2",
					contentType: "application/json; charset=utf-8",
					data: {
						year: 2020,
						counteragentId: this.documentModel.ContragentID
					},
					//data: JSON.stringify({ year: 2020, counteragentId: this.documentModel.ContragentID }),
					success: function (responce) {
						vm.contracts = responce
						if (vm.documentModel.ContractID != null)
						{
							var contractIndex = vm.contracts.findIndex(function (item1, index) {
								return item1.ContractID === vm.documentModel.ContractID;
							});

							if (vm.contracts[contractIndex])
								vm.foods = vm.contracts[contractIndex].foods;
						}

					}
				})
			}
		},
		
		"documentModel.DocumentStatusID": function (value) {
			var vm = this;
			if ((vm.statuses.lenght > 0)) {
				vm.documentModel.Status = vm.statuses.find(function (item) {
					return item.StatusID === vm.documentModel.DocumentStatusID;
				}).Name;
			}
		},

		"documentModel.ContractID": function (value) {
			var vm = this;
			if (vm.contracts) {
				var contractIndex = vm.contracts.findIndex(function (item1, index) {
					return item1.ContractID === vm.documentModel.ContractID;
				});

				if (vm.contracts[contractIndex])
				vm.foods = vm.contracts[contractIndex].foods;
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
    	})

    	

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
        console.log(vm.documentModel);
        $.ajax({
            method: "get",
            url: "/glbContragent/GetContragents",
            success: function (responce) {
                vm.contragents = responce
            }
        })
        if (this.documentModel.ContragentID != null) {
        	$.ajax({
        		method: "post",
        		url: "/fooContract/GetContractsByContragent2",
        		contentType: "application/json; charset=utf-8",
        		data: JSON.stringify({ year: 2020, counteragentId: this.documentModel.ContragentID }),
        		success: function (responce) {
        			vm.contracts = responce
        		}
        	})
        }
        $.ajax({
        	method: "get",
        	url: "/fooDocument/GetDocumentStatuses",
        	success: function (responce) {
        		vm.statuses = responce
        	}
        })
     
    },
});