Vue.component("building-form-new",
	{
		template: "#building-form-new",
		data: function () {
			return {
				
				showFormDialog: false,
				ignoreChanges: true,
			}
		},

	
		computed: {

		
		},
		
		methods: {
			
			beforeTabLeaves: function (newname, oldname) {
				console.log('tab changing...');
				return true;
			},
			resolveDisabled: function (item) {
				return !item.isvisible(this.current);
			},
	        
			saveForm: function (success) {
				var validationdata = [];
				var failedinfo = [];
				this.$refs['genericform'].forEach(
					f => f.validate(function (valid, data) {
						validationdata.push(
							{
								formName: f.name,
								isValid: valid,
								formValidData: data,
								formData: f.formData
							}
						);
					}));
				
				var resultobj = { BuildingID: this.current.BuildingID };
				validationdata.forEach(f => {
					if (f.isValid) {
						resultobj = Object.assign(resultobj, f.formData);
					}
					else {
						for (property in f.formValidData) {
							failedinfo.push(f.formValidData[property]);
						}
					}
				});
				if (failedinfo.length > 0 ) {
					this.$alert("Обнаружены ошибки!", "Внимание", {
						confirmButtonText: 'Исправить',
						type: 'warning'
					}).then(function () {


					})
				} else {
					this.$emit('after-object-concat', resultobj, success);
				}
				
			},	
		},
	
		

		props: {
			formmodel: Object,
            current: Object,
            credentials: Object 
		},

        created: function () {
		}

	})