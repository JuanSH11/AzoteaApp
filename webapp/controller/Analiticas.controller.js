sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"../model/kpiHelper"
], function(BaseController, MessageBox, Utilities, History, KPIHelper) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.azoteaApp.controller.Analiticas", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App64586be9606ff301bc604465";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			if (!this.sContext) {
				this.sContext = "PlatoSet('AZ-1000')";
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onFioriObjectPageHeaderPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		formatFractionDigitFromValue: function(sValue) {
			var sNumber;
			if (isNaN(sValue)) {
				sNumber = sValue;
			} else {
				sNumber = Number(sValue).toFixed(2);
			}
			return sNumber;

		},
		_onFioriObjectPageHeaderContactPress: function(oEvent) {

			var oPopover;
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			this.getOwnerComponent().runAsOwner(function() {
				oPopover = oSource.getDependents()[0];
				oPopover.setPlacement("Auto");
			});

			return new Promise(function(fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (sPath) {
					oPopover.bindElement(sPath);
				}
			}).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Analiticas").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711"] = {};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"__id": 4
			}];

			self.oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711'] = {
				"path": "Reviews",
				"parameters": {
					"entitySet": "PlatoSet"
				}
			};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086"] = {};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"__id": 4
			}];

			self.oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086'] = {
				"path": "Ventas",
				"parameters": {
					"entitySet": "PlatoSet"
				}
			};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oView.getModel(undefined).getMetaModel().loaded().then(function() {
				oChart = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711");
				var oParameters = oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711'];

				KPIHelper.getKPIModel("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711", oChart, undefined, oParameters.path, oChart.getDimensions(), {
					"MES_Rating_AVG": {
						"source": "Rating",
						"operation": "AVG"
					}
				}, self.updateBindingOptions.bind(self), function(oKPIModel) {
					oChart = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-3-sectionContent-sap_chart_PieChart-1683590201711");
					oChart.setModel(oKPIModel, "kpiModel");
					oChart.bindData({
						path: "/",
						model: "kpiModel"
					});
				});

			});

			oView.getModel(undefined).getMetaModel().loaded().then(function() {
				oChart = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086");
				var oParameters = oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086'];

				oChart.bindData(oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1683590604496-sectionContent-sap_chart_LineChart-1683590644086']);

			});

		}
	});
}, /* bExport= */ true);
