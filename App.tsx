import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
    UserRole,
    JobPosting,
    Application,
    Toast,
    starterJobs,
    JobType,
    ExperienceLevel,
    generateJobDescription
} from './types';

// --- UTILITY FUNCTIONS ---
const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};


// --- ICONS (Consolidated) ---
const Icons = {
    MapPin: ({ className = 'w-4 h-4' }) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    Briefcase: ({ className = 'w-4 h-4' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25h-13.5a2.25 2.25 0 0 1-2.25-2.25v-4.07m18 0a2.25 2.25 0 0 0-2.25-2.25h-13.5a2.25 2.25 0 0 0-2.25 2.25m18 0v-4.87a2.25 2.25 0 0 0-2.25-2.25h-13.5a2.25 2.25 0 0 0-2.25 2.25v4.87" />
        </svg>
    ),
    CurrencyDollar: ({ className = 'w-4 h-4' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11c-.77 0-1.536.21-2.121.579m-2.121 0a4.5 4.5 0 0 0-6.364 6.364m12.728 0a4.5 4.5 0 0 1-6.364-6.364" />
        </svg>
    ),
    ChartBar: ({ className = 'w-4 h-4' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
    ),
    ChevronDown: ({ className = 'w-3 h-3' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    ),
    XMark: ({ className = 'w-6 h-6' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    ),
    Sparkles: ({ className = 'w-5 h-5' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
    ),
    Pencil: ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>,
    Trash: ({ className = 'w-4 h-4' }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>,
};

const HireHubLogo = ({ className = 'h-9 text-blue-900' }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
            <g fill="none" stroke="#0C4A6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="10" />
                <circle cx="6" cy="18" r="3" fill="#0C4A6E" />
                <circle cx="30" cy="18" r="3" fill="#0C4A6E" />
                <circle cx="18" cy="6" r="3" fill="#0C4A6E" />
            </g>
            <g transform="translate(10 12)">
                <path d="M1 4H15C15.5523 4 16 4.44772 16 5V11C16 11.5523 15.5523 12 15 12H1C0.447715 12 0 11.5523 0 11V5C0 4.44772 0.447715 4 1 4Z" fill="#10B981" />
                <path d="M4 4V2C4 0.895431 4.89543 0 6 0H10C11.1046 0 12 0.895431 12 2V4H4Z" fill="#10B981" />
            </g>
        </svg>
        <span className="text-3xl font-bold text-current" style={{color: '#0C4A6E'}}>HireHub</span>
    </div>
);

// --- HEADER COMPONENT ---
const Header: React.FC<{
    onPostJobClick: () => void;
    role: UserRole;
    setRole: (role: UserRole) => void;
}> = ({ onPostJobClick, role, setRole }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-slate-200">
        <HireHubLogo />
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center p-1 bg-slate-200 rounded-lg">
                {(Object.values(UserRole) as UserRole[]).map(r => (
                    <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            role === r ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'
                        }`}
                    >
                        {r}
                    </button>
                ))}
            </div>
            {role === UserRole.RECRUITER && (
                <button
                    onClick={onPostJobClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                >
                    Post a Job
                </button>
            )}
        </div>
    </div>
);


// --- FILTER BAR COMPONENT (NEW DESIGN) ---
const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) callback();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
};

const FilterPopover: React.FC<{
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    onClose: () => void;
}> = ({ items, selectedItems, onToggle, onClose }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClick(wrapperRef, onClose);

    return (
        <div ref={wrapperRef} className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
            <div className="p-2">
                {items.map((item) => (
                    <label key={item} className="flex items-center space-x-3 p-2 cursor-pointer rounded-md hover:bg-slate-100">
                        <input type="checkbox" checked={selectedItems.includes(item)} onChange={() => onToggle(item)} className="h-4 w-4 bg-slate-100 text-blue-800 border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-white" />
                        <span className="text-slate-700 text-sm font-medium">{item}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const FilterBar: React.FC<{
  typeFilters: JobType[]; setTypeFilters: (types: JobType[]) => void;
  locations: string[]; locationFilters: string[]; setLocationFilters: (locations: string[]) => void;
  experienceFilters: ExperienceLevel[]; setExperienceFilters: (levels: ExperienceLevel[]) => void;
  searchTerm: string; setSearchTerm: (term: string) => void;
  sortBy: string; setSortBy: (sort: string) => void;
}> = ({ typeFilters, setTypeFilters, locations, locationFilters, setLocationFilters, experienceFilters, setExperienceFilters, searchTerm, setSearchTerm, sortBy, setSortBy }) => {
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    
    const handleToggleFilter = <T extends string>(value: T, selectedValues: T[], setter: (values: T[]) => void) => {
        setter(selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value]);
    };

    const allLocations = [...new Set(locations)].sort();
    const hasActiveFilters = typeFilters.length > 0 || locationFilters.length > 0 || experienceFilters.length > 0;

    const FilterButton: React.FC<{ title: string; filterKey: string; activeCount: number; children: React.ReactNode }> = ({ title, filterKey, activeCount, children }) => (
        <div className="relative">
            <button
                onClick={() => setOpenFilter(openFilter === filterKey ? null : filterKey)}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg shadow-sm transition-colors ${
                    openFilter === filterKey || activeCount > 0
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
            >
                {title}
                {activeCount > 0 && <span className="bg-blue-200 text-blue-900 text-xs font-semibold px-2 py-0.5 rounded-full">{activeCount}</span>}
                <Icons.ChevronDown className={`transform transition-transform ${openFilter === filterKey ? 'rotate-180' : ''}`} />
            </button>
            {openFilter === filterKey && children}
        </div>
    );

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by title, company, tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <FilterButton title="Job Type" filterKey="type" activeCount={typeFilters.length}>
                    <FilterPopover items={Object.values(JobType)} selectedItems={typeFilters} onToggle={(item) => handleToggleFilter(item, typeFilters, setTypeFilters)} onClose={() => setOpenFilter(null)} />
                </FilterButton>
                <FilterButton title="Location" filterKey="location" activeCount={locationFilters.length}>
                    <FilterPopover items={allLocations} selectedItems={locationFilters} onToggle={(item) => handleToggleFilter(item, locationFilters, setLocationFilters)} onClose={() => setOpenFilter(null)} />
                </FilterButton>
                <FilterButton title="Experience" filterKey="experience" activeCount={experienceFilters.length}>
                    <FilterPopover items={Object.values(ExperienceLevel)} selectedItems={experienceFilters} onToggle={(item) => handleToggleFilter(item, experienceFilters, setExperienceFilters)} onClose={() => setOpenFilter(null)} />
                </FilterButton>

                <div className="flex-grow"></div>
                
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="date-desc">Newest First</option>
                    <option value="salary-desc">Salary: High to Low</option>
                </select>

                {hasActiveFilters && (
                    <button onClick={() => { setTypeFilters([]); setLocationFilters([]); setExperienceFilters([]); }} className="text-sm font-medium text-blue-800 hover:text-blue-700 hover:underline">
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
};

// --- JOB LIST & CARD COMPONENT ---
const JobCard: React.FC<{ job: JobPosting; onSelect: (job: JobPosting) => void; isSelected: boolean; hasApplied: boolean; }> = ({ job, onSelect, isSelected, hasApplied }) => {
  const formatSalary = (min: number, max: number) => `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  return (
    <div 
        onClick={() => onSelect(job)} 
        className={`bg-white rounded-xl border-l-4 transition-all duration-200 cursor-pointer ${isSelected ? 'border-blue-800 shadow-md' : 'border-transparent hover:border-blue-500 hover:shadow-md'}`}
    >
      <div className="p-5 border border-slate-200 rounded-r-xl rounded-l-md h-full">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{job.company}</p>
            </div>
            {hasApplied && <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Applied</span>}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4">
            <div className="flex items-center"><Icons.MapPin className="mr-1.5 text-slate-400"/> {job.location}</div>
            <div className="flex items-center"><Icons.Briefcase className="mr-1.5 text-slate-400"/> {job.type}</div>
            <div className="flex items-center"><Icons.CurrencyDollar className="mr-1.5 text-slate-400"/> {formatSalary(job.salaryMin, job.salaryMax)}</div>
        </div>
        <div className="flex justify-between items-center">
             <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">{tag}</span>
                ))}
            </div>
            <p className="text-xs text-slate-400">{timeAgo(job.datePosted)}</p>
        </div>
      </div>
    </div>
  );
};

const JobList: React.FC<{ 
    jobs: JobPosting[]; 
    selectedJob: JobPosting | null;
    onSelectJob: (job: JobPosting) => void; 
    appliedJobIds: Set<string>;
}> = ({ jobs, selectedJob, onSelectJob, appliedJobIds }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center bg-white p-12 rounded-xl border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-700">No Jobs Found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }
  return (
    <div className="w-full mt-6 space-y-4">
        <p className="text-sm text-slate-500 px-2">{jobs.length} jobs found</p>
        <div className="flex flex-col space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto pr-2 -mr-2">
          {jobs.map((job) => (
            <JobCard 
                key={job.id} 
                job={job} 
                onSelect={onSelectJob}
                isSelected={selectedJob?.id === job.id}
                hasApplied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
    </div>
  );
};

// --- JOB DETAILS COMPONENT ---
const JobDetails: React.FC<{ 
    job: JobPosting; 
    onApply: (job: JobPosting) => void; 
    onEdit: (job: JobPosting) => void; 
    onDelete: (jobId: string) => void; 
    role: UserRole;
    isModalView?: boolean;
}> = ({ job, onApply, onEdit, onDelete, role, isModalView = false }) => {
  const formatSalary = (min: number, max: number) => `$${(min / 1000).toFixed(0)},000 - $${(max / 1000).toFixed(0)},000`;
  const parseDescription = (description: string) => {
    const sections: { title: string; content: string }[] = [];
    description.split('## ').slice(1).forEach(part => {
        const [title, ...contentLines] = part.split('\n');
        const content = contentLines.join('\n').trim();
        if(title && content) sections.push({ title: title.trim(), content });
    });
    return sections;
  };
  const descriptionSections = parseDescription(job.description);

  const containerClasses = isModalView
    ? "flex flex-col h-full"
    : "bg-white rounded-xl border border-slate-200 shadow-sm max-h-[calc(100vh-4rem)] flex flex-col";

  return (
    <div className={containerClasses}>
      <div className="p-6 overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
            <p className="text-md text-slate-500">{job.company}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600 border-t border-b border-slate-200 py-4">
            <div className="flex items-center"><Icons.MapPin className="mr-2 text-slate-400 w-5 h-5 flex-shrink-0"/> <div><p className="font-medium text-slate-800">Location</p><p>{job.location}</p></div></div>
            <div className="flex items-center"><Icons.Briefcase className="mr-2 text-slate-400 w-5 h-5 flex-shrink-0"/> <div><p className="font-medium text-slate-800">Job Type</p><p>{job.type}</p></div></div>
            <div className="flex items-center"><Icons.ChartBar className="mr-2 text-slate-400 w-5 h-5 flex-shrink-0"/> <div><p className="font-medium text-slate-800">Experience</p><p>{job.experienceLevel}</p></div></div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-800">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          <p className="text-sm text-blue-700">per year</p>
        </div>
        <div className="mt-6 space-y-6">
          {descriptionSections.map((section, index) => (
              <div key={index}>
                  <h3 className="font-bold text-lg text-slate-700 mb-2">{section.title}</h3>
                  <ul className="text-slate-600 space-y-2 text-sm list-disc list-inside leading-relaxed">
                      {section.content.split('\n').filter(line => line.trim() !== '' && line.trim() !== '-').map((item, i) => <li key={i}>{item.replace(/^- /, '')}</li>)}
                  </ul>
              </div>
          ))}
        </div>
      </div>
      <div className="p-6 mt-auto bg-white/80 backdrop-blur-sm border-t border-slate-200 flex items-center space-x-4 rounded-b-xl">
          <button onClick={() => onApply(job)} className="flex-grow bg-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors">
              Apply for this Position
          </button>
          {role === UserRole.RECRUITER && (
              <>
                  <button onClick={() => onEdit(job)} className="p-3 text-slate-500 hover:text-blue-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"><Icons.Pencil/></button>
                  <button onClick={() => onDelete(job.id)} className="p-3 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"><Icons.Trash/></button>
              </>
          )}
      </div>
    </div>
  );
};

const JobDetailsPlaceholder: React.FC = () => (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-500">
        <Icons.Briefcase className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold">Select a job</h3>
        <p className="mt-1 text-center">Job details will be shown here.</p>
    </div>
);


// --- MODAL COMPONENTS ---
const inputClassLight = "mt-1 block w-full bg-white border-slate-300 text-slate-800 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";
const JobForm: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (job: JobPosting) => void; jobToEdit: JobPosting | null; }> = ({ isOpen, onClose, onSave, jobToEdit }) => {
  const [job, setJob] = useState<Omit<JobPosting, 'id' | 'datePosted'>>({ title: '', company: '', location: '', type: JobType.FULL_TIME, experienceLevel: ExperienceLevel.ENTRY, salaryMin: 0, salaryMax: 0, tags: [], description: '' });
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => { if (isOpen) setJob(jobToEdit || { title: '', company: '', location: '', type: JobType.FULL_TIME, experienceLevel: ExperienceLevel.ENTRY, salaryMin: 0, salaryMax: 0, tags: [], description: '' }); }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'salaryMin' || name === 'salaryMax') setJob({ ...job, [name]: parseInt(value, 10) || 0 });
    else if (name === 'tags') setJob({ ...job, [name]: value.split(',').map(tag => tag.trim()).filter(Boolean) });
    else setJob({ ...job, [name]: value as any });
  };

  const handleGenerateDescription = async () => {
    if (!job.title) return;
    setIsGenerating(true);
    try {
        const description = await generateJobDescription(job.title, aiKeywords);
        setJob(prev => ({...prev, description}));
    } catch (error) { console.error(error) } 
    finally { setIsGenerating(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...job, id: jobToEdit?.id || new Date().toISOString(), datePosted: jobToEdit?.datePosted || new Date().toISOString() });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{jobToEdit ? 'Edit Job' : 'Post a New Job'}</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800"><Icons.XMark className="w-7 h-7" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-4 text-slate-600">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {Object.entries({ title: 'Job Title', company: 'Company', location: 'Location' }).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium">{label}</label>
                  <input type="text" name={key} id={key} value={job[key as keyof typeof job] as string} onChange={handleChange} required className={inputClassLight}/>
                </div>
              ))}
              <div>
                  <label htmlFor="type" className="block text-sm font-medium">Job Type</label>
                  <select name="type" id="type" value={job.type} onChange={handleChange} className={inputClassLight}>
                    {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
              </div>
              <div>
                  <label htmlFor="salaryMin" className="block text-sm font-medium">Minimum Salary</label>
                  <input type="number" name="salaryMin" id="salaryMin" value={job.salaryMin || ''} onChange={handleChange} required className={inputClassLight}/>
              </div>
              <div>
                  <label htmlFor="salaryMax" className="block text-sm font-medium">Maximum Salary</label>
                  <input type="number" name="salaryMax" id="salaryMax" value={job.salaryMax || ''} onChange={handleChange} required className={inputClassLight}/>
              </div>
               <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium">Experience Level</label>
                  <select name="experienceLevel" id="experienceLevel" value={job.experienceLevel} onChange={handleChange} className={inputClassLight}>
                    {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
              </div>
              <div>
                  <label htmlFor="tags" className="block text-sm font-medium">Tags (comma-separated)</label>
                  <input type="text" name="tags" id="tags" value={job.tags.join(', ')} onChange={handleChange} className={inputClassLight}/>
              </div>
           </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <div className="mt-1 p-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                <textarea name="description" id="description" value={job.description} onChange={handleChange} rows={8} required className="block w-full border-0 p-1 bg-slate-50 text-slate-800 focus:ring-0 sm:text-sm"></textarea>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2">
                    <input type="text" placeholder="Keywords for AI (e.g., React, TypeScript)" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} className="flex-grow border-slate-300 bg-white text-slate-800 rounded-md shadow-sm text-sm" />
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center justify-center bg-blue-800 text-white font-semibold py-2 px-3 rounded-md hover:bg-blue-900 transition-colors text-sm disabled:bg-blue-400">
                        <Icons.Sparkles className="w-4 h-4 mr-1.5" />
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>
              </div>
            </div>
        </form>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="bg-blue-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-900 transition-colors">Save Job</button>
        </div>
      </div>
    </div>
  );
};

const ApplyForm: React.FC<{ job: JobPosting | null; onClose: () => void; onSubmit: (application: Application) => void; }> = ({ job, onClose, onSubmit }) => {
  if (!job) return null;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const applicationData: Application = {
      jobId: job.id,
      applicantName: formData.get('name') as string,
      applicantEmail: formData.get('email') as string,
      phone: formData.get('phone') as string,
      linkedin: formData.get('linkedin') as string,
      portfolio: formData.get('portfolio') as string,
      coverLetter: formData.get('coverLetter') as string,
      resume: (formData.get('resume') as File)?.name || 'N/A',
    };
    onSubmit(applicationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Apply for {job.title}</h2>
            <p className="text-sm text-slate-500">at {job.company}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-900"><Icons.XMark className="w-7 h-7" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-600 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
              <input type="text" name="name" id="name" required className={inputClassLight}/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <input type="email" name="email" id="email" required className={inputClassLight}/>
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
            <input type="tel" name="phone" id="phone" className={inputClassLight}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn Profile</label>
              <input type="url" name="linkedin" id="linkedin" placeholder="https://linkedin.com/in/..." className={inputClassLight}/>
            </div>
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium">Portfolio / Website</label>
              <input type="url" name="portfolio" id="portfolio" placeholder="https://example.com" className={inputClassLight}/>
            </div>
          </div>
          <div>
            <label htmlFor="resume" className="block text-sm font-medium">Resume</label>
            <input type="file" name="resume" id="resume" required className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200"/>
          </div>
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium">Cover Letter</label>
            <textarea name="coverLetter" id="coverLetter" rows={5} className={`${inputClassLight} resize-y`}></textarea>
          </div>
        </form>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" form="apply-form" className="bg-blue-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-900 transition-colors">Submit Application</button>
        </div>
      </div>
    </div>
  );
};
const ConfirmDialog: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; }> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg leading-6 font-medium text-slate-900">{title}</h3>
              <div className="mt-2"><p className="text-sm text-slate-500">{message}</p></div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Confirm</button>
          <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const JobDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    job: JobPosting | null;
    onApply: (job: JobPosting) => void; 
    onEdit: (job: JobPosting) => void; 
    onDelete: (jobId: string) => void; 
    role: UserRole; 
}> = ({ isOpen, onClose, job, onApply, onEdit, onDelete, role }) => {
    if (!isOpen || !job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 lg:hidden">
            <div className="bg-slate-50 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 truncate pr-4">{job.title}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 flex-shrink-0"><Icons.XMark className="w-7 h-7" /></button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <JobDetails 
                        job={job} 
                        onApply={onApply} 
                        onEdit={onEdit} 
                        onDelete={onDelete} 
                        role={role} 
                        isModalView={true} 
                    />
                </div>
            </div>
        </div>
    );
};

// --- JOB BOARD COMPONENT ---
const JobBoard: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);
  const [jobs, setJobs] = useState<JobPosting[]>(starterJobs);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobToEdit, setJobToEdit] = useState<JobPosting | null>(null);
  const [jobToDeleteId, setJobToDeleteId] = useState<string | null>(null);
  const [jobToApply, setJobToApply] = useState<JobPosting | null>(null);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [typeFilters, setTypeFilters] = useState<JobType[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [experienceFilters, setExperienceFilters] = useState<ExperienceLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (jobs.length > 0) {
        setSelectedJob(jobs[0]);
    }
  }, []);
  
  const displayJobs = useMemo(() => {
    let result = [...jobs];

    if (typeFilters.length > 0) result = result.filter(job => typeFilters.includes(job.type));
    if (locationFilters.length > 0) result = result.filter(job => locationFilters.includes(job.location));
    if (experienceFilters.length > 0) result = result.filter(job => experienceFilters.includes(job.experienceLevel));

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        result = result.filter(job => 
            job.title.toLowerCase().includes(lowercasedTerm) ||
            job.company.toLowerCase().includes(lowercasedTerm) ||
            job.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
        );
    }
    
    if (sortBy === 'date-desc') {
        result.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
    } else if (sortBy === 'salary-desc') {
        result.sort((a, b) => b.salaryMax - a.salaryMax);
    }
    
    return result;
  }, [jobs, typeFilters, locationFilters, experienceFilters, searchTerm, sortBy]);
  
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleSelectJob = (job: JobPosting) => {
    setSelectedJob(job);
    if (window.innerWidth < 1024) {
        setIsDetailsModalOpen(true);
    }
  };

  const handleSaveJob = (job: JobPosting) => {
    if (jobs.some(j => j.id === job.id)) {
      setJobs(jobs.map(j => (j.id === job.id ? job : j)));
      addToast('Job updated successfully!');
    } else {
      setJobs([job, ...jobs]);
      addToast('Job posted successfully!');
    }
    setIsJobFormOpen(false);
    setJobToEdit(null);
  };

  const handleDeleteJob = useCallback(() => {
    if (jobToDeleteId) {
      const remainingJobs = jobs.filter(job => job.id !== jobToDeleteId);
      setJobs(remainingJobs);
      if (selectedJob?.id === jobToDeleteId) {
          const newDisplayJobs = displayJobs.filter(job => job.id !== jobToDeleteId);
          setSelectedJob(newDisplayJobs[0] || remainingJobs[0] || null);
      }
      setJobToDeleteId(null);
      addToast('Job deleted successfully!', 'success');
    }
  }, [jobToDeleteId, jobs, selectedJob, displayJobs]);

  const handleApplicationSubmit = (application: Application) => {
    addToast(`Successfully applied for ${jobToApply?.title}!`);
    setAppliedJobIds(prev => new Set(prev).add(application.jobId));
    setJobToApply(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-5 py-8">
                    <Header role={role} setRole={setRole} onPostJobClick={() => { setJobToEdit(null); setIsJobFormOpen(true); }} />
                    <div className="mt-8 space-y-6">
                        <FilterBar
                            typeFilters={typeFilters} setTypeFilters={setTypeFilters}
                            locations={jobs.map(j => j.location)} locationFilters={locationFilters} setLocationFilters={setLocationFilters}
                            experienceFilters={experienceFilters} setExperienceFilters={setExperienceFilters}
                            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                            sortBy={sortBy} setSortBy={setSortBy}
                        />
                        <JobList 
                            jobs={displayJobs} 
                            selectedJob={selectedJob} 
                            onSelectJob={handleSelectJob}
                            appliedJobIds={appliedJobIds}
                        />
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-7 py-8">
                    <div className="sticky top-8">
                        {selectedJob ? (
                            <JobDetails 
                                job={selectedJob} 
                                onApply={setJobToApply} 
                                role={role} 
                                onEdit={(job) => { setJobToEdit(job); setIsJobFormOpen(true); }} 
                                onDelete={setJobToDeleteId} 
                            />
                        ) : (
                            <JobDetailsPlaceholder />
                        )}
                    </div>
                </div>
            </div>
        </main>

        <JobForm isOpen={isJobFormOpen} onClose={() => setIsJobFormOpen(false)} onSave={handleSaveJob} jobToEdit={jobToEdit} />
        <ApplyForm job={jobToApply} onClose={() => setJobToApply(null)} onSubmit={handleApplicationSubmit} />
        <ConfirmDialog isOpen={!!jobToDeleteId} onClose={() => setJobToDeleteId(null)} onConfirm={handleDeleteJob} title="Delete Job Post" message="Are you sure you want to delete this job posting? This can't be undone." />
        <JobDetailsModal 
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            job={selectedJob}
            role={role} 
            onApply={(job) => { setIsDetailsModalOpen(false); setJobToApply(job); }} 
            onEdit={(job) => { setIsDetailsModalOpen(false); setJobToEdit(job); setIsJobFormOpen(true); }} 
            onDelete={(jobId) => { setIsDetailsModalOpen(false); setJobToDeleteId(jobId); }} 
        />

        <div className="fixed bottom-5 right-5 z-[100] space-y-2">
            {toasts.map(toast => (
                <div key={toast.id} className={`flex items-center text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in-out ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            ))}
        </div>
    </div>
  );
};

// --- LOGIN PAGE COMPONENT ---
const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <HireHubLogo className="h-12 text-blue-900 mx-auto" />
                </div>
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 text-center">Welcome Back</h2>
                    <p className="text-slate-500 text-center mt-2 mb-6">Sign in to continue to HireHub.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                defaultValue="demo@hirehub.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                defaultValue="password"
                            />
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT (NOW WITH AUTH) ---
const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    return <JobBoard />;
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}
.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out forwards;
}
`;
document.head.appendChild(style);

export default App;