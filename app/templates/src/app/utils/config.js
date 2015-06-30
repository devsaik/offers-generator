angular.module("config", [])

.constant("appConfig", {
	"SOCIAL": {
		"DEV": {
			"fb": {
				"appID": 1409783492615024,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "54OZC4KsiDrS0xUxCo1w"
			}
		},
		"INT": {
			"fb": {
				"appID": 1409783492615024,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "54OZC4KsiDrS0xUxCo1w"
			}
		},
		"DEMO": {
			"fb": {
				"appID": 1409783492615024,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "54OZC4KsiDrS0xUxCo1w"
			}
		},
		"STAG": {
			"fb": {
				"appID": 261078650716244,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "54OZC4KsiDrS0xUxCo1w"
			}
		},
		"STAGE": {
			"fb": {
				"appID": 261078650716244,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "54OZC4KsiDrS0xUxCo1w"
			}
		},
		"PROD": {
			"fb": {
				"appID": 567406433277274,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "BDKEJuffs6ABdmpmKl2wg"
			}
		},
		"QA": {
			"fb": {
				"appID": 839012416145389,
				"status": true,
				"cookie": true,
				"version": "v2.0"
			},
			"tw": {
				"apiKey": "54OZC4KsiDrS0xUxCo1w"
			}
		}
	},
	"API": {
		"PATTERN": {
			"PP": {
				"endpointURL": "https://{{env}}.pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		},
		"DEV": {
			"PP": {
				"endpointURL": "https://int.pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		},
		"STAGE": {
			"PP": {
				"endpointURL": "https://stage.pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		},
		"PROD": {
			"PP": {
				"endpointURL": "https://pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		},
		"QA": {
			"PP": {
				"endpointURL": "https://qa.pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		},
		"DEMO": {
			"PP": {
				"endpointURL": "https://qa.pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		},
		"INT": {
			"PP": {
				"endpointURL": "https://int.pushpointmobile.com/admin/api",
				"httpOptions": {
					"headers": {
						"Content-Type": "application/json; charset=UTF-8",
						"Version": 2
					}
				}
			}
		}
	},
	"PROXYAPI": {
		"endpointURL": "//faker.com/api",
		"httpOptions": {
			"headers": {
				"Content-Type": "application/json; charset=UTF-8"
			}
		}
	},
	"CONSTANTS": {
		"MAP": {
			"tiles": {
				"url": "//{s}.tiles.mapbox.com/v3/phenchanter.i80efl74/{z}/{x}/{y}.png",
				"options": {
					"attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
				}
			}
		}
	},
	"DATATRANSFORMERS": {
		"schemaTransformer": [
			"ENTITY.offer.transformers",
			"TRANSFORMERS",
			"channelBundle.channels.display.transformers",
			"channelBundle.channels.facebook.transformers",
			"channelBundle.channels.free.transformers",
			"channelBundle.ads.display.transformers"
		],
		"channelStatistic": "channelStatisticTransformer",
		"adStatistic": "adStatisticTransformer"
	},
	"TRANSFORMERS": {
		"locations": {
			"__prefix": "locations",
			"__copy": [
				"id",
				"address1",
				"address2",
				"city",
				"corporateOnly",
				"createdBy",
				"merchantId",
				"name",
				"phone",
				"primary",
				"state",
				"updatedBy",
				"zip"
			],
			"lat": "latitude",
			"lng": "longitude"
		},
		"locationToMarker": {
			"id": "id",
			"lat": "lat",
			"lng": "lng"
		},
		"galleryItem": {
			"response": {
				"__prefix": "items",
				"__copy": [
					"id",
					"merchantId",
					"tags",
					"title"
				],
				"url": "imageUrl",
				"createdAt": "createDate| amDateFormat: 'YYYY-MM-DD'"
			},
			"request": {
				"__copy": [
					"id",
					"title"
				],
				"createdAt": "createDate| amDateFormat: 'YYYY-MM-DD'",
				"merchantId": "'userService'| get_service_var: 'user_id'",
				"imageUrl": "url",
				"tags": "tags || ['uploaded']"
			}
		},
		"distribitionRecepient": {
			"response": {
				"__prefix": "distributionRecipients",
				"__copy": [
					"id",
					"status",
					"recipient",
					"lastName",
					"firstName",
					"merchantId",
					"distributionListId"
				]
			},
			"request": {
				"__copy": [
					"id",
					"recipient",
					"lastName",
					"firstName",
					"distributionListId",
					"status"
				],
				"merchantId": "'userService'| get_service_var: 'user_id'",
				"merchant_id": "'userService'| get_service_var: 'user_id'"
			}
		}
	},
	"offerBundle": {
		"form": {
			"name": {
				"tooltip": "Offer Nickname is a short phrase to help you find an offer in our system that you have already built. Nickname is for your eyes only and will never be seen by your intended audience.",
				"placeholder": "Example: \"Valentine's 10%\""
			},
			"title": {
				"tooltip": "Offer Title should be simple, eye-grabbing, with a strong call to action. Offer Title will show up everywhere associated with your Offer - from Offer Webpage, to Offer Ads. So make it count!",
				"placeholder": "Example: \"10% Off Roses for Valentine's Day\""
			},
			"description": {
				"tooltip": "Offer Description is where you can expand on Offer Title and reinforce the opportunity. Make it personal. Tell a story. But keep it brief, so your audience stays engaged.",
				"placeholder": "Example: \"Our annual Valentine's Day deal is here! Shop today and get 10% off a dozen or more roses.\""
			},
			"restrictions": {
				"tooltip": "Any rules and restrictions for offer redemption, such as where it can be redeemed (in-store only, online only), whether it can be combined with other promotions, or maximum redemptions per household.",
				"placeholder": "Example: \"Offer valid for in-store purchases only. Offer is valid between 12pm and 7pm on Valetine's Day only. Can not be combined with other offers. While supplies last.\""
			}
		}
	},
	"channelBundle": {
		"ads": {
			"display": {
				"transformers": {
					"displayAd": {
						"response": {
							"__copy": [
								"id",
								"bannerImageId",
								"linkedCampaigns",
								"merchantId",
								"name"
							],
							"type": "type || 'DISPLAY'",
							"bannerType": "bannerType.replace('TYPE_','')",
							"editorJson": "'{}'",
							"url": "bannerPublicUrl"
						},
						"request": {
							"__copy": [
								"id",
								"bannerImageId",
								"linkedCampaigns",
								"name",
								"type",
								"body",
								"title"
							],
							"bannerType": "type == 'DISPLAY' ? 'TYPE_'+bannerType : undefined",
							"editorJson": "'{}'",
							"merchantId": "'userService'| get_service_var: 'user_id'",
							"bannerPublicUrl": "url"
						}
					}
				}
			}
		},
		"channels": {
			"common": {
				"form": {
					"schedule": {
						"label": "Schedule",
						"tooltip": "Schedule is the dates in which your Mobile Banners campaign will be live. We've set it to match your Offer dates, but you can change it. However, your campaigns can only run within the dates of your Offer. You can run campaign for as short as one day and as long as 6 months."
					},
					"schedulings": {
						"label": "Day Targeting",
						"tooltip": "Day Targeting allows you to only run your campaign on certain days of the week, during the dates in which the campaign will be live.",
						"options": [
							{
								"label": "Every day",
								"value": "Everyday"
							},
							{
								"label": "Weekdays Only",
								"value": "Working Days"
							},
							{
								"label": "Weekends Only",
								"value": "Weekends"
							}
						]
					}
				}
			},
			"display": {
				"transformers": {
					"displayChannel": {
						"response": {
							"__copy": [
								"id",
								"name",
								"description",
								"timeZone",
								"merchantId",
								"averageSale",
								"dailyBudget",
								"redemptions",
								"distributionChannel",
								"status",
								"totalBudget",
								"maxBid",
								"schedulings",
								"metroCodes",
								"hourlyBudget",
								"cities",
								"states",
								"iabCategoryCodes",
								"devices",
								"deviceIdentifiers",
								"deviceCategory",
								"appTargeting",
								"pricingTargeting"
							],
							"startDate": "startDate | amDateFormat: 'YYYY/MM/DD'",
							"endDate": "endDate | amDateFormat: 'YYYY/MM/DD'",
							"devices": "devices",
							"type": "type || distributionChannel",
							"targetedCategoryIds": "targetedCategoryIds",
							"iabCategoryCodes": "iabCategoryCodes",
							"linkedAds": "linkedAds[0]",
							"linkedOffer": "linkedOffers[0]",
							"budgetType": "dailyBudget && dailyBudget > 0 ? 'PERDAY' : 'PERCAMPAIGN'",
							"reachRadius": "{1: 0.5, 3:2, 6:4, 9:6}[reachRadius]",
							"geoActive": "locationIds.length > 0 ? 'GEO' : (cities.length > 0 ? 'City' : (states.length > 0 ? 'State' : 'National'))"
						},
						"request": {
							"__copy": [
								"id",
								"name",
								"description",
								"timeZone",
								"merchantId",
								"averageSale",
								"dailyBudget",
								"redemptions",
								"status",
								"linkedOffers",
								"totalBudget",
								"schedulings",
								"metroCodes",
								"hourlyBudget",
								"cities",
								"states",
								"devices",
								"deviceIdentifiers",
								"deviceCategory",
								"appTargeting",
								"pricingTargeting"
							],
							"startDate": "startDate | amDateFormat: 'YYYY-MM-DD'",
							"endDate": "endDate | amDateFormat: 'YYYY-MM-DD'",
							"distributionChannel": "type",
							"type": "type",
							"campaignType": "type",
							"iabCategoryCodes": "iabCategoryCodes",
							"targetedCategoryIds": "targetedCategoryIds",
							"devices": "devices | array_remove_empty",
							"reachRadius": "{'0.5': 1, 2:3, 4:6, 6:9}[reachRadius]",
							"linkedAds": "[linkedAds]",
							"bidStrategy": "'OPTIMIZED'",
							"dailyBudget": "budgetType === 'PERDAY' ? dailyBudget : null"
						}
					}
				},
				"controllerName": "DisplayChannelController as vm",
				"entityName": "DisplayEntity",
				"templateUrl": "app/bundle/channelBundle/template/display/index.tpl.html",
				"view": {
					"image": "/assets/img/channels/mobile.png",
					"text": "Buy Mobile Ads"
				},
				"dialog": {
					"showClose": false,
					"onClose": {
						"confirm": "All unsaved data will be lost. Do you want to complete your campaign now?"
					}
				},
				"transformFields": {
					"GEO": {
						"arrayName": "locationIds",
						"fieldName": "location",
						"valueField": "id"
					},
					"City": {
						"arrayName": "cityIds",
						"fieldName": "cities",
						"valueField": "value"
					},
					"State": {
						"arrayName": "stateCodes",
						"fieldName": "states",
						"valueField": "value"
					}
				},
				"entity": {
					"defaults": {
						"type": "DISPLAY",
						"distributionChannel": "DISPLAY",
						"campaignType": "DISPLAY",
						"bidStrategy": "OPTIMIZED",
						"pricingTargeting": "CLICK",
						"iabCategoryCodes": [],
						"devices": "",
						"geo": {
							"label": "Geo-targeting location",
							"tooltip": "Geo-targeting allows you to define how large an area you want to reach consumers in. If you run a phone- or web-based business, National targeting may work best for you. If you run a coffee shop, maybe Local is the best way for you to target likely customers.",
							"options": [
								{
									"label": "National",
									"value": "National",
									"default": true
								},
								{
									"label": "My State",
									"value": "State"
								},
								{
									"label": "My City",
									"value": "City"
								},
								{
									"label": "Near Me",
									"value": "GEO"
								}
							]
						},
						"schedulings": [
							{
								"day": "MON",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "TUE",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "WED",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "THU",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "FRI",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "SAT",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "SUN",
								"startTime": "00:00",
								"endTime": "23:59"
							}
						]
					}
				},
				"validators": {
					"DisplayChannelEntity": {
						"iabCategoryCodes": [
							{
								"name": "required",
								"rule": 1,
								"message": "Please select a campaign classification subcategory"
							}
						],
						"startDate": [
							{
								"name": "required",
								"rule": true,
								"message": "Please select a start date for the campaign"
							},
							{
								"name": "dateDiff",
								"message": "Campaign start date must be before end date",
								"rule": {
									"field": "endDate",
									"range": 0
								}
							}
						],
						"endDate": [
							{
								"name": "required",
								"rule": true,
								"message": "Please select an end date for the campaign"
							},
							{
								"name": "dateDiff",
								"rule": {
									"field": "startDate",
									"range": 179
								},
								"message": "Please enter campaign length that is less than or equal to 6 months"
							}
						],
						"devicesTargeting": [
							{
								"name": "required",
								"rule": true
							}
						],
						"appTargeting": [
							{
								"name": "required",
								"rule": true
							}
						],
						"totalBudget": [
							{
								"name": "required",
								"rule": true,
								"message": "Please enter a budget amount"
							},
							{
								"name": "type",
								"rule": "positive",
								"message": "Please enter a numeric value"
							},
							{
								"name": "more",
								"rule": 0
							},
							{
								"name": "lessThan",
								"rule": 100,
								"message": "Over Budget"
							}
						],
						"maxBid": [
							{
								"name": "required",
								"rule": true
							},
							{
								"name": "type",
								"rule": "positive",
								"message": "Please enter a numeric value"
							},
							{
								"name": "more",
								"rule": 0
							}
						],
						"dailyBudget": [
							{
								"name": "required",
								"rule": true
							},
							{
								"name": "type",
								"rule": "positive",
								"message": "Please enter a numeric value"
							},
							{
								"name": "more",
								"rule": 0
							},
							{
								"name": "lessThan",
								"rule": "totalBudget"
							}
						],
						"hourlyBudget": [
							{
								"name": "type",
								"rule": "positive",
								"message": "Please enter a numeric value"
							}
						],
						"averageSale": [
							{
								"name": "required",
								"rule": true
							},
							{
								"name": "type",
								"rule": "positive",
								"message": "Please enter a numeric value"
							},
							{
								"name": "more",
								"rule": 0
							}
						]
					}
				},
				"form": {
					"campaingnClassification": {
						"label": "Campaign Classification",
						"tooltip": "Campaign Classification helps our advertising partners match your type of ads to websites and content that is relevant. An example would be ads for landscaping services running on a website containing gardening information."
					},
					"advancedTargeting": {
						"label": "Advanced Targeting",
						"tooltip": "Advanced Targeting allows you to target your ads only to specific devices and browsing experiences. Caution: combining a narrow Advanced Target and narrow geo-target may result in too small an audience to make a real impact on your business."
					},
					"budget": {
						"label": "Budget",
						"tooltip": "Budget is where you specify how much you want to spend on this campaign. No budget is too big or small, but results will also vary. You can also specify how quickly you want to spend the amount you approve: per day, per week, or for the entire campaign."
					},
					"deviceCategory": {
						"label": "Devices targeting",
						"options": [
							{
								"label": "All Mobile Devices",
								"value": "NO_PREFERENCE",
								"default": true
							},
							{
								"label": "Smartphones",
								"value": "SMARTPHONE"
							},
							{
								"label": "Tablet",
								"value": "TABLET"
							}
						]
					},
					"devices": {
						"label": "Device Category",
						"options": [
							{
								"label": "IOS",
								"value": "IOS"
							},
							{
								"label": "Blackberry",
								"value": "BLACKBERRY"
							},
							{
								"label": "Android",
								"value": "ANDROID"
							},
							{
								"label": "Windows",
								"value": "WINDOWS"
							}
						]
					},
					"application": {
						"label": "Application",
						"options": [
							{
								"label": "Mobile Apps & Web",
								"value": "NO_PREFERENCE",
								"default": true
							},
							{
								"label": "Mobile Apps",
								"value": "MOBILE"
							},
							{
								"label": "Web",
								"value": "WEB"
							}
						]
					},
					"budgetType": {
						"options": [
							{
								"label": "Per Day",
								"value": "PERDAY"
							},
							{
								"label": "Per Campaign",
								"value": "PERCAMPAIGN",
								"default": true
							}
						]
					},
					"maxBid": {
						"label": "Max Bid",
						"tooltip": "Max Bid"
					},
					"hourlyBudget": {
						"label": "Hourly Budget",
						"tooltip": "Hourly Budget"
					},
					"adTitle": {
						"label": "Ad Title",
						"tooltip": "Ad Title"
					},
					"adDesc": {
						"label": "Ad Description",
						"tooltip": "Additional information about your offer. Get creative with your descriptions to see what your customers like best."
					},
					"adType": {
						"label": "Ad Size",
						"tooltip": "Ad Size will define how your ad looks on a phone or tablet. The bigger the ad, the more engaging, but it can also limit the number of places it can show up. We have selected the most commonly seen ad size for you, ensuring the largest audience possible.",
						"options": [
							{
								"label": "320 x 50 px",
								"value": "320x50"
							},
							{
								"label": "300 x 250 px",
								"value": "300x250"
							},
							{
								"label": "320 x 480 px",
								"value": "320x480"
							}
						]
					},
					"preview": {
						"options": {
							"300x250": {
								"bg": "/assets/img/channels/third-step/phone-300x250.png",
								"width": 300,
								"height": 250,
								"top": 100,
								"left": 65,
								"landscape": false,
								"scale": 1
							},
							"320x50": {
								"bg": "/assets/img/channels/third-step/phone-320x50.png",
								"width": 320,
								"height": 50,
								"top": 100,
								"left": 55,
								"landscape": false,
								"scale": 1
							},
							"320x480": {
								"bg": "/assets/img/channels/third-step/phone-320x480.png",
								"width": 320,
								"height": 480,
								"top": 100,
								"left": 55,
								"landscape": false,
								"scale": 1
							}
						}
					}
				},
				"heatmap": {
					"defaults": {
						"zoom": {
							"National": 3,
							"City": 9,
							"GEO": 12,
							"State": 6
						},
						"mapCenter": {
							"National": {
								"lat": 39.828175,
								"lng": -98.5795
							}
						}
					},
					"filters": {
						"storeCategory": {
							"label": "Store Category",
							"tooltip": "Store Category",
							"options": [
								{
									"label": "Accounting",
									"value": "accounting"
								},
								{
									"label": "Airport",
									"value": "airport"
								},
								{
									"label": "Amusement park",
									"value": "amusement_park"
								},
								{
									"label": "Aquarium",
									"value": "aquarium"
								},
								{
									"label": "Art gallery",
									"value": "art_gallery"
								},
								{
									"label": "Atm",
									"value": "atm"
								},
								{
									"label": "Bakery",
									"value": "bakery"
								},
								{
									"label": "Bank",
									"value": "bank"
								},
								{
									"label": "Bar",
									"value": "bar"
								},
								{
									"label": "Beauty salon",
									"value": "beauty_salon"
								},
								{
									"label": "Bicycle store",
									"value": "bicycle_store"
								},
								{
									"label": "Book store",
									"value": "book_store"
								},
								{
									"label": "Bowling alley",
									"value": "bowling_alley"
								},
								{
									"label": "Bus station",
									"value": "bus_station"
								},
								{
									"label": "Cafe",
									"value": "cafe"
								},
								{
									"label": "Campground",
									"value": "campground"
								},
								{
									"label": "Car dealer",
									"value": "car_dealer"
								},
								{
									"label": "Car rental",
									"value": "car_rental"
								},
								{
									"label": "Car repair",
									"value": "car_repair"
								},
								{
									"label": "Car wash",
									"value": "car_wash"
								},
								{
									"label": "Casino",
									"value": "casino"
								},
								{
									"label": "Cemetery",
									"value": "cemetery"
								},
								{
									"label": "Church",
									"value": "church"
								},
								{
									"label": "City hall",
									"value": "city_hall"
								},
								{
									"label": "Clothing store",
									"value": "clothing_store"
								},
								{
									"label": "Convenience store",
									"value": "convenience_store"
								},
								{
									"label": "Courthouse",
									"value": "courthouse"
								},
								{
									"label": "Dentist",
									"value": "dentist"
								},
								{
									"label": "Department store",
									"value": "department_store"
								},
								{
									"label": "Doctor",
									"value": "doctor"
								},
								{
									"label": "Electrician",
									"value": "electrician"
								},
								{
									"label": "Electronics store",
									"value": "electronics_store"
								},
								{
									"label": "Embassy",
									"value": "embassy"
								},
								{
									"label": "Establishment",
									"value": "establishment"
								},
								{
									"label": "Finance",
									"value": "finance"
								},
								{
									"label": "Fire station",
									"value": "fire_station"
								},
								{
									"label": "Florist",
									"value": "florist"
								},
								{
									"label": "Food",
									"value": "food"
								},
								{
									"label": "Funeral home",
									"value": "funeral_home"
								},
								{
									"label": "Furniture store",
									"value": "furniture_store"
								},
								{
									"label": "Gas station",
									"value": "gas_station"
								},
								{
									"label": "General contractor",
									"value": "general_contractor"
								},
								{
									"label": "Grocery or supermarket",
									"value": "grocery_or_supermarket"
								},
								{
									"label": "Gym",
									"value": "gym"
								},
								{
									"label": "Hair care",
									"value": "hair_care"
								},
								{
									"label": "Hardware store",
									"value": "hardware_store"
								},
								{
									"label": "Health",
									"value": "health"
								},
								{
									"label": "Hindu temple",
									"value": "hindu_temple"
								},
								{
									"label": "Home goods store",
									"value": "home_goods_store"
								},
								{
									"label": "Hospital",
									"value": "hospital"
								},
								{
									"label": "Insurance agency",
									"value": "insurance_agency"
								},
								{
									"label": "Jewelry store",
									"value": "jewelry_store"
								},
								{
									"label": "Laundry",
									"value": "laundry"
								},
								{
									"label": "Lawyer",
									"value": "lawyer"
								},
								{
									"label": "Library",
									"value": "library"
								},
								{
									"label": "Liquor store",
									"value": "liquor_store"
								},
								{
									"label": "Local government office",
									"value": "local_government_office"
								},
								{
									"label": "Locksmith",
									"value": "locksmith"
								},
								{
									"label": "Lodging",
									"value": "lodging"
								},
								{
									"label": "Meal delivery",
									"value": "meal_delivery"
								},
								{
									"label": "Meal takeaway",
									"value": "meal_takeaway"
								},
								{
									"label": "Mosque",
									"value": "mosque"
								},
								{
									"label": "Movie rental",
									"value": "movie_rental"
								},
								{
									"label": "Movie theater",
									"value": "movie_theater"
								},
								{
									"label": "Moving company",
									"value": "moving_company"
								},
								{
									"label": "Museum",
									"value": "museum"
								},
								{
									"label": "Night club",
									"value": "night_club"
								},
								{
									"label": "Painter",
									"value": "painter"
								},
								{
									"label": "Park",
									"value": "park"
								},
								{
									"label": "Parking",
									"value": "parking"
								},
								{
									"label": "Pet store",
									"value": "pet_store"
								},
								{
									"label": "Pharmacy",
									"value": "pharmacy"
								},
								{
									"label": "Physiotherapist",
									"value": "physiotherapist"
								},
								{
									"label": "Place of worship",
									"value": "place_of_worship"
								},
								{
									"label": "Plumber",
									"value": "plumber"
								},
								{
									"label": "Police",
									"value": "police"
								},
								{
									"label": "Post office",
									"value": "post_office"
								},
								{
									"label": "Real estate agency",
									"value": "real_estate_agency"
								},
								{
									"label": "Restaurant",
									"value": "restaurant"
								},
								{
									"label": "Roofing contractor",
									"value": "roofing_contractor"
								},
								{
									"label": "Rv park",
									"value": "rv_park"
								},
								{
									"label": "School",
									"value": "school"
								},
								{
									"label": "Shoe store",
									"value": "shoe_store"
								},
								{
									"label": "Shopping mall",
									"value": "shopping_mall"
								},
								{
									"label": "Spa",
									"value": "spa"
								},
								{
									"label": "Stadium",
									"value": "stadium"
								},
								{
									"label": "Storage",
									"value": "storage"
								},
								{
									"label": "Store",
									"value": "store"
								},
								{
									"label": "Subway station",
									"value": "subway_station"
								},
								{
									"label": "Synagogue",
									"value": "synagogue"
								},
								{
									"label": "Taxi stand",
									"value": "taxi_stand"
								},
								{
									"label": "Train station",
									"value": "train_station"
								},
								{
									"label": "Travel agency",
									"value": "travel_agency"
								},
								{
									"label": "University",
									"value": "university"
								},
								{
									"label": "Veterinary care",
									"value": "veterinary_care"
								},
								{
									"label": "Zoo",
									"value": "zoo"
								},
								{
									"label": "Administrative area level 1",
									"value": "administrative_area_level_1"
								},
								{
									"label": "Administrative area level 2",
									"value": "administrative_area_level_2"
								},
								{
									"label": "Administrative area level 3",
									"value": "administrative_area_level_3"
								},
								{
									"label": "Administrative area level 4",
									"value": "administrative_area_level_4"
								},
								{
									"label": "Administrative area level 5",
									"value": "administrative_area_level_5"
								},
								{
									"label": "Colloquial area",
									"value": "colloquial_area"
								},
								{
									"label": "Country",
									"value": "country"
								},
								{
									"label": "Floor",
									"value": "floor"
								},
								{
									"label": "Geocode",
									"value": "geocode"
								},
								{
									"label": "Intersection",
									"value": "intersection"
								},
								{
									"label": "Locality",
									"value": "locality"
								},
								{
									"label": "Natural feature",
									"value": "natural_feature"
								},
								{
									"label": "Neighborhood",
									"value": "neighborhood"
								},
								{
									"label": "Political",
									"value": "political"
								},
								{
									"label": "Point of interest",
									"value": "point_of_interest"
								},
								{
									"label": "Post box",
									"value": "post_box"
								},
								{
									"label": "Postal code",
									"value": "postal_code"
								},
								{
									"label": "Postal code prefix",
									"value": "postal_code_prefix"
								},
								{
									"label": "Postal code suffix",
									"value": "postal_code_suffix"
								},
								{
									"label": "Postal town",
									"value": "postal_town"
								},
								{
									"label": "Premise",
									"value": "premise"
								},
								{
									"label": "Room",
									"value": "room"
								},
								{
									"label": "Route",
									"value": "route"
								},
								{
									"label": "Street address",
									"value": "street_address"
								},
								{
									"label": "Street number",
									"value": "street_number"
								},
								{
									"label": "Sublocality",
									"value": "sublocality"
								},
								{
									"label": "Sublocality level 4",
									"value": "sublocality_level_4"
								},
								{
									"label": "Sublocality level 5",
									"value": "sublocality_level_5"
								},
								{
									"label": "Sublocality level 3",
									"value": "sublocality_level_3"
								},
								{
									"label": "Sublocality level 2",
									"value": "sublocality_level_2"
								},
								{
									"label": "Sublocality level 1",
									"value": "sublocality_level_1"
								},
								{
									"label": "Subpremise",
									"value": "subpremise"
								},
								{
									"label": "Transit station",
									"value": "transit_station"
								}
							]
						},
						"datePurchase": {
							"label": "Date of Purchase",
							"tooltip": "Date of Purchase",
							"options": [
								{
									"label": "All Dates",
									"value": [],
									"default": true
								},
								{
									"label": "Week #1",
									"value": [
										"20120601",
										"20120602",
										"20120603"
									]
								},
								{
									"label": "Week #2",
									"value": [
										"20120604",
										"20120605",
										"20120606",
										"20120607",
										"20120608",
										"20120609",
										"20120610"
									]
								},
								{
									"label": "Week #3",
									"value": [
										"20120611",
										"20120612",
										"20120613",
										"20120614",
										"20120615",
										"20120616",
										"20120617"
									]
								},
								{
									"label": "Week #4",
									"value": [
										"20120618",
										"20120619",
										"20120620",
										"20120621",
										"20120622",
										"20120623",
										"20120624"
									]
								},
								{
									"label": "Week #5",
									"value": [
										"20120625",
										"20120626",
										"20120627",
										"20120628",
										"20120629",
										"20120630"
									]
								},
								{
									"label": "Week #1 (Working day)",
									"value": [
										"20120601"
									]
								},
								{
									"label": "Week #1 (Day Off)",
									"value": [
										"20120602",
										"20120603",
										"20120604"
									]
								},
								{
									"label": "Week #2 (Working day)",
									"value": [
										"20120605",
										"20120606",
										"20120607",
										"20120608"
									]
								},
								{
									"label": "Week #2 (Day Off)",
									"value": [
										"20120609",
										"20120610"
									]
								},
								{
									"label": "Week #3 (Working day)",
									"value": [
										"20120611",
										"20120612",
										"20120613",
										"20120614",
										"20120615"
									]
								},
								{
									"label": "Week #3 (Day Off)",
									"value": [
										"20120616",
										"20120617"
									]
								},
								{
									"label": "Week #4 (Working day)",
									"value": [
										"20120618",
										"20120619",
										"20120620",
										"20120621",
										"20120622"
									]
								},
								{
									"label": "Week #4 (Day Off)",
									"value": [
										"20120623",
										"20120624"
									]
								},
								{
									"label": "Week #5 (Working day)",
									"value": [
										"20120625",
										"20120626",
										"20120627",
										"20120628",
										"20120629"
									]
								},
								{
									"label": "Week #5 (Day Off)",
									"value": [
										"20120630"
									]
								},
								{
									"label": "Independence day",
									"value": [
										"20120604"
									]
								}
							]
						},
						"ranges": {
							"label": "How much are they spending?",
							"tooltip": "How much are they spending?",
							"options": [
								{
									"label": "0-5",
									"min": 0,
									"max": 5
								},
								{
									"label": "5-10",
									"min": 5,
									"max": 10
								},
								{
									"label": "10-25",
									"min": 10,
									"max": 25
								},
								{
									"label": "25-50",
									"min": 25,
									"max": 50
								},
								{
									"label": "50-100",
									"min": 50,
									"max": 100
								},
								{
									"label": "100-250",
									"min": 100,
									"max": 250
								},
								{
									"label": "250-500",
									"min": 250,
									"max": 500
								},
								{
									"label": "500-1000",
									"min": 500,
									"max": 1000
								},
								{
									"label": "1000+",
									"min": 1000,
									"max": 1100
								}
							]
						}
					}
				}
			},
			"facebook": {
				"transformers": {
					"facebookChannel": {
						"response": {
							"__copy": [
								"id",
								"name",
								"timeZone",
								"merchantId",
								"distributionChannel",
								"status",
								"totalBudget",
								"maxBid",
								"interests",
								"behaviors",
								"deviceCategory",
								"devices",
								"type"
							],
							"startDate": "startDate | amDateFormat: 'YYYY/MM/DD'",
							"endDate": "endDate | amDateFormat: 'YYYY/MM/DD'",
							"linkedAds": "linkedAds[0]",
							"linkedOffer": "linkedOffers[0]"
						},
						"request": {
							"__copy": [
								"id",
								"name",
								"geoActive",
								"timeZone",
								"merchantId",
								"linkedOffers",
								"budgetType",
								"totalBudget",
								"ageGroup",
								"gender",
								"interests",
								"behaviors",
								"deviceCategories",
								"devices",
								"type"
							],
							"startDate": "startDate | amDateFormat: 'YYYY-MM-DD'",
							"endDate": "endDate | amDateFormat: 'YYYY-MM-DD'",
							"geo": "undefined",
							"linkedAds": "linkedAds ? [linkedAds] : undefined",
							"status": "undefined"
						}
					}
				},
				"controllerName": "FacebookChannelController as vm",
				"entityName": "FacebookEntity",
				"templateUrl": "app/bundle/channelBundle/template/facebook/index.tpl.html",
				"view": {
					"image": "/assets/img/channels/mobile.png",
					"text": "Buy Facebook Ads"
				},
				"dialog": {
					"showClose": false,
					"onClose": {
						"confirm": "All unsaved data will be lost. Do you want to complete your campaign now?"
					}
				},
				"entity": {
					"defaults": {
						"type": "FACEBOOK",
						"devices": [],
						"deviceCategories": []
					}
				},
				"form": {
					"geo": {
						"label": "Location",
						"tooltip": "Use Location to narrow your target area. If most of your customers are local, then City or State targeting could be right for you. If your customers are all over, then Country might make more sense.",
						"options": [
							{
								"label": "My City",
								"value": "City"
							},
							{
								"label": "My State",
								"value": "State"
							},
							{
								"label": "My Country",
								"value": "Country",
								"default": true
							}
						]
					},
					"interests": {
						"label": "Interests",
						"tooltip": "It's going to be Anat-(wait for it)-olii!",
						"placeholder": "Outdoors"
					},
					"behaviors": {
						"label": "Behaviors",
						"tooltip": "Lock, Stock and 2 smoking Anatolii's",
						"placeholder": "Real Estate"
					},
					"ageGroup": {
						"label": "Age Group",
						"tooltip": "Anatolii. Just Anatolii. Don't ask",
						"options": [
							{
								"label": "18 - 24",
								"value": "18-24"
							},
							{
								"label": "25 - 34",
								"value": "25-34"
							},
							{
								"label": "35 - 44",
								"value": "35-44"
							},
							{
								"label": "45 - 54",
								"value": "45-54"
							},
							{
								"label": "55 - 64",
								"value": "55-64"
							},
							{
								"label": "64 -",
								"value": "64-"
							},
							{
								"label": "All Ages",
								"value": "ALL",
								"default": true
							}
						]
					},
					"gender": {
						"label": "Gender",
						"tooltip": "Anatolii again. Don't ask!",
						"options": [
							{
								"label": "Male",
								"value": "Male"
							},
							{
								"label": "Female",
								"value": "Female"
							},
							{
								"label": "Everyone",
								"value": "Everyone",
								"default": true
							}
						]
					},
					"budgetType": {
						"label": "Budget Type",
						"tooltip": "Fast and Anatolious",
						"options": [
							{
								"label": "Daily",
								"value": "Daily"
							},
							{
								"label": "Weekly",
								"value": "Weekly"
							},
							{
								"label": "Campaign",
								"value": "Campaign"
							}
						]
					},
					"totalBudget": {
						"label": "Budget",
						"tooltip": "Budget is where you specify how much you want to spend on this campaign. No budget is too big or small, but results will also vary. You can also specify how quickly you want to spend the amount you approve: per day, per week, or for the entire campaign."
					},
					"adTitle": {
						"label": "Ad Title",
						"tooltip": "Ad Title"
					},
					"adDesc": {
						"label": "Ad Description",
						"tooltip": "Ad Description"
					},
					"adType": {
						"label": "Ad Type",
						"tooltip": "Anatolie's of the Caribbean",
						"options": [
							{
								"label": "News Feed",
								"value": "feed"
							},
							{
								"label": "Right Side Ad",
								"value": "FACEBOOK",
								"default": true
							}
						]
					},
					"preview": {
						"options": {
							"feed": {
								"width": 560,
								"height": 292,
								"top": 192,
								"left": 111,
								"landscape": false,
								"label": "News Feed Ad",
								"scale": 0.325,
								"infoTop": 107,
								"infoLeft": 112,
								"background": "/assets/img/channels/fb-ad-prev.jpg"
							},
							"FACEBOOK": {
								"width": 254,
								"height": 133,
								"top": 127,
								"left": 92,
								"landscape": false,
								"label": "Right Side Ad",
								"scale": 1,
								"infoTop": 270,
								"infoLeft": 92,
								"background": "/assets/img/channels/fb-ad-right-prev.jpg"
							}
						}
					}
				}
			},
			"free": {
				"transformers": {
					"freeChannel": {
						"response": {
							"__copy": [
								"id",
								"name",
								"description",
								"timeZone",
								"merchantId",
								"redemptions",
								"status",
								"schedulings",
								"distributionListId",
								"distributionChannel"
							],
							"startDate": "startDate | amDateFormat: 'YYYY/MM/DD'",
							"endDate": "endDate | amDateFormat: 'YYYY/MM/DD'",
							"devices": "devices[0] || ''",
							"type": "type"
						},
						"request": {
							"__copy": [
								"id",
								"name",
								"description",
								"timeZone",
								"redemptions",
								"status",
								"schedulings",
								"distributionListId",
								"distributionChannel"
							],
							"startDate": "startDate | amDateFormat: 'YYYY-MM-DD'",
							"endDate": "endDate | amDateFormat: 'YYYY-MM-DD'",
							"merchantId": "'userService'| get_service_var: 'user_id'",
							"type": "type",
							"campaignType": "type"
						}
					}
				},
				"controllerName": "FreeChannelController as vm",
				"entityName": "FreeEntity",
				"templateUrl": "app/bundle/channelBundle/template/free/index.tpl.html",
				"view": {
					"image": "/assets/img/channels/free.png",
					"text": "Use Email Channel",
					"dialog": {
						"showClose": false,
						"onClose": {
							"confirm": "All unsaved data will be lost. Do you want to complete your campaign now?"
						}
					}
				},
				"entity": {
					"defaults": {
						"type": "FREE",
						"distributionChannel": "EMAIL",
						"campaignType": "FREE",
						"timeZone": "PST",
						"schedulings": [
							{
								"day": "MON",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "TUE",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "WED",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "THU",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "FRI",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "SAT",
								"startTime": "00:00",
								"endTime": "23:59"
							},
							{
								"day": "SUN",
								"startTime": "00:00",
								"endTime": "23:59"
							}
						]
					}
				}
			},
			"share": {
				"controllerName": "ShareChannelController as vm",
				"templateUrl": "app/bundle/channelBundle/template/share/index.tpl.html",
				"view": {
					"image": "/assets/img/channels/copy.png",
					"text": "I Send It"
				},
				"shareSchema": {
					"offer": {
						"facebook": {
							"offerId": "id",
							"name": "title",
							"picture": "imageUrl",
							"link": "shortUrl",
							"caption": "location.name",
							"description": "description",
							"message": "restrictions"
						},
						"twitter": {
							"text": "title",
							"picture": "imageUrl",
							"link": "shortUrl"
						},
						"sms": {
							"offerId": "id"
						},
						"email": {
							"offerId": "id"
						}
					}
				}
			}
		}
	},
	"ENTITY": {
		"offer": {
			"transformers": {
				"offerList": {
					"__copy": [
						"name",
						"title",
						"views",
						"viewDuration",
						"accepts",
						"shares",
						"redemptions",
						"revenue",
						"description",
						"uniquePageViews",
						"displays",
						"clicks",
						"impressions",
						"totalSales",
						"spend",
						"status",
						"shortUrl"
					],
					"id": "extId",
					"timeZone": "timeZone.timeZone || timeZone",
					"createdTime": "createdTime | amDateFormat: 'YYYY/MM/DD HH:mm:ssZ'",
					"startTime": "moment.tz(object.startTime, object.timeZone.timeZone || object.timeZone).format('YYYY/MM/DD')",
					"endTime": "moment.tz(object.endTime, object.timeZone.timeZone || object.timeZone).format('YYYY/MM/DD')",
					"channels": "campaigns || []"
				},
				"offerDetails": {
					"response": {
						"__prefix": "offer",
						"__copy": [
							"id",
							"name",
							"title",
							"timeRestrictions",
							"status",
							"timeRestrictions",
							"template",
							"offerRadius",
							"restrictions",
							"redemptionTarget",
							"promoType",
							"activeTimings",
							"companyName",
							"description",
							"extDiscountCode",
							"item",
							"line_items",
							"merchantId"
						],
						"discount": "discounts[0]",
						"shortUrl": "shortUrl || shortURL || siteUrl",
						"location": "locationIds[0]",
						"timeZone": "timeZone.timeZone || timeZone",
						"startTime": "offerStartDate || startTime | amDateFormat: 'YYYY/MM/DD'",
						"endTime": "offerEndDate || endTime | amDateFormat: 'YYYY/MM/DD'",
						"channels": "campaigns || []",
						"linkedOffer": "linkedOffers[0]"
					},
					"request": {
						"__copy": [
							"id",
							"name",
							"title",
							"timeZone",
							"timeRestrictions",
							"status",
							"timeRestrictions",
							"template",
							"shortUrl",
							"offerRadius",
							"restrictions",
							"redemptionTarget",
							"promoType",
							"activeTimings",
							"companyName",
							"description",
							"extDiscountCode",
							"item",
							"line_items",
							"merchantId"
						],
						"discounts": "[discount]",
						"locationIds": "[location.id]",
						"offerStartDate": "startTime | amDateFormat: 'YYYY-MM-DD'",
						"offerEndDate": "endTime | amDateFormat: 'YYYY-MM-DD'"
					}
				}
			},
			"defaults": {
				"timeZone": "US/Pacific",
				"status": "INCOMPLETE",
				"promoType": "OFFER",
				"activeTimings": [
					"ALLDAY"
				],
				"offerRadius": 5,
				"discount": {
					"discountType": "PERCENTAGE"
				},
				"extDiscountCode": "discode",
				"siteUrl": "http://www.pushpointmobile.com/",
				"template": "SPARKPAY_1",
				"timeRestrictions": [
					{
						"restrictionType": "WEEKLY",
						"frequency": 1,
						"weekDays": [
							"MONDAY",
							"TUESDAY",
							"WEDNESDAY",
							"THURSDAY",
							"FRIDAY",
							"SATURDAY",
							"SUNDAY"
						],
						"startTime": "12:00 AM",
						"endTime": "11:59 PM",
						"duration": "23:59"
					}
				]
			},
			"validators": {
				"merchantId": [
					{
						"name": "required",
						"rule": true
					}
				],
				"redemptionTarget": [
					{
						"name": "offer_redemption",
						"message": "Please enter a number for max redemptions on the offer"
					},
					{
						"name": "more",
						"rule": 0,
						"message": "Redemtion value must be more then 0"
					}
				],
				"companyName": [
					{
						"name": "required",
						"rule": true
					}
				],
				"title": [
					{
						"name": "required",
						"rule": true,
						"message": "Please enter a title for the offer"
					},
					{
						"name": "minlength",
						"rule": 3,
						"message": "Title must be more than 3 characters long"
					},
					{
						"name": "maxlength",
						"rule": 50,
						"message": "Title must be less than 50 characters long"
					}
				],
				"description": [
					{
						"name": "required",
						"rule": true,
						"message": "Please enter a description for the offer"
					},
					{
						"name": "maxlength",
						"rule": 200,
						"message": "Description must be less than 200 characters long"
					}
				],
				"name": [
					{
						"name": "required",
						"rule": true,
						"message": "Please enter a nickname for the offer"
					},
					{
						"name": "minlength",
						"rule": 3,
						"message": "Nickname must be more than 3 characters long"
					},
					{
						"name": "maxlength",
						"rule": 50,
						"message": "Nickname must be less than 50 characters long"
					}
				],
				"timeZone": [
					{
						"name": "required",
						"rule": true
					}
				],
				"discount": [
					{
						"name": "offer_discount",
						"messages": {
							"one": "asd"
						}
					}
				],
				"restrictions": [
					{
						"name": "maxlength",
						"rule": 300,
						"message": "Restrictions must be less than 300 characters long"
					}
				],
				"status": [
					{
						"name": "offer_status_map",
						"message": "Unable to change status",
						"map": {
							"incomplete": [
								"approve"
							],
							"approved": [],
							"pending": [
								"expire"
							],
							"rejected": [
								"expire",
								"pause"
							],
							"running": [
								"expire",
								"pause"
							],
							"paused": [
								"expire",
								"running"
							],
							"expired": [
								"archive"
							],
							"archived": []
						}
					}
				]
			},
			"autoRestrictionMessage": "* Only the first 5 offers are eligible so make sure you redeem yours right away. This QR code can only be used one time.",
			"status_default_flow": {
				"incomplete": "approve",
				"pending": "expire",
				"running": "expire",
				"paused": "expire",
				"expired": "archive"
			}
		}
	},
	"FAKEAPI": {
		"account_users_invite": {
			"url": "//faker.com/api/account/users/invite",
			"POST": {
				"not_full_mirror": {
					"state": "\"Invite Sent\""
				}
			}
		},
		"account_users": {
			"url": "//faker.com/api/account/users",
			"GET": {
				"count": 5,
				"schema": {
					"id": "faker.random.number(200)",
					"firstName": "faker.name.firstName()",
					"lastName": "faker.name.lastName()",
					"email": "faker.internet.email()",
					"type": "faker.random.array_element([\"Owner\", \"Mobile User\"])",
					"createDate": "faker.date.past(2)",
					"state": "faker.random.array_element([\"activated\", \"Invite Sent\", \"Invite Not Sent\"])",
					"status": "faker.random.array_element([\"active\", \"on hold\"])"
				}
			},
			"PUT": {
				"not_full_mirror": {
					"id": "faker.random.number(200)"
				}
			},
			"POST": {
				"full_mirror": true
			}
		},
		"account-plan": {
			"url": "//faker.com/api/account/plan",
			"GET": {
				"schema": {
					"title": "faker.random.array_element([\"pro\", \"go\"])",
					"startDate": "faker.date.recent(10)"
				}
			},
			"POST": {
				"not_full_mirror": {
					"startDate": "Date()"
				},
				"schema": {
					"title": "faker.random.array_element([\"pro\", \"go\"])",
					"startDate": "faker.date.recent(2)"
				}
			}
		},
		"account-pass-verify": {
			"url": "//faker.com/api/account/verifypass",
			"POST": {
				"schema": {
					"verify": "faker.random.array_element([true, false])"
				}
			}
		},
		"account-pass-update": {
			"url": "//faker.com/api/account/updatepass",
			"POST": {
				"schema": {
					"passLength": "faker.random.number(5) + 5"
				}
			}
		},
		"account-ques": {
			"url": "//faker.com/api/account/updateques",
			"POST": {
				"schema": {
					"secretQues": "faker.lorem.sentence()",
					"secretAnsLength": "faker.random.number(5) + 5"
				}
			}
		},
		"account": {
			"url": "//faker.com/api/account",
			"GET": {
				"schema": {
					"secretQues": "faker.lorem.sentence()",
					"secretAns": "\"*\".repeat(faker.random.number(5)+5)",
					"pass": "\"*\".repeat(faker.random.number(5)+5)",
					"personal": {
						"place": "faker.address.streetAddress()",
						"city": "faker.address.city()",
						"stateCode": "faker.address.stateAbbr()",
						"phone": "faker.phone.phoneNumber()",
						"email": "faker.internet.email()"
					},
					"business": {
						"place": "faker.address.streetAddress()",
						"city": "faker.address.city()",
						"stateCode": "faker.address.stateAbbr()",
						"zipCode": "faker.address.zipCode()",
						"phone": "faker.phone.phoneNumber()",
						"website": "faker.internet.domainName()",
						"logo": "faker.image.abstract(60,80)"
					},
					"emailPrefs": {
						"trans": "faker.random.array_element([true, false])",
						"deposit": "faker.random.array_element([true, false])"
					},
					"receiptSettings": {
						"showMap": "faker.random.array_element([true, false])",
						"showInfo": {
							"address": "faker.random.array_element([true, false])",
							"phone": "faker.random.array_element([true, false])",
							"website": "faker.random.array_element([true, false])"
						},
						"facebookLink": "faker.internet.domainName()",
						"yelpLink": "faker.internet.domainName()",
						"twitterLink": "faker.internet.domainName()",
						"foursquareLink": "faker.internet.domainName()"
					}
				}
			},
			"POST": {
				"full_mirror": true
			}
		}
	}
})

;