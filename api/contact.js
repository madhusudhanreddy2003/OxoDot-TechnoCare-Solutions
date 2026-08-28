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
     * SMTP CONFIGURATION
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
     * CHECK SMTP CREDENTIALS
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
            .replace(/\r?\n/g, "<br>");

    /*
     * ============================================================
     * EMAIL SUBJECT
     * ============================================================
     */

    const emailSubject =
        "We got a new Enquiry from the website";

    /*
     * ============================================================
     * HTML EMAIL
     * ============================================================
     */

    const htmlEmail = `
<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        New Website Enquiry
    </title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:#eef3f7;
        font-family:
            Arial,
            Helvetica,
            sans-serif;
        color:#172033;
    "
>

    <!-- Main Wrapper -->

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            background:#eef3f7;
            padding:40px 15px;
        "
    >

        <tr>

            <td align="center">

                <!-- Email Container -->

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width:680px;
                        background:#ffffff;
                        border-radius:18px;
                        overflow:hidden;
                        box-shadow:
                            0 12px 40px
                            rgba(7,21,45,0.12);
                    "
                >

                    <!-- ================================================= -->
                    <!-- HEADER -->
                    <!-- ================================================= -->

                    <tr>

                        <td
                            style="
                                padding:34px 38px;
                                background:
                                    linear-gradient(
                                        135deg,
                                        #07152d 0%,
                                        #0d3154 52%,
                                        #13c9b0 100%
                                    );
                            "
                        >

                            <div
                                style="
                                    font-size:25px;
                                    font-weight:700;
                                    color:#ffffff;
                                    letter-spacing:0.3px;
                                "
                            >
                                OXODOT TECHNOCARE
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:15px;
                                    font-weight:500;
                                    color:#d9fdf8;
                                "
                            >
                                SOLUTIONS
                            </div>

                            <div
                                style="
                                    margin-top:22px;
                                    width:50px;
                                    height:4px;
                                    background:#14d6bb;
                                    border-radius:10px;
                                "
                            ></div>

                            <div
                                style="
                                    margin-top:22px;
                                    font-size:21px;
                                    font-weight:600;
                                    color:#ffffff;
                                "
                            >
                                New Website Enquiry
                            </div>

                            <div
                                style="
                                    margin-top:7px;
                                    font-size:13px;
                                    color:#d6e4f0;
                                "
                            >
                                A new enquiry has been submitted
                                through your website.
                            </div>

                        </td>

                    </tr>


                    <!-- ================================================= -->
                    <!-- CONTENT -->
                    <!-- ================================================= -->

                    <tr>

                        <td
                            style="
                                padding:35px 38px 20px 38px;
                            "
                        >

                            <!-- Intro -->

                            <p
                                style="
                                    margin:0 0 25px 0;
                                    font-size:15px;
                                    line-height:1.7;
                                    color:#566174;
                                "
                            >
                                You have received a new enquiry
                                from the OXODOT TECHNOCARE
                                SOLUTIONS website.
                            </p>


                            <!-- ================================================= -->
                            <!-- NAME -->
                            <!-- ================================================= -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-bottom:14px;
                                    background:#f7f9fc;
                                    border:1px solid #e7edf3;
                                    border-radius:12px;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding:18px 20px;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:11px;
                                                font-weight:700;
                                                text-transform:uppercase;
                                                letter-spacing:1px;
                                                color:#0fae9a;
                                                margin-bottom:7px;
                                            "
                                        >
                                            Name
                                        </div>

                                        <div
                                            style="
                                                font-size:16px;
                                                font-weight:600;
                                                color:#172033;
                                            "
                                        >
                                            ${safeName}
                                        </div>

                                    </td>

                                </tr>

                            </table>


                            <!-- ================================================= -->
                            <!-- FROM -->
                            <!-- ================================================= -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-bottom:14px;
                                    background:#f7f9fc;
                                    border:1px solid #e7edf3;
                                    border-radius:12px;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding:18px 20px;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:11px;
                                                font-weight:700;
                                                text-transform:uppercase;
                                                letter-spacing:1px;
                                                color:#0fae9a;
                                                margin-bottom:7px;
                                            "
                                        >
                                            From
                                        </div>

                                        <a
                                            href="mailto:${safeEmail}"
                                            style="
                                                font-size:16px;
                                                font-weight:600;
                                                color:#087f9f;
                                                text-decoration:none;
                                                word-break:break-word;
                                            "
                                        >
                                            ${safeEmail}
                                        </a>

                                    </td>

                                </tr>

                            </table>


                            <!-- ================================================= -->
                            <!-- CONTACT NUMBER -->
                            <!-- ================================================= -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-bottom:14px;
                                    background:#f7f9fc;
                                    border:1px solid #e7edf3;
                                    border-radius:12px;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding:18px 20px;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:11px;
                                                font-weight:700;
                                                text-transform:uppercase;
                                                letter-spacing:1px;
                                                color:#0fae9a;
                                                margin-bottom:7px;
                                            "
                                        >
                                            Contact Number
                                        </div>

                                        <a
                                            href="tel:${safePhone}"
                                            style="
                                                font-size:16px;
                                                font-weight:600;
                                                color:#172033;
                                                text-decoration:none;
                                            "
                                        >
                                            ${safePhone}
                                        </a>

                                    </td>

                                </tr>

                            </table>


                            <!-- ================================================= -->
                            <!-- ENQUIRY -->
                            <!-- ================================================= -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-bottom:10px;
                                    background:#f7f9fc;
                                    border:1px solid #e7edf3;
                                    border-radius:12px;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding:20px;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:11px;
                                                font-weight:700;
                                                text-transform:uppercase;
                                                letter-spacing:1px;
                                                color:#0fae9a;
                                                margin-bottom:9px;
                                            "
                                        >
                                            Enquiry
                                        </div>

                                        <div
                                            style="
                                                font-size:15px;
                                                line-height:1.75;
                                                color:#414b5d;
                                                word-break:break-word;
                                            "
                                        >
                                            ${safeMessage}
                                        </div>

                                    </td>

                                </tr>

                            </table>

                        </td>

                    </tr>


                    <!-- ================================================= -->
                    <!-- ACTION BAR -->
                    <!-- ================================================= -->

                    <tr>

                        <td
                            style="
                                padding:10px 38px 30px 38px;
                            "
                        >

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    background:#07152d;
                                    border-radius:12px;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding:18px 20px;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:13px;
                                                color:#cbd8e7;
                                                line-height:1.6;
                                            "
                                        >
                                            <strong
                                                style="
                                                    color:#ffffff;
                                                "
                                            >
                                                Quick Action
                                            </strong>
                                            <br>

                                            Simply click
                                            <strong
                                                style="
                                                    color:#16d5ba;
                                                "
                                            >
                                                Reply
                                            </strong>
                                            to respond directly
                                            to the customer.
                                        </div>

                                    </td>

                                </tr>

                            </table>

                        </td>

                    </tr>


                    <!-- ================================================= -->
                    <!-- FOOTER -->
                    <!-- ================================================= -->

                    <tr>

                        <td
                            style="
                                padding:25px 38px 30px 38px;
                                border-top:1px solid #e8edf2;
                                text-align:center;
                            "
                        >

                            <div
                                style="
                                    font-size:13px;
                                    font-weight:600;
                                    color:#172033;
                                "
                            >
                                OXODOT TECHNOCARE SOLUTIONS
                            </div>

                            <div
                                style="
                                    margin-top:7px;
                                    font-size:12px;
                                    color:#8993a3;
                                    line-height:1.6;
                                "
                            >
                                This enquiry was submitted
                                through the company website.
                            </div>

                            <div
                                style="
                                    margin-top:10px;
                                    font-size:12px;
                                    color:#0fae9a;
                                "
                            >
                                oxodottechnocaresolutions.com
                            </div>

                        </td>

                    </tr>

                </table>

                <!-- End Email Container -->

            </td>

        </tr>

    </table>

</body>

</html>
`;

    /*
     * ============================================================
     * PLAIN TEXT EMAIL
     * ============================================================
     *
     * This is used by email clients that do not support HTML.
     *
     * ============================================================
     */

    const textEmail = `
OXODOT TECHNOCARE SOLUTIONS

NEW WEBSITE ENQUIRY
===================

We got a new enquiry from the website.

Name:
${cleanName}

From:
${cleanEmail}

Contact Number:
${cleanPhone}

Enquiry:
${cleanMessage}


----------------------------------------

OXODOT TECHNOCARE SOLUTIONS
oxodottechnocaresolutions.com

This enquiry was submitted through the company website.

Simply reply to this email to respond directly to the customer.
`;

    /*
     * ============================================================
     * SEND EMAIL
     * ============================================================
     */

    try {

        await transporter.sendMail({

            /*
             * Sender
             */

            from: {
                name: "OXODOT TECHNOCARE SOLUTIONS",
                address: mailFrom
            },

            /*
             * Recipient
             */

            to: mailTo,

            /*
             * VERY IMPORTANT
             *
             * When you click Reply in Hostinger,
             * it will reply directly to the customer.
             */

            replyTo: {
                name: cleanName,
                address: cleanEmail
            },

            /*
             * Subject
             */

            subject:
                "We got a new Enquiry from the website",

            /*
             * Plain text fallback
             */

            text: textEmail,

            /*
             * Professional HTML email
             */

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