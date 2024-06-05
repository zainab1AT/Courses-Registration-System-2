<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "courses2";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Get the JSON data from the request
$data = file_get_contents("php://input");
$ddd = json_decode($data, true);

$values = '';
foreach ($ddd as $row) {
  // Check if the entry already exists in the database
  $existing_check_sql = "SELECT COUNT(*) as count FROM tbl WHERE text = ?";
  $stmt_check = mysqli_prepare($conn, $existing_check_sql);
  mysqli_stmt_bind_param($stmt_check, "s", $row['cname']);
  mysqli_stmt_execute($stmt_check);
  $result = mysqli_stmt_get_result($stmt_check);
  $count = mysqli_fetch_assoc($result)['count'];
  mysqli_stmt_close($stmt_check);

  // If the entry doesn't exist, insert it into the database
  if ($count == 0) {
    // Use prepared statements to prevent SQL injection
    $sql = "INSERT INTO tbl (text, confirmed) VALUES (?, ?)";
    $stmt = mysqli_prepare($conn, $sql);

    // Bind parameters and execute the statement
    mysqli_stmt_bind_param($stmt, "si", $row['cname'], $row['isConfirmed']);
    mysqli_stmt_execute($stmt);

    // Close the statement
    mysqli_stmt_close($stmt);
  }
}

// Check if records were inserted successfully
if (mysqli_affected_rows($conn) > 0) {
  echo "Records saved successfully";
} else {
  echo "No new records inserted or records already exist";
}

// Close the database connection
mysqli_close($conn);
?>