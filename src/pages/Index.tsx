import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Trophy, Target, Star, Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6">
              <span className="gradient-text">PronoPik</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Le réseau social des experts en pronostiques sportifs. Partagez vos analyses, 
              suivez les meilleurs tipsters et rejoignez une communauté passionnée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Commencer maintenant
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Découvrir les experts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi PronoPik ?</h2>
          <p className="text-muted-foreground text-lg">Les outils dont vous avez besoin pour réussir</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-elegant text-center p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pronostiques Précis</h3>
            <p className="text-muted-foreground text-sm">
              Analyses détaillées et prédictions basées sur des statistiques avancées
            </p>
          </Card>

          <Card className="card-elegant text-center p-6">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Communauté Active</h3>
            <p className="text-muted-foreground text-sm">
              Échangez avec des passionnés et apprenez des meilleurs tipsters
            </p>
          </Card>

          <Card className="card-elegant text-center p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi Performance</h3>
            <p className="text-muted-foreground text-sm">
              Statistiques détaillées et historique de vos pronostiques
            </p>
          </Card>

          <Card className="card-elegant text-center p-6">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Classements</h3>
            <p className="text-muted-foreground text-sm">
              Compétitions mensuelles et récompenses pour les meilleurs
            </p>
          </Card>
        </div>
      </div>

      {/* Top Tipsters Preview */}
      <div className="bg-card/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Meilleurs Tipsters</h2>
            <p className="text-muted-foreground">Suivez les experts qui cartonnent</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-elegant p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/placeholder-avatar-${i}.jpg`} />
                    <AvatarFallback>T{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Expert{i}</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Spécialiste Football</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">78%</div>
                    <div className="text-xs text-muted-foreground">Réussite</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">+45</div>
                    <div className="text-xs text-muted-foreground">Unités</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1.2k</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  Suivre
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="card-elegant text-center p-12">
          <h2 className="text-3xl font-bold mb-4">Prêt à devenir un expert ?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de parieurs qui ont transformé leur passion en expertise. 
            Partagez vos pronostiques et construisez votre réputation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg">
              Créer mon compte
            </Button>
            <Button variant="ghost" size="lg">
              En savoir plus
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
