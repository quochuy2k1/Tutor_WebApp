(function () {

    // URL province api

    let offset = 0, numNotification = 2, responseNotification = true;
   

    $(document).ready(function () {

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })



        // Thêm sự kiện click cho checkbox mục đích để xoá và thêm vào filter
        function onChangeCheckbox() {
            $("input[type=checkbox].checkbox-filter ").each((i, checkbox) => {
                checkbox.addEventListener('click', (e) => {
                    addAndRemoveFilter(e);
                })
            })
        };

        onChangeCheckbox(); // Gọi thẳng ở đây luôn vì cho lần đầu nó load mấy cái checkbox





        // Nhấn để thêm vào chỗ "lọc theo"

        $(".category").each((i, child) => {
            if (child.nodeName === 'LI') {
                child.addEventListener('click', (e) => {

                    addAndRemoveFilter(e);

                    // console.log(current, "class");
                    $(".subject-active").each((i, li) => {
                        // console.log(li.className, "li.className")
                        if (li !== e.currentTarget) {
                            if (li.className.includes("subject-active")) {
                                li.className = li.className.replace(" subject-active", "");

                                $(`div[data-category="${li.getAttribute("subject-id")}"`)?.remove();
                                $(`div[value="${li.getAttribute("value")}"`)?.remove();


                                // console.log(e.target.getAttribute("value"))
                                // console.log(document.querySelector(`div[value="${e.currentTarget.getAttribute("value")}"`))
                            }
                        }


                    });



                    if (!e.currentTarget.className.includes("subject-active"))
                        $(e.currentTarget).addClass(" subject-active");

                    // if($(".subject-active").length <= 0)
                    //     $(`li[value="Tất cả"]`).addClass(" subject-active");

                    // console.log(e.currentTarget.className.includes("subject-active"))
                });

            }

        });



        function addAndRemoveFilter(e) {
            var DIVFilter = document.querySelector("#filter");
            var listFilter = [...DIVFilter.children];
            // console.log(listFilter.filter(val => {
            //     return val.getAttribute("value") === e.currentTarget.getAttribute("value")
            // }).length);
            // console.log(e.currentTarget.parentNode.getAttribute("data-category"))

            // Thêm filter môn học (việc lọc để tránh thêm trùng)

            if (listFilter.filter(val => val.getAttribute("value") === e.currentTarget.getAttribute("value")).length <= 0 && e.currentTarget.getAttribute("type") !== 'checkbox') {
                DIVFilter.innerHTML += `<div class="green-label green-label-filter font-weight-bold p-0 px-1 mx-sm-1 mx-0 my-sm-0 my-2" value="${e.currentTarget.getAttribute("value")}">${e.currentTarget.getAttribute("value")} <span
            class="px-1 close " >&times;</span> </div>`;

            }
            // Thêm filter của checkbox (việc lọc để tránh thêm trùng)
            else if (listFilter.filter(val => val.getAttribute("data-value") === e.currentTarget.parentNode.firstChild.nodeValue).length <= 0 && e.currentTarget.getAttribute("type") === 'checkbox' && e.currentTarget.checked) {
                DIVFilter.innerHTML += `<div class="green-label green-label-filter font-weight-bold p-0 px-1 mx-sm-1 mx-0 my-sm-0 my-2"  data-category="${e.currentTarget.parentNode.getAttribute("data-category")}" data-value="${e.currentTarget.parentNode.firstChild.nodeValue}">${e.currentTarget.parentNode.firstChild.nodeValue} <span
            class="px-1 close " >&times;</span> </div>`;
            }

            // Xoá khi checkbox checked bằng flase
            if ($(e.currentTarget).attr("type") === 'checkbox' && e.currentTarget.checked === false) {
                $(`div[data-value="${e.currentTarget.parentNode.firstChild.nodeValue}"`)?.remove();
            }

            $(".close").off().on('click', (e) => {

                let checkBoxValue = $(e.currentTarget.parentNode).attr("data-value");
                // let LiValue = e.currentTarget.parentNode.getAttribute("value");
                let checkBoxReset = $(`label[data-value="${checkBoxValue}"]`);
                // console.log(checkBoxReset);
                // var current = document.querySelectorAll(".subject-active");

                // [...current].map(li => {
                //     if (li.getAttribute("value") === LiValue) {
                //         li.className = li.className.replace("subject-active", "")
                //     }
                // })

                // xoá checked khi xoá filter
                console.log()
                // if (checkBoxReset[0]?.firstElementChild.nodeName === 'INPUT') {
                //     checkBoxReset[0].firstElementChild.checked = false;
                // }

                $(checkBoxReset).children("input[type='checkbox']").prop("checked", false)

                // console.log($(".category").first(), "123456");
                // Xoá hết thì thêm background xanh cho li Tất cả :))


                e.currentTarget.parentNode.remove(); // xoá khi click vào dấu x

                // khi xoá filter thì cập nhật lại gia sư

                //     $(`li[value="Tất cả"]`).addClass(" subject-active");
                // if (e.currentTarget.parentNode.("value") ) {
                //     e.currentTarget.parentNode.remove();

                filer_data();
                // }
                // console.log($(".subject-active").length, "length")

                if ($("#filter").children().length <= 1) {
                    $(".category").each((i, items) => {
                        if ($(items).attr("value") === "Tất cả") {
                            $(items).addClass("subject-active");
                        }
                        else {
                            $(items).removeClass("subject-active");
                        }
                    });

                }


            });

            // onChangeCheckbox();  // Cái này dùng đề refresh các chủ đề khi click và môn học
        }




        if (checkMobile(/iPhone|iPad|iPod|Android/i)) {
            $(".text-sub").each((i, li) => {
                li.textContent = li.textContent.substring(0, 103) + "...";
            })
        }


        function checkMobile(reg) {
            var isMobile = reg.test(navigator.userAgent);
            if (isMobile) {
                return true;
            }
            return false;
        }

        function select2_ajax(selector, dropdownParent, urlAjax, dataAjax, processResultsAjax, placeholder) {

            let select2 = $(selector).select2({
                theme: 'bootstrap-5',
                language: "vi",
                dropdownParent: dropdownParent,
                ajax: {
                    url: urlAjax,
                    type: "post",
                    dataType: 'json',
                    delay: 250,
                    data: dataAjax,
                    processResults: processResultsAjax,
                    cache: true
                },
                placeholder: placeholder,
                minimumInputLength: 0,
                // templateResult: formatRepo,
                // templateSelection: formatRepoSelection
            }).on("select2:close", function(e) { // validation select2
                // $(this).valid();
            });

            return select2;
        }

        function placeholder(limit) {
            let placeholder = "";
            for (let i = 0; i < limit; i++) {
                placeholder += `<div class="col-lg-4 col-md-6 col-sm-10 offset-md-0 offset-sm-1 pt-md-0">
                <div class="card card-tutor">
                    <div class=" card-img-top img-teacher text-center">
                        <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#868e96"></rect>
                        </svg>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                            <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-6"></span>
                            <span class="placeholder col-8"></span>
                        </p>
                        <div class="d-flex align-items-center justify-content-between pt-1 position-absolute" style="bottom: 1rem;">
                            <div class="d-flex flex-row">
                                <a href="#" class="mx-1 social-list-item text-center border-primary text-primary disabled placeholder"></a>
                                <a href="#" class="mx-1 social-list-item text-center border-info text-info disabled placeholder"></a>
                            </div>
                            <!-- <div class="btn btn-primary">Đăng ký</div> -->
                        </div>
                    </div>
                </div>
            </div>`
            }
    
            return placeholder;
        }

        select2_ajax('.js-data-province-filter-ajax', null, '../api/tutor/getcurrentplacetutor', function(params) {
            var query = {
                q: params.term,
                num: !params.term && 'all'
            }

            // Query parameters will be ?search=[term]&type=public
            return query;
        }, function(data, params) {
            console.log(data);
            // Transforms the top-level key of the response object from 'items' to 'results'
            return {
                results: data
            }
        }, 'Gõ chữ bất kì để tìm Tỉnh/Thành Phố');

        // page_data();
        filer_data();
        page_paginator();

        $("#filter-subject li").on('click', (e) => {


            // thêm subject filter
            $.ajax({
                type: "post",
                url: "../api/subjecttopic/topicfilter",
                data: {
                    subject: $(e.currentTarget).attr('subject-id') // lấy giá trị của thuộc tính subject-id
                },
                cache: false,
                success: function (data) {
                    console.log(data, "chủ đề")
                    $(".topic-container").html(data); // Thêm đoạn html vào id topic (response từ ajax)


                    onChangeCheckbox(); // Cái này dùng đề refresh các chủ đề khi click và môn học
                    $(".topic").on('click', (e) => { // Để ở đây cũng chủ yếu là để refresh các checkbox của 
                        // chủ đề khi mới thêm vào (cập nhật lại DOM)
                        filer_data();  // gọi hàm thực thi filter
                    });
                    filer_data();

                },
                error: function (xhr, status, error) {
                    console.error(xhr);
                }
            });


        });

        $(".checkbox-filter").on('click', () => { // filter khi all checkbox bị click

            filer_data();
        });


        $("#select_province").on('change', () => {
            filer_data();

        })



        // lọc dữ liệu
        function filer_data(e = null) {

            if(!document.querySelector("#tutors .row")) return false;

            let url = $(e?.currentTarget).attr('href') ? $(e.currentTarget).attr('href') : "9&1"; // check có thẻ a chưa 
            let [limit, page] = url.split("&");
            let placeholder_tutor = placeholder(limit);

            $("#tutors .row").html(placeholder_tutor);


            
            console.log(limit, page, url)

            let token = $("#token").val();
            let subject = $(".category.subject-active").attr("subject-id");
            let topic = get_filter_arr(".topic:checked");
            let status = get_filter_str(".teachingForm:checked");
            let sex = get_filter_arr(".sex:checked");
            let type = get_filter_arr(".type:checked");
            let province = get_filter_str("#select_province option:selected");
            // console.log(status, token, "get value ")
            console.log(province, "prov")
            $.ajax({
                type: "post",
                url: "../api/tutor/listtutors",
                data: {
                    token,
                    subject: subject,
                    topic: topic,
                    status: status,
                    sex: sex,
                    type: type,
                    province,
                    limit,
                    page,
                },
                cache: false,
                success: function (data) {

                    $("#tutors .row").html(data);
                    document.querySelector('#top-filter')?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' })

                    page_paginator();
                    // console.log(data)
                },
                error: function (xhr, status, error) {
                    console.error(xhr);
                }
            });

        }



        function page_paginator() {

            $(".link-ajax").off().on('click', (e) => {
                e.preventDefault();
                filer_data(e);
            });
        }

        // Lưu gia sư




        // dữ liệu trả về sẽ như thế này Toán, Vật lý, Hoá,
        function get_filter_str(className) {
            let data = "";
             
                $(className).each((i, val) => {
                    // console.log($(this).length)
                    if(i  === $(this).length - 1) 
                        data += $(val).val()
                    else 
                        data += $(val).val() + ', '

                    // console.log($(val).val(), "val")
                });
                return data.trim();
            
            return;
        }

        function get_filter_arr(className) {
            let data = [];
            $(className).each((i, val) => {
                data.push($(val).val());
                // console.log($(val).val(), "val")
            });
            return data;
        }


       


        $("#more-notification").on('click', (e) => {


            offset += 3;
           
            responseNotification && $.ajax({
                type: "post",
                url: "../api/notification/getnotificationmore",
                data: {
                    numNotification, 
                    offset
                },
                cache: false,
                success: function (data) {
                    console.log(data, "thông báo")
                    if (!data) {
                        responseNotification = false;
                        return;
                    }
                    $(".list-notification").last().append(data);
                    document.querySelector('#end-notification')?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' })

                },
                error: function (xhr, status, error) {
                    console.error(xhr);
                }
            });


        });





    });

    (function ($) {

        "use strict";

        $('nav .dropdown').hover(function () {
            var $this = $(this);
            $this.addClass('show');
            $this.find('> a').attr('aria-expanded', true);
            $this.find('.dropdown-menu').addClass('show');
        }, function () {
            var $this = $(this);
            $this.removeClass('show');
            $this.find('> a').attr('aria-expanded', false);
            $this.find('.dropdown-menu').removeClass('show');
        });

    })(jQuery);

    (function ($) {

        "use strict";

        $(".toggle-password").click(function () {

            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });

    })(jQuery);

    // Xem hình ảnh lớn và rõ hơn

    $("img:not(.avatar)").on('click', function (e) {
        let DIVShowImg = $(".img-float");
        let Img = $(".img-float>img");
        DIVShowImg.removeClass("d-none");
        console.log(Img)
        console.log(e.target)

        $(Img).prop("src", $(e.target).prop("src"));
        $('body').css("overflow-y", "hidden");
        $(".img-float").off().on('click', (e) => {

            $(e.currentTarget).addClass('d-none');
            $('body').css("overflow-y", "scroll");

        });


    });

})();
