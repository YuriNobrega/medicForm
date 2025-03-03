<?php

$upload_dir = __DIR__ . '/uploads/';
$files = glob($upload_dir . "*.pdf");
echo "<h1>PDFs Enviados</h1>";
if (!$files) {
    echo "<p>Nenhum PDF enviado.</p>";
} else {
    echo "<ul>";
    foreach ($files as $file) {
        $file_name = basename($file);
        echo "<li><a href='uploads/$file_name' target='_blank'>$file_name</a></li>";
    }
    echo "</ul>";
}
