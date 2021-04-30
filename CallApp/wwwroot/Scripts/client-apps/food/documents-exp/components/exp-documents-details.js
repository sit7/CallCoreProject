Vue.component("exp-document-details", {
	template: "#exp-document-details",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				ExpDocDetailID:null,
				DocumentID: null,
				DetailNumber: null,
				FoodName: null,
				Amount: null,
				RecordStatusID: 1,
				MeasureUnit: null,
				Price: null,
				IncDate: null,
				IsUndvidedPack: null,
				AmountInKg: null,
				Summa: null
			},
			details: [],
		}
	},

	props: {
		documentID: Object,
		expDetails: Array,
	},

	

	
	methods: {

		/*getDetails: function () {
			var vm = this;
			//var date = new Date(Date.now()).toISOString();
			
			$.ajax({
				method: "get",
				url: "/fooExpDocDetail/GetExpDocDetails/" + vm.$route.params.DocumentId,

				success: function (response) {
					vm.details = response;
				}
			});
		},*/

		deleteDetail: function (detail) {

			var vm = this;
			this.$confirm("Вы действительно хотите удалить эту строку?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/fooExpDocDetail/DeleteDetail/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
					data: JSON.stringify({ id: detail.ExpDocDetailID }),
					success: function (response) {
						if (response === true) {
							vm.details = vm.details.filter(function (item) {
								return item.ExpDocDetailID !== detail.ExpDocDetailID;
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
	},

	watch:
		{
			"expDetails": function (value) {
				vm = this;
				vm.details = this.expDetails;
			},

		},

	created: function () {
		console.log(this.expDetails);
		vm = this;
		vm.details = this.expDetails;

	}
});