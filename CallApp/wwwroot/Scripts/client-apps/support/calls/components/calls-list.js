Vue.component("calls-list", {
	template: "#calls-list",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				CallID:null,
				Object: null,
				ObjectID: null,
				ShortName: null,
				Name:null,
				Description: null,
				Solution: null,
				PhoneNumber: null,
				CreateUserID: null,
				ResponsibleUserID: null,
				ResponsibleUser:null,
				CallDate: null,
				RecordDate: null,
				UserID: null,
				TaskID: null,
				Task: null,
				CallerName: null,
				PriorityID: null,
				Priority:null,
				StatusID: null,
				Status: null,
				IsInc: null,
			},

			calls: [],
			call: [],
			dateFrom: null,
			IsNotResolved:0,
			search: null,
			showAddCallDialog: false,
		}
	},

	methods: {

		addCall: function () {
			var vm = this;
			vm.call = {
				CallID: -vm.generateUid(),
				ObjectID: null,
				ShortName: "",
				Name: "",
				Description: "",
				Solution: "",
				PhoneNumber: "",
				CreateUserID: null,
				ResponsibleUserID: null,
				ResponsibleUser: null,
				CallDate: new Date(Date.now()).toISOString(),
				RecordDate: new Date(Date.now()).toISOString(),
				UserID: null,
				TaskID: null,
				RecordStatusID: 1,
				Task: null,
				CallerName: null,
				PriorityID: 1,
				Priority: "Не срочно",
				StatusID: 1,
				Status: "Не готово",
				IsInc: true
			};
			console.log(vm.call);
			this.showAddCallDialog = true;
		},

		editCall: function (call) {
			var vm = this;
			vm.call = call;
			this.callFormMode = "edit";
			this.showAddCallDialog = true;
		},

		getCalls: function (date, IsNotResolved) {
			var vm = this;
			
			$.ajax({
				method: "get",
				data: { date: new Date(date).toISOString(), isNotResolved: IsNotResolved },
                url: "/Call/GetCallsFromDate",

                success: function (response) {
					vm.calls = response;
				}
			});
		},

		deleteCall: function (call) {

			var vm = this;
			this.$confirm("Вы действительно хотите удалить этот документ?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/Call/DeleteCall/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
                    data: JSON.stringify(call.CallID),
					success: function (response) {
						if (response === true) {
							vm.calls = vm.calls.filter(function (item) {
								return item.CallID !== call.CallID;
							});
							vm.$message({
								type: 'danger',
								message: 'Данные удалены'
							});
						}
                    },
                    error: function (response) {
                        alert('error!');
                    }
				});

			});

		},

		doneCall: function (call) {

			var vm = this;
			if (call.StatusID == 1)
			{
				this.$confirm("Вы действительно закрываете заявку? Аааа?!", "Внимание", {
					confirmButtonText: 'Да',
					cancelButtonText: 'Нет',
					cancelButtonClass: "el-button--text",
					type: 'warning'
				}).then(function () {
					$.ajax({
						url: "/Call/DoneCall/",
						dataType: "json",
						contentType: "application/json; charsert=utf-8",
                        method: "post",
                        data: JSON.stringify(call.CallID),
						success: function (response) {
							if (response === true) {
								vm.calls.forEach(function (item, index) {
									if (call.CallID === item.CallID) {
                                        item.StatusID = 2;
                                        item.Status = 'Готово';
									}
								});
								vm.$message({
									type: 'danger',
									message: 'Заявка исполнена'
								});
							}
                        },
                        error: function (response) {
                            alert('error!');
                        }
					});

				});
			}
		else
			{
				this.$confirm("Вы действительно хотите снова заниматься этой заявкой? Точно?", "Внимание", {
					confirmButtonText: 'Да',
					cancelButtonText: 'Нет',
					cancelButtonClass: "el-button--text",
					type: 'warning'
				}).then(function () {
					$.ajax({
						url: "/Call/DoneCall/",
						dataType: "json",
						contentType: "application/json; charsert=utf-8",
						method: "post",
                        data: JSON.stringify(call.CallID),
						success: function (response) {
							if (response === true) {
								vm.calls.forEach(function (item, index) {
									if (call.CallID === item.CallID) {
										item.StatusID = 1;
										item.Status = 'Не готово';
									}
								});
								vm.$message({
									type: 'danger',
									message: 'Заявка снова ваша'
								});
							}
                        },
                        error: function (response) {
                            alert('error!');
                        }
					});

				});
			}
		},

		onCallSaved: function (event) {

			var vm = this;
			vm.$message({
				showClose: true,
				message: "Звонок  успешно добавлен",
				type: 'success'
			});

			if (event.mode === "edit") {
				vm.calls.forEach(function (item, index) {
					if (event.call.CallID === item.CallID) {
						vm.calls.splice(index, 1, event.call);
					}
				});
			}

			if (event.mode === "add") {
				vm.calls.concat(event.call);
				vm.calls.push(event.call);

			}
			this.showAddCallDialog = false;
		},
	
	},
	created: function () {
		
		var newdate = new Date(Date.now());
		this.dateFrom = newdate.setDate(newdate.getDate() - 60);
		this.IsNotResolved = 0;
		this.getCalls(this.dateFrom, this.IsNotResolved);
	},
	computed: {
	},
	watch: {
		dateFrom: function (value) {
			var date = new Date(value);
			this.getCalls(date, this.IsNotResolved);
		},
		IsNotResolved: function (value) {
			this.getCalls(this.dateFrom, value);
		},

	}
});