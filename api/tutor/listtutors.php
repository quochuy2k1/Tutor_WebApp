<?php

namespace Ajax;

use Exception;
use Helpers\Util;

use Library\Session;
use Classes\Tutor, Classes\Subject;

require_once(__DIR__ . "../../../vendor/autoload.php");

// $filepath  = realpath(dirname(__FILE__));

// include_once($filepath . "../../classes/tutors.php");
// include_once($filepath . "../../classes/subjects.php");
// include_once($filepath . "../../helpers/utilities.php");
// include_once($filepath . "../../lib/session.php");
Session::init();

$TTtopic = new Tutor();
$subjects = new Subject();

if ($_SERVER["REQUEST_METHOD"] === "POST") :
    // csrf
    if (!isset($_POST["token"]) || !isset($_SESSION["csrf_token"])) {
        exit();
    }

    // 
    if (
        isset($_POST) && !empty($_POST)
        && hash_equals($_POST["token"], $_SESSION["csrf_token"])
    ) :
        try {
            $tutorOfTopic =  $TTtopic->getFilter($_POST);
?>
            <div class="col-12 pt-md-0 pb-2">
                <div class=" d-flex align-items-center views justify-content-end">
                    <span class="d-inline-flex text-success me-3">
                        <span class="material-symbols-rounded">
                            grid_view
                        </span>
                        <span class="d-block m-l-5">Dạng lưới</span>
                    </span>
                    <span class="green-label px-md-2 px-2 "><?= $tutorOfTopic->data->num_rows ?> gia sư

                </div>
            </div>
            <?php

            if ($tutorOfTopic->data) :
                while ($result = $tutorOfTopic->data->fetch_assoc()) :
            ?>


                    <div class="col-lg-4 col-md-6 col-sm-10 offset-md-0 offset-sm-1 pt-md-0">
                        <div class="card card-tutor" onclick=" location.href ='  <?= "tutor_details?id=" . $result['id']  ?> '; ">
                            <div class=" card-img-top img-teacher text-center">
                                <img src=" <?= (isset($result['imagepath']) ? Util::getCurrentURL(2) . "public/" .  $result['imagepath'] : Util::getCurrentURL(2) . "public/images/avatar5-default.jpg") ?>" class="rounded" alt="" srcset="">
                            </div>
                            <div class="card-body">
                                <h5 class="fw-600 pt-1 pb-2 limit-text-inline"><?= $result['lastname'] . ' ' . $result['firstname'] ?></h5>
                                <?php
                                $subjectTutors = "";
                                $subjectList = $subjects->getByTutorId($result['id']);
                                while ($resultSB = $subjectList->fetch_assoc()) :
                                    $subjectTutors .= $resultSB['subject'] . ', ';
                                endwhile;

                                $subjectTutors = substr($subjectTutors, 0, strlen(trim($subjectTutors)) - 1);
                                ?>

                                <div class=" d-flex pb-2">
                                    <span class="material-symbols-rounded pe-1">
                                        pin_drop
                                    </span>
                                    <span class="description-intro"><?= $result['teachingarea'] . "," . str_replace(["Tỉnh", "Thành phố"], '', $result['currentplace']) ?>
                                    </span>
                                </div>
                                <div class=" d-flex pb-2">
                                    <span class="material-symbols-rounded pe-1">
                                        book
                                    </span>
                                    <span class="description-intro"><?= $subjectTutors ?></span>
                                </div>
                                <div class="text-start description product limit-text mb-5">
                                    <?= html_entity_decode($result['introduction']) ?>
                                </div>
                                <div class="d-flex align-items-center justify-content-between pt-1 position-absolute" style="bottom: 1rem;">
                                    <div class="d-flex flex-row">
                                        <a href="<?= (isset($result['linkfacebook']) ? $result['linkfacebook'] : "") ?>" class="mx-1 social-list-item text-center border-primary text-primary"><i class="mdi mdi-facebook"></i></i></a>
                                        <a href="<?= (isset($result['linktwitter']) ? $result['linktwitter'] : "") ?>" class="mx-1 social-list-item text-center border-info text-info"><i class="mdi mdi-twitter"></i></i></a>
                                    </div>
                                    <!-- <div class="btn btn-primary">Đăng ký</div> -->
                                </div>
                            </div>
                        </div>
                    </div>
<?php
                endwhile;

                echo ' <nav aria-label="Page navigation example " id="pagination-nav" class="mt-3">';
                echo $TTtopic->getPaginator($_POST);
                echo '</div>';
            else : echo "Không tìm thấy gia sư.";
            endif;
        } catch (Exception $ex) {
            print_r($ex->getMessage());
        }
    endif;
endif;
