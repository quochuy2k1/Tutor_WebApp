<?php

namespace Api;

use Helpers\Format;
use Classes\TeachingSubject;
use Library\Session;
// \tutor_webapp
$filepath  = realpath(dirname(__FILE__, 4));

include_once($filepath . "../lib/session.php");
if (!Session::checkRoles(['admin'])) {
    header("location:../pages/errors/404");
}
include_once($filepath . "../../classes/teachingsubjects.php");
include_once($filepath . "../../helpers/format.php");


$_teaching_subject = new TeachingSubject();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (
        isset($_POST['tuid']) && !empty($_POST['tuid'])
    ) {

        $tuid = Format::validation($_POST['tuid']);

        $get_topic =  $_teaching_subject->getTopicByTutorId($tuid);

        $list_topic = array();
        if ($get_topic) {

            while ($topic = $get_topic->fetch_assoc()){
                $list_topic[] = ["topic_name"=> $topic["topicName"]];
            }



        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([$list_topic]);
    }
}