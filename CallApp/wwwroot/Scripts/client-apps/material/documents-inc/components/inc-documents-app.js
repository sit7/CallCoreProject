Vue.component("inc-documents-app", {
	template: "#inc-documents-app",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				DocumentID: null,
				DocumentTypeID: null,
				Name: null,
				Description: null,
				DocDate: null,
				Type: null,
				Number: null,
				RegNumber: null,
				Status: null,
				Summa: null,
			},
			documents: [],
			document: {},
			dateFrom: null/*(Date.now()-120)*/,
			search: null,
			showAddDocumentDialog: false,

		}
	},

	methods: {

		getIncDocuments: function (date) {
			var vm = this;
			//var date = new Date(Date.now()).toISOString();
			
			$.ajax({
				method: "get",
				data: { date: new Date(date).toISOString() },
				url: "/fooDocument/GetIncDocumentsFromDate",

				success: function (response) {
					vm.documents = response;
				}
			});
		},

		addDocument: function () {
			var vm = this;
			console.log("dialog");
			vm.document = {
				DocumentID: -vm.generateUid(),
				DocumentTypeID: 1,
				Type: "Товарная накладная",
				DocDate: new Date(Date.now()).toISOString(),
				RegNumber: 1,
				RegistrationDate: new Date(Date.now()).toISOString(),
				Number: 1,
				Description: null,
				ContragentID: null,
				ContragentName: null,
				DocumentStatusID: 1,
				ContractID: null,
				RecordStatusID: 1,
				ObjectPersonID: null,
				SendingID: null,
				Status: "Не утвержден",
				Summa:0,
				details:null,
			};
			console.log(vm.document);
			this.showAddDocumentDialog = true;
		},

		deleteDocument: function (document) {

			var vm = this;
			this.$confirm("Вы действительно хотите удалить этот документ?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/fooDocument/DeleteDocument/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
					data: JSON.stringify({ id: document.DocumentID }),
					success: function (response) {
						if (response === true) {
							vm.documents = vm.documents.filter(function (item) {
								return item.DocumentID !== document.DocumentID;
							});
							vm.$message({
								type: 'danger',
								message: 'Данные удалены'
							});
						}
					}
				});

			});

		},

		onDocumentSaved: function (event) {
			var vm = this;
			//vm.loadDocument();
			vm.$message({
				showClose: true,
				message: "Документ  успешно добавлен",
				type: 'success'
			});
			vm.documents.splice(0,0,event.document);
			this.showAddDocumentDialog = false;
		},

	handleCommand: function (command) {
            
            console.log(command);
            console.log(this);
            this.$emit(command.name, this.contract);
            
        },

        commandName: function (params) {
            console.log(params);
        }
	},
	created: function () {
		
		var newdate = new Date(Date.now());//от этой даты сейчас отсчитаем 60 дней назад
		this.dateFrom = newdate.setDate(newdate.getDate() - 120);
	},
	computed: {
		documentsList: function () {
			var vm = this;
				
			var result = vm.cloneData(vm.documents);
			
			if (vm.search !== null) {
                
				result = result.filter(function (item) {
                    
					var Description = item.Description !== null
                        ? item.Description.toLowerCase()
                        : "";
					return Description.indexOf(vm.search, 0) > -1;
				});

			}
			vm.loading = false;
			return result;
		},
	},
	watch: {
		dateFrom: function (value) {
			var date = new Date(value);
			this.getIncDocuments(date);
		}
	}
});