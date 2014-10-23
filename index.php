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
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                            <input type="text" id="fake-file" data-placeholder="Elegir archivo">
                            <span class="group-addon clickable upload">
                                Subir
                            </span>
                        </div>
                        <input type="file" name="csv-file" class="hidden">
                    </div>
                    <span class="field-help">Sube tu fichero CSV con los datos que quieres mostrar en el mapa.</span>
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
                        <a href="filters" data-action="filters">
                            Filtros
                        </a>
                    </li>
                    <li>
                        <a href="go-back" data-action="go-back">
                            Atrás
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div id="map">
        </div>
    </div>

    <!-- TEST CODE -->
    <div id="address-errors" class="modal-dialog" data-visible="false">
        <div data-visible="false" class="caret-shadow caret-shadow-top"></div>
        <div data-visible="false" class="caret caret-top"></div>

        <div class="dismiss-container">
            <a class="modal-dialog-dismiss" href="">&times;</a>
        </div>

        <div class="modal-content">
            <div class="dialog-header">
                <div class="circle circle-red">
                    <span class="icon light">!</span>
                </div>
                <span class="step-title">Errors</span>
            </div>
            <div class="dialog-content">
                <p>
                    A continuación se muestran las entradas, para las cuales, Google no ha sido capaz de especificar un marcador.
                </p>

                <br>

                <p>
                    Por favor, corrija el archivo .csv para que la aplicación funcione correctamente:
                </p>

                <br>

                <div class="error-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Dirección calculada</th>
                                <th>Orden</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div id="filters" class="modal-dialog modal-dialog-xs" data-visible="false">
        <div data-visible="false" class="caret-shadow caret-shadow-top"></div>
        <div data-visible="false" class="caret caret-top"></div>

        <div class="dismiss-container">
            <a class="modal-dialog-dismiss" href="">&times;</a>
        </div>

        <div class="modal-content">
            <div class="dialog-header">
                <div class="circle circle-green">
                    <span class="icon-filter"></span>
                </div>
                <span class="step-title">Filtros</span>
            </div>
            <div class="dialog-content">
                <ul class="filters-container">
                </ul>
            </div>
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
                    ¿Te gustaría dar un paseo por la aplicación?
                </p>

                <span class="btn" id="take-a-tour">Empieza el tour</span>
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
                    Esta es la barra de menú. Si colocas el puntero encima, podrás ver todas las cosas que puedes hacer con solo un click.
                </p>

                <br>

                <p>
                    <b>Siguiente paso:</b> Ahora prueba a hacer click en "Find my way".
                </p>
            </div>
        </div>

        <!-- STEP 2 -->
        <div id="step2" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-red">
                    <span class="icon">?</span>
                </div>
                <span class="step-title">Instrucciones</span>
            </div>
            <div class="dialog-content">
                <p>
                    Aquí puedes encontrar información para generar la ruta y algunos consejos.
                </p>

                <br>

                <p>
                    Ten en cuenta que punto de partida y finalización es Rentasoft S.A. Además, puedes aplicar filtros para restringir los puntos que aparecen en pantalla.
                </p>

                <br>

                <p>
                    <b>Siguiente paso:</b> Sigue las instrucciones para añadir un waypoint a tu ruta.
                </p>
            </div>
        </div>

        <!-- STEP 3 -->
        <div id="step3" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-yellow">
                    <span class="icon light">&#10004;</span>
                </div>
                <span class="step-title">Calcular la ruta</span>
            </div>
            <div class="dialog-content">
                <p>
                    Haciendo click en este botón generarás la ruta optima que pasa por todos los waypoints que has seleccionado.
                </p>

                <br>

                <p>
                    <b>Siguiente paso:</b> Haz click en el botón para calcular la ruta óptima.
                </p>
            </div>
        </div>

        <!-- STEP 4 -->
        <div id="step4" class="modal-content" data-current="false">
            <div class="dialog-header">
                <div class="circle circle-green">
                    <span class="icon light">&#10004;</span>
                </div>
                <span class="step-title">Información adicional</span>
            </div>
            <div class="dialog-content">
                <p>
                    Aquí tienes las indicaciones que debes seguir para completar tu recorrido.
                </p>

                <br>

                <p>
                    Recuerda que puedes arrastrar la ruta para adaptarla a tus necesidades, si lo haces, las indicaciones se actualizarán automáticamente.
                    Además puedes borrar la ruta y empezar de nuevo cuando quieras.
                </p>

                <br>

                <p>
                    <b>Siguiente paso:</b> Haz click en el botón 'Borrar ruta', para borrar la ruta de este tutorial.
                </p>
            </div>
        </div>

        <!-- FINAL STEP -->
        <div id="final-step" class="modal-content" data-current="false">
            <div class="dialog-content text-center">
                <img class="tutorial-logo" src="logo.png">
                <p class="tutorial-title">
                    ¡Felicidades!
                </p>

                <br>

                <p>
                    ¡Eso es todo! Ahora estas listo para manejar la aplicación.
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
            <span class="title">Indicaciones</span>
        </div>
        <div id="step-list"></div>
    </div>

    <script type="text/javascript" src="js/ui.js"> </script>
    <script type="text/javascript" src="js/observable.js"> </script>
    <script type="text/javascript" src="js/draggable.js"> </script>

    <?php if(isset($filename)) { ?>
    <script type="text/javascript"
            src="http://maps.googleapis.com/maps/api/js?sensor=false">
    </script>
    <script type="text/javascript" src="js/modal.js"> </script>
    <script type="text/javascript" src="js/tutorial.js"> </script>
    <script type="text/javascript" src="js/map.js"> </script>
    <?php } ?>

    <script type="text/javascript">
        UIManager.init();
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
        Tutorial.startTutorialIfNeeded();
        new Draggable(document.getElementById('tutorial'));
        <?php } ?>

    </script>
</body>
</html>