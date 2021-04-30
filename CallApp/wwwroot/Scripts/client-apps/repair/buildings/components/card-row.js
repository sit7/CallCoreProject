Vue.component("card-row",
	{
		template: "#card-row",
		props: {
			title: String,
			property: Object,
			rowitem: Object
		},
			
		methods: {
            formatRow: function (rowitem, property) {
                var propvalue = rowitem[property.datafield];
                if (propvalue === null || propvalue === undefined) return 'н/д'; // если ничто
                if (property.formatConverter !== null && property.formatConverter !== undefined && typeof property.formatConverter === 'function') {
                    return property.formatConverter(rowitem);
                }
                else {
                    if (property.editortype === 'datetimeinput') {
                        if (propvalue instanceof Date) {
                            console.log(propvalue);
                        }
                        else {
                            propvalue = new Date(propvalue);
                        }

                        return propvalue.toLocaleString("ru-RU", {

                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });
                    }
                    else {
                        if (property.editortype === 'checkbox') {
                            return propvalue === true ? 'да' : 'нет';
                        } else if (property.type === 'decimal') {
                            return propvalue.toLocaleString("ru-RU");
                        } else {
                            return propvalue;
                        }
                    }
                }
            } 
			
		},

		created: function () {
		}

	})