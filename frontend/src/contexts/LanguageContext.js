import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  fr: {
    // Auth
    login: "Se connecter",
    logout: "Déconnexion",
    
    // Language names
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Hero Section
    heroTitle: "Crée ta boutique en ligne en 2 minutes avec Sweqa",
    heroSubtitle: "Lance ton commerce sans compétence technique avec un nom de domaine personnalisé",
    createStoreButton: "Créer ma boutique gratuitement",
    
    // Menu Items
    menu: "Menu",
    products: "Produits",
    statistics: "Statistiques",
    personalization: "Personnalisation",
    assistance: "Assistance",
    
    // Boost Section
    boostTitle: "Boost ta visibilité",
    boostDescription: "Découvre Sweqa Discover pour plus de trafic",
    discoverButton: "Découvrir",
    
    // Products Section
    myProducts: "Mes produits",
    addProduct: "Ajouter un produit",
    addNewProduct: "Ajouter un nouveau produit",
    productName: "Caftan traditionnel",
    productPrice: "450 MAD",
    
    // AI Section
    aiTitle: "Ajoute des produits en un clic grâce à l'IA",
    aiDescription: "Téléverse une image, Sweqa fait le reste.",
    aiButton: "Découvrir l'IA",
    aiBannerTitle: "Téléverse une image et l'IA remplit les détails",
    aiBannerDescription: "Notre assistant IA analyse tes photos et remplit automatiquement les informations produit",
    tryButton: "Essayer",
    
    // Discover Section
    discoverTitle: "Produits affichés aléatoirement, redirection vers les boutiques, + de trafic, + de ventes",
    discoverDescription: "Boost ta visibilité avec Sweqa Discover",
    
    // How it works
    howItWorksTitle: "Comment ça marche",
    howItWorksSubtitle: "Ouvrez votre boutique en ligne en seulement trois étapes simples",
    step1Title: "Crée ta boutique",
    step1Description: "Quelques clics pour lancer ton e-commerce avec un site personnalisé.",
    step2Title: "Ajoute tes produits",
    step2Description: "L'IA de Sweqa analyse tes photos et remplit les détails automatiquement.",
    step3Title: "Vends et sois visible",
    step3Description: "Tes produits apparaissent sur Sweqa Discover pour plus de clients.",
    createStoreNow: "Créer ma boutique maintenant",
    
    // Testimonials
    testimonialsTitle: "Ce que disent nos utilisateurs",
    testimonial1: "Sweqa a transformé mon business en ligne!",
    testimonial2: "Facile à utiliser et très efficace.",
    testimonial3: "Une solution incroyable pour les startups.",
    testimonial4: "Je recommande vivement Sweqa.",
    
    // Final CTA
    finalCTATitle: "Prêt à vendre en ligne ? Crée ta boutique maintenant.",
    startFree: "Démarrer gratuitement",
    
    // Login Page
    welcome: "Bienvenue",
    loginDescription: "Connectez-vous pour accéder à votre tableau de bord et gérer votre boutique en ligne.",
    loginTitle: "Connexion",
    emailAddress: "Adresse e-mail",
    password: "Mot de passe",
    loginButton: "SE CONNECTER",
    loggingIn: "Connexion en cours...",
    noAccount: "Pas encore de compte ? Inscrivez-vous",
    loginError: "Email ou mot de passe incorrect",
    
    // Register Page
    joinUs: "Rejoignez-nous",
    registerDescription: "Créez votre compte pour commencer à vendre en ligne et développer votre entreprise.",
    registerTitle: "Inscription",
    fullName: "Nom complet",
    confirmPassword: "Confirmer le mot de passe",
    registerButton: "S'inscrire",
    registering: "Inscription en cours...",
    hasAccount: "Déjà un compte ? Connectez-vous",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    registrationError: "Échec de la création du compte",
    
    // Dashboard
    dashboardGreeting: "Bonjour, {name}",
    dashboardSubtext: "Gérez vos boutiques en ligne et suivez vos performances en temps réel.",
    createStore: "CRÉER UNE BOUTIQUE",
    orders: "Commandes",
    products: "Produits",
    categories: "Catégories",
    customers: "Clients",
    myStores: "Mes Boutiques",
    noStores: "Vous n'avez pas encore de boutique",
    createFirstStore: "Créez votre première boutique en ligne en quelques minutes",
    
    // Create Store Modal
    createStoreTitle: "Créer votre boutique",
    uploadLogo: "Télécharger le logo du magasin (Max 5Mo)",
    storeName: "* Nom du magasin",
    storeNameHelper: "Cela sera utilisé pour créer l'URL de votre boutique",
    storeDescription: "* Description du magasin",
    storeDescriptionHelper: "Dites aux clients à propos de votre boutique",
    createStoreBtn: "CRÉER UNE BOUTIQUE",
    cancelBtn: "ANNULER",
    
    // Store Admin Page
    viewStore: "VOIR LA BOUTIQUE",
    backToStores: "← RETOUR À MES BOUTIQUES",
    manage: "GESTION",
    dashboard: "DASHBOARD",
    orders: "Commandes",
    products: "Produits",
    categories: "Catégories",
    settings: "Paramètres",
    storeOverview: "Aperçu du magasin",
    ordersRevenue: "Commandes & Revenus",
    customerDistribution: "Répartition des clients",
    new: "Nouveaux",
    returning: "Récurrents",
    
    // Orders Table
    orderId: "ID de commande",
    customer: "Client",
    date: "Date",
    status: "Statut",
    payment: "Paiement",
    amount: "Montant",
    actions: "Actions",
    noOrders: "Aucune commande trouvée.",
    details: "Détails",
    orderDetails: "Détails de la commande",
    orderPlacedOn: "Commande passée le",
    product: "Produit",
    qty: "Qté",
    price: "Prix",
    total: "Total",
    updateOrderStatus: "Mettre à jour le statut",
    updatePaymentStatus: "Mettre à jour le paiement",
    close: "FERMER",
    pending: "En attente",
    processing: "En cours",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    paid: "Payé",
    refunded: "Remboursé"
  },
  
  ar: {
    // Auth
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    
    // Language names
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Hero Section
    heroTitle: "أنشئ متجرك الإلكتروني في دقيقتين مع Sweqa",
    heroSubtitle: "أطلق تجارتك بدون مهارات تقنية مع اسم نطاق مخصص",
    createStoreButton: "إنشاء متجري مجاناً",
    
    // Menu Items
    menu: "القائمة",
    products: "المنتجات",
    statistics: "الإحصائيات",
    personalization: "التخصيص",
    assistance: "المساعدة",
    
    // Boost Section
    boostTitle: "عزز ظهورك",
    boostDescription: "اكتشف Sweqa Discover للمزيد من الزيارات",
    discoverButton: "اكتشف",
    
    // Products Section
    myProducts: "منتجاتي",
    addProduct: "إضافة منتج",
    addNewProduct: "إضافة منتج جديد",
    productName: "قفطان تقليدي",
    productPrice: "450 درهم",
    
    // AI Section
    aiTitle: "أضف منتجات بنقرة واحدة بفضل الذكاء الاصطناعي",
    aiDescription: "حمّل صورة، Sweqa يقوم بالباقي.",
    aiButton: "اكتشف الذكاء الاصطناعي",
    aiBannerTitle: "حمّل صورة والذكاء الاصطناعي يملأ التفاصيل",
    aiBannerDescription: "مساعد الذكاء الاصطناعي يحلل صورك ويملأ معلومات المنتج تلقائياً",
    tryButton: "جرب",
    
    // Discover Section
    discoverTitle: "منتجات معروضة عشوائياً، إعادة توجيه للمتاجر، المزيد من الزيارات، المزيد من المبيعات",
    discoverDescription: "عزز ظهورك مع Sweqa Discover",
    
    // How it works
    howItWorksTitle: "كيف يعمل",
    howItWorksSubtitle: "افتح متجرك الإلكتروني في ثلاث خطوات بسيطة فقط",
    step1Title: "أنشئ متجرك",
    step1Description: "بضع نقرات لإطلاق تجارتك الإلكترونية مع موقع مخصص.",
    step2Title: "أضف منتجاتك",
    step2Description: "الذكاء الاصطناعي لـ Sweqa يحلل صورك ويملأ التفاصيل تلقائياً.",
    step3Title: "بع وكن مرئياً",
    step3Description: "منتجاتك تظهر على Sweqa Discover للمزيد من العملاء.",
    createStoreNow: "إنشاء متجري الآن",
    
    // Testimonials
    testimonialsTitle: "ماذا يقول مستخدمونا",
    testimonial1: "Sweqa غيرت عملي الإلكتروني!",
    testimonial2: "سهل الاستخدام وفعال جداً.",
    testimonial3: "حل رائع للشركات الناشئة.",
    testimonial4: "أنصح بشدة بـ Sweqa.",
    
    // Final CTA
    finalCTATitle: "مستعد للبيع عبر الإنترنت؟ أنشئ متجرك الآن.",
    startFree: "ابدأ مجاناً",
    
    // Login Page
    welcome: "مرحباً",
    loginDescription: "سجل دخولك للوصول إلى لوحة التحكم وإدارة متجرك الإلكتروني.",
    loginTitle: "تسجيل الدخول",
    emailAddress: "البريد الإلكتروني",
    password: "كلمة المرور",
    loginButton: "تسجيل الدخول",
    loggingIn: "جاري تسجيل الدخول...",
    noAccount: "ليس لديك حساب؟ سجل الآن",
    loginError: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    
    // Register Page
    joinUs: "انضم إلينا",
    registerDescription: "أنشئ حسابك لتبدأ البيع عبر الإنترنت وتطور عملك.",
    registerTitle: "التسجيل",
    fullName: "الاسم الكامل",
    confirmPassword: "تأكيد كلمة المرور",
    registerButton: "تسجيل",
    registering: "جاري التسجيل...",
    hasAccount: "لديك حساب؟ سجل دخولك",
    passwordMismatch: "كلمات المرور غير متطابقة",
    registrationError: "فشل في إنشاء الحساب",
    
    // Dashboard
    dashboardGreeting: "مرحباً، {name}",
    dashboardSubtext: "قم بإدارة متاجرك عبر الإنترنت وتابع أداءك في الوقت الفعلي.",
    createStore: "إنشاء متجر",
    orders: "الطلبات",
    products: "المنتجات",
    categories: "الفئات",
    customers: "العملاء",
    myStores: "متاجري",
    noStores: "ليس لديك أي متجر بعد",
    createFirstStore: "أنشئ متجرك الأول عبر الإنترنت في دقائق قليلة",
    
    // Create Store Modal
    createStoreTitle: "إنشاء متجرك",
    uploadLogo: "تحميل شعار المتجر (5 ميغابايت كحد أقصى)",
    storeName: "* اسم المتجر",
    storeNameHelper: "سيتم استخدام هذا لإنشاء رابط متجرك",
    storeDescription: "* وصف المتجر",
    storeDescriptionHelper: "أخبر العملاء عن متجرك",
    createStoreBtn: "إنشاء متجر",
    cancelBtn: "إلغاء",
    
    // Store Admin Page
    viewStore: "عرض المتجر",
    backToStores: "← العودة إلى متاجري",
    manage: "الإدارة",
    dashboard: "لوحة التحكم",
    orders: "الطلبات",
    products: "المنتجات",
    categories: "الفئات",
    settings: "الإعدادات",
    storeOverview: "نظرة عامة على المتجر",
    ordersRevenue: "الطلبات والإيرادات",
    customerDistribution: "توزيع العملاء",
    new: "جديد",
    returning: "متكرر",
    
    // Orders Table
    orderId: "معرّف الطلب",
    customer: "العميل",
    date: "التاريخ",
    status: "الحالة",
    payment: "الدفع",
    amount: "المبلغ",
    actions: "الإجراءات",
    noOrders: "لا توجد طلبات.",
    details: "تفاصيل",
    orderDetails: "تفاصيل الطلب",
    orderPlacedOn: "تم الطلب في",
    product: "المنتج",
    qty: "الكمية",
    price: "السعر",
    total: "الإجمالي",
    updateOrderStatus: "تحديث حالة الطلب",
    updatePaymentStatus: "تحديث حالة الدفع",
    close: "إغلاق",
    pending: "قيد الانتظار",
    processing: "قيد المعالجة",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغاة",
    paid: "مدفوع",
    refunded: "مسترد"
  },
  
  en: {
    // Auth
    login: "Login",
    logout: "Logout",
    
    // Language names
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Hero Section
    heroTitle: "Create your online store in 2 minutes with Sweqa",
    heroSubtitle: "Launch your business without technical skills with a personalized domain name",
    createStoreButton: "Create my store for free",
    
    // Menu Items
    menu: "Menu",
    products: "Products",
    statistics: "Statistics",
    personalization: "Personalization",
    assistance: "Assistance",
    
    // Boost Section
    boostTitle: "Boost your visibility",
    boostDescription: "Discover Sweqa Discover for more traffic",
    discoverButton: "Discover",
    
    // Products Section
    myProducts: "My products",
    addProduct: "Add a product",
    addNewProduct: "Add a new product",
    productName: "Traditional caftan",
    productPrice: "450 MAD",
    
    // AI Section
    aiTitle: "Add products in one click thanks to AI",
    aiDescription: "Upload an image, Sweqa does the rest.",
    aiButton: "Discover AI",
    aiBannerTitle: "Upload an image and AI fills in the details",
    aiBannerDescription: "Our AI assistant analyzes your photos and automatically fills in product information",
    tryButton: "Try",
    
    // Discover Section
    discoverTitle: "Products displayed randomly, redirect to stores, more traffic, more sales",
    discoverDescription: "Boost your visibility with Sweqa Discover",
    
    // How it works
    howItWorksTitle: "How it works",
    howItWorksSubtitle: "Open your online store in just three simple steps",
    step1Title: "Create your store",
    step1Description: "A few clicks to launch your e-commerce with a personalized site.",
    step2Title: "Add your products",
    step2Description: "Sweqa's AI analyzes your photos and fills in details automatically.",
    step3Title: "Sell and be visible",
    step3Description: "Your products appear on Sweqa Discover for more customers.",
    createStoreNow: "Create my store now",
    
    // Testimonials
    testimonialsTitle: "What our users say",
    testimonial1: "Sweqa transformed my online business!",
    testimonial2: "Easy to use and very effective.",
    testimonial3: "An incredible solution for startups.",
    testimonial4: "I highly recommend Sweqa.",
    
    // Final CTA
    finalCTATitle: "Ready to sell online? Create your store now.",
    startFree: "Start for free",
    
    // Login Page
    welcome: "Welcome",
    loginDescription: "Sign in to access your dashboard and manage your online store.",
    loginTitle: "Login",
    emailAddress: "Email Address",
    password: "Password",
    loginButton: "SIGN IN",
    loggingIn: "Signing in...",
    noAccount: "Don't have an account? Sign up",
    loginError: "Incorrect email or password",
    
    // Register Page
    joinUs: "Join Us",
    registerDescription: "Create your account to start selling online and grow your business.",
    registerTitle: "Registration",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    registerButton: "Sign Up",
    registering: "Signing up...",
    hasAccount: "Already have an account? Sign in",
    passwordMismatch: "Passwords do not match",
    registrationError: "Failed to create account",
    
    // Dashboard
    dashboardGreeting: "Hello, {name}",
    dashboardSubtext: "Manage your online stores and track your performance in real time.",
    createStore: "CREATE A STORE",
    orders: "Orders",
    products: "Products",
    categories: "Categories",
    customers: "Customers",
    myStores: "My Stores",
    noStores: "You don't have any stores yet",
    createFirstStore: "Create your first online store in a few minutes",
    
    // Create Store Modal
    createStoreTitle: "Create Your Store",
    uploadLogo: "Upload Store Logo (Max 5MB)",
    storeName: "* Store Name",
    storeNameHelper: "This will be used to create your store's URL",
    storeDescription: "* Store Description",
    storeDescriptionHelper: "Tell customers about your store",
    createStoreBtn: "CREATE STORE",
    cancelBtn: "CANCEL",
    
    // Store Admin Page
    viewStore: "VIEW STORE",
    backToStores: "← BACK TO MY STORES",
    manage: "MANAGE",
    dashboard: "DASHBOARD",
    orders: "Orders",
    products: "Products",
    categories: "Categories",
    settings: "Settings",
    storeOverview: "Store Overview",
    ordersRevenue: "Orders & Revenue",
    customerDistribution: "Customer Distribution",
    new: "New",
    returning: "Returning",
    
    // Orders Table
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    status: "Status",
    payment: "Payment",
    amount: "Amount",
    actions: "Actions",
    noOrders: "No orders found.",
    details: "Details",
    orderDetails: "Order Details",
    orderPlacedOn: "Order placed on",
    product: "Product",
    qty: "Qty",
    price: "Price",
    total: "Total",
    updateOrderStatus: "Update Order Status",
    updatePaymentStatus: "Update Payment Status",
    close: "CLOSE",
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    paid: "Paid",
    refunded: "Refunded"
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
