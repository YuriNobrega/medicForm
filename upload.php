<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['pdf_file']) || $_FILES['pdf_file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["success" => false, "message" => "Erro ao receber o arquivo."]);
        exit;
    }

    // Diretório onde os PDFs serão armazenados
    $upload_dir = __DIR__ . '/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $file_name = basename($_FILES['pdf_file']['name']);
    $upload_path = $upload_dir . $file_name;
    if (move_uploaded_file($_FILES['pdf_file']['tmp_name'], $upload_path)) {
        echo json_encode(["success" => true, "file_url" => "uploads/" . $file_name]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao salvar o arquivo."]);
    }
}
