import React from 'react';
import { 
  Book, 
  FileText, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  Building2,
  CheckCircle2,
  Globe2,
  Bookmark
} from 'lucide-react';
import { Course } from '../services/courseService';

interface TabProps {
  providerId: string;
  providerData: Course;
  addActivityLog: (log: any) => void;
  userRole: string;
}

// 1. CURRICULUM TAB
export const CourseCurriculumTab: React.FC<TabProps> = ({ providerData }) => {
  const modules = [
    { title: 'Foundations of Science', duration: '4 Weeks', credits: 10, status: 'Completed' },
    { title: 'Advanced Research Methods', duration: '6 Weeks', credits: 15, status: 'In Progress' },
    { title: 'Core Principles of Excellence', duration: '8 Weeks', credits: 20, status: 'Available' },
    { title: 'Final Project & Thesis', duration: '12 Weeks', credits: 30, status: 'Available' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Book size={20} className="text-indigo-600" />
            Curriculum Overview
          </h3>
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-gray-900">{mod.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10} /> {mod.duration}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Bookmark size={10} /> {mod.credits} Credits</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  mod.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                  mod.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col justify-center">
            <Award size={48} className="mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Accreditation & Quality</h3>
            <p className="text-sm text-gray-500">This course is fully accredited by Global Academic Standards (GAS) and meets international education quality frameworks.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">GAS Accredited</span>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">ISO 9001 Certified</span>
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold">QS ⭐⭐⭐⭐⭐</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// 2. ADMISSIONS TAB
export const CourseAdmissionsTab: React.FC<TabProps> = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Application Fee', value: '$75.00', icon: <FileText className="text-blue-600" />, sub: 'Non-refundable' },
                    { label: 'Next Intake', value: 'Sept 2024', icon: <Calendar className="text-indigo-600" />, sub: 'Spring Session' },
                    { label: 'Min. GPA', value: '3.0 / 4.0', icon: <CheckCircle2 className="text-green-600" />, sub: 'Recommended' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl">{item.icon}</div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{item.label}</p>
                                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{item.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Users size={24} className="text-indigo-600" />
                        Admission Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#253154] uppercase tracking-widest">Document Checklist</h4>
                            {[
                                'Official Academic Transcripts',
                                'Proof of English Proficiency (IELTS/TOEFL)',
                                'Statement of Purpose (SOP)',
                                'Letters of Recommendation (x2)',
                                'Valid Passport Copy'
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">{doc}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#253154] uppercase tracking-widest">Entrance Tests</h4>
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                                <p className="text-sm font-bold text-indigo-900 mb-2">GMAT / GRE Requirement</p>
                                <p className="text-xs text-indigo-700 leading-relaxed">Students applying for post-graduate degrees must provide valid GRE scores (min. 310) or GMAT scores (min. 650). Waivers are available for students with 5+ years of relevant experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. PROVIDERS TAB
export const CourseProvidersTab: React.FC<TabProps> = () => {
    const providers = [
        { name: 'University of Oxford', location: 'United Kingdom', intake: 'Open', ranking: '#1 Global' },
        { name: 'Stanford University', location: 'United States', intake: 'Closing Soon', ranking: '#3 Global' },
        { name: 'National University of Singapore', location: 'Singapore', intake: 'Not Started', ranking: '#11 Global' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Partner Institutions</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">Request New Partner</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {providers.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-indigo-900/5 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                            <Building2 size={24} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{p.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <Globe2 size={12} />
                            {p.location}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                p.intake === 'Open' ? 'bg-green-100 text-green-700' : 
                                p.intake === 'Closing Soon' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {p.intake}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-600">{p.ranking}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
