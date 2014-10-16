<?php
if (count($_FILES) > 0) {
    $allowedExts = array('csv', 'CSV');
    $temp = explode('.', $_FILES['csv-file']['name']);
    $extension = end($temp);

    if (in_array($extension, $allowedExts)) {
        if ($_FILES['csv-file']['error'] > 0) {
            $error = $_FILES['csv-file']['error'];
        } else {
            //echo 'Upload: ' . $_FILES['csv-file']['name'] . '<br>';
            //echo 'Type: ' . $_FILES['csv-file']['type'] . '<br>';
            //echo 'Size: ' . ($_FILES['csv-file']['size'] / 1024) . ' kB<br>';
            //echo 'Stored in: ' . $_FILES['csv-file']['tmp_name'] . '<br>';
            $filename = $_FILES['csv-file']['tmp_name'];
        }
    } else {
        $error = true;
    }
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Find the way</title>
    <link rel="stylesheet" href="custom.css">
</head>
<body>
    <div id="content"<?php if(isset($filename)) { ?> class="hidden" <?php } ?> class="">
        <div class="wrapper">
            <div class="logo">
                <img src="logo.png" class="img-responsive">
            </div>
            <div class="form">
                <form id="file-form" method="post" action="<?php $_SERVER['PHP_SELF'] ?>" enctype="multipart/form-data">
                    <div class="row-form">
                        <div class="addon">
                            <input type="text" id="fake-file" data-placeholder="Choose file">
                            <span class="group-addon clickable upload">
                                Upload
                            </span>
                        </div>
                        <input type="file" name="csv-file" class="hidden">
                    </div>
                    <span class="field-help">Upload your CSV file with the data you want to be displayed in the map.</span>
                    <?php
                        if ($error) {
                    ?>
                        <div class="alert-error">
                            <?php if(error == true) { ?>
                            The file you uploaded is wrong or maybe it isn't a CSV file.
                            <?php } else {
                                echo $error; }
                            ?>
                        </div>
                    <?php
                        }
                    ?>
                </form>
            </div>
        </div>
    </div>

    <div id="app-body" data-visible="<?php if(isset($filename)) { ?>true<?php } else { ?>false<?php } ?>">
        <div id="app-header">
            <div class="icon-hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <div class="help">
            </div>
            <nav id="app-sidebar" class="sidebar z-max out">
                <ul>
                    <li>
                        <a href="find-the-way" data-action="find-the-way">
                            Find my way
                        </a>
                    </li>
                    <li>
                        <a href="go-back" data-action="go-back">
                            Go back
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div id="map">
        </div>
    </div>

    <div id="tutorial" class="modal-dialog" data-visible="false">
        <div data-visible="false" class="caret-shadow caret-shadow-top"></div>
        <div data-visible="false" class="caret caret-top"></div>

        <div class="dismiss-container">
            <a class="modal-dialog-dismiss" href="">&times;</a>
        </div>
        <!-- STEP 0 -->
        <div id="step0" class="modal-content" data-current="false">
            <div class="dialog-content text-center">
                <img class="tutorial-logo" src="logo.png">
                <p class="tutorial-title">
                    Welcome to Find the Way!
                </p>

                <br>

                <p>
                    Would you like to take a tour around the application?
                </p>

                <span class="btn" id="take-a-tour">Take a tour</span>
            </div>
        </div>

        <!-- STEP 1 -->
        <div id="step1" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-blue">
                    <div class="icon-hamburger">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </div>
                <span class="step-title">Menu bar</span>
            </div>
            <div class="dialog-content">
                <p>
                    This is the menu bar. If you hover it you will see all the tasks you can do with just one click.
                </p>

                <br>

                <p>
                    <b>Next step:</b> Try clicking in "Find the way" now.
                </p>
            </div>
        </div>

        <!-- STEP 2 -->
        <div id="step2" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-red">
                    <span class="icon">?</span>
                </div>
                <span class="step-title">Instructions</span>
            </div>
            <div class="dialog-content">
                <p>
                    Here you could find the instruction to generate your route and some advices.
                </p>

                <br>

                <p>
                    Notice that your home point is set in Rentasoft S.A. so the route will starts and finish in that point.
                </p>

                <br>

                <p>
                    <b>Next step:</b> Follow the instructions to add a waypoint to the route.
                </p>
            </div>
        </div>

        <!-- STEP 3 -->
        <div id="step3" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-yellow">
                    <span class="icon light">&#10004;</span>
                </div>
                <span class="step-title">Calculate route</span>
            </div>
            <div class="dialog-content">
                <p>
                    Now click in this button to generate the optimized route for your waypoints.
                </p>

                <br>

                <p>
                    Notice that your home point is set in Rentasoft S.A. so the route will starts and finish in that point.
                </p>

                <br>

                <p>
                    <b>Next step:</b> Click the button to calculate the optimized route for your waypoints.
                </p>
            </div>
        </div>

        <!-- STEP 4 -->
        <div id="step4" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-green">
                    <span class="icon light">&#10004;</span>
                </div>
                <span class="step-title">Additional information</span>
            </div>
            <div class="dialog-content">
                <p>
                    Here you have the directions steps you need to follow to complete your route.
                </p>

                <br>

                <p>
                    Remember that you can drag the route to fit your necessities, so if you do it, the directions steps will be updated automatically.
                    Besides, you can clear the route and start again if you want.
                </p>

                <br>

                <p>
                    <b>Next step:</b> Click the button 'Clear route', to clear this tutorial route.
                </p>
            </div>
        </div>

        <!-- FINAL STEP -->
        <div id="final-step" class="modal-content" data-current="false">
            <div class="dialog-content text-center">
                <img class="tutorial-logo" src="logo.png">
                <p class="tutorial-title">
                    Congratulations!
                </p>

                <br>

                <p>
                    That's all! You're ready to use this application now.
                </p>
            </div>
        </div>

        <div class="dialog-paginator">
            <ul data-visible="false">
                <li><a data-page="1" href=""></a></li>
                <li><a data-page="2" href=""></a></li>
                <li><a data-page="3" href=""></a></li>
                <li><a data-page="4" href=""></a></li>
            </ul>
        </div>
    </div>

    <div id="route-steps" data-visible="false">
        <div id="header">
            <div class="circle circle-blue">
                <span class="icon">!</span>
            </div>
            <span class="title">Directions Steps</span>
        </div>
        <div id="step-list"></div>
    </div>

    <?php if(isset($filename)) { ?>
    <script type="text/javascript"
            src="http://maps.googleapis.com/maps/api/js?sensor=false">
    </script>
    <?php } ?>

    <script type="text/javascript">
        var Observable = {
            unobserve: function(_eventHandlers, prop, handler) {
                // arguments in reverse order to support .bind(handler) for the
                // unbind from all case
                function removeHandler(handler, prop) {
                    var handlers = _eventHandlers[prop];
                    if (!handlers) {
                        return;
                    }
                    var index = handlers.indexOf(handler);
                    if (index >= 0) {
                        handlers.splice(index, 1);
                    }
                }

                if (typeof prop === 'function') {
                    // (handler) -- remove from every key in _eventHandlers
                    Object.keys(_eventHandlers).forEach(removeHandler.bind(null, prop));
                } else if (handler) {
                    // (prop, handler) -- remove handler from the specific prop
                    removeHandler(handler, prop);
                } else if (prop in _eventHandlers) {
                    // (prop) -- otherwise remove all handlers for property
                    _eventHandlers[prop] = [];
                }
            },

            /*
             * An Observable is able to notify its property change. It is initialized by
             * an ordinary object.
             */
            init: function(obj) {
                var _eventHandlers = {};
                var _observable = {
                    observe: function o_observe(p, handler) {
                        /*
                         * We should check if _observable[_p] exists. Since _observable[_p] is
                         * created along with _eventHandlers[p], here we simply check
                         * _eventHandlers[p].
                         */
                        var handlers = _eventHandlers[p];
                        if (handlers) {
                            handlers.push(handler);
                        }
                    },
                    /**
                     * unobserve([prop], handler) - remove handler from observeable callbacks
                     */
                    unobserve: this.unobserve.bind(null, _eventHandlers)
                };

                var _getFunctionTemplate = function(p) {
                    return function() {
                        return _observable['_' + p];
                    };
                };

                var _setFunctionTemplate = function(p) {
                    return function(value) {
                        var oldValue = _observable['_' + p];
                        if (oldValue !== value) {
                            _observable['_' + p] = value;
                            var handlers = _eventHandlers[p];
                            handlers.forEach(function(handler) {
                                handler(value, oldValue);
                            });
                        }
                    };
                };

                /*
                 * Iterate all properties in the object and create corresponding getter and
                 * setter for them.
                 */
                for (var p in obj) {
                    // If p is a function, simply add it to the observable.
                    if (typeof obj[p] === 'function') {
                        _observable[p] = obj[p];
                        continue;
                    }

                    _eventHandlers[p] = [];

                    Object.defineProperty(_observable, '_' + p, {
                        value: obj[p],
                        writable: true
                    });

                    Object.defineProperty(_observable, p, {
                        enumerable: true,
                        get: _getFunctionTemplate(p),
                        set: _setFunctionTemplate(p)
                    });
                }

                return _observable;
            }
        }

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

        UIManager.init();

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
          MAX_WAYPOINTS: 8,
          directionsSteps: null,

          init: function() {
              this.directionsSteps = document.querySelector('#route-steps');
              this.home = new google.maps.LatLng(37.407749, -5.947144);
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
          },

          addPoint: function(point) {
              this.points.push(point);
          },

          setMarkers: function() {
              var forEach = Array.prototype.forEach;
              var self = this;
              forEach.call(this.points, function(element) {
                  var address = element.address;
                  var city = element.localidad;
                  self.geocoder.geocode({'address': address + ', ' + city}, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                          console.info(results);
                          var marker = new google.maps.Marker({
                              map: self.map,
                              position: results[0].geometry.location
                          });
                          self.markers.push(marker);
                      } else {
                         console.error("Geocode was not successful for the following reason: " + status);
                      }
                  });
              });
          },

          toggleEditMode: function() {
              this.isEditModeEnable = !this.isEditModeEnable;
              if (!this.isEditModeEnable) {
                  this._unbindEventsMarkers();
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

          _unbindEventsMarkers: function() {
              var forEach = Array.prototype.forEach;
              forEach.call(this.markers, function(marker) {
                  marker.setAnimation(null);
                  google.maps.event.clearListeners(marker, 'click');
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
                if (this.waypoints.length < this.MAX_WAYPOINTS) {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    this.waypoints.push(marker);
                    this.waypointsLength = this.waypoints.length;
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
          }
        });

        <?php if (isset($filename)) {
            $file = fopen($filename, 'r');
            $line = 1;
            $csvHeader = array();

            // First Line: Headers
            $data = fgetcsv($file, 0, ';');
            $chunk = count($data);
            foreach ($data as $d) {
                $csvHeader[] = $d;
            }

            while (($data = fgetcsv($file, 0, ';')) !== false) {
                $line++;
                // Creates a new point for each row in the csv file
            ?>
        MapManager.addPoint({

            <?php foreach ($data as $index => $content) { ?>
            <?php echo strtolower($csvHeader[$index]) . ' : \'' .  $content .'\''; ?><?php if($index != ($chunk - 1)) echo ', '; ?>
            <?php } ?>
        });
        <?php
        }
        fclose($file);
        ?>
        MapManager.init();

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
            caretOffset: 20,
            horizontalOffset: 5,
            verticalOffset: 5,
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
                var boundingClientRect = relativeElement.getBoundingClientRect();
                var position = 'auto';
                var clientX = boundingClientRect.x || boundingClientRect.left;
                var clientY = boundingClientRect.y || boundingClientRect.top;

                if (step.position) {
                    position = step.position;
                }

                switch (position) {
                    case 'auto' :
                        //Top position
                        if ((clientY - (this.panel.clientHeight + this.caretOffset)) > 0) {
                            this.panel.style.top = (clientX - (this.panel.clientHeight + this.caretOffset)) + 'px';
                            this.panel.style.left = clientX + 'px';
                            position = 'top';
                            break;
                        }
                        //Bottom position
                        if ((window.innerHeight - (clientY + boundingClientRect.height +
                            this.panel.clientHeight + this.caretOffset)) > 0) {
                            this.panel.style.top = (clientY + boundingClientRect.height + this.caretOffset) + 'px';
                            if (clientX == 0) {
                                this.panel.style.left = this.horizontalOffset + 'px';
                            } else {
                                this.panel.style.left = clientX + 'px';
                            }
                            position = 'bottom';
                            break;
                        }
                        //Left position
                        if ((clientX - (this.panel.clientWidth + this.caretOffset)) > 0) {
                            if (clientX == 0) {
                                this.panel.style.top = this.verticalOffset + 'px';
                            } else {
                                this.panel.style.top = clientY + 'px';
                            }
                            this.panel.style.left = (clientX - (this.panel.clientWidth + this.caretOffset)) + 'px';
                            position = 'left';
                            break;
                        }
                        //Right position
                        if ((window.innerWidth - (clientX + boundingClientRect.width +
                            this.panel.clientWidth + this.caretOffset)) > 0) {
                            if (clientX == 0) {
                                this.panel.style.top = this.verticalOffset + 'px';
                            } else {
                                this.panel.style.top = clientX + 'px';
                            }
                            this.panel.style.left = (clientX + boundingClientRect.width + this.caretOffset) + 'px';
                            position = 'right';
                            break;
                        }
                    case 'left':
                        if (clientX == 0) {
                            this.panel.style.top = this.verticalOffset + 'px';
                        } else {
                            this.panel.style.top = clientX + 'px';
                        }
                        this.panel.style.left = (clientX - this.panel.clientWidth + this.caretOffset) + 'px';
                        break;
                    case 'right':
                        if (clientX == 0) {
                            this.panel.style.top = this.verticalOffset + 'px';
                        } else {
                            this.panel.style.top = clientX + 'px';
                        }
                        this.panel.style.left = (clientX + boundingClientRect.width + this.caretOffset) + 'px';
                        break;
                    case 'top':
                        this.panel.style.top = (clientX - this.panel.clientHeight + this.caretOffset) + 'px';
                        this.panel.style.left = clientX + 'px';
                        break;
                    case 'bottom':
                        this.panel.style.top = (clientX + boundingClientRect.height + this.caretOffset) + 'px';
                        if (clientX == 0) {
                            this.panel.style.left = this.horizontalOffset + 'px';
                        } else {
                            this.panel.style.left = clientX + 'px';
                        }
                        break;
                    case 'center':
                        var center = {
                            x: window.innerWidth/2,
                            y: window.innerHeight/2
                        };
                        this.panel.style.left = center.x - (this.panel.clientWidth/2) + 'px';
                        this.panel.style.top = center.y - (this.panel.clientHeight/2) + 'px';
                        break;
                }
                this.currentLeft = this.panel.style.left;
                this.currentTop = this.panel.style.top;
                this.configCaret(position);
                this.panel.dataset.visible = true;
            },

            configCaret: function(position) {
                var caret = this.panel.querySelector('.caret');
                var caretShadow = this.panel.querySelector('.caret-shadow');
                this._sanitizeCarets(caret, caretShadow);
                switch (position) {
                    case 'top':
                        caret.classList.add('caret-bottom');
                        caretShadow.classList.add('caret-shadow-bottom');
                        break;
                    case 'bottom':
                        caret.classList.add('caret-top');
                        caretShadow.classList.add('caret-shadow-top');
                        break;
                    case 'left':
                        caret.classList.add('caret-right');
                        caretShadow.classList.add('caret-shadow-right');
                        break;
                    case 'right':
                        caret.classList.add('caret-left');
                        caretShadow.classList.add('caret-shadow-left');
                        break;
                    case 'center':
                        caret.dataset.visible = false;
                        caretShadow.dataset.visible = false;
                        break;
                }
            },

            _sanitizeCarets: function(caret, caretShadow) {
                caret.classList.remove('caret-top');
                caret.classList.remove('caret-left');
                caret.classList.remove('caret-right');
                caret.classList.remove('caret-bottom');
                caretShadow.classList.remove('caret-shadow-top');
                caretShadow.classList.remove('caret-shadow-left');
                caretShadow.classList.remove('caret-shadow-right');
                caretShadow.classList.remove('caret-shadow-bottom');
                caret.dataset.visible = true;
                caretShadow.dataset.visible = true;
            },

            _moveFirstStepRight: function() {
                var sidebarWidth = window.getComputedStyle(this.sidebar, null).getPropertyValue('width');
                var menuHeight = window.getComputedStyle(this.menu, null).getPropertyValue('height');
                this.panel.style.left = parseInt(sidebarWidth) + this.caretOffset + 'px';
                this.panel.style.top = parseInt(menuHeight) + this.verticalOffset + 'px';
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
                this.panel.dataset.visible = false;
            }
        };

        Tutorial.startTutorialIfNeeded();
        <?php } ?>

    </script>
</body>
</html>