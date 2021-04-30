Vue.component("requests-app", {
	template: "#requests-app",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				BuildingID: null,
				Description: null,
				Object: null,
				IsUrgent: null,
				Number: null,
				ObjectID: null,
				Building: null,
				Depatment: null,
				RequestStatus: null,
				RequestType: null,
				ReqDate: null,
				RequestID: null,
				RequirementID: null,
				StartDepartmentID: null,
				StatusID: null,
				UserID: null,
			},
			requests: [],
			dateFrom: (Date.now() - 60),
			search: null,

		}
	},

	methods: {

		getRequestsFromDate: function (date) {
			var vm = this;
			//var date = new Date(Date.now()).toISOString();

			$.ajax({
				method: "get",
				data: { date: new Date(date).toISOString() },
				url: "/fooDocument/GetRequestsFromDate",

				success: function (response) {
					vm.requests = response;
				}
			});
		},

		deleteRequest: function (request) {

			var vm = this;
			this.$confirm("Вы действительно хотите удалить эту заявку?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/fooDocument/DeleteRequestt/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
					data: JSON.stringify({ id: requests.RequestID }),
					success: function (response) {
						if (response === true) {
							vm.requests = vm.requests.filter(function (item) {
								return item.RequestID !== document.RequestID;
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

		handleCommand: function (command) {

			console.log(command);
			console.log(this);
			this.$emit(command.name, this.requests);

		},

		commandName: function (params) {
			console.log(params);
		}
	},
	created: function () {

		var newdate = new Date(Date.now());//от этой даты сейчас отсчитаем 60 дней назад
		this.dateFrom = newdate.setDate(newdate.getDate() - 365);
	},
	computed: {
		requestsList: function () {
			var vm = this;

			var result = vm.cloneData(vm.requests);

			if (vm.search !== null) {

				result = result.filter(function (item) {

					var Name = item.Name !== null
                        ? item.Name.toLowerCase()
                        : "";
					return Name.indexOf(vm.search, 0) > -1;
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
			this.getRequestsFromDate(date);
		}
	}
});