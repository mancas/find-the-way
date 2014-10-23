var Sanitize = {
    points: [],
    geocoder: null,
    wrongDirections: [],
    wrongDirectionsContainer: null,
    wrongDirectionsModalEnabled: false,
    chunk: 5,
    loadingOverlay: null,
    CSVContainer: null,

    init: function() {
        this.geocoder = new google.maps.Geocoder();
        this.wrongDirectionsContainer = document.querySelector('#address-errors');
    },

    addPoint: function(point) {
        this.points.push(point);
    },

    getCSVFile: function() {
        var forEach = Array.prototype.forEach;
        var self = this;
        this.loadingOverlay.dataset.visible = true;

        var nextChunk = function(iteration) {
            var i = iteration;
            var end = (iteration + self.chunk) > self.points.length ?
                self.points.length : iteration + self.chunk;
                console.info(end);
            if (i == self.points.length) {
                this.loadingOverlay.dataset.visible = false;
                this.CSVContainer.dataset.visible = true;
                return;
            }

            for (i; i < end; i++) {
                addLine(self.points[i]);
            }

            setTimeout(function() {
                nextChunk(i);
            }, 5000);
        }.bind(this);

        var addLine = function(element) {
            // This element doesn't need to be sanitized
            if (element.latitude && element.longitude) {
                return;
            }

            var address = self._generateAddress(element);
            // The error has been notified yet
            if (!address) {
                return;
            }

            self.geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    element.latitude = results[0].geometry.location.latitude;
                    element.longitude = results[0].geometry.location.longitude;
                } else {
                    console.warn('Revisar dirección: ' + element.orden + ' ' + status);
                    self.wrongDirections.push(element);
                    self.addWrongDirection(element, address);
                }
            });
        };

        nextChunk(0);
    },

    _generateAddress: function(element) {
        var address = element.direccion;
        var postalCode = element.postal;
        var population = element.poblacion;
        var township = element.municipio;
        var province = element.provincia;
        var country = 'España';
        var computedAddress = address;

        if (population.length > 0) {
            computedAddress += ', ' + population;
        }

        if (postalCode.length > 0) {
            computedAddress += ', ' + postalCode;
        }

        if (township.length > 0) {
            computedAddress += ', ' + township;
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
}