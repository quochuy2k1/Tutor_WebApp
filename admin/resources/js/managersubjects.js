(function() {
    // data table
    "use-strict"
    jQuery(document).ready(function($) {

        (function() {
            var subject_table = $('#subject-table').DataTable({
                // data: data,
                processing: true,
                serverSide: true,
                ajax: {
                    url: '../api/subjects/getdatasubjects',
                    dataType: 'json',
                    type: 'get',
                    complete: function(data) {

                        // if (data.add === "success") {
                        //     table.ajax.reload(null, false);

                        // }
                        InitLoadSuccess();
                        // console.log(data)
                    },
                    error: function(xhr, status, error) {
                        console.error(xhr);
                    }
                },
                drawCallBack: function(settings) {
                    console.log(settings)
                },
                createdRow: function(row, data, dataIndex) {
                    $(row).addClass('subject-row');
                },
                columns: [{
                        data: null,
                        className: "",
                        render: function(data, type, row) {
                            return `<input class="form-check-input check-one" type="checkbox" value="${data.Id}">`
                        },
                    },
                    {
                        data: "Id"
                    },
                    {
                        data: "Tên môn học",
                        render: function(data, type, row) {
                            return `<span class="subject-name">${data}</span>
                                                                <form class="edit-subject-form d-none">
                                                                    <input type="hidden" class="form-control id-subject-input" name="id-subject" value="${row.Id}">

                                                                    <input type="text" class="form-control edit-input" name="subject" value="${data} " required>

                                                                </form>`
                        }
                    }, {
                        data: null,
                        render: function(data, type, row) {
                            // Combine the first and last names into a single table field
                            return `<div class="d-inline-flex cursor-pointer ">
                                                                    <span class="badge badge-light-success m-l-10 edit-subject">
                                                                        <span class="material-symbols-rounded  m-auto" style="color: #3F99EF;font-size: 20px !important;">
                                                                            edit_note
                                                                        </span>
                                                                    </span>
                                                                    <span class="badge badge-light-danger m-l-10 delete-subject">
                                                                        <span class="material-symbols-rounded  m-auto" data-value-id="${data.Id}" style="color: #E73774;font-size: 20px !important; ">
                                                                            delete
                                                                        </span>
                                                                    </span>

                                                                </div>`;
                        },
                        // defaultContent:,
                    },
                ],

                dom: 'Bfrtip',
                buttons: ['pageLength', {
                        extend: 'print',
                        download: 'open',
                        exportOptions: {
                            columns: ':visible'
                        },
                        customize: function(win) {
                            console.log($(win.document.body).find('table').eq(1))
                                // $(win.document.body)
                                //     .css('font-size', '10pt')
                                //     .prepend(
                                //         '<img src="http://datatables.net/media/images/logo-fade.png" style="position:absolute; top:0; left:0;" />'
                                //     );

                            $(win.document.body).find('table')
                                .addClass('table-bordered').removeClass("table-type-1")
                        },
                        messageTop: `<span class="h5 pt-3 d-block">THÔNG TIN MÔN HỌC</span>`
                    },
                    'colvis'
                ],
                // initComplete: function(settings, json) {
                //     InitLoadSuccess(settings, json);
                // },
                stateSave: true,
                responsive: true,
                aoColumnDefs: [{
                    bSortable: false,
                    aTargets: [0]
                }],
                orderCellsTop: true,
                fixedHeader: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/vi.json",
                    paginate: {
                        next: '»',
                        previous: '«'
                    }
                }
            });

            // $('#subject-table').on('page.dt', (e) => {
            //     $("#select-all-subject").prop("checked", false);
            //     $("#select-all-subject").removeClass('allChecked');

            // })


            // hàm có tác dụng load dữ liệu bảng thành công mới thực thi hàm
            // mỗi lần chuyển trang là load dòng mới nên DOM cần phải load lại
            // nếu không load lại nó sẽ vô hiệu
            var idx = 0;

            // console.log(settings)

            // select all
            $('#select-all-subject').on('click', function(e) {
                // idx++
                // console.log("-------------------", idx, "allPage")

                let allPages = subject_table.rows().nodes();
                console.log(allPages)
                if ($(this).hasClass('allChecked')) {
                    $('input[type="checkbox"]', allPages).prop('checked', false);
                } else {
                    $('input[type="checkbox"]', allPages).prop('checked', true);

                }
                $(this).toggleClass('allChecked');

                return true;
            });

            function InitLoadSuccess(settings = null, json = null) {

                // xoá sự kiện của từng selector
                // vì bên trong hàm InitLoadSuccess sẽ lặp lại nhiều lần
                // và tạo ra nhiều sự kiện trùng nhau
                $(".edit-subject").off();
                $('.edit-subject-form').off();
                $(".delete-subject").off();
                $("#multiple-delete-subject").off();

                // Edit subject
                // Toggle Class
                $(".edit-subject").on('click', (e) => {
                    // get tr in table
                    let row_subject = $(e.currentTarget).closest(".subject-row");
                    let edit_form = row_subject.find("td > .edit-subject-form")
                    let span_subject_name = row_subject.find("td > .subject-name")
                        // show edit form
                    edit_form.toggleClass("d-none");
                    // hide span subject name
                    span_subject_name.toggleClass("d-none");
                    console.log(edit_form, span_subject_name)
                    idx++;
                    console.log(idx)
                });

                // Edit

                $('.edit-subject-form').on("submit", (event) => {
                    event.preventDefault();


                    console.log($(event.target).serialize())
                    $.ajax({
                        type: "post",
                        url: "../api/subjects/updatesubject",
                        data: $(event.target).serialize(),
                        cache: false,
                        success: function(data) {

                            if (data.update === "success") {
                                $(event.target).toggleClass("d-none")
                                $(event.target).prev().toggleClass("d-none").text(data.subject)
                                    // 
                                Toastify({
                                    text: "Cập nhật thành công!",
                                    duration: 5000,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "right", // `left`, `center` or `right`
                                    stopOnFocus: true, // Prevents dismissing of toast on hover
                                    style: {
                                        background: "linear-gradient(to right, #56C596, #7BE495)",
                                    },
                                    onClick: function() {} // Callback after click
                                }).showToast();
                            }

                            console.log(data)
                        },
                        error: function(xhr, status, error) {
                            console.error(xhr);
                        }
                    });
                });

                // Delete subject
                $(".delete-subject").on('click', (e) => {
                    let id_subject = $(e.target).attr("data-value-id");
                    console.log()

                    $.ajax({
                        type: "post",
                        url: "../api/subjects/deletesubject",
                        data: {
                            id_subject
                        },
                        cache: false,
                        success: function(data) {

                            if (data.delete === "success") {
                                subject_table.ajax.reload(null, false);
                                Toastify({
                                    text: "Xoá thành công!",
                                    duration: 5000,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "right", // `left`, `center` or `right`
                                    stopOnFocus: true, // Prevents dismissing of toast on hover
                                    style: {
                                        background: "linear-gradient(to right, #56C596, #7BE495)",
                                    },
                                    onClick: function() {} // Callback after click
                                }).showToast();


                            }

                            console.log(data)
                        },
                        error: function(xhr, status, error) {
                            console.error(xhr);
                        }
                    });
                });

                // Delete multiple

                $("#multiple-delete-subject").on('click', (e) => {
                    let subject_id_list = [];
                    $('input[type="checkbox"]:not(#select-all-subject):checked').each((i, elm) => {
                        subject_id_list.push($(elm).val())
                    });
                    console.log(subject_id_list);
                    $.ajax({
                        type: "post",
                        url: "../api/subjects/deletesubject",
                        data: {
                            id_subject: subject_id_list
                        },
                        cache: false,
                        success: function(data) {

                            if (data.delete === "success") {
                                subject_table.ajax.reload(null, false);
                                Toastify({
                                    text: "Xoá thành công!",
                                    duration: 5000,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "right", // `left`, `center` or `right`
                                    stopOnFocus: true, // Prevents dismissing of toast on hover
                                    style: {
                                        background: "linear-gradient(to right, #56C596, #7BE495)",
                                    },
                                    onClick: function() {} // Callback after click
                                }).showToast();


                            } else if (data.delete === "fail") {

                            }

                            console.log(data)
                        },
                        error: function(xhr, status, error) {
                            console.error(xhr);
                        }
                    });
                });


            }




            // validation form
            var forms = document.querySelectorAll('.needs-validation')
            console.log(forms, "forms");
            // Loop over them and prevent submission
            Array.prototype.slice.call(forms)
                .forEach(function(form) {
                    form.addEventListener('submit', function(event) {
                        if (!form.checkValidity()) {
                            event.preventDefault()
                            event.stopPropagation()
                        }

                        form.classList.add('was-validated')
                    }, false)
                });

            // Add

            $('#add-subject-form').on("submit", (event) => {
                event.preventDefault();


                console.log($(event.target).serialize())
                if (confirm("Bạn chắc chắn muốn thêm những môn học này?") === true) {
                    $.ajax({
                        type: "post",
                        url: "../api/subjects/addsubject",
                        data: $(event.target).serialize(),
                        cache: false,
                        success: function(data) {

                            if (data.add === "success") {
                                subject_table.ajax.reload(null, false);
                                Toastify({
                                    text: "Thêm thành công!",
                                    duration: 5000,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "right", // `left`, `center` or `right`
                                    stopOnFocus: true, // Prevents dismissing of toast on hover
                                    style: {
                                        background: "linear-gradient(to right, #56C596, #7BE495)",
                                    },
                                    onClick: function() {} // Callback after click
                                }).showToast();

                            }

                            console.log(data)
                        },
                        error: function(xhr, status, error) {
                            console.error(xhr);
                        }
                    });
                }

            });

            // submit textarea (in modal add new)
            $("#control-input-subject").on('keydown', (e) => {
                if (e.which === 13 && !e.shiftKey) {
                    e.preventDefault();
                    $(e.target).closest("#add-subject-form").submit();
                }
            });
            // submit button save-change-subject

            $("#save-change-subject").on('click', (e) => {
                console.log($(e.target).closest(".modal-content").find("#add-subject-form").submit());
            });

            // The ctrl+shift N event keyboard was used to display the modal.
            /* var isPress = false;
             var myModal = new bootstrap.Modal(document.getElementById('modalAddSubject'), {
                 keyboard: true
             });
             $(document).on("keydown", (event) => {
                 // console.log(event)

                 if (!isPress && event.ctrlKey && event.shiftKey) {
                     isPress = true;
                     console.log("ctrl+shift")
                     isPress && $(this).on('keydown', (e) => {
                         if (isPress && e.keyCode === 78 || e.keyCode === 110) { // 'A' or 'a'
                             console.log("ctrl+shift N")

                             e.preventDefault() ? e.preventDefault : e.returnValue = false;
                             e.stopPropagation();

                             myModal.show();
                             isPress = false;
                             return false;
                         }
                     })
                 }

             });*/
        })();


    });

})(jQuery)