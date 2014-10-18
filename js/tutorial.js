var Tutorial = {
    steps: {
        0 : {
            hash: '#step0',
            position: 'center',
            element: 'body'
        },
        1 : {
            hash: '#step1',
            position: 'right',
            element: '.icon-hamburger',
            paginator: true
        },
        2 : {
            hash: '#step2',
            element: '#app-header .help',
            paginator: true
        },
        3 : {
            hash: '#step3',
            element: '#app-header .help button#generate-route',
            paginator: true
        },
        4 : {
            hash: '#step4',
            element: '#route-steps',
            paginator: true
        },
        5: {
            hash: '#final-step',
            position: 'center',
            element: 'body'
        }
    },
    panel: null,
    paginator: null,
    currentStep: 0,
    menu: null,
    sidebar: null,
    takeATourBtn: null,
    currentTop: null,
    currentLeft: null,
    isRunning: false,
    handleObserveListener: null,
    handleStepListener: null,
    moveToLeftHandler: null,
    moveToRightHandler: null,
    TUTORIAL_WAYPOINTS: 1,
    TUTORIAL_KEY: 'ls_tutorial',

    _init: function() {
        this.panel = document.querySelector('#tutorial');
        this.menu = document.querySelector('.icon-hamburger');
        this.sidebar = document.getElementById('app-sidebar');
        this.takeATourBtn = document.querySelector('#take-a-tour');
        this.paginator = this.panel.querySelector('.dialog-paginator');
        this.handleObserveListener = this.handleObserve.bind(this);
        this.moveToLeftHandler = this._moveFirstStepLeft.bind(this);
        this.moveToRightHandler = this._moveFirstStepRight.bind(this);
        this.handleStepListener = this.handleStep.bind(this);
        this._bindEventsToPaginator();
        this._bindDismissEvents();
        this.handleStep();
    },

    startTutorialIfNeeded: function() {
        //Check local storage
        if (typeof(Storage) !== 'undefined') {
            var tutorial = localStorage.getItem(this.TUTORIAL_KEY);
            if (!tutorial || tutorial !== 'true') {
                this._init();
            }
        } else {
            this._init();
        }
    },

    _bindEventToTakeATourBtn: function() {
        this.takeATourBtn.addEventListener('click', function() {
            this.isRunning = true;
            this.handleStep();
        }.bind(this));
    },

    _bindEventsToPaginator: function() {
        var forEach = Array.prototype.forEach;
        var links = this.paginator.querySelectorAll('a');
        forEach.call(links, function(link) {
           link.addEventListener('click', function(evt) {
               evt.preventDefault();
           });
        });
    },

    _bindDismissEvents: function() {
        var dismissBtn = this.panel.querySelector('.modal-dialog-dismiss');
        dismissBtn.addEventListener('click', function(evt) {
            evt.preventDefault();
            this._closeTutorial();
        }.bind(this));
    },

    handleStep: function() {
        this.updateCurrentStep();
        switch (this.currentStep) {
            case 0:
                this.panel.dataset.visible = true;
                this._bindEventToTakeATourBtn();
                break;
            case 1:
                this._bindEventsToFirstStep();
                break;
            case 2:
                this._unbindEventsToFirstStep();
                MapManager.observe('waypointsLength', this.handleObserveListener);
                break;
            case 3:
                MapManager.unobserve('waypointsLength', this.handleObserveListener);
                break;
            case 4:
                this._bindEventsToClearBtn();
                break;
            case 5: 
                localStorage.setItem(this.TUTORIAL_KEY, true);
                this.isRunning = false;
                break;
        }
        this.openModal(this.steps[this.currentStep]);
        this.currentStep++;
    },

    handleObserve: function(value) {
        if (value >= this.TUTORIAL_WAYPOINTS) {
            this.handleStep();
        }
    },

    openModal: function(step) {
        var relativeElement = document.querySelector(step.element);
        var position = 'auto';

        if (step.position) {
            position = step.position;
        }

        Modal.openModal(this.panel, relativeElement, position);
        this.currentLeft = this.panel.style.left;
        this.currentTop = this.panel.style.top;
    },

    _moveFirstStepRight: function() {
        var sidebarWidth = window.getComputedStyle(this.sidebar, null).getPropertyValue('width');
        var menuHeight = window.getComputedStyle(this.menu, null).getPropertyValue('height');
        this.panel.style.left = parseInt(sidebarWidth) + Modal.caretOffset + 'px';
        this.panel.style.top = parseInt(menuHeight) + Modal.verticalOffset + 'px';
    },

    _moveFirstStepLeft: function() {
        this.panel.style.left = this.currentLeft;
        this.panel.style.top = this.currentTop;
    },

    _bindEventsToFirstStep: function() {
        var self = this;
        this.menu.addEventListener('mouseover', this.moveToRightHandler);

        this.menu.addEventListener('mouseout', this.moveToLeftHandler);

        this.sidebar.addEventListener('mouseover', this.moveToRightHandler);

        this.sidebar.addEventListener('mouseout', this.moveToLeftHandler);
    },

    _unbindEventsToFirstStep: function() {
        var self = this;
        this.menu.removeEventListener('mouseover', this.moveToRightHandler);

        this.menu.removeEventListener('mouseout', this.moveToLeftHandler);

        this.sidebar.removeEventListener('mouseover', this.moveToRightHandler);

        this.sidebar.removeEventListener('mouseout', this.moveToLeftHandler);
    },

    _bindEventsToClearBtn: function() {
        var btn = document.querySelector('button#clear-route');
        btn.addEventListener('click', this.handleStepListener);
    },

    _unbindEventsToClearBtnIfNeeded: function() {
        var btn = document.querySelector('button#clear-route');
        if (btn)
            btn.removeEventListener('click', this.handleStepListener);
    },

    updateCurrentStep: function() {
        var step = this.steps[this.currentStep];
        var stepElement = document.querySelector(step.hash);
        var currentModal = document.querySelector('div[data-current="true"]');
        var currentPage = this.paginator.querySelector('a.active');
        var stepPage = this.paginator.querySelector('a[data-page="' + this.currentStep + '"]');
        if (currentModal) {
            currentModal.dataset.current = false;
        }

        if (currentPage) {
            currentPage.classList.remove('active');
        }

        if (step.paginator) {
            this.paginator.querySelector('ul').dataset.visible = true;
        } else {
            this.paginator.querySelector('ul').dataset.visible = false;
        }

        stepElement.dataset.current = true;
        if(stepPage)
            stepPage.classList.add('active');
    },

    _closeTutorial: function() {
        //We need to clear or event listeners
        this._unbindEventsToFirstStep();
        MapManager.unobserve('waypointsLength', this.handleObserveListener);
        this._unbindEventsToClearBtnIfNeeded();
        this.isRunning = false;
    }
};
