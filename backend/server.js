import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import helmet from 'helmet';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/userRoutes.js'; // Import user routes
import productRoutes from './routes/productRoutes.js'; // Import product routes
import reservationRoutes from './routes/reservationRoutes.js'; // Import reservation routes
import orderRoutes from './routes/orderRoutes.js'; // Import order routes
import { initializeDatabase } from './utils/initializeDatabase.js';

// Add Mongoose connection event listeners for detailed diagnostics
mongoose.connection.on('connected', () => console.log('✅ Mongoose connected'));
mongoose.connection.on('reconnected', () => console.log('🔁 Mongoose reconnected'));
mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose disconnected'));
mongoose.connection.on('error', (e) => console.error('❌ Mongoose connection error:', e));

// Ensure .env is loaded from the correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

const MONGODB_URI = process.env.MONGODB_URI;

// Debug: Log environment variables (remove in production)
console.log('🔍 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Vérification des variables d'environnement critiques
if (!MONGODB_URI) {
  console.error('❌ ERREUR: MONGODB_URI n\'est pas défini dans les variables d\'environnement');
  console.error('Veuillez créer un fichier .env avec MONGODB_URI=votre_chaine_de_connexion');
  console.error('Fichier .env attendu dans:', join(__dirname, '.env'));
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ ERREUR: JWT_SECRET n\'est pas défini dans les variables d\'environnement');
  console.error('Veuillez ajouter JWT_SECRET=votre_clé_secrète dans votre fichier .env');
  process.exit(1);
}

// Validation plus poussée de l'URI MongoDB
console.log('🔍 Validation MongoDB URI:');
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  console.error('❌ ERREUR: MONGODB_URI doit commencer par mongodb:// ou mongodb+srv://');
  process.exit(1);
}

// Masquer les credentials dans les logs
const maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log('URI MongoDB (masquée):', maskedUri);

// Configuration Mongoose avec options optimisées
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Réduit pour échouer plus vite
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000, // Réduit pour échouer plus vite
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority',
  family: 4 // Force IPv4
};
console.log('🚀 Options de connexion:', {
  serverSelectionTimeoutMS: mongooseOptions.serverSelectionTimeoutMS,
  socketTimeoutMS: mongooseOptions.socketTimeoutMS,
  connectTimeoutMS: mongooseOptions.connectTimeoutMS
});

(async () => {
  console.log('🚀 Démarrage de la connexion MongoDB...');
  
  try {
    // Test de connexion avec timeout personnalisé
    const connectionPromise = mongoose.connect(MONGODB_URI, mongooseOptions);
    
    // Timeout manuel pour diagnostiquer les problèmes
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout de connexion MongoDB après 15 secondes')), 15000);
    });
    
    await Promise.race([connectionPromise, timeoutPromise]);
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 État de la connexion:', mongoose.connection.readyState);
    console.log('🏷️  Nom de la base:', mongoose.connection.name);
    console.log('🖥️  Host:', mongoose.connection.host);
    
    // Initialiser la base de données avec les produits par défaut
    await initializeDatabase();
    
    // Configuration Express après connexion réussie
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    
    // Routes API
    app.use('/api/orders', orderRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/reservations', reservationRoutes);
    
    // Route de test
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Backend is running!', 
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
      });
    });
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🟢 Server running on http://localhost:${PORT}`);
      console.log(`🔗 Test: curl http://localhost:${PORT}/`);
    });
    
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:');
    console.error('Type d\'erreur:', err.name);
    console.error('Message:', err.message);
    
    if (err.message.includes('ENOTFOUND')) {
      console.error('🔍 Problème DNS - Vérifiez votre connexion internet et l\'URL du cluster');
    } else if (err.message.includes('authentication failed')) {
      console.error('🔍 Problème d\'authentification - Vérifiez username/password dans l\'URI');
    } else if (err.message.includes('Timeout')) {
      console.error('🔍 Timeout - Le cluster MongoDB est peut-être en veille ou inaccessible');
    }
    
    console.error('💡 Solutions possibles:');
    console.error('   1. Vérifiez que votre cluster MongoDB Atlas est actif');
    console.error('   2. Vérifiez les whitelist IP dans MongoDB Atlas');
    console.error('   3. Testez la connexion avec MongoDB Compass');
    console.error('   4. Vérifiez que l\'URI est correcte et complète');
    console.error('   5. IMPORTANT: Ajoutez 0.0.0.0/0 dans Network Access de MongoDB Atlas');
    console.error('   6. Vérifiez que le cluster n\'est pas en pause (M0 se met en pause)');
    console.error('   7. Essayez de vous connecter depuis MongoDB Compass d\'abord');
    
    console.error('🔄 Démarrage du serveur en mode LOCAL (sans MongoDB)...');
    console.error('📝 Les données seront stockées temporairement en mémoire.');
    
    // Démarrer le serveur même sans MongoDB pour le développement
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    
    // Routes API
    app.use('/api/orders', orderRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/reservations', reservationRoutes);
    
    // Route de test
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Backend is running WITHOUT MongoDB!', 
        mongodb: 'Disconnected - Using local fallback data',
        timestamp: new Date().toISOString(),
        mode: 'LOCAL_FALLBACK'
      });
    });
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🟡 Server running on http://localhost:${PORT} (WITHOUT MongoDB)`);
      console.log(`🔗 Test: curl http://localhost:${PORT}/`);
      console.log(`⚠️  MongoDB connection failed - Fix the connection to enable full functionality`);
    });
  }
})();