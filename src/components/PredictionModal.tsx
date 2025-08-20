
import { Calendar, Clock, Trophy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MultipleBetModal from '@/components/MultipleBetModal';

interface PredictionModalProps {
  prediction: {
    id: string;
    user: {
      username: string;
      avatar: string;
      badge: string;
      badgeColor: string;
    };
    match: string;
    prediction: string;
    odds: string;
    confidence: number;
    analysis: string;
    successRate: number;
    sport: string;
    totalOdds?: string;
    reservationCode?: string;
    betType?: string;
    matches?: Array<{
      id: string;
      teams: string;
      prediction: string;
      odds: string;
      league: string;
      time: string;
      betType?: string;
    }>;
  };
  onClose?: () => void;
}

const PredictionModal = ({ prediction, onClose }: PredictionModalProps) => {
  const [showMultipleBetModal, setShowMultipleBetModal] = useState(false);

  const isMultipleBet = prediction.betType === 'combine' || prediction.betType === 'multiple' || (prediction.matches && prediction.matches.length > 1);
  const isLoto = prediction.betType === 'loto' || prediction.sport === 'Loto';

  // Si c'est un loto, afficher l'interface spéciale loto
  if (isLoto) {
    return (
      <ScrollArea className="max-h-[80vh] pr-4">
        <div className="space-y-4">
          {/* Bannière publicitaire */}
          <div className="relative">
            <img 
              src="/lovable-uploads/546931fd-e8a2-4958-9150-8ad8c4308659.png" 
              alt="Winner.bet Application"
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Header avec info utilisateur */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={prediction.user.avatar}
              alt={prediction.user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{prediction.user.username}</div>
              <div className="text-xs text-gray-500">
                {prediction.successRate}% de réussite • Badge {prediction.user.badge}
              </div>
            </div>
          </div>

          {/* Affichage Loto */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-lg">🎰 Pronostic Loto</div>
                  <div className="text-sm text-gray-500">{prediction.sport}</div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-purple-800 mb-2">Numéros sélectionnés</div>
                  <div className="text-lg font-bold text-purple-900">{prediction.prediction}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Code de réservation */}
          {prediction.reservationCode && (
            <div className="bg-green-500 text-white p-4 rounded-lg text-center">
              <div className="text-sm font-medium mb-1">CODE DE RÉSERVATION</div>
              <div className="text-xl font-bold tracking-widest">
                {prediction.reservationCode}
              </div>
            </div>
          )}

          {/* Analyse */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg">💡</span>
              <span className="font-medium text-blue-900 text-sm">Analyse détaillée</span>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">{prediction.analysis}</p>
          </div>

          {/* Niveau de confiance */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔥</span>
                <span className="font-medium text-yellow-800 text-sm">Niveau de confiance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < prediction.confidence ? 'bg-yellow-400' : 'bg-yellow-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-yellow-700 font-medium text-sm">
                  {prediction.confidence}/5
                  {prediction.confidence === 5 ? ' 🚀' : prediction.confidence >= 4 ? ' 🔥' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Si c'est un pari multiple ou combiné, ouvrir directement le modal spécialisé
  if (isMultipleBet) {
    return (
      <MultipleBetModal 
        open={true}
        onOpenChange={(open) => {
          if (!open && onClose) {
            onClose();
          }
        }}
        prediction={prediction}
      />
    );
  }

  // Pour les paris simples, garder l'affichage original simplifié
  return (
    <ScrollArea className="max-h-[80vh] pr-4">
        <div className="space-y-4">
          {/* Bannière publicitaire */}
          <div className="relative">
            <img 
              src="/lovable-uploads/546931fd-e8a2-4958-9150-8ad8c4308659.png" 
              alt="Winner.bet Application"
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Header avec info utilisateur */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={prediction.user.avatar}
            alt={prediction.user.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="font-medium text-sm">{prediction.user.username}</div>
            <div className="text-xs text-gray-500">
              {prediction.successRate}% de réussite • Badge {prediction.user.badge}
            </div>
          </div>
        </div>

        {/* Match simple */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-lg">{prediction.match}</div>
                <div className="text-sm text-gray-500">{prediction.sport}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {prediction.betType || 'Simple'}
                </span>
                <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                  {prediction.prediction}
                </span>
              </div>
              {prediction.betType !== 'loto' && prediction.sport !== 'Loto' && (
                <span className="text-lg font-bold text-green-600">{prediction.odds}</span>
              )}
            </div>
          </div>
        </Card>

        {/* Code de réservation */}
        {prediction.reservationCode && (
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            <div className="text-sm font-medium mb-1">CODE DE RÉSERVATION</div>
            <div className="text-xl font-bold tracking-widest">
              {prediction.reservationCode}
            </div>
          </div>
        )}

        {/* Analyse */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg">💡</span>
            <span className="font-medium text-blue-900 text-sm">Analyse détaillée</span>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">{prediction.analysis}</p>
        </div>

        {/* Niveau de confiance */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔥</span>
              <span className="font-medium text-yellow-800 text-sm">Niveau de confiance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < prediction.confidence ? 'bg-yellow-400' : 'bg-yellow-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-yellow-700 font-medium text-sm">
                {prediction.confidence}/5
                {prediction.confidence === 5 ? ' 🚀' : prediction.confidence >= 4 ? ' 🔥' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default PredictionModal;
