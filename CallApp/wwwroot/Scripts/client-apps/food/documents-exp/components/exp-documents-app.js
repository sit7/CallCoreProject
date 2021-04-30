Vue.component("exp-documents-app", {
	template: "#exp-documents-app",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				DocumentID: null,
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
			dateFrom: (Date.now()-60),
			search: null,

		}
	},

	methods: {

		getExpDocuments: function (date) {
			var vm = this;
			//var date = new Date(Date.now()).toISOString();
			
			$.ajax({
				method: "get",
				data: { date: new Date(date).toISOString() },
				url: "/fooDocument/GetExpDocumentsFromDate",

				success: function (response) {
					vm.documents = response;
				}
			});
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

		addDocument: function () {
			console.log(this);
			
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
		this.dateFrom = newdate.setDate(newdate.getDate() - 60);
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
			//this.$store.dispatch("getContracts", { year: date.toISOString() });
			this.getExpDocuments(date);
		}
	}
});