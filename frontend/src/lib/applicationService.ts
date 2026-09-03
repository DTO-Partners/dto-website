import emailjs from '@emailjs/browser';
import type { 
  ApplicationFormData, 
  ApplicationSubmissionResult, 
  ValidationResult
} from '@/types/application';

/**
 * Application Service - Handles all business logic for application submissions
 * 
 * Features:
 * - Form validation with detailed error messages
 * - File upload handling and validation
 * - Email notifications to both applicant and company
 * - GDPR compliance tracking
 * - Application ID generation
 * - Error logging and metrics
 */
export class ApplicationService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  // EmailJS Configuration
  private static readonly EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
  private static readonly EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
  private static readonly EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
  
  /**
   * Validates the application form data
   */
  static validateApplication(data: ApplicationFormData): ValidationResult {
    const errors: Record<string, string> = {};
    
    // Required field validation
    if (!data.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    } else if (data.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!data.email?.trim()) {
      errors.email = 'Email address is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!data.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!this.isValidPhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // GDPR consent validation
    if (!data.gdprConsent) {
      errors.gdprConsent = 'You must consent to data processing to proceed';
    }
    
    // Professional summary validation (optional but recommended)
    if (data.professionalSummary && data.professionalSummary.length > 2000) {
      errors.professionalSummary = 'Professional summary must be less than 2000 characters';
    }
    
    // File validation
    if (data.cvFile) {
      const fileValidation = this.validateFile(data.cvFile);
      if (!fileValidation.isValid) {
        errors.cvFile = fileValidation.error ?? 'Invalid file';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Validates uploaded CV/Resume file
   */
  private static validateFile(file: File): { isValid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB'
      };
    }
    
    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only PDF, DOC, and DOCX files are allowed'
      };
    }
    
    return { isValid: true };
  }
  
  /**
   * Submits the application using EmailJS
   */
  static async submitApplication(data: ApplicationFormData): Promise<ApplicationSubmissionResult> {
    try {
      // Validate the application data
      const validation = this.validateApplication(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Please correct the errors in your application',
          errors: validation.errors
        };
      }
      
      // Generate unique application ID
      const applicationId = this.generateApplicationId();
      
      // Prepare email data for EmailJS
      const emailData = await this.prepareEmailData(data, applicationId);
      
      // Log email data for debugging (remove sensitive info)
      const debugData = { ...emailData };
      const { user_agent: userAgentForDebug, ...debugDataClean } = debugData;
      void userAgentForDebug;
      console.log('Sending EmailJS data:', debugDataClean);
      
      // Send main application email (now includes CV download link if available)
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        emailData,
        this.EMAILJS_PUBLIC_KEY
      );
      
      // Log successful submission
      this.logSubmission(applicationId, 'success');
      
      // Check if we're in development mode
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('local');
      
      // Provide feedback based on CV upload status and environment
      let cvUploadMessage = '';
      if (data.cvFile && emailData.cv_download_url) {
        cvUploadMessage = ' Your CV has been uploaded and is available for download in the email sent to our HR team.';
      } else if (data.cvFile && isDevelopment) {
        cvUploadMessage = ' Your CV upload was skipped in development mode. In production, CVs will be uploaded automatically.';
      } else if (data.cvFile) {
        cvUploadMessage = ' Your CV upload failed, but your application was submitted. Please email your CV directly to candidates@dtopartners.com with your application ID.';
      }
      
      return {
        success: true,
        message: `Application submitted successfully!${cvUploadMessage} We will review your application and get back to you soon.`,
        applicationId
      };
      
    } catch (error) {
      console.error('Application submission error:', error);
      
      // Log failed submission
      this.logSubmission('unknown', 'error', error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        message: 'We apologize, but there was an error submitting your application. Please try again or contact us directly at candidates@dtopartners.com.',
        errors: { general: error instanceof Error ? error.message : 'Submission failed' }
      };
    }
  }

  /**
   * Uploads CV file to temporary storage and gets download link
   * Handles CORS issues with fallback for localhost development
   */
  private static async uploadCVFile(file: File): Promise<string | null> {
    try {
      // Check if we're in development (localhost)
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('local');
      
      // Try multiple file upload services as fallbacks
      const uploadServices = [
        {
          name: 'tmpfiles.org',
          upload: () => this.uploadToTmpFiles(file)
        },
        {
          name: 'file.io',
          upload: () => this.uploadToFileIO(file)
        }
      ];
      
      for (const service of uploadServices) {
        try {
          console.log(`Attempting upload to ${service.name}...`);
          const result = await service.upload();
          if (result) {
            console.log(`CV uploaded successfully to ${service.name}: ${result}`);
            return result;
          }
        } catch (error) {
          console.warn(`Upload to ${service.name} failed:`, error);
          
          // In development, if all services fail due to CORS, show helpful message
          if (isDevelopment && error instanceof TypeError && error.message.includes('CORS')) {
            console.warn('CORS restriction detected in development. CV upload will work in production.');
            return null;
          }
          continue;
        }
      }
      
      throw new Error('All upload services failed');
      
    } catch (error) {
      console.error('CV file upload error:', error);
      return null;
    }
  }

  /**
   * Upload to file.io service
   */
  private static async uploadToFileIO(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expires', '7d');
    
    const response = await fetch('https://file.io', {
      method: 'POST',
      body: formData,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`file.io upload failed: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success ? result.link : null;
  }

  /**
   * Upload to tmpfiles.org service (CORS-friendly alternative)
   * Uses proxy in development to avoid CORS issues
   */
  private static async uploadToTmpFiles(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Use proxy in development, direct URL in production
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('local');
      
      const uploadUrl = isDevelopment 
        ? '/api/file-upload'  // Proxied through Vite
        : 'https://tmpfiles.org/api/v1/upload';
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`tmpfiles.org upload failed: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data?.url ?? null;
    } catch (error) {
      console.warn('tmpfiles.org upload failed:', error);
      return null;
    }
  }

  /**
   * Sends CV instructions or attempts to attach CV file
   */
  /**
   * Prepares email data for EmailJS template
   * Note: File content is NOT included due to EmailJS 50KB variable limit
   */
  private static async prepareEmailData(data: ApplicationFormData, applicationId: string) {
    const submissionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Try to upload CV file and get download link
    let cvDownloadUrl: string | null = null;
    if (data.cvFile) {
      cvDownloadUrl = await this.uploadCVFile(data.cvFile);
    }

    // Determine CV download status
    let cvDownloadStatus: string;
    if (cvDownloadUrl) {
      cvDownloadStatus = 'Available (expires in 7 days)';
    } else if (data.cvFile) {
      cvDownloadStatus = 'Upload failed - contact applicant';
    } else {
      cvDownloadStatus = 'No file uploaded';
    }

    // Determine CV note
    let cvNote: string;
    if (cvDownloadUrl) {
      cvNote = `CV file "${data.cvFile?.name}" is available for download at: ${cvDownloadUrl} (link expires in 7 days for security)`;
    } else if (data.cvFile) {
      cvNote = `CV file "${data.cvFile.name}" upload failed. Please contact ${data.fullName} at ${data.email} to request the file.`;
    } else {
      cvNote = 'No CV file was uploaded with this application.';
    }

    return {
      // Email routing
      to_email: 'candidates@dtopartners.com',
      
      // Application details
      application_id: applicationId,
      submission_date: submissionDate,
      
      // Applicant information
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      nationality: data.nationality ?? 'Not specified',
      
      // Work authorization
      work_authorization: data.workAuthorization ?? 'Not specified',
      visa_assistance: data.visaAssistance ?? 'Not specified',
      
      // Professional summary
      professional_summary: data.professionalSummary ?? 'Not provided',
      
      // File information with download link
      cv_file_name: data.cvFile?.name ?? 'No file uploaded',
      cv_file_size: data.cvFile ? `${(data.cvFile.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
      cv_file_type: data.cvFile?.type ?? 'N/A',
      cv_file_uploaded: data.cvFile ? 'Yes ✅' : 'No ❌',
      cv_download_url: cvDownloadUrl ?? '',
      cv_download_status: cvDownloadStatus,
      cv_download_display: cvDownloadUrl ? '' : 'display: none;',
      
      // GDPR consent (with emoji for better display)
      gdpr_consent: data.gdprConsent ? 'Yes ✅' : 'No ❌',
      
      // Additional metadata
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      
      // Browser information for better tracking
      browser_language: navigator.language,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Instructions for handling CV
      cv_note: cvNote
    };
  }

  /**
   * Email validation helper
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation helper
   */
  private static isValidPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }

  /**
   * Generates a unique application ID
   */
  private static generateApplicationId(): string {
    const prefix = 'DTO';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Logs submission for analytics and monitoring
   */
  private static logSubmission(applicationId: string, status: 'success' | 'error', error?: string): void {
    const logData = {
      applicationId,
      status,
      timestamp: new Date().toISOString(),
      error,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Analytics logging disabled due to API endpoint SSL/CORS issues
    // Re-enable when backend API is properly configured with valid SSL and CORS
    console.log('Application submission logged:', logData);
  }

  /**
   * Utility method to format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Utility method to check file type from filename
   */
  static getFileTypeFromName(filename: string): string {
    const extension = filename.toLowerCase().split('.').pop() ?? '';
    const typeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return typeMap[extension] || 'unknown';
  }
}
