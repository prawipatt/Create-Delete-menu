function loadUser() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5000/users", true);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    const users = JSON.parse(this.responseText);
                    console.log("Data received:", users);
                    let trHTML = '';
                    users.forEach(user => {
                        trHTML += `<tr>
                            <td>${user.id}</td>
                            <td><img src="${user.avatar}" width="50" height="50" class="rounded-circle"></td>
                            <td>${user.fname}</td>
                            <td>${user.lname}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>
                                <button type="button" class="btn btn-outline-warning btn-sm" onclick="showUserEditBox(${user.id})">แก้ไข</button>
                                <button type="button" class="btn btn-outline-danger btn-sm" onclick="userDelete(${user.id})">ลบ</button>
                            </td>
                        </tr>`;
                    });
                    document.getElementById("mytable").innerHTML = trHTML;
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
                }
            } else {
                console.error("Server returned status:", this.status);
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์ได้", "error");
            }
        }
    };

    xhttp.onerror = function () {
        console.error("Request failed");
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error");
    };
}

function userDelete(userId) {
    Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "ข้อมูลนี้จะถูกลบและไม่สามารถกู้คืนได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `http://localhost:5000/users/${userId}`, true);
            xhttp.send();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire('สำเร็จ!', 'ลบผู้ใช้เรียบร้อยแล้ว', 'success');
                    loadUser();
                }
            };
        }
    });
}

function showUserEditBox(userId) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:5000/users/${userId}`, true);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                const user = JSON.parse(this.responseText);
                document.getElementById("editUserId").value = user.id;
                document.getElementById("editFirst").value = user.fname;
                document.getElementById("editLast").value = user.lname;
                document.getElementById("editUsername").value = user.username;
                document.getElementById("editEmail").value = user.email;
                document.getElementById("editAvatar").value = user.avatar;

                var editModal = new bootstrap.Modal(document.getElementById("editModal"));
                editModal.show();
            } catch (error) {
                console.error("Error parsing user data:", error);
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลผู้ใช้ได้", "error");
            }
        }
    };
}

function updateUser() {
    const userId = document.getElementById("editUserId").value;
    const updatedUser = {
        fname: document.getElementById("editFirst").value,
        lname: document.getElementById("editLast").value,
        username: document.getElementById("editUsername").value,
        email: document.getElementById("editEmail").value,
        avatar: document.getElementById("editAvatar").value
    };

    Swal.fire({
        title: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("PUT", `http://localhost:5000/users/${userId}`, true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(updatedUser));

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire('สำเร็จ!', 'แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว', 'success');
                    loadUser();
                    var editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
                    editModal.hide();
                }
            };
        }
    });
}

loadUser();
