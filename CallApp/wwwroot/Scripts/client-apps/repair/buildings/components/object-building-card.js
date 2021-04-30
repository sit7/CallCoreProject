Vue.component("object-building-card",
	{
        template: "#object-building-card",
        data: function () {
            var vm = this;
            return {
                total: vm.buildingsTotal,
                checked: vm.buildingsChecked,
                name: vm.name,
                cardicon: vm.StatusID === 2 ? 'el-icon-success' : 'el-icon-warning',
                tooltip: vm.StatusID === 2 ? 'Готово к проверке' : 'Возвращено для корректировки',
                status: vm.StatusID,
            }
        },
		props: {
			buildingsTotal: Number,
			buildingsChecked: Number,
			name: String,
			objectKey: Number,
            StatusID: Number,

        },
	});