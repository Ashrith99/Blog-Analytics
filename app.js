const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const app = express();
const errorHandler = require('./errorHandler');
//endPoint 1
app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });
    
    const blogs = response.data.blogs; 
    const totalBlogs = blogs.length;
    const longestBlog = _.maxBy(blogs, 'title.length');
    const blogsWithPrivacy = blogs.filter(blog => blog.title.toLowerCase().includes('privacy'));
    const uniqueBlogTitles = _.uniqBy(blogs, 'title').map(blog => blog.title);
    
    const analytics = {
        totalBlogs,
        longestBlogTitle: longestBlog ? longestBlog.title : null,
        blogsWithPrivacyCount: blogsWithPrivacy.length,
        uniqueBlogTitles
    };
  
      res.json(analytics);
      


  } catch (error) {
    next(error); //Error handling
    
  }
});

//endPoint 2
app.get('/api/blog-search', (req, res) => {
    const query = req.query.query.toLowerCase(); //accepting query parameter here
  
    const filteredBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(query));
  
    res.json(filteredBlogs);
  });

  app.use(errorHandler); //Error handling

//Bonus challenge-->Lodash's `memoize` function 
const memoizedAnalytics = _.memoize(() => {
    
  }, () => 60000);  //memoizing for 6 seconds
  
  app.get('/api/blog-stats', async (req, res) => {
    try {
      const analyticsData = memoizedAnalytics();
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
