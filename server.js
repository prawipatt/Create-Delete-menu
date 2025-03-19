var express = require('express');
var cors = require('cors');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'mydb'
});

var app = express();
app.use(cors());
app.use(express.json());

app.listen(5000,function(){
    console.log('CORS-enabled wed server listening on port 5000');
});

app.get('/users', function(req,res,next){
    connection.query(
        'SELECT * FROM users',
        function(err, results, fields){
            res.status(200).json(results);

        }
    );
});


app.get('/users/:id', function(req,res,next){
    const id = req.params.id;
    connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        function(err, results, fields){
            res.status(200).json(results);

        }
    );
});


app.post('/users/create', function(req, res) {
    const fname = req.body.fname;  
    const lname = req.body.lname;  
    const username = req.body.username;  
    const password = req.body.password;  
    const avatar = req.body.avatar;  

    connection.query(
        'INSERT INTO users (fname, lname, username, password, avatar) VALUES (?, ?, ?, ?, ?)',
        [fname, lname, username, password, avatar],
        function(err, results, fields) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json(results);
            }
        }
    );
});







connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database');
});

app.put('/users/update', async function(req, res) {
    try {
        console.log('Received body:', req.body); // ดูค่าที่ได้รับจากไคลเอนต์

        const { fname, lname, username, password, avatar, id } = req.body;

        if (!fname || !lname || !username || !password || !avatar || !id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้างคำสั่ง SQL
        const query = `
            UPDATE users
            SET fname = ?, lname = ?, username = ?, password = ?, avatar = ?
            WHERE id = ?
        `;

        // อัปเดตฐานข้อมูล
        connection.query(query, [fname, lname, username, hashedPassword, avatar, id], function(err, results) {
            if (err) {
                console.error('Database error:', err); // แสดงข้อผิดพลาด SQL
                return res.status(500).json({ message: 'Database error', error: err });
            }

            res.status(200).json({ message: 'User updated successfully' });
        });

    } catch (error) {
        console.error('Server error:', error); // แสดงข้อผิดพลาดของเซิร์ฟเวอร์
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




app.delete('/users/:id', function(req, res) {
    const id = req.params.id;
    
    connection.query(
        'DELETE FROM users WHERE id = ?',
        [id],
        function(err, results) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ message: 'User deleted successfully', results });
            }
        }
    );
});
