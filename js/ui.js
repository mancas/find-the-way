var UIManager = {
    inputs: null,
    fakeInput: null,
    fileInput: null,
    uploadBtn: null,
    form: null,
    menu: null,
    sidebar: null,
    help: null,
    HELP_WAYPOINTS: 'Click on the markers to add them as waypoints. When you have finished, click in \'Calculate route\'',
    HELP_ROUTE: 'Remember that you can drag the route to fit your necessities. You can clear the route by clicking in \'Clear route\'',
    exitFindTheWayModeHandler: null,

    init: function() {
        this.inputs = document.querySelectorAll('input');
        this.fakeInput = document.querySelector('#fake-file');
        this.fileInput = document.querySelector('input[name="csv-file"]');
        this.uploadBtn = document.querySelector('.upload');
        this.form = document.querySelector('#file-form');
        this.menu = document.querySelector('.icon-hamburger');
        this.sidebar = document.querySelector('.sidebar');
        this.help = document.querySelector('#app-header .help');
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
            button.textContent = 'Clear route';
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
        button.textContent = 'Calculate route';
        button.disabled = true;
        this.help.appendChild(button);
        button.addEventListener('click', MapManager.generateRoute.bind(MapManager));
        var cancelButton = document.createElement('button');
        cancelButton.classList.add('btn');
        cancelButton.classList.add('btn-small');
        cancelButton.textContent = 'Cancel';
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
    }
};