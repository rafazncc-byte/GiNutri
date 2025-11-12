'use client';

import { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, Camera, BookOpen, User, ChevronRight, Sparkles, TrendingUp, Apple, Salad, Coffee, Moon, Sun, Check, X, Play, ShoppingCart, MessageCircle, BarChart3, Calendar, Clock, Heart, Zap, Award, Target, Plus, Minus, Flame, Droplets, Activity } from 'lucide-react';

// Tipos
type UserProfile = 'acessivel' | 'premium';
type Screen = 'splash' | 'welcome' | 'login' | 'register' | 'onboarding' | 'dashboard' | 'cardapio' | 'camera' | 'diario' | 'perfil' | 'chat' | 'receitas' | 'compras' | 'progresso' | 'water' | 'meal-detail';

interface OnboardingData {
  nome: string;
  idade: string;
  genero: 'masculino' | 'feminino' | 'outro' | '';
  peso: string;
  altura: string;
  objetivo: 'emagrecer' | 'ganhar_massa' | 'manter' | 'reeducar' | 'energia' | '';
  atividade: 'sedentario' | 'leve' | 'moderado' | 'intenso' | '';
  estilo: 'tradicional' | 'low_carb' | 'high_protein' | 'vegetariano' | 'vegano' | '';
  perfil: UserProfile | '';
  restricoes: string[];
  refeicoes: string;
}

interface UserData extends OnboardingData {
  imc: number;
  tdee: number;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

interface MealEntry {
  id: number;
  meal: string;
  time: string;
  items: string;
  kcal: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  icon: any;
}

export default function GiNutriApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile>('acessivel');
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    nome: '',
    idade: '',
    genero: '',
    peso: '',
    altura: '',
    objetivo: '',
    atividade: '',
    estilo: '',
    perfil: '',
    restricoes: [],
    refeicoes: '5'
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedDay, setSelectedDay] = useState('Segunda');
  const [selectedMeal, setSelectedMeal] = useState('cafe');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<MealEntry[]>([]);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(2000); // 2L em ml
  const [selectedMealDetail, setSelectedMealDetail] = useState<MealEntry | null>(null);

  // Splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      setTimeout(() => setCurrentScreen('welcome'), 2500);
    }
  }, [currentScreen]);

  // Cores baseadas no perfil
  const colors = userProfile === 'premium' 
    ? { primary: '#D4AF37', secondary: '#FEF3C7', accent: '#F59E0B' }
    : { primary: '#10B981', secondary: '#F5F3EE', accent: '#8BC34A' };

  // Calcular IMC e TDEE
  const calculateMetrics = () => {
    const peso = parseFloat(onboardingData.peso);
    const altura = parseFloat(onboardingData.altura) / 100;
    const idade = parseInt(onboardingData.idade);
    
    const imc = peso / (altura * altura);
    
    // Fórmula Harris-Benedict
    let tmb = onboardingData.genero === 'masculino'
      ? 88.362 + (13.397 * peso) + (4.799 * altura * 100) - (5.677 * idade)
      : 447.593 + (9.247 * peso) + (3.098 * altura * 100) - (4.330 * idade);
    
    const atividadeMultiplier = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725
    };
    
    const tdee = tmb * atividadeMultiplier[onboardingData.atividade as keyof typeof atividadeMultiplier];
    
    let calorias = tdee;
    if (onboardingData.objetivo === 'emagrecer') calorias = tdee - 500;
    if (onboardingData.objetivo === 'ganhar_massa') calorias = tdee + 300;
    
    const proteinas = Math.round((calorias * 0.30) / 4);
    const carboidratos = Math.round((calorias * 0.40) / 4);
    const gorduras = Math.round((calorias * 0.30) / 9);
    
    return { imc, tdee, calorias, proteinas, carboidratos, gorduras };
  };

  // Finalizar onboarding
  const finishOnboarding = () => {
    const metrics = calculateMetrics();
    const newUserData: UserData = {
      ...onboardingData,
      ...metrics
    };
    setUserData(newUserData);
    setUserProfile(onboardingData.perfil as UserProfile);
    setCurrentScreen('dashboard');
    
    // Gerar lista de compras inicial
    generateShoppingList();
    
    // Inicializar entradas do diário
    initializeDiaryEntries();
  };

  // Inicializar entradas do diário
  const initializeDiaryEntries = () => {
    const entries: MealEntry[] = [
      { 
        id: 1, 
        meal: 'Café da Manhã', 
        time: '08:00', 
        items: 'Pão integral com ovo mexido e banana',
        kcal: 320,
        proteinas: 18,
        carboidratos: 45,
        gorduras: 8,
        icon: Coffee
      },
      { 
        id: 2, 
        meal: 'Almoço', 
        time: '12:30', 
        items: 'Arroz integral, feijão, frango grelhado e salada',
        kcal: 485,
        proteinas: 38,
        carboidratos: 52,
        gorduras: 12,
        icon: UtensilsCrossed
      },
      { 
        id: 3, 
        meal: 'Lanche', 
        time: '15:30', 
        items: 'Iogurte natural com granola',
        kcal: 180,
        proteinas: 12,
        carboidratos: 24,
        gorduras: 5,
        icon: Apple
      }
    ];
    setDiaryEntries(entries);
  };

  // Gerar lista de compras
  const generateShoppingList = () => {
    const items = [
      { id: 1, categoria: 'Hortifruti', nome: 'Banana', quantidade: '1 dúzia', checked: false },
      { id: 2, categoria: 'Hortifruti', nome: 'Alface', quantidade: '2 unidades', checked: false },
      { id: 3, categoria: 'Hortifruti', nome: 'Tomate', quantidade: '500g', checked: false },
      { id: 4, categoria: 'Açougue', nome: 'Peito de frango', quantidade: '1kg', checked: false },
      { id: 5, categoria: 'Açougue', nome: 'Carne moída', quantidade: '500g', checked: false },
      { id: 6, categoria: 'Padaria', nome: 'Pão integral', quantidade: '1 pacote', checked: false },
      { id: 7, categoria: 'Laticínios', nome: 'Iogurte natural', quantidade: '6 unidades', checked: false },
      { id: 8, categoria: 'Mercearia', nome: 'Arroz integral', quantidade: '1kg', checked: false },
      { id: 9, categoria: 'Mercearia', nome: 'Feijão', quantidade: '1kg', checked: false },
      { id: 10, categoria: 'Mercearia', nome: 'Azeite', quantidade: '500ml', checked: false },
    ];
    setShoppingList(items);
  };

  // Adicionar água
  const addWater = (amount: number) => {
    setWaterIntake(Math.min(waterIntake + amount, waterGoal));
  };

  // Cardápio semanal
  const cardapioSemanal = {
    'Segunda': {
      cafe: userProfile === 'premium' 
        ? 'Omelete de claras com espinafre e queijo cottage, torrada integral com abacate'
        : 'Pão integral com ovo mexido e banana',
      almoco: userProfile === 'premium'
        ? 'Salmão grelhado com quinoa e legumes no vapor'
        : 'Arroz integral, feijão, frango grelhado e salada',
      lanche: 'Iogurte natural com granola',
      jantar: userProfile === 'premium'
        ? 'Risoto de cogumelos com peito de peru'
        : 'Sopa de legumes com frango desfiado'
    },
    'Terça': {
      cafe: userProfile === 'premium'
        ? 'Panqueca de aveia com frutas vermelhas e mel'
        : 'Tapioca com queijo branco e mamão',
      almoco: userProfile === 'premium'
        ? 'Filé mignon ao molho madeira com batata doce rústica'
        : 'Arroz, feijão, carne moída e cenoura refogada',
      lanche: 'Mix de castanhas e frutas secas',
      jantar: userProfile === 'premium'
        ? 'Wrap integral com frango, cream cheese e rúcula'
        : 'Omelete com legumes e salada'
    },
    'Quarta': {
      cafe: 'Vitamina de frutas com aveia',
      almoco: userProfile === 'premium'
        ? 'Peixe ao molho de maracujá com arroz selvagem'
        : 'Macarrão integral com molho de tomate e frango',
      lanche: 'Pão integral com pasta de amendoim',
      jantar: 'Salada completa com atum'
    },
    'Quinta': {
      cafe: userProfile === 'premium'
        ? 'Bowl de açaí com granola e frutas'
        : 'Mingau de aveia com banana',
      almoco: userProfile === 'premium'
        ? 'Frango ao curry com arroz basmati'
        : 'Arroz, feijão, bife grelhado e brócolis',
      lanche: 'Queijo branco com torradas',
      jantar: 'Sopa de lentilha com legumes'
    },
    'Sexta': {
      cafe: 'Crepioca com queijo e tomate',
      almoco: userProfile === 'premium'
        ? 'Camarão grelhado com purê de mandioquinha'
        : 'Arroz, feijão, peixe grelhado e salada',
      lanche: 'Frutas com iogurte',
      jantar: userProfile === 'premium'
        ? 'Pizza integral de frango com rúcula'
        : 'Sanduíche natural com frango'
    },
    'Sábado': {
      cafe: userProfile === 'premium'
        ? 'Croissant integral com salmão defumado'
        : 'Pão francês integral com requeijão light',
      almoco: userProfile === 'premium'
        ? 'Picanha grelhada com legumes assados'
        : 'Arroz, feijão, frango assado e salada',
      lanche: 'Bolo de cenoura fit',
      jantar: 'Wrap de atum com salada'
    },
    'Domingo': {
      cafe: 'Panqueca americana com frutas',
      almoco: userProfile === 'premium'
        ? 'Cordeiro assado com batatas ao alecrim'
        : 'Macarronada com almôndegas e salada',
      lanche: 'Smoothie de frutas',
      jantar: 'Sopa de legumes com torradas'
    }
  };

  // Calcular totais do dia
  const calculateDayTotals = () => {
    return diaryEntries.reduce((acc, entry) => ({
      kcal: acc.kcal + entry.kcal,
      proteinas: acc.proteinas + entry.proteinas,
      carboidratos: acc.carboidratos + entry.carboidratos,
      gorduras: acc.gorduras + entry.gorduras
    }), { kcal: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  };

  const dayTotals = calculateDayTotals();

  // Renderizar telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-teal-50'}`}>
            <div className="text-center space-y-6 animate-fade-in">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-600' : 'bg-emerald-500'} shadow-2xl`}>
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>GiNutri</h1>
              <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sua Guia Nutricional Inteligente</p>
              <div className="flex items-center justify-center gap-2 mt-8">
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-600'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        );

      case 'welcome':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-teal-50'} p-6 flex flex-col`}>
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-600' : 'bg-emerald-500'} shadow-2xl`}>
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <div className="text-center space-y-4">
                <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bem-vindo ao GiNutri!</h1>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md`}>
                  Sua jornada para uma alimentação saudável e personalizada começa aqui
                </p>
              </div>
              <div className="space-y-4 w-full max-w-sm">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center gap-4`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-600' : 'bg-emerald-100'}`}>
                    <UtensilsCrossed className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cardápios Personalizados</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Adaptados ao seu objetivo</p>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center gap-4`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-600' : 'bg-emerald-100'}`}>
                    <Camera className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reconhecimento por IA</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Analise suas refeições</p>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center gap-4`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-600' : 'bg-emerald-100'}`}>
                    <MessageCircle className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assistente Virtual Gi</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Suporte nutricional 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setCurrentScreen('register')}
                className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                Começar Agora
              </button>
              <button
                onClick={() => setCurrentScreen('login')}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
              >
                Já tenho conta
              </button>
            </div>
          </div>
        );

      case 'login':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-teal-50'} p-6`}>
            <div className="max-w-md mx-auto pt-12 space-y-8">
              <div className="text-center">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Entrar</h2>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Acesse sua conta GiNutri</p>
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                <button
                  onClick={() => {
                    // Simular login e ir direto para dashboard com dados mockados
                    const mockData: UserData = {
                      nome: 'Maria Silva',
                      idade: '32',
                      genero: 'feminino',
                      peso: '68',
                      altura: '165',
                      objetivo: 'emagrecer',
                      atividade: 'moderado',
                      estilo: 'tradicional',
                      perfil: 'acessivel',
                      restricoes: [],
                      refeicoes: '5',
                      imc: 25.0,
                      tdee: 2100,
                      calorias: 1600,
                      proteinas: 120,
                      carboidratos: 160,
                      gorduras: 53
                    };
                    setUserData(mockData);
                    setUserProfile('acessivel');
                    generateShoppingList();
                    initializeDiaryEntries();
                    setCurrentScreen('dashboard');
                  }}
                  className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                >
                  Entrar
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-emerald-50 text-gray-500'}`}>Ou continue com</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                  <button className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Apple className="w-5 h-5" />
                    Apple
                  </button>
                </div>
              </div>
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Não tem conta?{' '}
                <button onClick={() => setCurrentScreen('register')} className="text-emerald-500 font-semibold">
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-teal-50'} p-6`}>
            <div className="max-w-md mx-auto pt-12 space-y-8">
              <div className="text-center">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Criar Conta</h2>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comece sua jornada saudável</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                <button
                  onClick={() => setCurrentScreen('onboarding')}
                  className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                >
                  Continuar
                </button>
              </div>
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Já tem conta?{' '}
                <button onClick={() => setCurrentScreen('login')} className="text-emerald-500 font-semibold">
                  Entrar
                </button>
              </p>
            </div>
          </div>
        );

      case 'onboarding':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-teal-50'} p-6`}>
            <div className="max-w-md mx-auto pt-8 space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Passo {onboardingStep + 1} de 10</span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{Math.round(((onboardingStep + 1) / 10) * 100)}%</span>
                </div>
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((onboardingStep + 1) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Onboarding steps */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl space-y-6`}>
                {onboardingStep === 0 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Qual é o seu nome?</h3>
                    <input
                      type="text"
                      value={onboardingData.nome}
                      onChange={(e) => setOnboardingData({ ...onboardingData, nome: e.target.value })}
                      placeholder="Digite seu nome"
                      className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                  </div>
                )}

                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Idade e Gênero</h3>
                    <input
                      type="number"
                      value={onboardingData.idade}
                      onChange={(e) => setOnboardingData({ ...onboardingData, idade: e.target.value })}
                      placeholder="Idade"
                      className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      {['masculino', 'feminino', 'outro'].map((gen) => (
                        <button
                          key={gen}
                          onClick={() => setOnboardingData({ ...onboardingData, genero: gen as any })}
                          className={`py-3 rounded-xl font-semibold transition-all ${
                            onboardingData.genero === gen
                              ? 'bg-emerald-500 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {gen.charAt(0).toUpperCase() + gen.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Peso e Altura</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Peso (kg)</label>
                        <input
                          type="number"
                          value={onboardingData.peso}
                          onChange={(e) => setOnboardingData({ ...onboardingData, peso: e.target.value })}
                          placeholder="70"
                          className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Altura (cm)</label>
                        <input
                          type="number"
                          value={onboardingData.altura}
                          onChange={(e) => setOnboardingData({ ...onboardingData, altura: e.target.value })}
                          placeholder="170"
                          className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Qual é o seu objetivo?</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'emagrecer', label: 'Emagrecer', icon: TrendingUp },
                        { value: 'ganhar_massa', label: 'Ganhar Massa', icon: Zap },
                        { value: 'manter', label: 'Manter Peso', icon: Target },
                        { value: 'reeducar', label: 'Reeducar Hábitos', icon: Heart },
                        { value: 'energia', label: 'Melhorar Energia', icon: Sparkles }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setOnboardingData({ ...onboardingData, objetivo: value as any })}
                          className={`w-full p-4 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                            onboardingData.objetivo === value
                              ? 'bg-emerald-500 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 4 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nível de Atividade Física</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'sedentario', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                        { value: 'leve', label: 'Leve', desc: '1-3 dias por semana' },
                        { value: 'moderado', label: 'Moderado', desc: '3-5 dias por semana' },
                        { value: 'intenso', label: 'Intenso', desc: '6-7 dias por semana' }
                      ].map(({ value, label, desc }) => (
                        <button
                          key={value}
                          onClick={() => setOnboardingData({ ...onboardingData, atividade: value as any })}
                          className={`w-full p-4 rounded-xl transition-all text-left ${
                            onboardingData.atividade === value
                              ? 'bg-emerald-500 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="font-semibold">{label}</div>
                          <div className={`text-sm ${onboardingData.atividade === value ? 'text-emerald-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 5 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Estilo Alimentar</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'tradicional', label: 'Tradicional' },
                        { value: 'low_carb', label: 'Low Carb' },
                        { value: 'high_protein', label: 'High Protein' },
                        { value: 'vegetariano', label: 'Vegetariano' },
                        { value: 'vegano', label: 'Vegano' }
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setOnboardingData({ ...onboardingData, estilo: value as any })}
                          className={`w-full p-4 rounded-xl font-semibold transition-all ${
                            onboardingData.estilo === value
                              ? 'bg-emerald-500 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 6 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Restrições Alimentares</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Selecione todas que se aplicam</p>
                    <div className="space-y-3">
                      {['Glúten', 'Lactose', 'Amendoim', 'Frutos do mar', 'Soja', 'Nenhuma'].map((restricao) => (
                        <button
                          key={restricao}
                          onClick={() => {
                            const current = onboardingData.restricoes;
                            if (restricao === 'Nenhuma') {
                              setOnboardingData({ ...onboardingData, restricoes: current.includes(restricao) ? [] : [restricao] });
                            } else {
                              const filtered = current.filter(r => r !== 'Nenhuma');
                              setOnboardingData({
                                ...onboardingData,
                                restricoes: current.includes(restricao)
                                  ? filtered.filter(r => r !== restricao)
                                  : [...filtered, restricao]
                              });
                            }
                          }}
                          className={`w-full p-4 rounded-xl font-semibold transition-all flex items-center justify-between ${
                            onboardingData.restricoes.includes(restricao)
                              ? 'bg-emerald-500 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {restricao}
                          {onboardingData.restricoes.includes(restricao) && <Check className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 7 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Perfil Financeiro</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Escolha o plano ideal para você</p>
                    <div className="space-y-4">
                      <button
                        onClick={() => setOnboardingData({ ...onboardingData, perfil: 'acessivel' })}
                        className={`w-full p-6 rounded-xl transition-all border-2 ${
                          onboardingData.perfil === 'acessivel'
                            ? 'border-emerald-500 bg-emerald-50'
                            : darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className={`text-xl font-bold ${darkMode && onboardingData.perfil !== 'acessivel' ? 'text-white' : 'text-gray-900'}`}>Fit Acessível</h4>
                            <p className={`text-sm ${darkMode && onboardingData.perfil !== 'acessivel' ? 'text-gray-400' : 'text-gray-600'}`}>Refeições econômicas e práticas</p>
                          </div>
                          <div className="text-2xl font-bold text-emerald-500">Grátis</div>
                        </div>
                        <ul className={`space-y-2 text-sm ${darkMode && onboardingData.perfil !== 'acessivel' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Cardápios semanais</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Lista de compras</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Registro de refeições</li>
                        </ul>
                      </button>

                      <button
                        onClick={() => setOnboardingData({ ...onboardingData, perfil: 'premium' })}
                        className={`w-full p-6 rounded-xl transition-all border-2 relative overflow-hidden ${
                          onboardingData.perfil === 'premium'
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50'
                            : darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="absolute top-2 right-2">
                          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Premium</span>
                        </div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className={`text-xl font-bold ${darkMode && onboardingData.perfil !== 'premium' ? 'text-white' : 'text-gray-900'}`}>Fit Premium</h4>
                            <p className={`text-sm ${darkMode && onboardingData.perfil !== 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>Pratos gourmet saudáveis</p>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-amber-500">R$ 29,90</div>
                            <div className={`text-xs ${darkMode && onboardingData.perfil !== 'premium' ? 'text-gray-400' : 'text-gray-500'}`}>/mês</div>
                          </div>
                        </div>
                        <ul className={`space-y-2 text-sm ${darkMode && onboardingData.perfil !== 'premium' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Tudo do plano Acessível</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Câmera nutricional com IA</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Vídeos de receitas exclusivos</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Chat ilimitado com Gi</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Cardápios gourmet</li>
                        </ul>
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 8 && (
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quantas refeições por dia?</h3>
                    <input
                      type="number"
                      value={onboardingData.refeicoes}
                      onChange={(e) => setOnboardingData({ ...onboardingData, refeicoes: e.target.value })}
                      min="3"
                      max="6"
                      className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-2xl font-bold`}
                    />
                    <div className="flex justify-between text-sm">
                      {[3, 4, 5, 6].map(num => (
                        <button
                          key={num}
                          onClick={() => setOnboardingData({ ...onboardingData, refeicoes: num.toString() })}
                          className={`px-4 py-2 rounded-lg ${
                            onboardingData.refeicoes === num.toString()
                              ? 'bg-emerald-500 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 9 && (() => {
                  const metrics = calculateMetrics();
                  return (
                    <div className="space-y-6 text-center">
                      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-600' : 'bg-emerald-500'}`}>
                        <Check className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tudo Pronto!</h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Vamos criar seu plano nutricional personalizado
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-emerald-50'} space-y-2 text-left`}>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>IMC:</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.imc.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Calorias diárias:</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(metrics.calorias)} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Proteínas:</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.proteinas}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Carboidratos:</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.carboidratos}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gorduras:</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.gorduras}g</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep === 9) {
                      finishOnboarding();
                    } else {
                      setOnboardingStep(onboardingStep + 1);
                    }
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                >
                  {onboardingStep === 9 ? 'Começar' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
            {/* Header */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Olá, {userData?.nome.split(' ')[0]}! 👋
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
              </div>

              {/* Metas diárias */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Meta Diária</span>
                  <span className="text-sm opacity-90">{dayTotals.kcal} / {userData?.calorias} kcal</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all" 
                    style={{ width: `${Math.min((dayTotals.kcal / (userData?.calorias || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-xs opacity-90">Proteínas</div>
                    <div className="font-bold">{dayTotals.proteinas}g / {userData?.proteinas}g</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-90">Carbos</div>
                    <div className="font-bold">{dayTotals.carboidratos}g / {userData?.carboidratos}g</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-90">Gorduras</div>
                    <div className="font-bold">{dayTotals.gorduras}g / {userData?.gorduras}g</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Assistente Gi */}
              <div
                onClick={() => setCurrentScreen('chat')}
                className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} text-white shadow-lg cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Assistente Gi</h3>
                    <p className="text-sm opacity-90">Olá! Como posso ajudar você hoje?</p>
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentScreen('cardapio')}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-emerald-600' : 'bg-emerald-100'} flex items-center justify-center mb-3`}>
                    <UtensilsCrossed className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-emerald-600'}`} />
                  </div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cardápio</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ver refeições</p>
                </button>

                <button
                  onClick={() => setCurrentScreen('camera')}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center mb-3`}>
                    <Camera className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                  </div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Câmera IA</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Analisar refeição</p>
                </button>

                <button
                  onClick={() => setCurrentScreen('water')}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-cyan-600' : 'bg-cyan-100'} flex items-center justify-center mb-3`}>
                    <Droplets className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-cyan-600'}`} />
                  </div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hidratação</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{waterIntake}ml / {waterGoal}ml</p>
                </button>

                <button
                  onClick={() => setCurrentScreen('progresso')}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-100'} flex items-center justify-center mb-3`}>
                    <BarChart3 className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                  </div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Progresso</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ver estatísticas</p>
                </button>
              </div>

              {/* Refeições de hoje */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Refeições de Hoje</h3>
                  <button 
                    onClick={() => setCurrentScreen('diario')}
                    className="text-emerald-500 text-sm font-semibold"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="space-y-3">
                  {diaryEntries.slice(0, 3).map((entry) => (
                    <div 
                      key={entry.id}
                      onClick={() => {
                        setSelectedMealDetail(entry);
                        setCurrentScreen('meal-detail');
                      }}
                      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between cursor-pointer hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-emerald-600' : 'bg-emerald-100'} flex items-center justify-center`}>
                          <entry.icon className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-emerald-600'}`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.meal}</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{entry.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.kcal} kcal</div>
                        <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dica do dia */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-amber-600 to-orange-600' : 'bg-gradient-to-br from-amber-500 to-orange-500'} text-white shadow-lg`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Dica da Gi</h4>
                    <p className="text-sm opacity-90">
                      Beba pelo menos 2 litros de água hoje! A hidratação é essencial para o bom funcionamento do metabolismo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} darkMode={darkMode} />
          </div>
        );

      case 'water':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm`}>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className={`mb-4 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <ChevronRight className={`w-5 h-5 rotate-180 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Hidratação
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Water progress */}
              <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-cyan-600 to-blue-600' : 'bg-gradient-to-br from-cyan-500 to-blue-500'} text-white text-center`}>
                <Droplets className="w-16 h-16 mx-auto mb-4" />
                <div className="text-5xl font-bold mb-2">{waterIntake}ml</div>
                <div className="text-lg opacity-90 mb-6">de {waterGoal}ml</div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all" 
                    style={{ width: `${(waterIntake / waterGoal) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-sm opacity-90">
                  {waterIntake >= waterGoal ? '🎉 Meta atingida!' : `Faltam ${waterGoal - waterIntake}ml para sua meta`}
                </p>
              </div>

              {/* Quick add buttons */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Adicionar Água</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[250, 500, 750].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => addWater(amount)}
                      className={`p-4 rounded-xl font-semibold transition-all ${
                        darkMode 
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                          : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
                      }`}
                    >
                      <Plus className="w-5 h-5 mx-auto mb-1" />
                      {amount}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* History */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Histórico de Hoje</h3>
                <div className="space-y-3">
                  {[
                    { time: '08:00', amount: 250 },
                    { time: '10:30', amount: 500 },
                    { time: '13:00', amount: 250 }
                  ].map((entry, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <Droplets className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{entry.time}</span>
                      </div>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.amount}ml</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} darkMode={darkMode} />
          </div>
        );

      case 'meal-detail':
        if (!selectedMealDetail) return null;
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm`}>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className={`mb-4 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <ChevronRight className={`w-5 h-5 rotate-180 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedMealDetail.meal}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedMealDetail.time}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Macros */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informações Nutricionais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                    <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Calorias</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMealDetail.kcal}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>kcal</div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Proteínas</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMealDetail.proteinas}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>gramas</div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carboidratos</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMealDetail.carboidratos}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>gramas</div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gorduras</div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMealDetail.gorduras}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>gramas</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Alimentos</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedMealDetail.items}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className={`flex-1 py-3 rounded-xl font-semibold ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                  Editar
                </button>
                <button className={`flex-1 py-3 rounded-xl font-semibold text-white ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}>
                  Excluir
                </button>
              </div>
            </div>

            <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} darkMode={darkMode} />
          </div>
        );

      // Manter as outras telas existentes (cardapio, camera, diario, perfil, chat, receitas, compras, progresso)
      // ... (código das outras telas continua igual ao original)

      default:
        return null;
    }
  };

  return (
    <div className="font-inter">
      {renderScreen()}
    </div>
  );
}

// Bottom Navigation Component
function BottomNav({ currentScreen, setCurrentScreen, darkMode }: { currentScreen: Screen; setCurrentScreen: (screen: Screen) => void; darkMode: boolean }) {
  const navItems = [
    { id: 'dashboard' as Screen, icon: Home, label: 'Início' },
    { id: 'cardapio' as Screen, icon: UtensilsCrossed, label: 'Cardápio' },
    { id: 'camera' as Screen, icon: Camera, label: 'Câmera' },
    { id: 'diario' as Screen, icon: BookOpen, label: 'Diário' },
    { id: 'perfil' as Screen, icon: User, label: 'Perfil' }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              currentScreen === id
                ? 'text-emerald-500'
                : darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
