Vue.component("building-form", {
    template: "#building-form",
    mixins:[crossdMixins],
    data: function(){	
		return {
	          model: {
            	BuildingID: -1,
				BuildingTypeID: null,
            	Type: null,
				Address:null,
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
        	
        }
    },
    props:{
		buildingToEdit: Object,
		buildingTypes: Array
    },
	methods: {
		submitForm: function () {
			var x = 0;
			var vm = this;
			var _model = vm.model;
			var _building = vm.buildingToEdit;
			if (_model.BuildingID < 0) {
				this.addBuilding(_model);
			} else {
				this.editBuilding(_model);
			}
			x = 1;
		},

    	saveBuilding: function () {
			var vm = this;
			if (vm.model.BuildingID < 0) {
				this.addBuilding(data);
			} else {
				this.editBuilding(data);
			}
    		
    	},

    	editBuilding: function (data) {
    		var vm = this;
    		this.$refs["buildingform"].validate(function (valid) {
				if (valid) {
					$.ajax({
						url: "/repBuilding/Save/",
						dataType: "json",
						contentType: "application/json; charsert=utf-8",
						method: "post",
						data: JSON.stringify(data),
						success: function (response) {

							if (response.success) {
								vm.$emit("building-saved", data);
								vm.$message({
									showClose: true,

									message: "Сведения о здании обновлены",
									type: 'success'
								});
							} else {
								vm.$alert(data, 'Ошибка', {
									type: "error",
									confirmButtonText: 'OK',
								});
							}
						}
					});
				}
				else {
					vm.$alert("что-то пошло не так", {
						type: "error",
						confirmButtonText: 'OK',
					});
					return false;
				}
    		});
    	},

    	addBuilding: function (data) {
    		var vm = this;
    		this.model.BuildingID = vm.generateUid()*(-1);
    		this.$refs["form"].validate(function (valid, data) {
    			if (valid) {
    				$.ajax({
    					url: "/repBuilding/Add/",
    					dataType: "json",
    					contentType: "application/json; charsert=utf-8",
    					method: "post",
    					data: JSON.stringify(vm.model),
    					success: function (response) {
    						if (response.success) {
    							vm.$emit("building-saved", vm.model);
    							vm.$message({
    								showClose: true,
    								message: "Сведения о здании добавлены",
    								type: 'success'
    							});
    						} else {
    							vm.$alert(data, 'Ошибка', {
    								type: "error",
    								confirmButtonText: 'OK',
    							});
    						}
    					}
    				});
    			}
    		});
    	},
    	generateNewModel: function () {
    		return {
    			BuildingID: -1,
    			Type: null,
    			BuildYear: null,
    			Description: null,
    			FloorNum: null,
    			Latitude: null,
    			Longitude: null,
    			Name: null,
    			Object: null,
    			TechFloorNum: null,
    			UnderFloorNum: null,
    			RecordStatusID: 1
    		};
    	},

    	/*showModel: function () {
    		console.log(this.model);
    	},*/
 },
	computed: {
		//buildingTypes: {
		//	//var store = this.$store;
		//	//var count = store.getters.buildingTypes.length;
		//	//if (count === 0) {
			
		//	//}
		//	//else return store.getters.buildingTypes;

		//	$.ajax({
		//		method: "get",
		//		url: "/repBuilding/GetBuildingTypes",
		//		success: function (responce) {
		//			store.dispatch("commitBuildingTypes", responce);
		//			return responce;
		//		}
		//	});
		//}
	},
    created: function () {
    	console.log(this.model);
		if (this.buildingToEdit !== null) {
			this.model = this.buildingToEdit;
		}
 
		},
		watch: {
			buildingToEdit: function (value) {
				/*if (value === null)
				{
					this.model =generateNewModel()
				}
				else
				{*/
			//	this.model = value;/*}*/
				if (value === null) {
					this.model = generateNewModel();
				}
				else {
					this.model = value;
				}
			}
        },
	
});