const express = require("express");
const db = require("./db");
const path = require("path");
const app = express();
const multer = require("multer");
const connection = require("./db");
const pool = require("./db");
const { log } = require("console");
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------- CONTACT US ----------------
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject) {
        return res.status(400).json({
            success: false,
            message: "Please fill all contact form fields."
        });
    }

    try {

        const sql = `
            INSERT INTO contacts (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;

        await pool.execute(sql, [
            name,
            email,
            subject,
            message
        ]);

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (error) {

        console.error("Contact insert error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save your message."
        });

    }
});

// ========================================
// SLIDER API
// GET /api/sliders
// ========================================

app.get("/api/sliders", async (req, res) => {
    try {

        const [rows] = await pool.execute(`
            SELECT
                id,
                image,
                title,
                description,
                created_at
            FROM sliders
            WHERE deleted_at IS NULL
            ORDER BY id ASC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("GET /api/sliders error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load sliders."
        });

    }
});

// ========================================
// GALLERY API
// GET /api/gallery
// ========================================

app.get("/api/gallery", async (req, res) => {
    try {

        const [rows] = await pool.execute(`
            SELECT
                id,
                filetype,
                filename,
                created_at
            FROM galleries
            WHERE deleted_at IS NULL
            ORDER BY id DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("GET /api/gallery error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load gallery."
        });

    }
});

// ========================================
// GET SINGLE GALLERY ITEM
// GET /api/gallery/:id
// ========================================

app.get("/api/gallery/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid gallery ID."
            });
        }

        const [rows] = await pool.execute(`
            SELECT
                id,
                filetype,
                filename,
                created_at
            FROM galleries
            WHERE id = ?
            AND deleted_at IS NULL
            LIMIT 1
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Gallery item not found."
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        console.error("GET /api/gallery/:id error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load gallery item."
        });

    }

});


// ========================================
// TEAM API
// GET /api/team
// ========================================

app.get("/api/team", async (req, res) => {

    try {

        const [rows] = await pool.execute(`
            SELECT
                id,
                filter_id,
                profile,
                name,
                designation,
                description
            FROM teams
            ORDER BY id ASC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("GET /api/team error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load team members"
        });

    }

});

// ========================================
// GET SINGLE TEAM MEMBER
// GET /api/team/:id
// ========================================

app.get("/api/team/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid team member ID"
            });

        }


        const [rows] = await pool.execute(
            `
            SELECT
                id,
                filter_id,
                profile,
                name,
                designation,
                description
            FROM teams
            WHERE id = ?
            AND status = 1
            LIMIT 1
            `,
            [id]
        );


        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });

        }


        res.status(200).json({
            success: true,
            data: rows[0]
        });


    } catch (error) {

        console.error("GET /api/team/:id error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load team member"
        });

    }

});


// ---------------- DONATION ----------------
app.post("/api/donations", (req, res) => {
    const { name, email, phone_no, city, pan, amount, message } = req.body;

    if (!name || !email || !phone_no || !city || !amount) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required donation fields."
        });
    }

    const donationAmount = Number(amount);

    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid donation amount."
        });
    }

    const sql = `
        INSERT INTO donation_reports
        (name, email, phone_no, city, pan, amount, message, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone_no, city, pan || null, donationAmount, message || null, "pending"],
        (err, result) => {
            if (err) {
                console.error("Donation insert error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to save donation details."
                });
            }

            res.json({
                success: true,
                message: "Donation details saved successfully!",
                donationId: result.insertId
            });
        }
    );
});

// ========================================
// donation API
// GET /api/donations
// ========================================
app.post("/api/donations", async (req, res) => {

    const {
        name,
        email,
        phone_no,
        city,
        pan,
        amount,
        message
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone_no || !city || !amount) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required donation fields."
        });
    }

    // Convert amount to number
    const donationAmount = Number(amount);

    // Validate donation amount
    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid donation amount."
        });
    }

    try {

        const sql = `
            INSERT INTO donation_reports
            (name, email, phone_no, city, pan, amount, message, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(sql, [
            name,
            email,
            phone_no,
            city,
            pan || null,
            donationAmount,
            message || null,
            "pending"
        ]);

        res.status(200).json({
            success: true,
            message: "Donation details saved successfully!",
            donationId: result.insertId
        });

    } catch (error) {

        console.error("Donation insert error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save donation details."
        });

    }

});

// ========================================
// feedback API
// GET /api/feedback
// ========================================

// app.post("/api/feedback", async (req, res) => {

//     const {
//         name,
//         email,
//         rating,
//         message
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !rating || !message) {
//         return res.status(400).json({
//             success: false,
//             message: "Please fill all feedback fields."
//         });
//     }

//     const feedbackRating = Number(rating);

//     // Validate rating
//     if (
//         !Number.isInteger(feedbackRating) ||
//         feedbackRating < 1 ||
//         feedbackRating > 5
//     ) {
//         return res.status(400).json({
//             success: false,
//             message: "Please select a valid rating between 1 and 5."
//         });
//     }

//     try {

//         const sql = `
//             INSERT INTO feedback
//             (name, email, rating, message)
//             VALUES (?, ?, ?, ?)
//         `;

//         const [result] = await pool.execute(sql, [
//             name,
//             email,
//             feedbackRating,
//             message
//         ]);

//         res.status(200).json({
//             success: true,
//             message: "Thank you for your feedback!",
//             feedbackId: result.insertId
//         });

//     } catch (error) {

//         console.error("Feedback insert error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Unable to save your feedback."
//         });

//     }
// });

app.get("/api/feedback", async (req, res) => {

    try {

        const [rows] = await pool.execute(`
            SELECT
                id,
                profile,
                name,
                designation,
                comment,
                rating,
                created_at
            FROM feedback
            WHERE deleted_at IS NULL
            ORDER BY id DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("GET /api/feedback error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load feedback."
        });

    }

});

// ========================================
// EVENTS API
// GET /api/events
// ========================================

app.get("/api/events", async (req, res) => {

    try {

        const [rows] = await pool.execute(`
            SELECT
                id,
                image,
                title,
                event_date,
                event_time,
                description,
                location,
                created_at
            FROM events
            WHERE deleted_at IS NULL
            ORDER BY event_date DESC, id DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("GET /api/events error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load events."
        });

    }

});


// ========================================
// BLOG CATEGORY API
// GET /api/blog-categories
// ========================================

app.get("/api/blog-categories", async (req, res) => {

    try {

        const [rows] = await pool.execute(`
            SELECT
                id,
                category_name,
                created_at
            FROM blog_categories
            WHERE deleted_at IS NULL
            ORDER BY id ASC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("GET /api/blog-categories error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load blog categories."
        });

    }

});



console.log("server is running");

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`);
});


module.exports= connection;