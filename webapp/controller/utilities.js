sap.ui.define([
	"./utilities"
], function() {
	"use strict";

	// class providing static utility methods to retrieve entity default values.

	return {
		getDefaultValuesForCrearIngrediente: function() {
			return {
				"ID": "id-" + Date.now().toString(),
				"Nombre": "",
				"StockLevel": "",
				"StockLevelCC": "",
				"Precio": 0,
				"___FK_f00f0f7288abdc9e191c49cf_00015": "",
				"___FK_e6967776851d13e1191c4fbc_00001": "",
				"Cantidad": 0,
				"Unidad": ""
			};
		},
		getDefaultValuesForCrearProveedor: function() {
			return {
				"ID": "id-" + Date.now().toString(),
				"Name": "",
				"email": "",
				"Phone": "",
				"URI": ""
			};
		}
	};
});
