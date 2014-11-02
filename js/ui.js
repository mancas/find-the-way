var UIManager = {
    inputs: null,
    fakeInput: null,
    fileInput: null,
    uploadBtn: null,
    form: null,
    menu: null,
    sidebar: null,
    help: null,
    HELP_WAYPOINTS: 'Haz click en los marcadores para añadirlos como waypoints. Cuando hayas acabado haz click en \'Calcular ruta\'',
    HELP_ROUTE: 'Recuerda que puedes arrastrar la ruta para ajustarla a tus necesidades. Puedes borrar la ruta haciendo click en \'Borrar ruta\'',
    exitFindTheWayModeHandler: null,
    filters: null,
    filtersContainer: null,

    init: function() {
        this.inputs = document.querySelectorAll('input');
        this.fakeInput = document.querySelector('#fake-file');
        this.fileInput = document.querySelector('input[name="csv-file"]');
        this.uploadBtn = document.querySelector('.upload');
        this.form = document.querySelector('#file-form');
        this.menu = document.querySelector('.icon-hamburger');
        this.sidebar = document.querySelector('.sidebar');
        this.help = document.querySelector('#app-header .help');
        this.filters = document.querySelector('#filters');
        this.filtersContainer = document.querySelector('#filters ul.filters-container');
        this.exitFindTheWayModeHandler = this.exitFindTheWayModeListener.bind(this);
        this._setPlaceholders();
        this.bindEvents();
    },

    _setPlaceholders: function() {
        var forEach = Array.prototype.forEach;
        forEach.call(this.inputs, function(element) {
            var placeholder = element.dataset.placeholder;
            element.setAttribute('value', placeholder);
        });
    },

    bindEvents: function() {
        var self = this;
        var openDialog = function() {
            self._openSelectFileDialog();
        };

        var submitForm = function() {
            self._submitForm();
        };

        this.fakeInput.addEventListener('click', openDialog);

        this.uploadBtn.addEventListener('click', openDialog);

        this.fileInput.addEventListener('change', function(evt) {
            var file = evt.target.value;

            if (file.length == 0) {
                console.info(file);
                this.fakeInput.setAttribute('value', this.fakeInput.dataset.placeholder);
                this.uploadBtn.addEventListener('click', openDialog);
                this.uploadBtn.removeEventListener('click', submitForm);
                return;
            }

            this.fakeInput.setAttribute('value', file);

            this.uploadBtn.removeEventListener('click', openDialog);
            this.uploadBtn.addEventListener('click', submitForm);
        }.bind(this));

        this.bindMenuEvents();
    },

    bindMenuEvents: function() {
        var self = this;
        var forEach = Array.prototype.forEach;
        var actions = this.sidebar.querySelectorAll('a');
        this.menu.addEventListener('mouseover', function() {
            self.sidebar.classList.remove('out');
            self.sidebar.classList.add('in');
        });

        this.menu.addEventListener('mouseout', function() {
            self.sidebar.classList.remove('in');
            self.sidebar.classList.add('out');
        });

        this.sidebar.addEventListener('mouseover', function() {
            self.sidebar.classList.remove('out');
            self.sidebar.classList.add('in');
        });

        this.sidebar.addEventListener('mouseout', function() {
            self.sidebar.classList.remove('in');
            self.sidebar.classList.add('out');
        });

        forEach.call(actions, function(element) {
            element.addEventListener('click', function(evt) {
                evt.preventDefault();
                var action = evt.target.dataset.action;
                self.executeAction(action);
            });
        });
    },

    _openSelectFileDialog: function() {
        this.fileInput.click();
    },

    _submitForm: function() {
        this.form.submit();
    },

    executeAction: function(action) {
        switch (action) {
            case 'find-the-way':
                this.configureHelp();
                MapManager.findTheWay();
                if (Tutorial.isRunning && Tutorial.currentStep == 2) {
                    Tutorial.handleStep();
                }
                break;
            case 'filters':
                this.toggleFilters();
                break;
            case 'go-back':
                window.location.href = window.location.href;
                break;
        }
    },

    exitFindTheWayModeListener: function(value) {
        if (!value) {
          this.clearHelp();
          var directions = MapManager.directionsDisplay.getDirections();
          if(directions && directions.routes.length != 0) {
            var p = document.createElement('p');
            p.textContent = this.HELP_ROUTE;
            this.help.appendChild(p);
            var button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-small');
            button.id = 'clear-route';
            button.textContent = 'Borrar ruta';
            this.help.appendChild(button);
            button.addEventListener('click', function() {
                MapManager.clearRoute();
                this.clearHelp();
            }.bind(this, MapManager));
          }
        }
    },

    configureHelp: function() {
        //Clear help
        this.clearHelp();
        var p = document.createElement('p');
        p.textContent = this.HELP_WAYPOINTS;
        this.help.appendChild(p);
        var button = document.createElement('button');
        button.id = 'generate-route';
        button.classList.add('btn');
        button.classList.add('btn-small');
        button.textContent = 'Calcular ruta';
        button.disabled = true;
        this.help.appendChild(button);
        button.addEventListener('click', MapManager.generateRoute.bind(MapManager));
        var cancelButton = document.createElement('button');
        cancelButton.classList.add('btn');
        cancelButton.classList.add('btn-small');
        cancelButton.textContent = 'Cancelar';
        this.help.appendChild(cancelButton);
        if (Tutorial.isRunning) {
            cancelButton.disabled = true;
        }
        cancelButton.addEventListener('click', MapManager.exitFindTheWayMode.bind(MapManager));
        MapManager.observe('waypointsLength', function(value) {
            console.info(value);
            if (value > 0) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });
        MapManager.observe('isEditModeEnable', this.exitFindTheWayModeHandler);
    },

    clearHelp: function() {
        this.help.innerHTML = '';
        MapManager.unobserve('isEditModeEnable', this.exitFindTheWayModeHandler);
    },

    createFilters: function(filterObject) {
        var forEach = Array.prototype.forEach;
        var postalCodeFilters = filterObject.getFiltersByType('postal-code');
        var activityFilters = filterObject.getFiltersByType('activity');

        forEach.call(postalCodeFilters, function(filter) {
            var item = this.createFilterListItem(filter, 'postal-code');
            this.filtersContainer.appendChild(item);
        }.bind(this));

        forEach.call(activityFilters, function(filter) {
            var item = this.createFilterListItem(filter, 'activity');
            this.filtersContainer.appendChild(item);
        }.bind(this));

        new Draggable(this.filters);
    },

    createFilterListItem: function(filter, type) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = filter.value;
        checkbox.name = 'filter_' + filter.value;
        checkbox.id = 'filter_' + filter.value;

        var label = document.createElement('label');
        label.textContent = filter.value;
        label.classList.add('filter');
        label.setAttribute('for', 'filter_' + filter.value);

        switch (type) {
            case 'activity':
                var legend = document.createElement('img');
                legend.src = filter.icon;
                legend.classList.add('icon');
                label.appendChild(legend);
                break;
        }

        var listItem = document.createElement('li');
        listItem.appendChild(checkbox);
        listItem.appendChild(label);

        return listItem;
    },

    toggleFilters: function() {
        if (this.filters.dataset.visible == 'true') {
            this.filters.dataset.visible = false;
        } else {
            Modal.openModal(this.filters, document.body, 'custom', 40, 60);
        }
    }
};