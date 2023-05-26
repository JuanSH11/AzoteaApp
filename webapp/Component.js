sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/build/standard/azoteaApp/model/models",
	"./model/errorHandling"
], function(UIComponent, Device, models, errorHandling) {
	"use strict";

	var navigationWithContext = {
		"PlatoSet": {
			"VerPlato": "",
			"Analiticas": "",
			"CrearReview": "Reviews",
			"CrearPlato": ""
		},
		"RecetaSet": {
			"VerPlato": "PlatoReceta",
			"VerIngrediente": "IngredienteReceta",
			"Analiticas": "PlatoReceta",
			"CrearPlato": "PlatoReceta",
			"CrearIngrediente": "IngredienteReceta",
			"IngresarStock": "IngredienteReceta"
		},
		"ReviewSet": {
			"VerPlato": "Plato",
			"Analiticas": "Plato",
			"CrearReview": "",
			"CrearPlato": "Plato"
		},
		"VentasSet": {
			"VerPlato": "Plato",
			"Analiticas": "Plato",
			"CrearPlato": "Plato"
		},
		"IngredienteSet": {
			"VerIngrediente": "",
			"VerProveedor": "Proveedor",
			"CrearIngrediente": "",
			"CrearProveedor": "Proveedor",
			"IngresarStock": ""
		},
		"ProveedorSet": {
			"VerIngrediente": "Ingrediente",
			"VerProveedor": "",
			"CrearIngrediente": "Ingrediente",
			"CrearProveedor": "",
			"IngresarStock": "Ingrediente"
		}
	};

	return UIComponent.extend("com.sap.build.standard.azoteaApp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");

			// set the dataSource model
			this.setModel(new sap.ui.model.json.JSONModel({
				"uri": "/here/goes/your/serviceUrl/local/"
			}), "dataSource");

			// set application model
			var oApplicationModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oApplicationModel, "applicationModel");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// delegate error handling
			errorHandling.register(this);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		createContent: function() {
			var app = new sap.m.App({
				id: "App"
			});
			var appType = "App";
			var appBackgroundColor = "";
			if (appType === "App" && appBackgroundColor) {
				app.setBackgroundColor(appBackgroundColor);
			}

			return app;
		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}

	});

});
