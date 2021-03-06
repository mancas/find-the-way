var MapManager = Observable.init({
    points: [],
    map: null,
    home: null,
    geocoder: null,
    directionsService: null,
    directionsDisplay: null,
    isEditModeEnable: false,
    waypoints: [],
    waypointsLength: 0,
    markers: [],
    filter: null,
    filtersApplied: [],
    MAX_WAYPOINTS: 8,
    directionsSteps: null,
    wrongDirections: [],
    wrongDirectionsContainer: null,
    wrongDirectionsModalEnabled: false,
    chunk: 5,
    waypointsWarning: null,
    printButton: null,

    init: function() {
        this.directionsSteps = document.querySelector('#route-steps');
        this.printButton = document.querySelector('#route-steps #print-steps');
        this.wrongDirectionsContainer = document.querySelector('#address-errors');
        this.home = new google.maps.LatLng(37.407604, -5.94713);
        var mapOptions = {
            center: this.home,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var rendererOptions = {
            draggable: true,
            suppressMarkers: true
        };
        this.geocoder = new google.maps.Geocoder();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        this.directionsDisplay.setPanel(this.directionsSteps.querySelector('#step-list'));
        this.map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        this.setMarkers();
        this.directionsDisplay.setMap(this.map);
        UIManager.createFilters(this.filter);
        this._bindEventsToFilters();
        this._createHomeMarker();
        this.waypointsWarning = new WarningDialog({
            selector: '#waypoints-warning',
            position: 'center',
            draggable: true
        })
        this.printButton.addEventListener('click', this.printRoute.bind(this));
    },

    initFilter: function() {
        this.filter = new Filter();
    },

    addPoint: function(point) {
        this.points.push(point);
        this.addFilter(point);
    },

    addFilter: function(point) {
        var postalCodeFilter = {type: 'postal-code', value: parseInt(point.postal)};
        if (!this.filter.exists(postalCodeFilter)) {
            this.filter.addFilter(postalCodeFilter);
        }

        var activityFilter ={type: 'activity', value: point.actividad};
        if (!this.filter.exists(activityFilter)) {
            this.filter.addFilter(activityFilter);
        }
    },

    setMarkers: function() {
        var forEach = Array.prototype.forEach;
        var self = this;

        var addMarker = function(element) {
            // The filter is used to retrieve the icon
            var filter = self.filter.getFilterIfExists(element.actividad);
            if (element.latitude && element.longitude) {
                var marker = new google.maps.Marker({
                    map: self.map,
                    position: new google.maps.LatLng(element.latitude, element.longitude),
                    icon: filter.icon ? filter.icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });
                marker.ftw_point = element;
                self.markers.push(marker);
                // When the user click a marker the information will be displayed
                google.maps.event.addListener(marker, 'click', function() {
                    self.setMarkerInformation(marker);
                });
            } else {
                var address = self._generateAddress(element);
                if (!address) {
                    return;
                }

                self.geocoder.geocode({'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            map: self.map,
                            position: results[0].geometry.location,
                            icon: filter.icon ? filter.icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        });
                        marker.ftw_point = element;
                        self.markers.push(marker);
                        // When the user click a marker the information will be displayed
                        google.maps.event.addListener(marker, 'click', function() {
                            self.setMarkerInformation(marker);
                        });
                    } else {
                        console.warn('Revisar dirección: ' + element.orden + ' ' + status);
                        self.wrongDirections.push(element);
                        self.addWrongDirection(element, address);
                    }
                });
            }
        };

        forEach.call(self.points, function(element) {
            addMarker(element);
        });
    },

    _generateAddress: function(element) {
        var address = element.direccion;
        var postalCode = element.postal;
        var population = element.poblacion;
        var township = element.municipio;
        var province = element.provincia;
        var country = 'España';
        var computedAddress = address;
        console.info(element);
        if (population.length > 0) {
            computedAddress += ', ' + population;
        }

        if (postalCode.length > 0) {
            computedAddress += ', ' + postalCode;
        }

        if (township.length > 0) {
            computedAddress += ', ' + township;
        }

        if (computedAddress.length == 0) {
            return;
        }

        computedAddress += ', ' + country;

        if (address.length == 0) {
            this.wrongDirections.push(element);
            this.addWrongDirection(element, computedAddress);
            return;
        }

        return computedAddress;
    },

    addWrongDirection: function(element, address) {
        if (!this.wrongDirectionsModalEnabled) {
            this.wrongDirectionsModalEnabled = true;
            Modal.openModal(this.wrongDirectionsContainer, document.body, 'center');
        }

        var tr = document.createElement('tr');
        var tdAddress = document.createElement('td');
        var tdIndex = document.createElement('td');
        tdAddress.textContent = address;
        tdIndex.textContent = element.orden;

        tr.appendChild(tdAddress);
        tr.appendChild(tdIndex);

        var tbody = this.wrongDirectionsContainer.querySelector('tbody');
        tbody.appendChild(tr);
    },

    _createHomeMarker: function() {
        var image = {
            url: 'rs_home_marker.png',
            size: new google.maps.Size(40, 31),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 31)
        };
        new google.maps.Marker({
            map: this.map,
            position: this.home,
            icon: image
        });
    },

    toggleEditMode: function() {
        this.isEditModeEnable = !this.isEditModeEnable;
        if (!this.isEditModeEnable) {
            this._restoreEventsMarkers();
        } else {
            this._bindEventsMarkers();
        }
    },

    findTheWay: function() {
      if (!this.isEditModeEnable) {
          this.toggleEditMode();
          this.waypoints = [];
          this.waypointsLength = 0;
      }
    },

    _bindEventsMarkers: function() {
        var forEach = Array.prototype.forEach;
        forEach.call(this.markers, function(marker) {
            google.maps.event.addListener(marker, 'click', function() {
                this.toggleBounce(marker);
            }.bind(this));
        }.bind(this));
    },

    _restoreEventsMarkers: function() {
        var forEach = Array.prototype.forEach;
        forEach.call(this.markers, function(marker) {
            marker.setAnimation(null);
            google.maps.event.clearListeners(marker, 'click');
            // Restore the previous behavior
            google.maps.event.addListener(marker, 'click', function() {
                this.setMarkerInformation(marker);
            }.bind(this));
        }.bind(this));
    },

    toggleBounce: function(marker) {
      if (marker.getAnimation() != null) {
          marker.setAnimation(null);
          var indexToRemove = this.waypoints.indexOf(marker);
          if (indexToRemove != -1) {
              this.waypoints.splice(indexToRemove, 1);
              this.waypointsLength = this.waypoints.length;
          }
      } else {
          if ((this.waypoints.length + 1) <= this.MAX_WAYPOINTS) {
              marker.setAnimation(google.maps.Animation.BOUNCE);
              this.waypoints.push(marker);
              this.waypointsLength = this.waypoints.length;
          } else {
              if (!this.waypointsWarning.visible)
                this.waypointsWarning.show();
          }
      }
    },

    getWaypoints: function() {
        return this.waypoints;
    },

    generateRoute: function() {
        var waypts = [];
        var forEach = Array.prototype.forEach;
        forEach.call(this.waypoints, function(waypoint) {
           waypts.push({
               location: waypoint.position,
               stopover: true
           });
        });
        var request = {
            origin: this.home,
            destination: this.home,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
                this.directionsSteps.dataset.visible = true;
                this.exitFindTheWayMode();
                //Observe does not work here
                if (Tutorial.isRunning) {
                    Tutorial.handleStep();
                }
            }
        }.bind(this));
    },

    exitFindTheWayMode: function() {
        this.toggleEditMode();
    },

    clearRoute: function() {
        this.directionsSteps.dataset.visible = false;
        setTimeout(function() {
            this.directionsDisplay.setDirections({routes: [], status: "OK", mc: []});
        }.bind(this), 300)
    },

    _bindEventsToFilters: function() {
        var forEach = Array.prototype.forEach;
        var filters = UIManager.filtersContainer.querySelectorAll('input');

        forEach.call(filters, function(filter) {
            filter.addEventListener('change', this.applyFilters.bind(this));
        }.bind(this));
    },

    applyFilters: function(evt) {
        var checkbox = evt.target;

        this.filter.toggleFilter(checkbox.value);
        this.filter.applyFilters(this.markers);
    },

    setMarkerInformation: function(marker) {
        // Escape if we are in the edit mode
        if (this.isEditModeEnable) {
            return;
        }

        var point = marker.ftw_point;
        UIManager.cleanMarkerInformation();

        for (var key in point) {
            UIManager.addItemToMarkerInformation(key, point[key]);
        }

        UIManager.openInformationModal();
    },

    printRoute: function() {
        var html = this.directionsSteps.querySelector('#step-list').innerHTML;
        var css = document.head.querySelector('style').innerHTML;
        var popup_win = "toolbar=yes,location=no,directories=yes,menubar=yes,scrollbars=yes,width=600,height=600,left=100,top=100";
        var print_form = window.open('','',popup_win);
        print_form.document.open();
        html = '<html><head><style type="text/css">' + css +'</style><title>Print Preview</title></head><body>' + html + '</body></html>';
        print_form.document.write(html);
        print_form.document.close();
        print_form.print();
    }
});