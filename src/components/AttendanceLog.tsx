'use client';

interface LogEntry {
  name: string;
  time: string;
}

interface AttendanceLogProps {
  logs: LogEntry[];
}

const AttendanceLog = ({ logs }: AttendanceLogProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="text-xl font-medium text-slate-600 mb-2">No Records Found</h3>
            <p className="text-slate-500 max-w-xs">
              Attendance records will appear here once face recognition is active and detects known faces.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Name</div>
              <div className="col-span-7 text-right">Time</div>
            </div>
            <ul className="space-y-3">
              {logs.map((log, index) => (
                <li
                  key={index}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all duration-200 flex justify-between items-center border border-slate-200"
                >
                  <span className="font-medium text-slate-800 truncate max-w-[140px]">{log.name}</span>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceLog;