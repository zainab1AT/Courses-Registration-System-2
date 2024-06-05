<?php
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

  // Get the JSON data from the request body
  $data = json_decode(file_get_contents("php://input"), true);

  if (is_string($data)) {
    // Delete row with the specified text
    $text = $data;
    $sql = "DELETE FROM tbl WHERE text = '$text'";
    if (!mysqli_query($conn, $sql)) {
      echo "Error deleting record: " . mysqli_error($conn);
    } else {
      echo "Record deleted successfully";
    }
  } else {
    echo "Invalid data format. Expected a string.";
  }

  // Close the database connection
  mysqli_close($conn);
?>