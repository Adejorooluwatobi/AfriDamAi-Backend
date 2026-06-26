"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT', 465),
            secure: true,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }
    async sendResetPasswordEmail(email, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: 'RESET YOUR CLINICAL ACCESS',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Access Recovery</h2>
          <p style="color: #333; font-size: 14px;">A password reset was requested for your AfriDam clinical account.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Your Reset Code</p>
            <h1 style="margin: 10px 0; color: #333; letter-spacing: 5px; font-size: 32px;">${token}</h1>
          </div>

          <p style="color: #333; font-size: 14px; text-align: center;">Alternatively, you can click the button below:</p>

          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetLink}" style="background-color: #E1784F; color: white; padding: 16px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; font-size: 12px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 11px; color: #999;">This code and link expire in 30 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Clinical reset email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error.stack);
            return false;
        }
    }
    async sendVerificationCodeEmail(email, code) {
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: 'VERIFY YOUR AFRIDAM ACCOUNT',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Welcome to AfriDam</h2>
          <p style="color: #333; font-size: 14px;">Thank you for registering. Please use the verification code below to complete your account setup.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Your Verification Code</p>
            <h1 style="margin: 10px 0; color: #E1784F; letter-spacing: 8px; font-size: 40px; font-weight: bold;">${code}</h1>
          </div>

          <p style="font-size: 11px; color: #999; text-align: center;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Verification email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${email}`, error.stack);
            return false;
        }
    }
    async sendWelcomeEmail(email, name, role) {
        const roleTitle = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `WELCOME TO AFRIDAM AI - ${roleTitle.toUpperCase()} ACCOUNT`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Welcome aboard, ${name}!</h2>
          <p style="color: #333; font-size: 14px;">Your AfriDam AI ${roleTitle} account has been successfully created and verified.</p>
          <p style="color: #333; font-size: 14px;">We are thrilled to have you join our platform for advancing clinical intelligence.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'https://app.afridamai.com'}" style="background-color: #E1784F; color: white; padding: 16px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; font-size: 12px; display: inline-block;">Log in to your dashboard</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Welcome email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${email}`, error.stack);
            return false;
        }
    }
    async sendAppointmentCreatedEmail(email, appointmentDetails) {
        const appointmentDate = new Date(appointmentDetails.scheduledAt).toLocaleString();
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `APPOINTMENT CREATED - ${appointmentDetails.specialty}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Appointment Initiated</h2>
          <p style="color: #333; font-size: 14px;">Your request for a <strong>${appointmentDetails.specialty}</strong> appointment has been received.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px;">
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Appointment ID:</strong> ${appointmentDetails.id}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Scheduled For (Requested):</strong> ${appointmentDate}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Status:</strong> ${appointmentDetails.status}</p>
          </div>

          <p style="color: #333; font-size: 14px;">We are currently assigning the best available specialist for your consultation. You will receive another notification once a specialist has accepted.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Appointment created email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send appointment created email to ${email}`, error.stack);
            return false;
        }
    }
    async sendAppointmentAcceptedEmail(email, specialistName, appointmentDetails) {
        const appointmentDate = new Date(appointmentDetails.scheduledAt).toLocaleString();
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `APPOINTMENT CONFIRMED - DR. ${specialistName.toUpperCase()}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Specialist Assigned!</h2>
          <p style="color: #333; font-size: 14px;">Great news! <strong>Dr. ${specialistName}</strong> has accepted your ${appointmentDetails.specialty} appointment.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px;">
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Appointment ID:</strong> ${appointmentDetails.id}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Scheduled For:</strong> ${appointmentDate}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Specialist:</strong> Dr. ${specialistName}</p>
          </div>

          <p style="color: #333; font-size: 14px;">Please ensure you are online at the scheduled time to join the consultation session.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Appointment accepted email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send appointment accepted email to ${email}`, error.stack);
            return false;
        }
    }
    async sendSpecialistAppointmentAcceptedEmail(email, patientName, appointmentDetails) {
        const appointmentDate = new Date(appointmentDetails.scheduledAt).toLocaleString();
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `ASSIGNMENT CONFIRMED - ${patientName.toUpperCase()}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Appointment Accepted!</h2>
          <p style="color: #333; font-size: 14px;">You have successfully accepted the ${appointmentDetails.specialty} appointment with <strong>${patientName}</strong>.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px;">
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Appointment ID:</strong> ${appointmentDetails.id}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Scheduled For:</strong> ${appointmentDate}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Patient:</strong> ${patientName}</p>
          </div>

          <p style="color: #333; font-size: 14px;">Please ensure you are online at the scheduled time to start the consultation session.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Specialist appointment accepted email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send specialist appointment accepted email to ${email}`, error.stack);
            return false;
        }
    }
    async sendSessionStartEndEmail(email, otherPartyName, status, appointmentDetails) {
        const action = status === 'STARTED' ? 'has started' : 'has ended';
        const title = status === 'STARTED' ? 'Session Commenced' : 'Session Completed';
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `CLINICAL SESSION ${status} - ${appointmentDetails.id}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">${title}</h2>
          <p style="color: #333; font-size: 14px;">Your consultation session with <strong>${otherPartyName}</strong> ${action}.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px;">
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Appointment ID:</strong> ${appointmentDetails.id}</p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Specialty:</strong> ${appointmentDetails.specialty || 'Clinical Consultation'}</p>
          </div>
          
          ${status === 'ENDED' ? '<p style="color: #333; font-size: 14px;">Thank you for using AfriDam AI Clinical Services.</p>' : ''}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Session ${status} email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send session ${status} email to ${email}`, error.stack);
            return false;
        }
    }
    async sendOrderPurchaseEmail(email, orderDetails, role) {
        const isVendor = role === 'VENDOR';
        const subject = isVendor ? `NEW SALE NOTIFICATION - ORDER #${orderDetails.id}` : `ORDER CONFIRMED - #${orderDetails.id}`;
        const headerTitle = isVendor ? 'New Product Sale!' : 'Thank you for your purchase!';
        const message = isVendor
            ? `One or more of your products have been purchased in Order #${orderDetails.id}.`
            : `Your order #${orderDetails.id} has been successfully placed and confirmed.`;
        let itemsHtml = '<ul style="padding-left: 20px; color: #333; font-size: 13px;">';
        orderDetails.items.forEach((item) => {
            const productName = item.product?.name || item.name || 'Product';
            itemsHtml += `<li>${productName} (x${item.quantity}) - ₦${item.price}</li>`;
        });
        itemsHtml += '</ul>';
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: subject,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">${headerTitle}</h2>
          <p style="color: #333; font-size: 14px;">${message}</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 12px;">
            <p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Order ID:</strong> ${orderDetails.id}</p>
            ${!isVendor ? `<p style="margin: 5px 0; color: #333; font-size: 13px;"><strong>Total Amount:</strong> ₦${orderDetails.totalAmount}</p>` : ''}
            <p style="margin: 10px 0 5px 0; color: #333; font-size: 13px;"><strong>Items:</strong></p>
            ${itemsHtml}
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Order purchase email dispatched to ${role}: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send order purchase email to ${email}`, error.stack);
            return false;
        }
    }
    async sendWithdrawalStatusEmail(email, amount, status, notes) {
        let message = `Your withdrawal request for <strong>₦${amount}</strong> has been updated to: <strong style="color: #E1784F;">${status}</strong>.`;
        if (status === 'APPROVED') {
            message += '<p>Your request has been approved by our finance team and is pending payment.</p>';
        }
        else if (status === 'PAID') {
            message += '<p>The funds have been transferred to your registered account. Please allow up to 24 hours for it to reflect.</p>';
        }
        else if (status === 'REJECTED') {
            message += '<p>Unfortunately, your request could not be processed at this time.</p>';
        }
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `WITHDRAWAL REQUEST ${status} - ₦${amount}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Withdrawal Status Update</h2>
          <p style="color: #333; font-size: 14px;">${message}</p>
          
          ${notes ? `
          <div style="margin: 20px 0; padding: 20px; background-color: #fff3ed; border-radius: 12px; border: 1px solid #fbdad0;">
            <p style="margin: 0; color: #E1784F; font-size: 13px;"><strong>Admin Note:</strong> ${notes}</p>
          </div>` : ''}

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Withdrawal status email dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send withdrawal status email to ${email}`, error.stack);
            return false;
        }
    }
    async sendAdminNotificationEmail(email, subject, html) {
        const mailOptions = {
            from: `"AfriDam AI System" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `[ADMIN ALERT] ${subject}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; border-radius: 20px;">
          <h2 style="color: #dc2626; text-transform: uppercase;">System Activity Alert</h2>
          <div style="margin: 20px 0; padding: 20px; background-color: #fef2f2; border-radius: 12px; color: #333;">
            ${html}
          </div>
          <hr style="border: none; border-top: 1px solid #fecaca; margin: 20px 0;" />
          <p style="font-size: 9px; color: #999; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • System Administration • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Admin alert dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send admin alert to ${email}`, error.stack);
            return false;
        }
    }
    async sendSubscriptionStatusEmail(email, planName, status, reason) {
        const isSuccess = status === 'SUCCESS';
        const subject = isSuccess ? 'SUBSCRIPTION SUCCESSFUL' : 'SUBSCRIPTION PAYMENT FAILED';
        const title = isSuccess ? 'Subscription Activated' : 'Payment Issue Detected';
        const color = isSuccess ? '#E1784F' : '#dc2626';
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: subject,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: ${color}; text-transform: uppercase; font-style: italic;">${title}</h2>
          <p style="color: #333; font-size: 14px;">
            ${isSuccess
                ? `Your subscription to the <strong>${planName}</strong> plan is now active. You can now enjoy full clinical access.`
                : `We were unable to process your payment for the <strong>${planName}</strong> plan.`}
          </p>
          ${!isSuccess && reason ? `<p style="color: #dc2626; font-size: 13px;"><strong>Reason:</strong> ${reason}</p>` : ''}
          <div style="margin: 30px 0; text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL')}/billing" style="background-color: ${color}; color: white; padding: 16px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; font-size: 12px; display: inline-block;">
              View Billing Dashboard
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Subscription status email (${status}) dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send subscription status email to ${email}`, error.stack);
            return false;
        }
    }
    async sendAutoRenewalStatusEmail(email, planName, isEnabled) {
        const statusText = isEnabled ? 'ENABLED' : 'DISABLED';
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `SUBSCRIPTION AUTO-RENEWAL ${statusText}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #E1784F; text-transform: uppercase; font-style: italic;">Auto-Renewal Updated</h2>
          <p style="color: #333; font-size: 14px;">
            You have successfully <strong>${statusText.toLowerCase()}</strong> auto-renewal for your <strong>${planName}</strong> plan.
          </p>
          <p style="color: #666; font-size: 13px;">
            ${isEnabled
                ? 'Your subscription will automatically renew at the end of the current billing cycle.'
                : 'Your subscription will remain active until the end of the current period, after which it will not renew automatically.'}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Auto-renewal status email (${statusText}) dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send auto-renewal status email to ${email}`, error.stack);
            return false;
        }
    }
    async sendAccountStatusEmail(email, name, status, role) {
        const color = (status === 'DEACTIVATED' || status === 'SUSPENDED') ? '#dc2626' : '#16a34a';
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `ACCOUNT ${status} - ACTION REQUIRED`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: ${color}; text-transform: uppercase; font-style: italic;">Account Status: ${status}</h2>
          <p style="color: #333; font-size: 14px;">Hello ${name},</p>
          <p style="color: #333; font-size: 14px;">
            Your AfriDam AI <strong>${role}</strong> account has been <strong>${status.toLowerCase()}</strong> by a system administrator.
          </p>
          <p style="color: #666; font-size: 13px;">
            If you believe this was an error or have questions, please contact our support team immediately.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Account status email (${status}) dispatched to: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send account status email to ${email}`, error.stack);
            return false;
        }
    }
    async sendProductDeletedEmail(email, productName, reason) {
        const mailOptions = {
            from: `"AfriDam AI" <${this.configService.get('MAIL_USER')}>`,
            to: email,
            subject: `PRODUCT REMOVED FROM CATALOG - ${productName.toUpperCase()}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #dc2626; text-transform: uppercase; font-style: italic;">Product Deleted</h2>
          <p style="color: #333; font-size: 14px;">
            Your product <strong>${productName}</strong> has been removed from the AfriDam AI catalog by an administrator.
          </p>
          ${reason ? `<div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #333; font-size: 13px;"><strong>Reason:</strong> ${reason}</p>
          </div>` : ''}
          <p style="color: #666; font-size: 13px;">
            Please review our product guidelines or contact your vendor manager for more details.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; text-align: center;">© 2026 AfriDam AI • Clinical Intelligence • Lagos, Nigeria</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Product deletion email dispatched to vendor: ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send product deletion email to ${email}`, error.stack);
            return false;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map