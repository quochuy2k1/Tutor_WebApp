<?php

namespace Ajax;

use Exception;
use Helpers\Format;
use Library\Session;
use Classes\TutoringSchedule;

require_once(__DIR__ . "../../../vendor/autoload.php");

// $filepath = realpath(dirname(__FILE__));

// include_once $filepath . "../../lib/session.php";
if (!Session::checkRoles(['tutor'])) {
    header("location:../../pages/errors/404");
}
// include_once $filepath . "../../classes/tutoringschedule.php";

// include_once $filepath . "../../helpers/format.php";

$_schedule = new TutoringSchedule();
// print_r($_POST);
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (
        isset($_POST["id"]) && is_numeric($_POST["id"])
        && isset($_POST["status"]) && is_numeric($_POST["status"])
    ) {

        try {
            $id = Format::validation($_POST["id"]);
            $status = Format::validation($_POST["status"]);



            if ((isset($_POST["DoW_id"]) && $_POST["DoW_id"] != -1)
                && (isset($_POST["topicId"]) && $_POST["topicId"] != 0)
                && (isset($_POST["timeId"]) && $_POST["timeId"] != 0)
            ) {

                $dayofweekId = Format::validation($_POST["DoW_id"]);
                $topicId = Format::validation($_POST["topicId"]);
                $timeId = Format::validation($_POST["timeId"]);

                $insert_schedule = $_schedule->AddTutoringSchedule($status, $id, $dayofweekId, $topicId, $timeId);
                $hasSchedule = $insert_schedule->fetch_assoc()["hasSchedule"];
                if ($hasSchedule == 0) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode(["action" => "successful", "message" => "Thêm lịch dạy thành công."]);
                } 
                else if ($hasSchedule == 1) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode(["action" => "fail", "message" => "Bạn đã thêm lịch học môn này rồi."]);
                }
                // var_dump($insert_schedule->fetch_assoc());
            } else {
                $update_status = $_schedule->AddTutoringSchedule($status, $id, null, null, null, null);
                if ($update_status) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode(["status" => $status]);
                }
            }
        } catch (Exception $ex) {
            print_r($ex->getMessage());
        }
    }
}
