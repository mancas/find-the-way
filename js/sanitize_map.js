var SanitizeMap = {
    map: null,
    currentElement: null,
    marker: null,
    handlerClickEvent: null,
    helpMessageElement: null,
    container: null,

    init: function() {
        var mapCenter = new google.maps.LatLng(37.407604, -5.94713);
        var mapOptions = {
            center: mapCenter,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var rendererOptions = {
            draggable: true,
            suppressMarkers: true
        };
        this.map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        this.handlerClickEvent = this.addMarker.bind(this);
        this.addEventListener();

        this.helpMessageElement = document.querySelector('#app-body .help');
        this.container = document.querySelector('#app-body');
    },

    addEventListener: function() {
        if (!this.map) {
            return;
        }

        google.maps.event.addListener(this.map, 'click', this.handlerClickEvent);
    },

    addMarker: function(evt) {
        this.marker = new google.maps.Marker({
            position: evt.latLng,
            map: this.map,
            draggable: true
        });
    },

    configureElement: function(element) {
        this.currentElement = element;
        this.createHelpMessage();
        this.openMap();
    },

    createHelpMessage: function() {
        var span = document.createElement('span');
        span.textContent = Sanitize._generateAddress(this.currentElement);

        var btn = document.createElement('button');
        btn.textContent = 'OK';
        btn.classList.add('btn');
        btn.classList.add('btn-small');
        btn.addEventListener('click', function saveAndClose() {
            var position = this.marker.getPosition();
            this.currentElement.latitude = position.lat();
            this.currentElement.longitude = position.lng();
            this.marker.setMap(null);
            this.closeMap();
        }.bind(this));

        this.helpMessageElement.appendChild(span);
        this.helpMessageElement.appendChild(btn);
    },

    closeMap: function() {
        this.container.dataset.visible = false;
        this.helpMessageElement.innerHTML = ''
        Sanitize.removeWrongDirection(this.currentElement.orden);
        SanitizeUI.clearCSV();
        Sanitize.convertToCSV();
    },

    openMap: function(element) {
        this.container.dataset.visible = true;
    }
};