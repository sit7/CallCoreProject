Vue.component("callsp-form", {
	template: "#callsp-form",
	mixins: [crossdMixins],
	data: function () {
		return {
			callModel: null,
			tasks: [],
			objects: [],
			statuses: [],
			priorities: [],
			users: [],
		};
	},

	props: {
		call: Object,

	},

	computed: {
		/*canEditNetto: function () {
            console.log(this.mode);
            return (this.mode === "edit" && this.isEditingActive) || this.mode === "create";
        },

        productsModified: function () {
            return (this.mode === "edit" && this.isEditingActive) || (this.mode === "create");
        }*/
	},

	methods: {

		getObjects: function (query) {
    		var vm = this;
    			$.ajax({
    				method: "post",
    				url: "/Call/GetObjects",
				
    				data: {
    						searchString: query,
						},
    				success: function (response) {
    					vm.objects = response;
    				}
    			});
        },

		handleProductChanged: function (data) {
			console.log(data);
		},

		saveCall: function () {

			var validForms = []
			var vm = this;

            var call = this.callModel;
            var dataObject = JSON.stringify({
                CallID: call.CallID,
                ObjectID: call.ObjectID,
                ShortName: call.ShortName,
                Name: call.Name,
                Description: call.Description,
                Solution: call.Solution,
                PhoneNumber: call.PhoneNumber,
                CreateUserID: call.CreateUserID,
                ResponsibleUserID: call.ResponsibleUserID,
                CallDate: call.CallDate,
                TaskID: call.TaskID,
                CallerName: call.CallerName,
                PriorityID: call.PriorityID,
                StatusID: call.StatusID,
                IsInc: call.IsInc
            });
			this.$refs.CallForm.validate(function (valid, data) {

				if (valid) {
					if (call.CallID < 0) {
						$.ajax({
							url: "/Call/AddCall/",
							dataType: "json",
							contentType: "application/json; charset=utf-8",
                            method: "post",
                            data: dataObject,
							//data: JSON.stringify({ call: call }),
							success: function (response) {
								console.log(response);
								if (response.success) {
									vm.$emit("close", { type: "edit", data: response.data });
									// vm.$refs.form.resetFields();
									vm.$message({
										showClose: true,
										message: "Сведения о звонке добавлены",
										type: 'success'
									});
								} else {
									vm.$alert(data, 'Ошибка', {
										type: "error",
										confirmButtonText: 'OK',
									});
								}
								call.CallID = response.data[0].CallID;
								var event = {
									call: call,
									newCallID: response,
									mode:'add'
								};
								vm.$emit("form-saved", event);
                            },
                            error: function (response) {
                                alert('error!');
                            }
						});
					}


					else {
						$.ajax({
							url: "/Call/SaveCall/",
							dataType: "json",
							contentType: "application/json; charset=utf-8",
                            method: "post",
                            data: dataObject,
							//data: JSON.stringify({ CallID: call.CallID,}),
							success: function (response) {
								console.log(response);
								var event = {
									call: call,
									newCallID: response,
									mode: 'edit'
								};

								vm.$emit("form-saved", event);
							}
						});
					}
				}
			})
		},
	},


	watch: {
		"call.CallID": function (value) {
			var vm = this;
			vm.callModel = vm.cloneData(vm.call);

		},
		"callModel.CallDate": function (value) {
			var vm = this;
			this.callModel.CallDate = moment(value).toISOString();

		},
		"callModel.ObjectID": function (value) {
			var vm = this;
			if (vm.objects && vm.callModel) {
				vm.callModel.ShortName = vm.objects.find(function (item) {
					return item.ObjectID === vm.callModel.ObjectID;
				}).Name;
			}
		},
		"callModel.StatusID": function (value) {
			var vm = this;
			if (vm.statuses) {
				vm.callModel.Status = vm.statuses.find(function (item) {
					return item.StatusID === vm.callModel.StatusID;
				}).Name;
			}
		}
	},

	created: function () {
		var vm = this;
		vm.callModel = vm.cloneData(vm.call);

		vm.getObjects("");

		$.ajax({
			method: "get",
			url: "/Call/GetTasks",
			success: function (responce) {
				vm.tasks = responce
			}
		}),
		  $.ajax({
		  	method: "get",
		  	url: "/Call/GetStatuses",
		  	success: function (responce) {
		  		vm.statuses = responce
		  	}
		  }),
		  $.ajax({
		  	method: "get",
		  	url: "/Call/GetPriorities",
		  	success: function (responce) {
		  		vm.priorities = responce
		  	}
		  }),
		 /*$.ajax({
		 	method: "get",
		 	url: "/Call/GetObjects",
		 	success: function (responce) {
		 		vm.objects = responce
		 	}
		 }),*/
		$.ajax({
			method: "get",
			url: "/Call/GetUsers",
			success: function (responce) {
				vm.users = responce
			}
		})
	},

});
