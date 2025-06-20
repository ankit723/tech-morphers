'use client';

import { ArrowRight, Calendar, Clock, BookOpen, TrendingUp, Users, Eye, Sparkles, Zap, Filter, Mail, Star, Code, Lightbulb, Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getFeaturedPosts, getBlogStatistics } from '@/lib/blog-actions';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  categories?: { name: string }[];
  readTime: number;
  publishedAt: Date;
  author: string;
  slug: string;
}

interface BlogStat {
  number: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}

const BlogSection = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [blogStats, setBlogStats] = useState<BlogStat[]>([
    { number: "50+", label: "Articles Published", icon: <BookOpen className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500" },
    { number: "10K+", label: "Monthly Readers", icon: <Users className="w-5 h-5" />, gradient: "from-purple-500 to-pink-500" },
    { number: "25K+", label: "Total Views", icon: <Eye className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" },
    { number: "95%", label: "Reader Satisfaction", icon: <TrendingUp className="w-5 h-5" />, gradient: "from-orange-500 to-red-500" }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = [
    { name: 'All', icon: <Filter className="w-4 h-4" />, count: 'All' },
    { name: 'Web Development', icon: <Code className="w-4 h-4" />, count: '15+' },
    { name: 'Design', icon: <Lightbulb className="w-4 h-4" />, count: '12+' },
    { name: 'Mobile Development', icon: <Rocket className="w-4 h-4" />, count: '8+' },
    { name: 'Tutorials', icon: <BookOpen className="w-4 h-4" />, count: '20+' }
  ];

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const posts = await getFeaturedPosts(3);
        setFeaturedPosts(posts as BlogPost[]);
        
        try {
          const stats = await getBlogStatistics();
          setBlogStats([
            { number: `${stats.publishedPosts}+`, label: "Articles Published", icon: <BookOpen className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500" },
            { number: "10K+", label: "Monthly Readers", icon: <Users className="w-5 h-5" />, gradient: "from-purple-500 to-pink-500" },
            { number: `${stats.totalViews.toLocaleString()}+`, label: "Total Views", icon: <Eye className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" },
            { number: `${stats.totalLikes}+`, label: "Total Likes", icon: <TrendingUp className="w-5 h-5" />, gradient: "from-orange-500 to-red-500" }
          ]);
        } catch {
          console.log('Using fallback blog stats');
        }
      } catch {
        console.log('Using fallback blog data');
        setFeaturedPosts([
          {
            id: "1",
            title: "Building Scalable Web Applications with Next.js 14",
            excerpt: "Learn how to leverage the latest Next.js features to build performant and scalable web applications that can handle millions of users.",
            featuredImage: "/api/placeholder/400/240",
            categories: [{ name: "Web Development" }],
            readTime: 8,
            publishedAt: new Date("2024-01-15"),
            author: "Tech Morphers Team",
            slug: "building-scalable-web-applications-nextjs-14"
          },
          {
            id: "2", 
            title: "UI/UX Design Trends That Will Dominate 2024",
            excerpt: "Discover the latest design trends and principles that are shaping the digital landscape and how to implement them in your projects.",
            featuredImage: "/api/placeholder/400/240",
            categories: [{ name: "Design" }],
            readTime: 6,
            publishedAt: new Date("2024-01-12"),
            author: "Design Team",
            slug: "uiux-design-trends-2024"
          },
          {
            id: "3",
            title: "Mobile App Development: Native vs Cross-Platform",
            excerpt: "A comprehensive comparison of native and cross-platform development approaches to help you choose the right strategy for your mobile app.",
            featuredImage: "/api/placeholder/400/240",
            categories: [{ name: "Mobile Development" }],
            readTime: 10,
            publishedAt: new Date("2024-01-10"),
            author: "Mobile Team",
            slug: "mobile-app-development-native-vs-cross-platform"
          }
        ]);
      }
    };

    fetchBlogData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? featuredPosts 
    : featuredPosts.filter(post => post.categories?.[0]?.name === selectedCategory);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
            Tech Insights & Knowledge Hub
            <Zap className="w-4 h-4 ml-2 text-yellow-500" />
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            Latest from Our
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tech Universe
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Dive into cutting-edge tutorials, industry insights, and expert perspectives that shape the future of technology. 
            Your gateway to staying ahead in the digital revolution.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {blogStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-600/50'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/30 dark:border-gray-700/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="relative overflow-hidden h-56">
                    <Image
                      src={post.featuredImage || "/api/placeholder/400/240"}
                      alt={post.title}
                      width={400}
                      height={240}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                        {post.categories?.[0]?.name || "Article"}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="mr-6">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Recent'}
                      </span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{post.readTime} min read</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {post.author?.split(' ').map(n => n[0]).join('') || 'TM'}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {post.author}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group/link inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-sm transition-all duration-300"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                    <Mail className="w-4 h-4 mr-2" />
                    Weekly Tech Newsletter
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Stay Ahead with
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                      Tech Insights
                    </span>
                  </h3>
                  <p className="text-xl text-indigo-100 leading-relaxed">
                    Get the latest tutorials, industry insights, and exclusive content delivered to your inbox every week.
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl text-gray-900 placeholder:text-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubscribed ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Subscribed!
                        </>
                      ) : (
                        <>
                          Subscribe
                          <Zap className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-indigo-200">
                    Join 10,000+ developers. No spam, unsubscribe anytime.
                  </p>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <div className="mb-8">
                  <h4 className="text-3xl font-bold text-white mb-4">
                    Explore Our Blog Universe
                  </h4>
                  <p className="text-xl text-indigo-100 mb-8">
                    Discover comprehensive tutorials, case studies, and industry insights that help you master modern technology.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-indigo-200">Tutorials</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">25+</div>
                    <div className="text-sm text-indigo-200">Case Studies</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/blog">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Explore All Articles
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-white/30 text-white hover:bg-white/10 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                  >
                    <Link href="/blog/categories">
                      Browse by Category
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection; 