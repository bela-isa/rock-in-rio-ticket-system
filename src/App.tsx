import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Calendar, CreditCard, Clock, Users, Music, CheckCircle, Printer, RotateCcw, AlertCircle, Zap, Star, TrendingUp, Shield } from 'lucide-react';

// Interfaces TypeScript
interface LineupDay {
  date: string;
  day: string;
  headliner: string;
  bands: string[];
  genre: string;
  color: string;
}

interface Lineup {
  [key: string]: LineupDay;
}

interface TicketData {
  id: string;
  name: string;
  cpf: string;
  email: string;
  day: LineupDay;
  purchaseDate: string;
  sector: string;
  gate: string;
  price: string;
}

interface LogEntry {
  timestamp: string;
  action: string;
  details: string;
  id: number;
}

interface PaymentForm {
  name: string;
  cpf: string;
  email: string;
  card: string;
  expiry: string;
  cvv: string;
}

const App = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [queuePosition, setQueuePosition] = useState(3);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [reservationTime, setReservationTime] = useState(600);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    name: '',
    cpf: '',
    email: '',
    card: '',
    expiry: '',
    cvv: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<PaymentForm>>({});

  const lineup: Lineup = {
    day1: {
      date: '15 de Setembro, 2024',
      day: 'Sexta-feira',
      headliner: 'Imagine Dragons',
      bands: ['Twenty One Pilots', 'The Killers', 'Fresno', 'Capital Inicial', 'NX Zero'],
      genre: 'Rock Alternativo',
      color: 'from-blue-600 to-cyan-600'
    },
    day2: {
      date: '16 de Setembro, 2024',
      day: 'Sábado',
      headliner: 'Iron Maiden',
      bands: ['Megadeth', 'Sepultura', 'Angra', 'Ratos de Porão', 'Viper'],
      genre: 'Heavy Metal',
      color: 'from-red-600 to-orange-600'
    },
    day3: {
      date: '17 de Setembro, 2024',
      day: 'Domingo',
      headliner: 'Travis Scott',
      bands: ['Post Malone', 'Lil Nas X', 'Matuê', 'Kayblack', 'Xamã'],
      genre: 'Hip Hop / Trap',
      color: 'from-purple-600 to-pink-600'
    }
  };

  const addLog = useCallback((action: string, details = '') => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const logEntry: LogEntry = {
      timestamp,
      action,
      details,
      id: Date.now()
    };
    setLogs(prev => [logEntry, ...prev].slice(0, 50));
  }, []);

  const resetApplication = useCallback(() => {
    addLog('🔄 Sistema reiniciado', 'Nova sessão iniciada');
    setCurrentStep('welcome');
    setQueuePosition(Math.floor(Math.random() * 5) + 2);
    setSelectedDay(null);
    setReservationTime(600);
    setTicketData(null);
    setIsProcessing(false);
    setPaymentForm({
      name: '',
      cpf: '',
      email: '',
      card: '',
      expiry: '',
      cvv: ''
    });
    setFormErrors({});
  }, [addLog]);

  const handleTimeout = useCallback(() => {
    addLog('⏰ Reserva expirada', 'Tempo limite de 10 minutos atingido');
    alert('⏰ Tempo esgotado! Sua reserva expirou. Você será redirecionado para o início.');
    resetApplication();
  }, [addLog, resetApplication]);

  useEffect(() => {
    addLog('Sistema inicializado', 'Rock in Rio Tickets v1.0');
  }, [addLog]);

  useEffect(() => {
    if (currentStep === 'queue' && queuePosition > 0) {
      const timer = setInterval(() => {
        setQueuePosition(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentStep('selectDay');
            addLog('Acesso liberado', 'Usuário entrou no sistema de compra');
            return 0;
          }
          return prev - 1;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [currentStep, queuePosition, addLog]);

  useEffect(() => {
    if (currentStep === 'reservation' && reservationTime > 0) {
      const timer = setInterval(() => {
        setReservationTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, reservationTime, handleTimeout]);

  const handleWelcomeStart = () => {
    setCurrentStep('queue');
    addLog('Usuário iniciou o processo', 'Entrando na fila de espera');
  };

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
    setCurrentStep('reservation');
    addLog('🎫 Dia selecionado', `${lineup[day].date} - ${lineup[day].headliner}`);
  };

  const handleFormChange = (field: keyof PaymentForm, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): Partial<PaymentForm> => {
    const errors: Partial<PaymentForm> = {};
    
    if (!paymentForm.name.trim()) errors.name = 'Nome é obrigatório';
    if (!paymentForm.cpf.trim()) errors.cpf = 'CPF é obrigatório';
    else if (paymentForm.cpf.length < 11) errors.cpf = 'CPF inválido';
    
    if (!paymentForm.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(paymentForm.email)) errors.email = 'Email inválido';
    
    if (!paymentForm.card.trim()) errors.card = 'Número do cartão é obrigatório';
    else if (paymentForm.card.replace(/\s/g, '').length < 16) errors.card = 'Número do cartão inválido';
    
    if (!paymentForm.expiry.trim()) errors.expiry = 'Validade é obrigatória';
    if (!paymentForm.cvv.trim()) errors.cvv = 'CVV é obrigatório';
    else if (paymentForm.cvv.length < 3) errors.cvv = 'CVV inválido';

    return errors;
  };

  const handlePayment = () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addLog('❌ Erro de validação', 'Dados do formulário incompletos ou inválidos');
      return;
    }

    setIsProcessing(true);
    addLog('💳 Processando pagamento', `Cartão final: ${paymentForm.card.slice(-4)}`);

    setTimeout(() => {
      const ticket: TicketData = {
        id: `RIR2024${Date.now().toString().slice(-8)}`,
        name: paymentForm.name,
        cpf: paymentForm.cpf,
        email: paymentForm.email,
        day: lineup[selectedDay!],
        purchaseDate: new Date().toLocaleString('pt-BR'),
        sector: `PISTA ${Math.floor(Math.random() * 3) + 1}`,
        gate: `PORTÃO ${Math.floor(Math.random() * 10) + 1}`,
        price: 'R$ 890,00'
      };
      
      setTicketData(ticket);
      setCurrentStep('ticket');
      setIsProcessing(false);
      addLog('✅ Pagamento confirmado', `Ingresso ${ticket.id} gerado com sucesso`);
    }, 3000);
  };

  const handlePrint = () => {
    if (ticketData) {
      addLog('🖨️ Solicitação de impressão', `Ingresso ID: ${ticketData.id}`);
      window.print();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCard = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="relative bg-black/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Music className="w-12 h-12 text-pink-500" />
                <Zap className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Rock in Rio 2024
                </h1>
                <p className="text-sm text-gray-400 font-medium">Sistema Oficial de Ingressos</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-400">Online</span>
              </div>
              {currentStep === 'ticket' && (
                <button
                  onClick={resetApplication}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-full transition-all font-semibold shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nova Compra
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 'welcome' && (
              <div className="space-y-6">
                <div className="relative bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
                  <div className="relative text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-2xl">
                      <Music className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-4xl sm:text-5xl font-black text-white">
                        Bem-vindo ao Rock in Rio!
                      </h2>
                      <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                        O maior festival de música do mundo. Garanta já seu ingresso para uma experiência inesquecível!
                      </p>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4 pt-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="font-bold text-white">3 Dias</p>
                        <p className="text-sm text-gray-300">De festival</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="font-bold text-white">+100 Artistas</p>
                        <p className="text-sm text-gray-300">Lineup completo</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="font-bold text-white">100% Seguro</p>
                        <p className="text-sm text-gray-300">Compra protegida</p>
                      </div>
                    </div>

                    <button
                      onClick={handleWelcomeStart}
                      className="group relative inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-full text-xl font-bold text-white transition-all shadow-2xl hover:shadow-pink-500/50 hover:scale-105"
                    >
                      <Ticket className="w-6 h-6" />
                      Comprar Ingresso Agora
                      <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-sm text-gray-400">
                      ⚡ Apenas <strong className="text-pink-400">1 usuário</strong> por vez para garantir a melhor experiência
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {Object.entries(lineup).map(([key, day]) => (
                    <div key={key} className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-pink-500/50 transition-all">
                      <div className={`inline-flex px-3 py-1 bg-gradient-to-r ${day.color} rounded-full text-xs font-bold mb-3`}>
                        {day.day}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{day.headliner}</h3>
                      <p className="text-sm text-gray-400">{day.genre}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'queue' && (
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <Users className="w-24 h-24 sm:w-32 sm:h-32 text-pink-500 animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                      {queuePosition}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-5xl font-black text-white">Você está na fila</h2>
                    <p className="text-gray-400">Aguarde sua vez de entrar no sistema</p>
                  </div>
                  
                  <div className="inline-flex flex-col items-center gap-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/50 rounded-2xl px-8 py-6">
                    <p className="text-sm text-gray-300 uppercase tracking-wide">Posição na Fila</p>
                    <p className="text-7xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {queuePosition}
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4">
                    <p className="text-sm text-blue-200">
                      💡 <strong>Dica:</strong> Mantenha esta janela aberta. Você será redirecionado automaticamente quando for sua vez!
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 pt-4">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'selectDay' && (
              <div className="space-y-6">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-pink-500" />
                    Escolha o Dia do Evento
                  </h2>
                  <p className="text-gray-400">Selecione o dia com o line-up de sua preferência</p>
                </div>

                <div className="grid gap-6">
                  {Object.entries(lineup).map(([key, day]) => (
                    <button
                      key={key}
                      onClick={() => handleDaySelection(key)}
                      className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-pink-500 hover:bg-black/60 transition-all text-left overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${day.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity`}></div>
                      
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className={`inline-flex px-3 py-1 bg-gradient-to-r ${day.color} rounded-full text-sm font-bold`}>
                              {day.day}
                            </div>
                            <span className="text-gray-400 text-sm">{day.date}</span>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Headliner</p>
                            <h3 className="text-3xl sm:text-4xl font-black text-white group-hover:text-pink-400 transition-colors">
                              {day.headliner}
                            </h3>
                          </div>

                          <div>
                            <p className="text-sm text-gray-400 mb-2">Mais atrações:</p>
                            <div className="flex flex-wrap gap-2">
                              {day.bands.map((band, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm border border-white/20 transition-colors"
                                >
                                  {band}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                            <Music className="w-4 h-4" />
                            <span>{day.genre}</span>
                          </div>
                        </div>
                        
                        <Ticket className="w-12 h-12 text-pink-500 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'reservation' && selectedDay && (
              <div className="space-y-6">
                <div className={`relative bg-gradient-to-r ${reservationTime < 120 ? 'from-red-600/30 to-orange-600/30 border-red-500/50' : 'from-pink-600/30 to-purple-600/30 border-pink-500/50'} backdrop-blur-xl rounded-2xl p-6 border transition-all`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className={`w-7 h-7 ${reservationTime < 120 ? 'text-red-400 animate-pulse' : 'text-pink-400'}`} />
                      <div>
                        <p className="text-sm text-gray-200">Tempo de Reserva</p>
                        <p className={`text-3xl font-black ${reservationTime < 120 ? 'text-red-400' : 'text-white'}`}>
                          {formatTime(reservationTime)}
                        </p>
                      </div>
                    </div>
                    <AlertCircle className={`w-8 h-8 ${reservationTime < 120 ? 'text-red-400' : 'text-pink-400'}`} />
                  </div>
                  {reservationTime < 120 && (
                    <p className="text-sm text-red-200 mt-3">⚠️ Atenção! Seu tempo está acabando!</p>
                  )}
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Ingresso Reservado
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Data do Evento</p>
                      <p className="font-bold text-white">{lineup[selectedDay].date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Headliner</p>
                      <p className="font-bold text-white">{lineup[selectedDay].headliner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Gênero</p>
                      <p className="font-bold text-white">{lineup[selectedDay].genre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Valor</p>
                      <p className="font-bold text-green-400">R$ 890,00</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <CreditCard className="w-7 h-7 text-pink-500" />
                    Dados de Pagamento
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        value={paymentForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Maria Silva Santos"
                        className={`w-full px-4 py-3 bg-white/10 border ${formErrors.name ? 'border-red-500' : 'border-white/20'} rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white placeholder-gray-500`}
                      />
                      {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">CPF *</label>
                        <input
                          type="text"
                          value={paymentForm.cpf}
                          onChange={(e) => handleFormChange('cpf', formatCPF(e.target.value))}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className={`w-full px-4 py-3 bg-white/10 border ${formErrors.cpf ? 'border-red-500' : 'border-white/20'} rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white placeholder-gray-500`}
                        />
                        {formErrors.cpf && <p className="text-red-400 text-sm mt-1">{formErrors.cpf}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email *</label>
                        <input
                          type="email"
                          value={paymentForm.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          placeholder="maria@email.com"
                          className={`w-full px-4 py-3 bg-white/10 border ${formErrors.email ? 'border-red-500' : 'border-white/20'} rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white placeholder-gray-500`}
                        />
                        {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Número do Cartão *</label>
                      <input
                        type="text"
                        value={paymentForm.card}
                        onChange={(e) => handleFormChange('card', formatCard(e.target.value))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className={`w-full px-4 py-3 bg-white/10 border ${formErrors.card ? 'border-red-500' : 'border-white/20'} rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white placeholder-gray-500 font-mono`}
                      />
                      {formErrors.card && <p className="text-red-400 text-sm mt-1">{formErrors.card}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Validade *</label>
                        <input
                          type="text"
                          value={paymentForm.expiry}
                          onChange={(e) => handleFormChange('expiry', e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          className={`w-full px-4 py-3 bg-white/10 border ${formErrors.expiry ? 'border-red-500' : 'border-white/20'} rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white placeholder-gray-500 font-mono`}
                        />
                        {formErrors.expiry && <p className="text-red-400 text-sm mt-1">{formErrors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">CVV *</label>
                        <input
                          type="text"
                          value={paymentForm.cvv}
                          onChange={(e) => handleFormChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="000"
                          maxLength={3}
                          className={`w-full px-4 py-3 bg-white/10 border ${formErrors.cvv ? 'border-red-500' : 'border-white/20'} rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white placeholder-gray-500 font-mono`}
                        />
                        {formErrors.cvv && <p className="text-red-400 text-sm mt-1">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-300 mb-1">Ambiente de Demonstração</p>
                        <p className="text-sm text-yellow-200">
                          Esta é uma simulação educacional. Todos os dados são fictícios e não serão processados ou armazenados. 
                          Sinta-se livre para testar todas as funcionalidades!
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-pink-500/50 text-white flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processando Pagamento...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Confirmar Pagamento - R$ 890,00
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'ticket' && ticketData && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-xl rounded-2xl p-6 border border-green-500/50 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white">Pagamento Confirmado!</h3>
                      <p className="text-green-200">Seu ingresso foi gerado com sucesso. Aproveite o show!</p>
                    </div>
                  </div>
                </div>

                <div id="ticket-print" className="bg-white text-black rounded-3xl shadow-2xl overflow-hidden border-4 border-dashed border-pink-500">
                  <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Music className="w-10 h-10 text-white" />
                        <div>
                          <h3 className="text-2xl font-black text-white">Rock in Rio 2024</h3>
                          <p className="text-sm text-pink-100">Ingresso Oficial</p>
                        </div>
                      </div>
                      <Ticket className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Titular</p>
                        <p className="font-bold text-lg">{ticketData.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CPF</p>
                        <p className="font-bold text-lg">{ticketData.cpf}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Data do Evento</p>
                        <p className="font-bold text-lg">{ticketData.day.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Dia da Semana</p>
                        <p className="font-bold text-lg">{ticketData.day.day}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Setor</p>
                        <p className="font-bold text-lg">{ticketData.sector}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Portão</p>
                        <p className="font-bold text-lg">{ticketData.gate}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Atração Principal</p>
                      <p className="font-black text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {ticketData.day.headliner}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{ticketData.day.genre}</p>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-300 pt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-semibold">ID do Ingresso:</span>
                        <span className="font-mono font-bold text-pink-600">{ticketData.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-semibold">Data da Compra:</span>
                        <span className="font-bold">{ticketData.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-semibold">Email:</span>
                        <span className="font-bold text-sm">{ticketData.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-semibold">Valor Pago:</span>
                        <span className="font-bold text-green-600 text-lg">{ticketData.price}</span>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-2xl text-center">
                      <div className="h-24 bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center mb-3">
                        <p className="font-mono text-2xl tracking-widest font-bold">||||| |||| ||||| ||||</p>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold">Código de Barras - {ticketData.id}</p>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                      <p className="text-xs text-yellow-800">
                        <strong>Importante:</strong> Apresente este ingresso impresso ou digital na entrada do evento junto com documento de identidade original com foto.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={handlePrint}
                    className="py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-lg transition-all shadow-xl text-white flex items-center justify-center gap-3"
                  >
                    <Printer className="w-5 h-5" />
                    Imprimir Ingresso
                  </button>
                  <button
                    onClick={resetApplication}
                    className="py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all shadow-xl text-white flex items-center justify-center gap-3"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Nova Compra
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <details className="group bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 sticky top-24 shadow-xl">
              <summary className="cursor-pointer p-4 hover:bg-white/5 rounded-2xl transition-all list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-400">Sistema de Logs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                      {logs.length}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </summary>
              
              <div className="p-4 pt-0">
                <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">Nenhum evento</p>
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={log.id}
                        className="bg-white/5 hover:bg-white/10 rounded-lg p-2.5 border border-white/10 text-xs transition-all"
                        style={{ 
                          animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full flex-shrink-0 mt-1"></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-pink-400 break-words">{log.action}</p>
                            {log.details && (
                              <p className="text-gray-400 text-xs mt-0.5 break-words">{log.details}</p>
                            )}
                            <p className="text-gray-600 text-xs mt-1">{log.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(236, 72, 153, 0.6), rgba(168, 85, 247, 0.6));
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(236, 72, 153, 0.9), rgba(168, 85, 247, 0.9));
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-print, #ticket-print * {
            visibility: visible;
          }
          #ticket-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .custom-scrollbar {
            max-height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
