Vue.component("building-card-new",
    {
        template: "#building-card-new",
        //mixins: [crossdMixins],
        data: function () {
            var vm = this;
            var t = vm.tabsinfo;
            var c = vm.building;
            return {
                tabs: t,
                current: c,
            };
        },
		props: {
			tabsinfo: { type: Array, required: true },
            building: { type: Object, required: true },
            objectstatusid: {type: Number, required: true}
		},

        mounted: function () {
            
        },

        created: function () {
          
        },

        computed: {
            allowedit() {
                return this.objectstatusid !== 2 && !this.building.IsVerified;
            },
            allowremove() {
                return false;
            },
            allowverify() {
                return false;
            },
            allowundoverify() {
                return false;
            }
        },

		methods: {
            createitemkey: function (index, item) {
                var vm = this;
                return item.name + index + '_' + vm.building.BuildingID;

            },

            isvisible: function (model) {
                if (model.isvisible == undefined) return true;
                if (typeof model.isvisible === 'function') return model.isvisible(this.current);
                if (typeof model.isvisible === 'boolean') return model.isvisible;
                return true;
            },


		}
	});