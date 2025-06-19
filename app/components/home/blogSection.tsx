import { ArrowRight, Calendar, Clock, BookOpen, TrendingUp, Users, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getFeaturedPosts, getBlogStatistics } from '@/lib/blog-actions';

const BlogSection = async () => {
  // Fetch real blog data
  let featuredPosts = [];
  let blogStats = [
    { number: "50+", label: "Articles Published", icon: <BookOpen className="w-5 h-5" /> },
    { number: "10K+", label: "Monthly Readers", icon: <Users className="w-5 h-5" /> },
    { number: "25K+", label: "Total Views", icon: <Eye className="w-5 h-5" /> },
    { number: "95%", label: "Reader Satisfaction", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  try {
    // Fetch real featured posts (limit to 3 for home page)
    featuredPosts = await getFeaturedPosts(3);
    
    // Try to get real blog statistics
    try {
      const stats = await getBlogStatistics();
      blogStats = [
        { number: `${stats.publishedPosts}+`, label: "Articles Published", icon: <BookOpen className="w-5 h-5" /> },
        { number: "10K+", label: "Monthly Readers", icon: <Users className="w-5 h-5" /> },
        { number: `${stats.totalViews.toLocaleString()}+`, label: "Total Views", icon: <Eye className="w-5 h-5" /> },
        { number: `${stats.totalLikes}+`, label: "Total Likes", icon: <TrendingUp className="w-5 h-5" /> }
      ];
    } catch {
      console.log('Using fallback blog stats');
    }
  } catch {
    console.log('Using fallback blog data');
    // Fallback to mock data if database is not available
    featuredPosts = [
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
    ];
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Tech Insights & Knowledge Hub
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Latest from Our
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tech Blog
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Stay updated with the latest trends, tutorials, and insights from our expert team. 
            Discover practical tips and industry best practices.
          </p>

          {/* Blog Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            {blogStats.map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-800/50"
              >
                <div className="flex justify-center mb-2 text-indigo-600 dark:text-indigo-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.featuredImage || "/api/placeholder/400/240"}
                  alt={post.title}
                  width={400}
                  height={240}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                    {post.categories?.[0]?.name || "Article"}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Recent'}
                  </span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    By {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want More Tech Insights?
            </h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive blog with tutorials, case studies, and industry insights 
              to help you stay ahead in the digital world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/blog">
                  Explore All Articles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 