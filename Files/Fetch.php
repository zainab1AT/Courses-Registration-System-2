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

  // Retrieve data from the table
  $sql = "SELECT * FROM tbl";
  $result = mysqli_query($conn, $sql);
  $data = [];//this is the array that will take the json objects

  if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
      $data[] = $row;
    }
  }

  // Close the database connection
  mysqli_close($conn);

  // Return the data as JSON
  $json = json_encode($data);
  echo $json; // Output the JSON data
?>