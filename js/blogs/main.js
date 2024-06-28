document.addEventListener('DOMContentLoaded', function() {
    // Function to parse the markdown content
    function parseMarkdown(mdContent) {
        const frontMatterRegex = /^---\n([\s\S]+?)\n---/;
        const match = frontMatterRegex.exec(mdContent);
        let frontMatter = {};
        let markdown = mdContent;

        if (match) {
            frontMatter = jsyaml.load(match[1]);
            markdown = mdContent.slice(match[0].length);
        }

        return { frontMatter, markdown };
    }

    // Function to truncate text to a specified word limit
    function truncateText(text, wordLimit) {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    }

    fetch('../blogs/blogInformation/blogsInfo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load blogs info');
            }
            return response.json();
        })
        .then(blogs => {
            // Sort blogs by date (newest first)
            blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            const content = document.querySelector('.content');
            blogs.forEach(blog => {
                const blogTile = document.createElement('div');
                blogTile.className = 'blogTile';
                
                fetch(`../blogs/${blog.filename}`)
                    .then(response => response.text())
                    .then(mdContent => {
                        const { frontMatter, markdown } = parseMarkdown(mdContent);

                        const blogTitle = document.createElement('h2');
                        blogTitle.className = 'blogTitle';
                        blogTitle.innerText = frontMatter.title;

                        // Truncate the excerpt to 100 words
                        const truncatedExcerpt = truncateText(frontMatter.excerpt, 40);
                        // Add blog date
                        const blogDate = document.createElement('p');
                        blogDate.className = 'blogDate';
                        blogDate.innerText = frontMatter.date;
                        blogTile.appendChild(blogDate);

                        const blogDescription = document.createElement('p');
                        blogDescription.className = 'blogDescription';
                        blogDescription.innerText = truncatedExcerpt;

                        const readMoreLink = document.createElement('a');
                        readMoreLink.href = `post.html?file=${blog.filename}`;
                        readMoreLink.className = 'readMore';
                        readMoreLink.innerText = 'Read More';
                        blogTile.addEventListener('click', function() {
                            window.location.href = `post.html?file=${blog.filename}`;
                        }
                        );
                        blogTile.appendChild(blogTitle);
                        blogTile.appendChild(blogDescription);
                        blogTile.appendChild(readMoreLink);
                        content.appendChild(blogTile);
                    })
                    .catch(error => console.error(error));
            });
        })
        .catch(error => {
            console.error('Error occurred while fetching blogs info', error);
        });
});
