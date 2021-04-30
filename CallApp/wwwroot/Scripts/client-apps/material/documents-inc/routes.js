var documentsApp = { template: "<inc-documents-app></inc-documents-app>" };
var incDocumentDetails = { template: "<inc-document-view></inc-document-view>" };


var routes = [
    {
    	path: "",
		name: "incDocumentsList",
    	component: documentsApp,
    	props: true,

    },
 {
        path: "/incdocument-:DocumentId",
        name: "incDetails",
        component: incDocumentDetails,
        props: true,
    }
];

var router = new VueRouter({
	routes: routes,
	mode: "history",
	base: "/fooDocument/IncDocumentsNew"
}
 
);