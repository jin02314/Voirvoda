import { Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Contact() {
  return (
    <motion.div 
      className="flex-1 p-8 md:p-12 max-w-4xl mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-12">
        <h2 className="text-2xl mb-4">Contact</h2>
        <p className="text-gray-600 mb-2">
          프로젝트 문의, 장비 렌탈, 협업 제안 등 언제든지 연락 주세요.
        </p>
        <p className="text-gray-600">
          Feel free to reach out for project inquiries, equipment rental, or collaboration opportunities.
        </p>
      </div>

      <div className="space-y-8">
        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg flex-shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="mb-1">Email</h3>
            <a 
              href="mailto:contact@voirvoda.com" 
              className="text-gray-600 hover:text-black transition-colors"
            >
              contact@voirvoda.com
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg flex-shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="mb-1">Location</h3>
            <p className="text-gray-600">
              광주광역시 서구<br />
              Gwangju, South Korea
            </p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg flex-shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="mb-1">Business Hours</h3>
            <p className="text-gray-600">
              연중 무휴<br />
              <span className="text-sm">Open All Year Round</span>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="mb-3">빠른 응답</h3>
        <p className="text-sm text-gray-600 mb-2">
          • 일반 문의: 12시간 내 답변<br />
          • 긴급 장비 렌탈: 당일 응답<br />
          • 프로젝트 제안: 영업일 기준 2-3일 내 검토 후 회신
        </p>
        <p className="text-sm text-gray-600 mt-4">
          • General inquiries: Response within 12 hours<br />
          • Urgent equipment rental: Same-day response<br />
          • Project proposals: Review and response within 2-3 business days
        </p>
      </div>
    </motion.div>
  );
}