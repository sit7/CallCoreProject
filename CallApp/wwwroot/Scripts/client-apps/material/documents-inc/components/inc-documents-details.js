Vue.component("inc-document-details", {
	template: "#inc-document-details",
	mixins: [crossdMixins],
	data: function () {
		return {
			hello: "hello",
			model: {
				IncDocDetailID: null,
				FoodID: null,
				MeasureUnit: null,
				Amount: null,
				//s.Price,
				VATRate: null,
				Excise: null,
				DocumentID: null,
				Date: null,
				FoodName: null,
				DetailNumber: null,
				UnitMeasureID: null,
				IsUndividedPack: null,
				LossPercent: null,
				UseBeforeDate: null,
				CreateDate: null,
				SummTotal: null,
				Summa: null,
				PricePerUnit: null,
				RecordStatusID: 1
			},
			details: [],
		}
	},
	props: {
		documentID: Object,
		incDetails: Array,
	},

	computed: {
		documentSumm: function () {
			var vm = this;
			if (vm.incDetails) {
				if (vm.incDetails.length > 0) {

					return vm.incDetails.reduce(function (result, current) {
						return result += current.Summa;
					}, 0);
				}
			}
			return 0;
		},


	},
	methods: {


		deleteDetail: function (detail) {

			var vm = this;
			this.$confirm("Вы действительно хотите удалить эту строку?", "Внимание", {
				confirmButtonText: 'Да',
				cancelButtonText: 'Нет',
				cancelButtonClass: "el-button--text",
				type: 'warning'
			}).then(function () {
				$.ajax({
					url: "/fooIncDocDetail/DeleteDetail/",
					dataType: "json",
					contentType: "application/json; charsert=utf-8",
					method: "post",
					data: JSON.stringify({ id: detail.IncDocDetailID }),
					success: function (response) {
						if (response === true) {
							vm.details = vm.details.filter(function (item) {
								return item.IncDocDetailID !== detail.IncDocDetailID;
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
			"incDetails": function (value) {
				vm = this;
				vm.details = this.incDetails;
			},

		},

	created: function () {
		console.log(this.incDetails);
		vm = this;
		vm.details = this.incDetails;

	}
});