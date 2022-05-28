<?php

namespace Ajax;

use Helpers\Format;
use Classes\Subject;
use Library\Session;

$filepath  = realpath(dirname(__FILE__));

include_once($filepath . "../../../lib/session.php");
if (!Session::checkRoles(['admin'])) {
    header("location:../pages/errors/404");
}
include_once($filepath . "../../classes/subjects.php");
include_once($filepath . "../../helpers/format.php");


$_subject = new Subject();
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ((isset($_POST['id-subject']) && is_numeric($_POST['id-subject']))
        && (isset($_POST['subject']) && !empty($_POST['subject']))
    ) {
        $id = Format::validation($_POST['id-subject']);
        $subject_name = Format::validation($_POST['subject']);


        $update_subject =  $_subject->update_subject($id, $subject_name);


        if ($update_subject) {

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(["update"=>"success", "subject"=> $subject_name]);
        }
    }
}
