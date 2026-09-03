import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { useApplicationForm } from "@/hooks/useApplicationForm"
import { StatusMessages } from "@/components/application/StatusMessages"
import { InfoForEmployersAndCandidates, ContactInformation, PhoneNumbers, CompanyInfo } from "@/components/application/InfoSections"
import { ApplicationForm } from "@/components/application/ApplicationForm"

export default function ApplyForm() {
  const { submissionResult, showSuccess, setShowSuccess } = useApplicationForm()

  return (
    <section id="Candidates & Employers">
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#fdf6e3] to-[#f9fafb]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.08),transparent_60%)]" />
        
        <div className="relative py-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <motion.div 
              className="inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="border-[#daa520] text-[#daa520] mb-6 px-6 py-2 text-sm font-semibold tracking-widest bg-[#fdf6e3]/80 backdrop-blur-sm"
              >
                DTO PARTNERS
              </Badge>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-light text-[#1a1a2e] mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Connect <span className="font-bold text-[#daa520]">with</span> Excellence
            </motion.h1>
            <motion.div 
              className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#daa520] to-transparent mx-auto rounded-full mb-8"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.p 
              className="text-[#1a1a2e]/70 max-w-3xl mx-auto text-xl leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your gateway to exceptional opportunities and strategic partnerships. 
              We connect talent with vision and organizations with excellence.
            </motion.p>
          </div>

          {/* Info Sections */}
          <InfoForEmployersAndCandidates />
          <ContactInformation />
          <PhoneNumbers />
          <CompanyInfo />

          {/* Status Messages */}
          <StatusMessages 
            submissionResult={submissionResult}
            showSuccess={showSuccess}
            onDismissSuccess={() => setShowSuccess(false)}
          />

          {/* Application Form */}
          <ApplicationForm />
        </div>
      </div>
    </section>
  )
}
