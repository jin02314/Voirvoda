import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, X, Calendar, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Equipment } from '../lib/sharedState';

interface EquipmentShopProps {
  equipment: Equipment[];
}

interface CartItem {
  equipment: Equipment;
  quantity: number;
}

export function EquipmentShop({ equipment }: EquipmentShopProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [errorEquipmentId, setErrorEquipmentId] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const addToCart = (equipmentItem: Equipment) => {
    const existingItem = cart.find(item => item.equipment.id === equipmentItem.id);
    
    // If item already exists, show error message
    if (existingItem) {
      setErrorEquipmentId(equipmentItem.id);
      setTimeout(() => setErrorEquipmentId(null), 5000);
      return;
    }
    
    setCart(prevCart => {
      return [...prevCart, { equipment: equipmentItem, quantity: 1 }];
    });
    
    // Show added feedback animation
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 1000);
  };

  const closeCart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRentalInquiry = () => {
    setIsDateModalOpen(true);
  };

  const handleSendEmail = () => {
    if (!startDate || !endDate) {
      alert('대여 날짜를 모두 선택해주세요.');
      return;
    }

    // Calculate rental days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Create email content
    const equipmentList = cart.map(item => 
      `- ${item.equipment.name} (수량: ${item.quantity}, ${item.equipment.price}/일)`
    ).join('\\n');

    const totalDailyPrice = cart.reduce((sum, item) => sum + (item.equipment.priceNumber * item.quantity), 0);
    const totalPrice = totalDailyPrice * days;

    const emailSubject = encodeURIComponent('장비 대여 문의');
    const emailBody = encodeURIComponent(
      `안녕하세요,\\n\\n다음 장비의 대여를 문의합니다:\\n\\n${equipmentList}\\n\\n대여 기간:\\n시작일: ${startDate}\\n종료일: ${endDate}\\n총 ${days}일\\n\\n1일 대여료: ₩${totalDailyPrice.toLocaleString()}\\n총 예상 금액: ₩${totalPrice.toLocaleString()}\\n\\n연락 받을 이메일: ${contactEmail}\\n\\n감사합니다.`
    );

    window.location.href = `mailto:contact@voirvoda.com?subject=${emailSubject}&body=${emailBody}`;
    
    // Close modals
    setIsDateModalOpen(false);
    closeCart();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  return (
    <>
      <motion.div 
        className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.45 }}
      >
        {/* Cart Summary */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold">We have This!</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">담당자와 상의 후 대여 가능합니다.</p>
            <p className="text-xs md:text-sm text-gray-600">This system is only available in South Korea.</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors self-start md:self-auto ${showAddedFeedback ? 'animate-cart-bounce' : ''}`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">{totalItems}</span>
          </button>
        </div>

        {/* Equipment Grid */}
        <div className="divide-y divide-gray-200">
          {equipment.map(equipmentItem => (
            <div 
              key={equipmentItem.id}
              className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 py-4"
            >
              {/* Mobile: Image + Name */}
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  {equipmentItem.image ? (
                    <ImageWithFallback
                      src={equipmentItem.image}
                      alt={equipmentItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <h3 className="flex-1 text-sm md:text-base">{equipmentItem.name}</h3>
              </div>
              
              {/* Mobile: Price + Button */}
              <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 pl-[4.5rem] md:pl-0">
                <span className="text-base md:text-lg font-medium md:font-normal flex-shrink-0">{equipmentItem.price}/일</span>
                <div className="relative">
                  <button
                    onClick={() => addToCart(equipmentItem)}
                    className="bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-xs md:text-sm flex-shrink-0"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    담기
                  </button>
                  {errorEquipmentId === equipmentItem.id && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded text-xs whitespace-nowrap animate-float-up">
                      보유 수량을 초과했습니다
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cart Sidebar Overlay */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-40 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => closeCart()}
          />
          
          {/* Sidebar */}
          <div className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">장바구니</h2>
                <button
                  onClick={() => closeCart()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p>장바구니가 비어있습니다</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div 
                        key={item.equipment.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          {item.equipment.image ? (
                            <ImageWithFallback
                              src={item.equipment.image}
                              alt={item.equipment.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.equipment.name}</p>
                          <p className="text-sm text-gray-500 mt-1">수량: {item.quantity}</p>
                          <p className="text-sm text-gray-500">{item.equipment.price}/일</p>
                        </div>
                        <span className="font-medium flex-shrink-0">
                          ₩{(item.equipment.priceNumber * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">총 금액</span>
                    <span className="text-2xl font-bold">
                      ₩{cart.reduce((sum, item) => sum + (item.equipment.priceNumber * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleRentalInquiry}>
                    대여 문의하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Date Modal */}
      {isDateModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsDateModalOpen(false)}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 pointer-events-auto">
              <h2 className="text-xl font-bold mb-4">대여 날짜 선택</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">연락 받을 이메일</label>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="border border-gray-300 px-4 py-2 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">대여 시작일</label>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">대여 종료일</label>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded-lg w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button 
                  className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors" 
                  onClick={() => setIsDateModalOpen(false)}
                >
                  취소
                </button>
                <button 
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" 
                  onClick={handleSendEmail}
                >
                  이메일 보내기
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowSuccessMessage(false)}
          />
          
          {/* Success Message */}
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="bg-green-500 text-white px-8 py-6 rounded-lg shadow-lg pointer-events-auto text-center"
              onClick={() => setShowSuccessMessage(false)}
            >
              <p className="text-lg font-medium">감사합니다! 빠르게 확인 후 연락드리겠습니다.</p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}