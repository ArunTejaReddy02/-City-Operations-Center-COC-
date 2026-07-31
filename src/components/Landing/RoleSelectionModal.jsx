import { useNavigate } from 'react-router-dom';
import { User, Shield, ArrowRight, X } from 'lucide-react';
import Spotlight from '../Effects/Spotlight';
import Magnetic from '../Effects/Magnetic';

export default function RoleSelectionModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#283618]/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#fefae0] border border-[#d4cc9a] rounded-3xl p-8 shadow-2xl space-y-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#606c38] hover:text-[#283618] transition-colors rounded-full hover:bg-[#faf5d0]"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#bc6c25]">
            Access Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#283618] mt-1">
            Choose Your Operating Role
          </h2>
          <p className="text-xs text-[#606c38] mt-2">
            Select your account type to proceed into the VizagOps portal.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Citizen / Resident Card */}
          <Spotlight
            onClick={() => handleSelectRole('citizen')}
            className="p-6 rounded-2xl bg-[#faf5d0] border border-[#d4cc9a] cursor-pointer hover:border-[#dda15e] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#606c38]/15 text-[#606c38] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#283618] mb-1">Citizen / Resident</h3>
              <p className="text-xs text-[#606c38] leading-relaxed mb-6">
                File pothole or waterlogging grievances, track status updates in real time, and view resolution logs.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#dda15e] group-hover:translate-x-1 transition-transform">
              Proceed as Citizen <ArrowRight size={14} className="ml-1" />
            </div>
          </Spotlight>

          {/* Officer / Admin Card */}
          <Spotlight
            onClick={() => handleSelectRole('admin')}
            className="p-6 rounded-2xl bg-[#faf5d0] border border-[#d4cc9a] cursor-pointer hover:border-[#bc6c25] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#dda15e]/20 text-[#bc6c25] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#283618] mb-1">GVMC IT / Officer</h3>
              <p className="text-xs text-[#606c38] leading-relaxed mb-6">
                Access the 60 FPS real-time dispatch map, cross-match CCTV sensor pings, and assign field crews.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#bc6c25] group-hover:translate-x-1 transition-transform">
              Proceed as Officer <ArrowRight size={14} className="ml-1" />
            </div>
          </Spotlight>
        </div>
      </div>
    </div>
  );
}
