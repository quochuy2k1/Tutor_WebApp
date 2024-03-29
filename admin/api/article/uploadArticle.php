<?php

namespace Ajax;

use Exception;
use Helpers\Format;
use Library\Session;
use Classes\blogpage;
use Vendor\SSP;


// \tutor_webapp
$filepath  = realpath(dirname(__FILE__, 4));

require_once($filepath . "/vendor/autoload.php");
// include_once($filepath . "../../lib/session.php");
if (!Session::checkRoles(['admin'])) {
    header("location:../../pages/errors/404");
}
// include_once($filepath . "../../classes/savedtutors.php");
// include_once($filepath . "../../helpers/format.php");
Session::init();
include_once $filepath . "/config/config.php";
// include_once($filepath . "../../classes/subjects.php");
// include_once($filepath . "../../helpers/format.php");
// include_once $filepath . "/admin/vendor/ssp.class.php";
try {
    $blog =  new blogpage();
    if (
        isset($_POST['title'])
        && isset($_POST['nameimage'])
        && isset($_POST['content'])
        && isset($_POST['id'])
    ) {
        $id = Format::validation($_POST['id']);
        $kind = Format::validation($_POST["kind"]);
        $title = Format::validation($_POST["title"]);
        $title_url = Format::validation($_POST["title_url"]);
        $content = ($_POST["content"]);
        $nameimage = Format::validation($_POST["nameimage"]);
        $status = Format::validation($_POST["status"]);
        $title_url .= '-' .rand(1000,9999);
        $blog->upldateArticle($id, $title, $title_url,  $nameimage,  $content,  $kind, $status);
        $blog->edit_readmost($id,$title_url);
    }
} catch (Exception $ex) {
    print_r($ex->getMessage());
} finally {
    exit;
}
