import { Express } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import subscriptionRoutes from './subscription';
import gamificationRoutes from './gamification';
import adminRoutes from './admin';
import chatRoutes from './chat';
import reportRoutes from './report';
import { apiLimiter } from '../middleware/rateLimit';

export const setupRoutes = (app: Express) => {
  // Root route - only show API info in development
  if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Vele API Server',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          user: '/api/user',
          subscription: '/api/subscription',
          gamification: '/api/gamification',
          admin: '/api/admin',
          chat: '/api/chat',
          report: '/api/report'
        }
      });
    });
  }

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Vele API is running' });
  });

  // Apply general rate limiting to all API routes
  app.use('/api', apiLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/subscription', subscriptionRoutes);
  app.use('/api/gamification', gamificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/report', reportRoutes);
};

