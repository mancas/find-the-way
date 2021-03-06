var Sanitize = {
    points: [],
    geocoder: null,
    wrongDirections: [],
    wrongDirectionsContainer: null,
    wrongDirectionsModalEnabled: false,
    chunk: 5,

    init: function() {
        this.geocoder = new google.maps.Geocoder();
        this.wrongDirectionsContainer = document.querySelector('#address-errors');
        this.getCSVFile();
    },

    addPoint: function(point) {
        this.points.push(point);
    },

    getCSVFile: function() {
        var forEach = Array.prototype.forEach;
        var self = this;
        SanitizeUI.openLoadingOverlay();

        var nextChunk = function(iteration) {
            var i = iteration;
            var end = (iteration + self.chunk) > self.points.length ?
                self.points.length : iteration + self.chunk;
                console.info(end);
            if (i == self.points.length) {
                SanitizeUI.closeLoadingOverlay();
                self.convertToCSV();
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
            console.info(address);
            // The error has been notified yet
            if (!address) {
                return;
            }

            self.geocoder.geocode({'address': address}, function(results, status) {
                console.info(results, status);
                if (status == google.maps.GeocoderStatus.OK && results[0].geometry.location_type != 'APPROXIMATE') {
                    element.latitude = results[0].geometry.location.lat();
                    element.longitude = results[0].geometry.location.lng();
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
        tr.dataset.index = element.orden;
        var tdAddress = document.createElement('td');
        var tdIndex = document.createElement('td');
        var tdAction = document.createElement('td');
        var btn = document.createElement('button');
        btn.textContent = 'Añadir marcador';
        btn.classList.add('btn');
        btn.classList.add('btn-no-margin');
        btn.classList.add('btn-small');
        tdAction.appendChild(btn);
        btn.addEventListener('click', function() {
            SanitizeMap.configureElement(element);
        }.bind(this));

        tdAddress.textContent = address;
        tdIndex.textContent = element.orden;

        tr.appendChild(tdAddress);
        tr.appendChild(tdIndex);
        tr.appendChild(tdAction);

        var tbody = this.wrongDirectionsContainer.querySelector('tbody');
        tbody.appendChild(tr);
    },

    removeWrongDirection: function(index) {
        var tr = document.querySelector('tr[data-index="' + index + '"]');
        if (tr) {
            var tbody = this.wrongDirectionsContainer.querySelector('tbody');
            tbody.removeChild(tr);
        }
    },

    convertToCSV: function() {
        var forEach = Array.prototype.forEach;
        if (this.points.length === 0) {
            return;
        }
        SanitizeUI.viewCSVBtn.disabled = true;

        var keys = Object.keys(this.points[0]);
        var header = '';
        for (var i = 0; i < keys.length; i++) {
            header += keys[i];
            if (i != keys.length - 1) {
                header += ';';
            }
        }
        SanitizeUI.addCSVLine(header);

        forEach.call(this.points, function(line) {
            var csvLine = '';
            for (var key in line) {
                var column = line[key];
                csvLine += column;
                if (keys.indexOf(key) != (keys.length - 1)) {
                    csvLine += ';';
                }
            }
            SanitizeUI.addCSVLine(csvLine);
        });

        SanitizeUI.viewCSVBtn.disabled = false;
    }
}
