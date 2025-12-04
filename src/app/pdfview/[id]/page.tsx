'use client';

import { EditableResume } from '@/components/pages/pdfview/editable-resume';
import api from '@/lib/axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResumePage() {
  const params = useParams();
  const [resume, setResume] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!params?.id) return;

    const fetchResume = async () => {
      try {
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/pdfview/${params.id}`
        );
        setResume(res.data);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, [params?.id]);

  // Handle save resume data
  const handleSaveResume = async (resumeData: any) => {
    if (!params?.id) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    console.log(resumeData);
    
    try {
      // Update the resume data structure to match your backend expectations
      const updateData = {
        data: resumeData,
        // Include any other fields your backend might need
        updatedAt: new Date().toISOString(),
      };

      const response = await api.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/update/${params.id}`,
        updateData
      );
      console.log(response);
      
      if (response.data.ok) {
        setSaveStatus('success');
        setResume({ ...resume, data: resumeData });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setSaveStatus('error');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsSaving(false);
    }
  };
  console.log();
  
  if (!resume) return <div>Loading...</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* Save Status Indicator */}
      {saveStatus === 'success' && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Resume saved successfully!
        </div>
      )}

      {saveStatus === 'error' && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#ef4444',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Failed to save resume. Please try again.
        </div>
      )}

      {isSaving && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#3b82f6',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Saving resume...
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <EditableResume 
        resume={resume.data} 
        onSave={handleSaveResume}
      />
    </div>
  );
}