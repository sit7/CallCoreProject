Vue.component("building-view", {
	template: "#building-view",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				BuildingID: null,
				BuildingTypeID: null,
				Type: null,
				Address: null,
				BuildYear: null,
				Description: null,
				FloorNum: null,
				Latitude: null,
				Longitude: null,
				Name: null,
				Object: null,
				TechFloorNum: null,
				UnderFloorNum: null,
				RecordStatusID: 1,
				OperationalManagementCertificate: null,
				TotalArea: null,
				MainBuildingArea: null,
				AuxiliaryBuildingArea: null,
				LandCertificate: null,
				LandArea: null,
				Comment: null,
				MaxKidsCount: null,
				LandKadastrNumber: null,
				LandToBeautification: null,
				BeautificationPlan: null,
				IsVerified: false
			},
			buildingTypes: null,
			building: [],
			building1: [],
			buildingToEdit: null,
			showFormDialog: false,
		}
	},

	methods: {

		getDetails: function () {
			var vm = this;
			//var date = new Date(Date.now()).toISOString();

			$.ajax({
				method: "get",
				url: "/repBuilding/GetBuilding/" + vm.$route.params.buildingid,

				success: function (response) {
					vm.building = response;
				}
			});


		},
		editBuilding: function (item) {
			var vm = this;
			this.buildingToEdit = item;
			//vm.building1 = vm.cloneData(item);
			this.showFormDialog = true;
		},

		addBuilding: function () {
			this.buildingToEdit = this.generateNewModel();
			this.showFormDialog = true;
		},

		buildingSaved: function (data) {
			//this.getBuildings();
			this.showFormDialog = false;
		},

		onBuildingSaved: function (data) {
			//this.getBuildings();
			this.showFormDialog = false;
		},

		deleteBuilding: function (building) {

			var vm = this;
			this.$confirm("Вы действительно хотите удалить это здание?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/repBuilding/DeleteBuilding/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
					data: JSON.stringify({ id: building.BuildingID }),
					success: function (response) {
						if (response === true) {
							vm.$message({
								type: 'danger',
								message: 'Данные удалены'
							});
						}
					}
				});

			});
		},

		verifyBuilding: function (building) {

			var vm = this;
			this.$confirm("Вы действительно хотите отметить это здание как проверенное?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/repBuilding/VerifyBuilding/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
					data: JSON.stringify({ id: building.BuildingID }),
					success: function (response) {
						if (response === true) {
							vm.$message({
								type: 'danger',
								message: 'Данные обновлены'
							});
						}
					}
				});

			});

		},
	},
	created: function () {
		this.getDetails();
		console.log(this.$router);
	},
	computed: {

		validClass: function () {
			var vm = this;
			return {
				"is-valid": vm.IsVerified === 1,
				"is-notvalid": vm.IsVerified === 0,
			};
		}
	}
});