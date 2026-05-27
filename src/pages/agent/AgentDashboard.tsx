import { useState } from 'react'
import { AgentNavbar } from '../../components/agent/layout/AgentNavbar'
import { AgentSidebar } from '../../components/agent/layout/AgentSidebar'
import { EnquiryDetail } from '../../components/agent/enquiry/EnquiryDetail'
import { DocSearchPanel } from '../../components/agent/documents/DocSearchPanel'
import { UploadPanel } from '../../components/agent/upload/UploadPanel'
import { useAgentEnquiries } from '../../hooks/useAgentEnquiries'
import { useEnquiryDraft } from '../../hooks/useEnquiryDraft'
import { useFileUpload } from '../../hooks/useFileUpload'
import type { AgentTab } from '../../types/agent'

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<AgentTab>('enquiry')
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null)

  const { enquiries, isLoading: enquiriesLoading, error: enquiriesError, updateEnquiryStatus } = useAgentEnquiries()
  const fileUpload = useFileUpload()

  const selectedEnquiry = enquiries.find(e => e.id === selectedEnquiryId) ?? null
  const enquiryDraft = useEnquiryDraft(selectedEnquiry, updateEnquiryStatus) // onStatusChange

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex flex-col p-4 gap-4 md:flex-1 md:min-h-0">
        <AgentNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col md:flex-row md:flex-1 md:min-h-0">
          <AgentSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            enquiries={enquiries}
            enquiriesLoading={enquiriesLoading}
            enquiriesError={enquiriesError}
            selectedEnquiryId={selectedEnquiryId}
            onSelectEnquiry={setSelectedEnquiryId}
            uploads={fileUpload.uploads}
            isGenerating={enquiryDraft.isLoading}
          />
          <div className="md:flex-1 md:min-h-0 md:flex md:flex-col md:border-l md:border-slate-200 dark:md:border-slate-700 md:pl-4">
            {activeTab === 'enquiry' && (
              <EnquiryDetail
                key={selectedEnquiryId}
                enquiry={selectedEnquiry}
                draft={enquiryDraft}
              />
            )}
            {activeTab === 'documents' && <DocSearchPanel />}
            {activeTab === 'upload' && (
              <UploadPanel
                uploads={fileUpload.uploads}
                isUploading={fileUpload.isUploading}
                error={fileUpload.error}
                onUpload={fileUpload.upload}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
