<?php

namespace Ajax;

use Classes\AppUser;
use Classes\Tutor;
// use Helpers\Format;
use Library\Session;

$filepath = realpath(dirname(__FILE__));

include_once $filepath . "../../../lib/session.php";
include_once $filepath . "../../classes/tutors.php";
include_once $filepath . "../../classes/appusers.php";

if (!Session::checkRoles(['admin'])) {
    header("location:../pages/errors/404.php");
}

// include_once $filepath . "../../helpers/format.php";

$_tutor = new Tutor();
$_user = new AppUser();

// if ($_SERVER["REQUEST_METHOD"] === "POST") {
//     if ((isset($_POST['id']) && !empty($_POST['id']))
//      && (isset($_POST['topicId']) && !empty($_POST['topicId']))
//      && (isset($_POST['status']) && is_numeric($_POST['status']))) {

//         $userId = Format::validation($_POST["id"]);
//         $topicId = Format::validation($_POST["topicId"]);
//         $status = Format::validation($_POST["status"]);
$get_num_tutor = $_tutor->getNumTutorByMonth();
$get_num_user = $_user->getNumUserByMonth();
if ($get_num_tutor && $get_num_user) {


    $groupByTutor = array();
    $groupByUser = array();

    while ($rs = $get_num_tutor->fetch_assoc()) {
        array_push($groupByTutor, $rs);
    }

    while ($rs = $get_num_user->fetch_assoc()) {
        array_push($groupByUser, $rs);
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["groupByTutor" => $groupByTutor, "groupByUser" => $groupByUser]);
}
exit;
//     }
// }
