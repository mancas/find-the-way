<?php
if (isset($_POST['file'])) {
    $filename = '/home/manu/farmacias.csv';
    $file = str_replace('\n', PHP_EOL, $_POST['file']);
    /*$handle = fopen($filename, 'w');
    fwrite($handle, $file);
    fclose($handle);

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($filename));
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filename));
    readfile($filename);*/
} else {
    header('Location: ' . 'http://' . $_SERVER['SERVER_NAME'] . dirname($_SERVER['SCRIPT_NAME']));
    die();
}
?>

<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <pre><?php echo trim($file); ?></pre>
    </body>
</html>