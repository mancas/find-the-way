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

    class Sanitize {
        private $sanitize_array_key = array(
                    'á' => 'a',
                    'é' => 'e',
                    'í' => 'i',
                    'ó' => 'o',
                    'ú' => 'u',
                    'Á' => 'A',
                    'É' => 'E',
                    'Í' => 'I',
                    'Ó' => 'O',
                    'Ú' => 'U',
                    'ñ' => 'n',
                    'Ñ' => 'N',
                    'ç' => 'c',
                    'ü' => 'u',
                    'Ü' => 'u',
                    '.' => '',
                    ',' => '',
                    ':' => '',
                    ';' => '',
                    '<' => '',
                    '>' => '',
                    '-' => '',
                    '_' => '',
                    '^' => '',
                    '*' => '',
                    '+' => '',
                    '-' => '',
                    '/' => '',
                    '\\' => '',
                    '[' => '',
                    ']' => '',
                    '{' => '',
                    '}' => '',
                    '(' => '',
                    ')' => '',
                    '=' => '',
                    '%' => '',
                    '$' => '',
                    '#' => '',
                    '"' => '',
                    '!' => '',
                    '¡' => '',
                    '?' => '',
                    '¿' => '',
                    '&' => '',
                    '¬' => '',
                    'º' => '',
                    'ª' => '',
                    '|' => '',
                    '@' => '',
                    ' ' => ''
                    );

        public function __contruct() {
        }

        public function sanitizeString($string) {
            return strtr($string, $this->sanitize_array_key);
        }
    };

    $sanitize = new Sanitize();
}

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Find the way</title>
    <link rel="stylesheet" href="../custom.css">
</head>
<body>
    <div id="content"<?php if(isset($filename)) { ?> class="hidden" <?php } ?> class="">
        <div class="wrapper">
            <div class="logo">
                <img src="../logo.png" class="img-responsive">
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
                    <span class="field-help">Sube tu fichero CSV con los datos que se mostrarán en el mapa, para comprobar las direcciones y pre-procesarlo para que todo funcione correctamente.</span>
                    <?php
                        if (isset($error)) {
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="loading-overlay dialog-center" data-visible="false">
      <div class="overlay-wrapper dialog-wrapper">
        <span class="spin-loader"></span>
        <div class="overlay-header">
        </div>
        <div class="overlay-content">
            Procesando datos, esto puede tardar unos minutos...
        </div>
      </div>
    </div>

    <div class="csv-container dialog-center" data-visible="false">
        <form class="dialog-wrapper" action="download.php" method="POST">
            <div class="csv-explain">
                <span>
                    Aquí tienes el fichero CSV procesado y listo para usarlo en Find The Way. Puedes ver el fichero pulsando en el botón que aparece más abajo.
                </span>
                <button type="submit" class="btn">Ver CSV</button>
            </div>
            <textarea name="file" hidden="hidden"></textarea>
        </form>
    </div>

    <div id="app-body" class="sanitize-map" data-visible="false">
        <div id="app-header">
            <div class="help">
            </div>
        </div>
        <div id="map">
        </div>
    </div>

    <script type="text/javascript" src="../js/sanitize_ui.js"> </script>

    <?php if(isset($filename)) { ?>
    <script type="text/javascript"
            src="http://maps.googleapis.com/maps/api/js?sensor=false">
    </script>
    <script type="text/javascript" src="../js/modal.js"> </script>
    <script type="text/javascript" src="../js/sanitize.js"> </script>
    <script type="text/javascript" src="../js/sanitize_map.js"> </script>
    <?php } ?>

    <script type="text/javascript">
        SanitizeUI.init();
        <?php if (isset($filename)) {
            $file = fopen($filename, 'r');
            $line = 1;
            $csvHeader = array();

            // First Line: Headers
            $data = fgetcsv($file, 0, ';');
            $chunk = count($data);
            foreach ($data as $d) {
                $csvHeader[] = strtolower($sanitize->sanitizeString(utf8_encode($d)));
            }

            while (($data = fgetcsv($file, 0, ';')) !== false) {
                $line++;
                // Creates a new point for each row in the csv file
            ?>
        Sanitize.addPoint({
            <?php foreach ($data as $index => $content) { ?>
            <?php echo $csvHeader[$index] . ' : "' . $content .'"'; ?><?php if($index != ($chunk - 1)) echo ', '; ?>
            <?php } ?>
        });
        <?php
        }
        fclose($file);
        ?>
        Sanitize.init();
        SanitizeMap.init();
        <?php } ?>
    </script>
</body>
</html>
