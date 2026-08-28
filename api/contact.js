import nodemailer from "nodemailer";

export const runtime = "nodejs";

export default async function handler(req, res) {
    /*
     * ============================================================
     * ONLY ALLOW POST REQUESTS
     * ============================================================
     */

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed."
        });
    }

    /*
     * ============================================================
     * READ FORM DATA
     * ============================================================
     */

    const {
        name,
        email,
        phone,
        message
    } = req.body || {};

    /*
     * ============================================================
     * BASIC VALIDATION
     * ============================================================
     */

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please enter your full name."
        });
    }

    if (!email || !email.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please enter your email address."
        });
    }

    if (!phone || !phone.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please enter your phone number."
        });
    }

    if (!message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please enter your message."
        });
    }

    /*
     * ============================================================
     * EMAIL VALIDATION
     * ============================================================
     */

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    /*
     * ============================================================
     * GET SMTP CREDENTIALS FROM ENVIRONMENT VARIABLES
     * ============================================================
     */

    const smtpHost =
        process.env.SMTP_HOST || "smtp.hostinger.com";

    const smtpPort =
        Number(process.env.SMTP_PORT) || 465;

    const smtpUser =
        process.env.SMTP_USER;

    const smtpPassword =
        process.env.SMTP_PASSWORD;

    const mailFrom =
        process.env.MAIL_FROM ||
        "info@oxodottechnocaresolutions.com";

    const mailTo =
        process.env.MAIL_TO ||
        "info@oxodottechnocaresolutions.com";

    /*
     * ============================================================
     * MAKE SURE SMTP CREDENTIALS EXIST
     * ============================================================
     */

    if (!smtpUser || !smtpPassword) {
        console.error(
            "SMTP environment variables are missing."
        );

        return res.status(500).json({
            success: false,
            message:
                "Email service is not configured correctly. Please try again later."
        });
    }

    /*
     * ============================================================
     * CREATE NODEMAILER TRANSPORTER
     * ============================================================
     *
     * Hostinger:
     *
     * smtp.hostinger.com
     * Port 465
     * SSL
     *
     * ============================================================
     */

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        }
    });

    /*
     * ============================================================
     * CLEAN USER INPUT
     * ============================================================
     */

    const cleanName =
        name.trim().slice(0, 100);

    const cleanEmail =
        email.trim().slice(0, 150);

    const cleanPhone =
        phone.trim().slice(0, 50);

    const cleanMessage =
        message.trim().slice(0, 5000);

    /*
     * ============================================================
     * ESCAPE HTML
     * ============================================================
     *
     * Prevents user-submitted HTML from being injected into
     * the email body.
     *
     * ============================================================
     */

    function escapeHtml(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const safeName =
        escapeHtml(cleanName);

    const safeEmail =
        escapeHtml(cleanEmail);

    const safePhone =
        escapeHtml(cleanPhone);

    const safeMessage =
        escapeHtml(cleanMessage)
            .replace(/\n/g, "<br>");

    /*
     * ============================================================
     * EMAIL CONTENT
     * ============================================================
     */

    const emailSubject =
        `New Website Enquiry - ${cleanName}`;

    const htmlEmail = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>New Website Enquiry</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background:#f4f7fb;
            font-family:Arial,Helvetica,sans-serif;
            color:#1a1a1a;
        ">

            <div style="
                max-width:680px;
                margin:40px auto;
                background:#ffffff;
                border-radius:16px;
                overflow:hidden;
                box-shadow:0 10px 35px rgba(0,0,0,0.08);
            ">

                <div style="
                    padding:30px;
                    background:linear-gradient(
                        135deg,
                        #07152d,
                        #123d63,
                        #18c9aa
                    );
                    color:#ffffff;
                ">

                    <h1 style="
                        margin:0;
                        font-size:26px;
                    ">
                        OXODOT TECHNOCARE SOLUTIONS
                    </h1>

                    <p style="
                        margin:8px 0 0;
                        opacity:.85;
                        font-size:14px;
                    ">
                        New Website Contact Enquiry
                    </p>

                </div>

                <div style="padding:30px;">

                    <div style="
                        margin-bottom:20px;
                        padding:18px;
                        background:#f7f9fc;
                        border-radius:10px;
                    ">

                        <strong>Full Name</strong>

                        <div style="
                            margin-top:6px;
                            color:#555;
                        ">
                            ${safeName}
                        </div>

                    </div>


                    <div style="
                        margin-bottom:20px;
                        padding:18px;
                        background:#f7f9fc;
                        border-radius:10px;
                    ">

                        <strong>Email Address</strong>

                        <div style="
                            margin-top:6px;
                            color:#555;
                        ">
                            ${safeEmail}
                        </div>

                    </div>


                    <div style="
                        margin-bottom:20px;
                        padding:18px;
                        background:#f7f9fc;
                        border-radius:10px;
                    ">

                        <strong>Phone Number</strong>

                        <div style="
                            margin-top:6px;
                            color:#555;
                        ">
                            ${safePhone}
                        </div>

                    </div>


                    <div style="
                        margin-bottom:20px;
                        padding:18px;
                        background:#f7f9fc;
                        border-radius:10px;
                    ">

                        <strong>Message</strong>

                        <div style="
                            margin-top:10px;
                            color:#555;
                            line-height:1.7;
                        ">
                            ${safeMessage}
                        </div>

                    </div>

                    <div style="
                        margin-top:30px;
                        padding-top:20px;
                        border-top:1px solid #e5e7eb;
                        color:#888;
                        font-size:12px;
                    ">

                        This enquiry was submitted through:

                        <strong>
                            oxodottechnocaresolutions.com
                        </strong>

                    </div>

                </div>

            </div>

        </body>
        </html>
    `;

    /*
     * ============================================================
     * PLAIN TEXT VERSION
     * ============================================================
     */

    const textEmail = `
OXODOT TECHNOCARE SOLUTIONS

New Website Contact Enquiry

Full Name:
${cleanName}

Email Address:
${cleanEmail}

Phone Number:
${cleanPhone}

Message:
${cleanMessage}

----------------------------------------

Submitted through:
oxodottechnocaresolutions.com
`;

    /*
     * ============================================================
     * SEND EMAIL
     * ============================================================
     */

    try {

        await transporter.sendMail({

            from: {
                name: "OXODOT TECHNOCARE SOLUTIONS",
                address: mailFrom
            },

            to: mailTo,

            replyTo: {
                name: cleanName,
                address: cleanEmail
            },

            subject: emailSubject,

            text: textEmail,

            html: htmlEmail
        });

        /*
         * ========================================================
         * SUCCESS
         * ========================================================
         */

        return res.status(200).json({
            success: true,
            message:
                "Your message has been sent successfully. Our team will contact you soon."
        });

    } catch (error) {

        /*
         * ========================================================
         * SERVER LOG
         * ========================================================
         */

        console.error(
            "Contact form email error:",
            error
        );

        /*
         * ========================================================
         * USER RESPONSE
         * ========================================================
         */

        return res.status(500).json({
            success: false,
            message:
                "We could not send your message right now. Please try again later."
        });
    }
}