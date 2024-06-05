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

    if (isset($data['courseName']) && isset($data['newCourseName'])) {
        // Update the row with the specified course name
        $courseName = $data['courseName'];
        $newCourseName = $data['newCourseName'];

        $sql = "UPDATE tbl SET text='$newCourseName' WHERE text='$courseName'";
        if (mysqli_query($conn, $sql)) {
            echo "Record updated successfully";
        } else {
            echo "Error updating record: " . mysqli_error($conn);
        }
    } else {
        echo "Invalid data format. Expected 'courseName' and 'newCourseName' keys in the JSON data.";
    }

    // Close the database connection
    mysqli_close($conn);
?>