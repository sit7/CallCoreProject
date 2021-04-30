var documentsApp = { template: "<exp-documents-app></exp-documents-app>" };
var expDocumentDetails = { template: "<exp-document-view></exp-document-view>" };


var routes = [
    {
    	path: "",
    	name: "expDocumentsList",
    	component: documentsApp,
    	props: true,

    },
 {
 	path: "/expdocument-:DocumentId",
 	name: "expDetails",
 	component: expDocumentDetails,
 	props: true,
 }
];

var router = new VueRouter({
	routes: routes,
	mode: "history",
	base: "/fooDocument/ExpDocumentsNew"
}

);