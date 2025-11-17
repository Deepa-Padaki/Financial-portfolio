import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Bookmark, Share2, TrendingUp } from 'lucide-react';

const newsArticles = [
  {
    id: 1,
    title: 'Tech Stocks Rally as Market Reaches New Highs',
    summary: 'Major tech companies saw significant gains today as investors responded positively to strong earnings reports and economic indicators.',
    source: 'Bloomberg',
    time: '2 hours ago',
    category: 'market',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
    impact: 'high'
  },
  {
    id: 2,
    title: 'Federal Reserve Announces Interest Rate Decision',
    summary: 'The Fed decided to maintain current interest rates, citing ongoing economic stability and controlled inflation levels.',
    source: 'Reuters',
    time: '4 hours ago',
    category: 'economic',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop',
    impact: 'high'
  },
  {
    id: 3,
    title: 'Apple Unveils New Product Line with AI Features',
    summary: 'Apple announced its latest product lineup featuring advanced AI capabilities, pushing the stock to new 52-week highs.',
    source: 'CNBC',
    time: '6 hours ago',
    category: 'company',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=200&fit=crop',
    impact: 'medium'
  },
  {
    id: 4,
    title: 'Oil Prices Surge Amid Global Supply Concerns',
    summary: 'Crude oil prices jumped 5% today following reports of production cuts from major oil-producing nations.',
    source: 'Financial Times',
    time: '8 hours ago',
    category: 'market',
    image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=200&fit=crop',
    impact: 'medium'
  },
];

export default function News() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNews = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Market News</h1>
            <p className="text-muted-foreground">Stay updated with the latest market news</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="economic">Economic</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4 mt-6">
            {filteredNews.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={article.impact === 'high' ? 'default' : 'secondary'}>
                            {article.impact === 'high' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {article.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <h3 className="text-xl font-bold">{article.title}</h3>
                        <p className="text-muted-foreground">{article.summary}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{article.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
